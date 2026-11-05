from __future__ import annotations

import argparse

import pytest

import save_spa


class FakeResponse:
    ok = True
    status = 200

    def __init__(self, text: str) -> None:
        self._text = text

    def text(self) -> str:
        return self._text


class FakeRequest:
    def __init__(self) -> None:
        self.calls: list[str] = []

    def get(self, url: str, **kwargs: object) -> FakeResponse:
        self.calls.append(url)
        return FakeResponse("console.log('ok');")


class FakeContext:
    def __init__(self) -> None:
        self.request = FakeRequest()


class FakePage:
    def __init__(self, url: str) -> None:
        self.url = url


class FakePageContext:
    def __init__(self, *urls: str) -> None:
        self.pages = [FakePage(url) for url in urls]


def test_parser_accepts_click_sequence_and_freeze_options() -> None:
    args = save_spa.build_parser().parse_args(
        [
            "http://example.test/supervision",
            "--click",
            "#journalisation",
            "--click",
            "role=button[name='UNDO']",
            "--wait-after-click",
            "750",
            "--no-navigate",
            "--freeze",
        ]
    )

    assert args.click == ["#journalisation", "role=button[name='UNDO']"]
    assert args.wait_after_click == 750
    assert args.no_navigate is True
    assert args.freeze is True


def test_freeze_removes_scripts_without_fetching_them() -> None:
    if save_spa.lxml_html is None:
        pytest.skip("lxml n'est pas installé")
    context = FakeContext()
    inliner = save_spa.Inliner(
        context=context,
        page_url="http://example.test/supervision#/undo",
        timeout_ms=1000,
        freeze=True,
    )

    html = inliner.build_html(
        """
        <html>
          <head>
            <link rel="stylesheet" href="data:text/css,body%7Bcolor%3Ared%7D">
            <link rel="modulepreload" href="/app.js">
            <script src="/app.js"></script>
          </head>
          <body>
            <div id="root">contenu rendu</div>
            <script>window.state = "undo";</script>
          </body>
        </html>
        """
    )

    assert "<script" not in html.lower()
    assert "modulepreload" not in html
    assert "data-save-spa-route" not in html
    assert 'id="root"' in html
    assert "<style" in html
    assert inliner.css_inlined == 1
    assert inliner.scripts_inlined == 0
    assert inliner.scripts_removed == 2
    assert context.request.calls == []


def test_without_freeze_external_script_is_still_inlined() -> None:
    if save_spa.lxml_html is None:
        pytest.skip("lxml n'est pas installé")
    context = FakeContext()
    inliner = save_spa.Inliner(
        context=context,
        page_url="http://example.test/supervision",
        timeout_ms=1000,
        preserve_route=False,
    )

    html = inliner.build_html(
        '<html><head><script src="/app.js"></script></head><body></body></html>'
    )

    assert inliner.scripts_inlined == 1
    assert inliner.scripts_removed == 0
    assert 'data-inlined-from="http://example.test/app.js"' in html
    assert "console.log('ok');" in html
    assert context.request.calls == ["http://example.test/app.js"]


def test_select_existing_page_matches_requested_url() -> None:
    context = FakePageContext(
        "http://example.test/login",
        "http://example.test/supervision",
    )

    page = save_spa.select_existing_page(context, "http://example.test/supervision/")

    assert page is context.pages[1]


def test_select_existing_page_reports_available_tabs() -> None:
    context = FakePageContext("http://example.test/login")

    with pytest.raises(RuntimeError, match="Onglets disponibles"):
        save_spa.select_existing_page(context, "http://example.test/supervision")


def test_no_navigate_requires_cdp() -> None:
    args = argparse.Namespace(no_navigate=True, cdp_url=None)

    with pytest.raises(RuntimeError, match="--no-navigate nécessite --cdp-url"):
        save_spa.capture(args)
