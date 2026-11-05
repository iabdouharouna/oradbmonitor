#!/usr/bin/env python3
"""Capture une page SPA avec Playwright dans un fichier HTML autonome.

Les feuilles de style externes et les scripts externes sont récupérés puis
intégrés directement dans le HTML. La page est capturée après chargement du
DOM et des ressources réseau, ce qui permet de conserver l'état rendu par le
routeur côté client. Des clics peuvent être rejoués avant la capture pour
atteindre un état interne qui ne possède pas d'URL dédiée.
"""

from __future__ import annotations

import argparse
import base64
import json
import re
import sys
import tempfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any
from urllib.parse import unquote_to_bytes, urljoin, urlparse

try:
    from lxml import etree, html as lxml_html
except ImportError:  # pragma: no cover - vérifié au démarrage
    etree = None
    lxml_html = None


CSS_IMPORT_RE = re.compile(
    r"@import\s+(?:url\(\s*(?P<q1>['\"]?)(?P<u1>[^'\")\s]+)(?P=q1)\s*\)"
    r"|(?P<q2>['\"])(?P<u2>.*?)(?P=q2))(?P<media>[^;]*);",
    re.IGNORECASE | re.DOTALL,
)
CSS_URL_RE = re.compile(
    r"url\(\s*(?P<q>['\"]?)(?P<url>.*?)(?P=q)\s*\)",
    re.IGNORECASE | re.DOTALL,
)
MODULE_SPECIFIER_RE = re.compile(
    r"(?P<prefix>\b(?:import|export)\s+(?:[^;'\"]*?\s+from\s+)?|\bimport\s*\(\s*)"
    r"(?P<q>['\"])(?P<spec>(?:\.{1,2}/|/)[^'\"]*)(?P=q)",
    re.IGNORECASE,
)
HEADER_RE = re.compile(r"^\s*([^:]+):\s*(.*)$")


def log(message: str) -> None:
    print(message, file=sys.stderr)


def parse_headers(values: list[str] | None) -> dict[str, str]:
    headers: dict[str, str] = {}
    for value in values or []:
        match = HEADER_RE.match(value)
        if not match:
            raise ValueError(f"En-tête HTTP invalide : {value!r} (format attendu : 'Nom: valeur')")
        headers[match.group(1).strip()] = match.group(2).strip()
    return headers


def default_output_path(url: str) -> Path:
    parsed = urlparse(url)
    parts = [parsed.netloc or parsed.hostname or "page", parsed.path, parsed.fragment]
    slug = re.sub(r"[^A-Za-z0-9._-]+", "-", "-".join(parts)).strip("-.")
    return Path(f"{slug or 'page'}.html")


def _decode_data_url(url: str) -> str:
    header, data = url.split(",", 1)
    if ";base64" in header.lower():
        raw = base64.b64decode(data)
        return raw.decode("utf-8", errors="replace")
    return unquote_to_bytes(data).decode("utf-8", errors="replace")


def _is_relative_url(value: str) -> bool:
    lowered = value.strip().lower()
    return not (
        lowered.startswith(("#", "data:", "mailto:", "tel:", "javascript:", "blob:", "about:"))
        or re.match(r"^[a-z][a-z0-9+.-]*:", lowered)
    )


@dataclass
class Inliner:
    context: Any
    page_url: str
    timeout_ms: int
    request_headers: dict[str, str] = field(default_factory=dict)
    strict: bool = False
    preserve_route: bool = True
    freeze: bool = False
    document_base: str = ""
    css_inlined: int = 0
    scripts_inlined: int = 0
    scripts_removed: int = 0
    warnings: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)
    _css_cache: dict[str, str] = field(default_factory=dict)
    _css_visiting: set[str] = field(default_factory=set)
    _deferred_scripts: list[Any] = field(default_factory=list)

    def warn(self, message: str) -> None:
        self.warnings.append(message)
        log(f"[avertissement] {message}")

    def error(self, message: str) -> None:
        self.errors.append(message)
        if self.strict:
            raise RuntimeError(message)
        self.warn(message)

    def fetch_text(self, url: str, resource_type: str) -> str | None:
        if not url:
            return None
        if url.startswith("data:"):
            try:
                return _decode_data_url(url)
            except Exception as exc:  # noqa: BLE001
                self.error(f"Impossible de décoder {resource_type} data URL : {exc}")
                return None
        if url.startswith(("blob:", "about:")):
            self.error(f"{resource_type} non récupérable ({url[:80]})")
            return None

        headers = dict(self.request_headers)
        headers.setdefault("Referer", self.page_url)
        try:
            response = self.context.request.get(
                url,
                headers=headers,
                timeout=self.timeout_ms,
                fail_on_status_code=False,
            )
            if not response.ok:
                self.error(f"{resource_type} HTTP {response.status} : {url}")
                return None
            return response.text()
        except Exception as exc:  # noqa: BLE001
            self.error(f"Échec de récupération {resource_type} {url} : {exc}")
            return None

    def resolve(self, value: str) -> str:
        return urljoin(self.document_base or self.page_url, value)

    def inline_css(
        self, css: str, css_url: str, depth: int = 0, base_url: str | None = None
    ) -> str:
        if css_url in self._css_cache:
            return self._css_cache[css_url]
        if css_url in self._css_visiting or depth > 20:
            self.warn(f"Import CSS cyclique ou trop profond ignoré : {css_url}")
            return ""
        self._css_visiting.add(css_url)
        resolution_base = base_url or css_url

        css = re.sub(r"^\s*@charset\s+[^;]+;", "", css, count=1, flags=re.IGNORECASE)

        def replace_import(match: re.Match[str]) -> str:
            raw_url = match.group("u1") or match.group("u2") or ""
            imported_url = urljoin(resolution_base, raw_url)
            imported_css = self.fetch_text(imported_url, "CSS")
            media = match.group("media").strip()
            if imported_css is None:
                suffix = f" {media}" if media else ""
                return f'@import url("{imported_url}"){suffix};'
            self.css_inlined += 1
            imported_base = (
                self.document_base if imported_url.startswith("data:") else imported_url
            )
            body = self.inline_css(
                imported_css, imported_url, depth + 1, base_url=imported_base
            )
            if media:
                return f"@media {media} {{\n{body}\n}}"
            return body

        css = CSS_IMPORT_RE.sub(replace_import, css)

        def replace_url(match: re.Match[str]) -> str:
            raw_url = match.group("url").strip()
            if not raw_url or raw_url.startswith(("#", "data:", "blob:", "about:")):
                return match.group(0)
            absolute = urljoin(resolution_base, raw_url)
            quote = match.group("q") or '"'
            return f"url({quote}{absolute}{quote})"

        css = CSS_URL_RE.sub(replace_url, css)
        self._css_visiting.discard(css_url)
        self._css_cache[css_url] = css
        return css

    def rewrite_module_specifiers(self, script: str, script_url: str) -> str:
        def replace(match: re.Match[str]) -> str:
            specifier = match.group("spec")
            absolute = urljoin(script_url, specifier)
            return f"{match.group('prefix')}{match.group('q')}{absolute}{match.group('q')}"

        return MODULE_SPECIFIER_RE.sub(replace, script)

    def inline_stylesheet(self, link: Any) -> None:
        href = (link.get("href") or "").strip()
        if not href:
            return
        css_url = self.resolve(href)
        css = self.fetch_text(css_url, "CSS")
        if css is None:
            link.set("href", css_url)
            return

        css_base = self.document_base if href.startswith("data:") else css_url
        css = self.inline_css(css, css_url, base_url=css_base)
        style = etree.Element("style")
        for attr in ("media", "title"):
            if link.get(attr):
                style.set(attr, link.get(attr))
        style.set("data-inlined-from", css_url)
        style.text = css
        link.addprevious(style)
        link.getparent().remove(link)
        self.css_inlined += 1

    def inline_script(self, script: Any) -> None:
        src = (script.get("src") or "").strip()
        if not src:
            return
        script_url = self.resolve(src)
        body = self.fetch_text(script_url, "JavaScript")
        if body is None:
            script.set("src", script_url)
            return

        script_type = (script.get("type") or "").strip().lower()
        if script_type == "module":
            body = self.rewrite_module_specifiers(body, script_url)

        body = body.replace("</script", "<\\/script")
        script.set("data-inlined-from", script_url)
        for attr in ("src", "integrity", "crossorigin", "referrerpolicy"):
            script.attrib.pop(attr, None)
        script.text = body
        self.scripts_inlined += 1
        if script.get("defer") is not None or script.get("async") is not None:
            self._deferred_scripts.append(script)

    def absolutize_attribute(self, element: Any, attribute: str) -> None:
        value = element.get(attribute)
        if not value or not _is_relative_url(value):
            return
        element.set(attribute, urljoin(self.document_base, value.strip()))

    def absolutize_srcset(self, element: Any, attribute: str = "srcset") -> None:
        value = element.get(attribute)
        if not value or "data:" in value.lower():
            return
        candidates: list[str] = []
        for candidate in value.split(","):
            parts = candidate.strip().split()
            if not parts:
                continue
            if _is_relative_url(parts[0]):
                parts[0] = urljoin(self.document_base, parts[0])
            candidates.append(" ".join(parts))
        element.set(attribute, ", ".join(candidates))

    def build_html(self, page_html: str) -> str:
        doctype_match = re.search(r"<!doctype[^>]*>", page_html, re.IGNORECASE)
        doctype = doctype_match.group(0) if doctype_match else "<!DOCTYPE html>"
        document = lxml_html.fromstring(page_html)

        existing_base = document.xpath("//base[@href]/@href")
        self.document_base = urljoin(self.page_url, existing_base[0]) if existing_base else self.page_url

        for meta in list(document.xpath("//meta[translate(@http-equiv, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='content-security-policy']")):
            meta.getparent().remove(meta)
            self.warn("Meta Content-Security-Policy supprimée pour autoriser le CSS/JS intégré.")

        for link in list(document.xpath("//link[@href]")):
            rel = {part.lower() for part in (link.get("rel") or "").split()}
            if "stylesheet" in rel:
                self.inline_stylesheet(link)
            else:
                self.absolutize_attribute(link, "href")

        if self.freeze:
            for script in list(document.xpath("//script")):
                script.getparent().remove(script)
                self.scripts_removed += 1
            for link in list(document.xpath("//link[@href]")):
                rel = {part.lower() for part in (link.get("rel") or "").split()}
                if "modulepreload" in rel or ("preload" in rel and link.get("as") == "script"):
                    link.getparent().remove(link)
        else:
            for script in list(document.xpath("//script[@src]")):
                self.inline_script(script)

            if self._deferred_scripts:
                body = document.find(".//body")
                if body is None:
                    body = etree.Element("body")
                    document.append(body)
                for script in self._deferred_scripts:
                    parent = script.getparent()
                    if parent is not None:
                        parent.remove(script)
                    for attr in ("defer", "async"):
                        script.attrib.pop(attr, None)
                    body.append(script)

        for element, attribute in (
            ("img", "src"),
            ("img", "data-src"),
            ("source", "src"),
            ("video", "src"),
            ("video", "poster"),
            ("audio", "src"),
            ("track", "src"),
            ("iframe", "src"),
            ("frame", "src"),
            ("embed", "src"),
            ("object", "data"),
            ("input", "src"),
        ):
            for node in document.xpath(f"//{element}[@{attribute}]"):
                self.absolutize_attribute(node, attribute)

        for node in document.xpath("//*[@srcset]"):
            self.absolutize_srcset(node)
        for node in document.xpath("//*[@imagesrcset]"):
            self.absolutize_srcset(node, "imagesrcset")

        for node in document.xpath("//a[@href] | //area[@href]"):
            self.absolutize_attribute(node, "href")

        head = document.find(".//head")
        if head is None:
            head = etree.Element("head")
            document.insert(0, head)
        if not document.xpath("//head/meta[translate(@charset, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='utf-8']"):
            charset = etree.Element("meta")
            charset.set("charset", "utf-8")
            head.insert(0, charset)
        if not document.xpath("//base[@href]"):
            base = etree.Element("base")
            base.set("href", self.page_url)
            head.insert(0, base)

        if self.preserve_route and not self.freeze:
            fragment = urlparse(self.page_url).fragment
            if fragment:
                route = "#" + fragment
                route_script = etree.Element("script")
                route_script.set("data-save-spa-route", "")
                route_script.text = (
                    "(function () {\n"
                    f"  var route = {json.dumps(route)};\n"
                    "  if (!location.hash) {\n"
                    "    try { history.replaceState(null, '', route); }\n"
                    "    catch (error) { location.hash = route.slice(1); }\n"
                    "  }\n"
                    "})();"
                )
                head.insert(0, route_script)

        return etree.tostring(document, method="html", encoding="unicode", doctype=doctype)


def positive_float(value: str) -> float:
    number = float(value)
    if number <= 0:
        raise argparse.ArgumentTypeError("la valeur doit être strictement positive")
    return number


def positive_int(value: str) -> int:
    number = int(value)
    if number <= 0:
        raise argparse.ArgumentTypeError("la valeur doit être strictement positive")
    return number


def non_negative_int(value: str) -> int:
    number = int(value)
    if number < 0:
        raise argparse.ArgumentTypeError("la valeur doit être positive ou nulle")
    return number


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Enregistre une page web SPA dans un unique fichier HTML en intégrant "
            "les feuilles de style et scripts externes."
        ),
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("url", help="URL de la page SPA à capturer")
    parser.add_argument("-o", "--output", help="Fichier HTML de sortie ('-' pour stdout)")
    parser.add_argument(
        "--wait-until",
        choices=("load", "domcontentloaded", "networkidle", "commit"),
        default="networkidle",
        help="État de chargement attendu avant la capture",
    )
    parser.add_argument("--wait-for", help="Sélecteur CSS à attendre avant la capture")
    parser.add_argument("--wait-ms", type=positive_int, default=1000, help="Délai supplémentaire en millisecondes")
    parser.add_argument(
        "--click",
        action="append",
        default=[],
        metavar="SÉLECTEUR",
        help="Cliquer sur le premier élément correspondant avant la capture (répétable)",
    )
    parser.add_argument(
        "--wait-after-click",
        type=non_negative_int,
        default=500,
        help="Délai après chaque clic en millisecondes",
    )
    parser.add_argument("--timeout", type=positive_float, default=30.0, help="Timeout global en secondes")
    parser.add_argument("--browser", choices=("chromium", "firefox", "webkit"), default="chromium")
    parser.add_argument("--channel", help="Canal navigateur Playwright (ex. chrome, msedge)")
    parser.add_argument("--executable-path", help="Chemin explicite vers un navigateur")
    parser.add_argument("--cdp-url", help="Se connecter à un navigateur existant via CDP (ex. http://127.0.0.1:9222)")
    parser.add_argument(
        "--no-navigate",
        action="store_true",
        help="Capturer l'onglet courant sans naviguer (nécessite --cdp-url)",
    )
    parser.add_argument("--headed", action="store_true", help="Afficher le navigateur")
    parser.add_argument("--viewport", default="1440x900", help="Viewport WIDTHxHEIGHT")
    parser.add_argument("--device-scale-factor", type=positive_float, default=1.0)
    parser.add_argument("--user-agent", help="User-Agent personnalisé")
    parser.add_argument("--locale", help="Locale du navigateur (ex. fr-FR)")
    parser.add_argument("--storage-state", help="Fichier JSON Playwright de cookies/session")
    parser.add_argument("--header", action="append", default=[], help="En-tête HTTP 'Nom: valeur' (répétable)")
    parser.add_argument("--ignore-https-errors", action="store_true", help="Ignorer les erreurs de certificat HTTPS")
    parser.add_argument("--scroll", action="store_true", help="Faire défiler la page pour déclencher le chargement différé")
    parser.add_argument("--scroll-steps", type=positive_int, default=10)
    parser.add_argument("--scroll-delay", type=positive_int, default=150, help="Délai entre les défilements en millisecondes")
    parser.add_argument(
        "--no-preserve-route",
        action="store_true",
        help="Ne pas restaurer automatiquement la route hash de la SPA à l'ouverture du fichier",
    )
    parser.add_argument(
        "--freeze",
        action="store_true",
        help="Supprimer tous les scripts après capture pour figer le DOM rendu",
    )
    parser.add_argument("--strict", action="store_true", help="Échouer si une ressource CSS/JS ne peut pas être intégrée")
    parser.add_argument("--quiet", action="store_true", help="Réduire les messages de progression")
    return parser


def parse_viewport(value: str) -> dict[str, int]:
    match = re.fullmatch(r"(\d+)x(\d+)", value.strip().lower())
    if not match:
        raise ValueError("viewport invalide, format attendu : LARGEURxHAUTEUR (ex. 1440x900)")
    return {"width": int(match.group(1)), "height": int(match.group(2))}


def select_existing_page(context: Any, target_url: str) -> Any:
    pages = list(context.pages)
    if not pages:
        raise RuntimeError("Aucun onglet n'est ouvert dans le navigateur CDP.")
    target = target_url.rstrip("/")
    for page in reversed(pages):
        if page.url.rstrip("/") == target:
            return page
    available = "\n".join(f"  - {page.url}" for page in pages)
    raise RuntimeError(
        f"Aucun onglet ne correspond à {target_url!r}.\nOnglets disponibles :\n{available}"
    )


def capture(args: argparse.Namespace) -> tuple[str, str]:
    if args.no_navigate and not args.cdp_url:
        raise RuntimeError("--no-navigate nécessite --cdp-url pour cibler un onglet existant.")

    try:
        from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
        from playwright.sync_api import sync_playwright
    except ImportError as exc:
        raise RuntimeError(
            "Playwright n'est pas installé. Exécutez : "
            "pip install -r requirements-playwright.txt && playwright install chromium"
        ) from exc

    if lxml_html is None or etree is None:
        raise RuntimeError(
            "lxml n'est pas installé. Exécutez : pip install -r requirements-playwright.txt"
        )

    headers = parse_headers(args.header)
    viewport = parse_viewport(args.viewport)
    timeout_ms = int(args.timeout * 1000)
    storage_state = None
    if args.storage_state:
        storage_path = Path(args.storage_state).expanduser()
        if not storage_path.is_file():
            raise RuntimeError(f"Fichier storage-state introuvable : {storage_path}")
        storage_state = str(storage_path)

    with sync_playwright() as playwright:
        launched = not bool(args.cdp_url)
        if args.cdp_url:
            browser = playwright.chromium.connect_over_cdp(args.cdp_url)
            if browser.contexts:
                context = browser.contexts[0]
            else:
                context = browser.new_context(
                    viewport=viewport,
                    ignore_https_errors=args.ignore_https_errors,
                    user_agent=args.user_agent,
                    locale=args.locale,
                    device_scale_factor=args.device_scale_factor,
                    extra_http_headers=headers or None,
                )
            if args.no_navigate:
                page = select_existing_page(context, args.url)
            else:
                page = context.pages[0] if context.pages else context.new_page()
        else:
            launch_kwargs: dict[str, Any] = {"headless": not args.headed}
            if args.channel:
                launch_kwargs["channel"] = args.channel
            if args.executable_path:
                launch_kwargs["executable_path"] = args.executable_path
            browser_type = getattr(playwright, args.browser)
            browser = browser_type.launch(**launch_kwargs)
            context = browser.new_context(
                viewport=viewport,
                ignore_https_errors=args.ignore_https_errors,
                user_agent=args.user_agent,
                locale=args.locale,
                device_scale_factor=args.device_scale_factor,
                storage_state=storage_state,
                extra_http_headers=headers or None,
            )
            page = context.new_page()

        page.set_default_timeout(timeout_ms)
        page.set_default_navigation_timeout(timeout_ms)
        if args.cdp_url:
            page.set_viewport_size(viewport)

        try:
            if args.no_navigate:
                if not args.quiet:
                    log(f"Réutilisation de l'onglet courant : {page.url} …")
            else:
                if not args.quiet:
                    log(f"Ouverture de {args.url} …")
                try:
                    page.goto(args.url, wait_until=args.wait_until, timeout=timeout_ms)
                except PlaywrightTimeoutError:
                    log(
                        f"[avertissement] Délai atteint avec wait_until={args.wait_until}; "
                        "la capture continue avec le DOM disponible."
                    )
                    try:
                        page.wait_for_load_state("domcontentloaded", timeout=min(timeout_ms, 10_000))
                    except PlaywrightTimeoutError:
                        pass

            for index, selector in enumerate(args.click, 1):
                if not args.quiet:
                    log(f"Clic {index}/{len(args.click)} sur {selector!r} …")
                page.locator(selector).first.click(timeout=timeout_ms)
                if args.wait_after_click:
                    page.wait_for_timeout(args.wait_after_click)

            if args.wait_for:
                if not args.quiet:
                    log(f"Attente du sélecteur {args.wait_for!r} …")
                page.wait_for_selector(args.wait_for, state="attached", timeout=timeout_ms)

            if args.wait_ms:
                page.wait_for_timeout(args.wait_ms)

            if args.scroll:
                if not args.quiet:
                    log("Défilement pour déclencher le chargement différé …")
                for _ in range(args.scroll_steps):
                    page.evaluate(
                        "() => window.scrollBy(0, Math.max(window.innerHeight * 0.9, 600))"
                    )
                    page.wait_for_timeout(args.scroll_delay)
                page.evaluate("() => window.scrollTo(0, 0)")
                page.wait_for_timeout(min(args.scroll_delay, 300))
                try:
                    page.wait_for_load_state("networkidle", timeout=min(timeout_ms, 5_000))
                except PlaywrightTimeoutError:
                    pass

            page_html = page.content()
            final_url = page.url or args.url
            if not args.quiet:
                log(f"DOM capturé ({len(page_html):,} octets), intégration des ressources …")

            inliner = Inliner(
                context=context,
                page_url=final_url,
                timeout_ms=timeout_ms,
                request_headers=headers,
                strict=args.strict,
                preserve_route=not args.no_preserve_route,
                freeze=args.freeze,
            )
            output_html = inliner.build_html(page_html)
            if args.strict and inliner.errors:
                raise RuntimeError(
                    f"{len(inliner.errors)} ressource(s) CSS/JS n'ont pas pu être intégrées."
                )
            if not args.quiet:
                log(
                    f"Ressources intégrées : {inliner.css_inlined} CSS, "
                    f"{inliner.scripts_inlined} JavaScript."
                )
                if inliner.scripts_removed:
                    log(f"Mode --freeze : {inliner.scripts_removed} script(s) supprimé(s).")
                if inliner.warnings:
                    log(f"{len(inliner.warnings)} avertissement(s) lors de la capture.")
            return output_html, final_url
        finally:
            if launched:
                browser.close()


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        html, final_url = capture(args)
    except (RuntimeError, ValueError) as exc:
        log(f"[erreur] {exc}")
        return 1
    except Exception as exc:  # noqa: BLE001 - message CLI sans traceback brut
        log(f"[erreur] {type(exc).__name__}: {exc}")
        return 1

    output = args.output or str(default_output_path(final_url))
    if output == "-":
        sys.stdout.write(html)
        if not html.endswith("\n"):
            sys.stdout.write("\n")
    else:
        path = Path(output).expanduser()
        path.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(
            "w", encoding="utf-8", dir=path.parent, prefix=f".{path.name}.", suffix=".tmp", delete=False
        ) as handle:
            handle.write(html)
            temporary = Path(handle.name)
        temporary.replace(path)
        if not args.quiet:
            log(f"HTML enregistré : {path.resolve()} ({path.stat().st_size / 1024:.1f} Kio)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
