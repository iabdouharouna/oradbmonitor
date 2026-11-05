(() => {
  "use strict";

  const app = document.getElementById("app");
  const domains = [
    ["overview", "Vue d'ensemble", "⌂"],
    ["performance", "Performance", "⌁"],
    ["capacity", "Capacité", "▤"],
    ["processes", "Processus", "▧"],
    ["logging", "Journalisation", "▤"],
    ["waits", "Attentes", "◷"],
    ["locks", "Verrous", "♙"],
    ["jobs", "Jobs", "▦"],
    ["files", "Fichiers", "▱"],
    ["objects", "Objets", "⬡"],
    ["backups", "Sauvegardes", "⬡"],
    ["oracle-alerts", "Alertes Oracle", "⚠"],
    ["security", "Sécurité", "⬡"],
    ["licenses", "Licences", "⚖"],
    ["recommendations", "Recommandations", "↗"]
  ];

  const domainIconMarkup = {
    overview: '<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect>',
    performance: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>',
    capacity: '<line x1="22" x2="2" y1="12" y2="12"></line><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" x2="6.01" y1="16" y2="16"></line><line x1="10" x2="10.01" y1="16" y2="16"></line>',
    processes: '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line>',
    logging: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>',
    waits: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
    locks: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
    jobs: '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>',
    files: '<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path>',
    objects: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><path d="M12 22V12"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><path d="m7.5 4.27 9 5.15"></path>',
    backups: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>',
    "oracle-alerts": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
    security: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>',
    licenses: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="M7 21h10"></path><path d="M12 3v18"></path><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>',
    recommendations: '<path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path>'
  };
  const domainNavIcon = key => `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${domainIconMarkup[key] || ""}</svg>`;
  const deynaoMark = '<svg viewBox="0 0 48 48" fill="none" role="img" aria-label="Deynao"><path d="M16.5 37 A15 15 0 1 1 31.5 37" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"></path><circle cx="24" cy="24" r="5" fill="currentColor"></circle></svg>';
  const houseIcon = '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>';
  const databaseIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>';
  const infoIcon = '<svg class="score-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>';
  const clockIcon = '<svg class="refresh-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
  const iconSvg = (body, className = "") => `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body || ""}</svg>`;
  const uiIconMarkup = {
    layoutGrid: '<rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect>',
    shieldCheck: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path>',
    gauge: '<path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path>',
    trendingDown: '<path d="M16 17h6v-6"></path><path d="m22 17-8.5-8.5-5 5L2 7"></path>',
    circleCheck: '<circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>',
    chevronRight: '<path d="m9 18 6-6-6-6"></path>',
    info: '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>',
    server: '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line>',
    circleAlert: '<circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line>',
    fileText: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path>',
    chevronDown: '<path d="m6 9 6 6 6-6"></path>',
    chevronUp: '<path d="m18 15-6-6-6 6"></path>',
    refreshCw: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path>',
    triangleAlert: domainIconMarkup["oracle-alerts"],
    activity: domainIconMarkup.performance,
    hardDrive: domainIconMarkup.capacity
  };
  const uiIcon = (name, className = "") => iconSvg(uiIconMarkup[name], className);
  const standardNav = [
    ["fleet", "Supervision", "▦", "État des bases Oracle"],
    ["alerts-history", "Historique des alertes", "◷", "Alertes levées par la supervision"],
    ["alerts-analysis", "Alertes Oracle", "⚠", "Analyse de fichiers alert.log"]
  ];
  const sampleConnection = {
    name: "FREEDB", host: "127.0.0.1", port: "1521", service: "freepdb1",
    username: "dbsnmp", environment: "TEST", auto: false, lastUsed: "22 min",
    hostname: "e3a12c78531f", description: "Base de test — validation avant production"
  };
  const stored = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem("deynao-" + key)) ?? fallback; }
    catch { return fallback; }
  };
  const strongPassword = value => {
    const groups = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(pattern => pattern.test(value)).length;
    return value.length >= 12 && groups >= 3;
  };
  const formatProcessMemory = (megabytes, compact = false) => {
    const value = Number(megabytes) || 0;
    if (value >= 1024) return `${(value / 1024).toFixed(1)} GB`;
    return compact ? `${Math.round(value)} MB` : `${value.toFixed(1)} MB`;
  };
  const formatProcessUptime = seconds => {
    const value = Number(seconds);
    if (!Number.isFinite(value) || value <= 0) return "—";
    const days = Math.floor(value / 86400);
    const hours = Math.floor((value % 86400) / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };
  const state = {
    route: location.hash.slice(1) || (stored("authenticated", false) ? "/fleet" : "/login"),
    locale: stored("locale", "fr"),
    connections: stored("connections", [sampleConnection]),
    activeConnection: null,
    users: stored("users", [{ username: "admin", name: "admin", role: "Administrateur", active: true, last: "02/11/2026 11:28" }]),
    settings: stored("settings", {}),
    modal: null,
    connectionDraft: null,
    openMenu: null,
    refreshMenuOpen: false,
    refreshInterval: stored("refreshInterval", 0),
    refreshTimer: null,
    guideOpen: false,
    alertHelpTab: "overview",
    search: "",
    environment: "Tous",
    monitor: "Tous",
    fleetView: "cards",
    domainTab: "Vue d'ensemble",
    capacitySearch: "",
    capacityCriticalOnly: false,
    capacitySortDescending: true,
    processSearch: "",
    processEssentialsOnly: false,
    processDetail: null,
    userSessionSort: "username",
    userSessionSortDirection: "asc",
    userSessionDetail: null,
    journalFilter: "Tout",
    alertFilter: "Toutes",
    uploadName: "",
    backendAvailable: false,
    backendError: "",
    oracleConnected: false,
    oracleConnection: null,
    oracleDomainData: null,
    oracleOverviewData: null,
    oracleDomainError: "",
    oracleOverviewError: "",
    oracleRequestId: 0,
    oracleScores: null
  };
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const capacityFormatBytes = value => {
    const bytes = Math.max(0, Number(value) || 0);
    if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
    return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  };
  const refreshIntervals = [
    { milliseconds: 0, label: "Manuel" },
    { milliseconds: 30000, label: "30 s" },
    { milliseconds: 60000, label: "1 min" },
    { milliseconds: 300000, label: "5 min" }
  ];
  const persist = (key, value) => localStorage.setItem("deynao-" + key, JSON.stringify(value));
  const sameProfile = (a, b) => Boolean(a && b
    && String(a.host || "") === String(b.host || "")
    && String(a.port || "") === String(b.port || "")
    && String(a.service || "") === String(b.service || "")
    && String(a.username || "") === String(b.username || ""));
  const profileIsActive = profile => Boolean(state.oracleConnected && sameProfile(profile, state.oracleConnection));
  const savedProfile = () => (state.activeConnection && !isSampleProfile(state.activeConnection))
    ? state.activeConnection
    : state.connections.find(item => !isSampleProfile(item)) || null;
  const isSampleProfile = profile => sameProfile(profile, sampleConnection);
  const profileState = profile => profileIsActive(profile)
    ? { label: "Session active", tone: "green" }
    : isSampleProfile(profile)
      ? { label: "Exemple local", tone: "" }
      : { label: "Profil enregistré", tone: "amber" };
  const upsertProfile = connection => {
    const profiles = state.connections.filter(item => !isSampleProfile(item) || sameProfile(item, connection));
    const existingIndex = profiles.findIndex(item => sameProfile(item, connection));
    if (existingIndex >= 0) profiles[existingIndex] = { ...profiles[existingIndex], ...connection };
    else profiles.unshift(connection);
    state.connections = profiles;
    state.activeConnection = profiles.find(item => sameProfile(item, connection)) || connection;
    persist("connections", state.connections);
    return state.activeConnection;
  };
  const requestReconnect = profile => {
    const target = profile || savedProfile();
    state.connectionDraft = target || null;
    state.modal = "connection";
    state.openMenu = null;
    state.refreshMenuOpen = false;
    return render();
  };
  function configureAutoRefresh() {
    if (state.refreshTimer !== null) clearInterval(state.refreshTimer);
    state.refreshTimer = null;
    if (state.refreshInterval > 0) {
      state.refreshTimer = setInterval(() => {
        if (state.oracleConnected && state.route.startsWith("/supervision")) loadOracleDomain(domainKey());
      }, state.refreshInterval);
    }
  }
  const routeTo = route => {
    if (route.startsWith("/supervision") && route.split("/")[2] !== state.route.split("/")[2]) state.domainTab = "Vue d'ensemble";
    state.route = route; state.modal = null; state.connectionDraft = null; state.openMenu = null; state.refreshMenuOpen = false;
    if(route === "/fleet") state.activeConnection = null;
    location.hash = route; render();
    if(route.startsWith("/supervision")) loadOracleDomain(route.split("/")[2] || "overview");
  };
  async function apiRequest(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(body.detail || `Erreur serveur (${response.status}).`);
      error.status = response.status;
      throw error;
    }
    return body;
  }
  async function loadOracleDomain(domain) {
    if (!state.backendAvailable || !state.oracleConnected) return;
    const requestId = ++state.oracleRequestId;
    state.oracleDomainData = null;
    state.oracleDomainError = "";
    if (domain === "overview") state.oracleOverviewError = "";
    render();
    try {
      const data = await apiRequest(`/api/dashboard/${encodeURIComponent(domain)}`);
      if (requestId !== state.oracleRequestId || domainKey() !== domain) return;
      state.oracleDomainData = data;
      if (domain === "overview") {
        state.oracleOverviewData = data;
        state.oracleOverviewError = "";
      }
      try {
        const scores = await apiRequest("/api/scores");
        if (requestId === state.oracleRequestId) state.oracleScores = scores;
      } catch { /* scores non critiques */ }
    } catch (error) {
      if (requestId !== state.oracleRequestId) return;
      if (error.status === 409) {
        state.oracleConnected = false;
        state.oracleConnection = null;
        state.oracleDomainData = null;
        if (domain === "overview") state.oracleOverviewData = null;
      }
      state.oracleDomainError = error.message;
      if (domain === "overview") state.oracleOverviewError = error.message;
    }
    render();
  }
  function initializeBackend() {
    if (location.protocol === "file:") return;
    apiRequest("/api/status").then(data => {
      state.backendAvailable = true;
      state.oracleConnected = data.connected;
      state.oracleConnection = data.connection;
      if (data.connected && data.connection) {
        upsertProfile(data.connection);
      }
      render();
      if (data.connected && state.route.startsWith("/supervision")) {
        const domain = state.route.split("/")[2] || "overview";
        loadOracleDomain("overview").then(() => {
          if (domain !== "overview") loadOracleDomain(domain);
        });
      }
    }).catch(error => {
      state.backendError = error.message;
      render();
    });
  }
  function backendNotice() {
    if (!state.backendAvailable) return "";
    if (state.oracleConnected) {
      return `<div class="callout success backend-notice"><span><b>Oracle connecté</b> — collecte à la demande depuis ${esc(state.oracleConnection?.host || "la base configurée")}. Les identifiants restent en mémoire côté serveur.</span>${btn("Déconnecter","disconnect-oracle","btn small-btn")}</div>`;
    }
    const profile = savedProfile();
    if (profile) {
      return `<div class="callout backend-notice"><b>Profil « ${esc(profile.name || profile.service || "Oracle")} » enregistré — session Oracle inactive.</b> Le mot de passe n’est pas conservé ; reconnectez-vous pour collecter les mesures réelles. ${btn("Reconnecter","reconnect-oracle","btn small-btn")}${btn("Nouvelle connexion","new-connection","btn small-btn")}</div>`;
    }
    return `<div class="callout backend-notice"><b>Connexion Oracle non configurée.</b> Les valeurs de cette vue sont des exemples et ne représentent pas une collecte réelle. ${btn("Configurer Oracle","new-connection","btn small-btn")}</div>`;
  }
  function backendStatusNotice() {
    if (!state.backendAvailable) return "";
    if (!state.oracleConnected) {
      const profile = savedProfile();
      if (profile) {
        return `<div class="backend-page-notice"><div class="callout backend-notice"><b>Profil « ${esc(profile.name || profile.service || "Oracle")} » enregistré — session Oracle inactive.</b> Le profil est conservé dans le navigateur, mais le mot de passe reste en mémoire serveur et disparaît à l’arrêt. ${btn("Reconnecter","reconnect-oracle","btn small-btn")}${btn("Nouvelle connexion","new-connection","btn small-btn")}</div></div>`;
      }
      return `<div class="backend-page-notice"><div class="callout backend-notice"><b>Connexion Oracle non configurée.</b> Les données et compteurs de démonstration ne sont pas collectés depuis la base en ligne. ${btn("Configurer Oracle","new-connection","btn small-btn")}</div></div>`;
    }
    return `<div class="backend-page-notice"><div class="callout info backend-notice"><b>Base Oracle connectée.</b> Les mesures réelles sont disponibles dans les domaines de supervision. L’historique des alertes Deynao, les utilisateurs et les paramètres restent des écrans de démonstration.</div></div>`;
  }
  const toast = message => {
    document.querySelector(".toast")?.remove();
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 2800);
  };
  const btn = (label, action, cls = "btn", attrs = "") =>
    `<button class="${cls}" data-action="${esc(action)}" ${attrs}>${label}</button>`;
  const pageHead = (title, subtitle, actions = "") =>
    `<header class="page-head"><div><h1>${title}</h1>${subtitle ? `<p class="subtitle">${subtitle}</p>` : ""}</div><div class="toolbar">${actions}</div></header>`;
  const card = (content, extra = "") => `<section class="card ${extra}">${content}</section>`;
  const badge = (text, tone = "") => `<span class="pill ${tone}">${esc(text)}</span>`;
  const field = (label, name, value = "", hint = "", type = "text", placeholder = "", readonly = false) => {
    const ro = readonly ? " readonly" : "";
    return `<label class="field">${esc(label)}${type === "password"
      ? `<span class="password-wrap"><input class="input" name="${esc(name)}" type="password" value="${esc(value)}" placeholder="${esc(placeholder)}"><button class="password-toggle" type="button" data-action="toggle-password">Afficher</button></span>`
      : `<input class="input" name="${esc(name)}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}"${ro}>`}${hint ? `<span class="field-hint">${hint}</span>` : ""}</label>`;
  };

  function standardShell(content) {
    const isDomain = state.route.startsWith("/supervision");
    if (isDomain) return domainShell(content);
    const nav = standardNav.map(([path, label, icon, sub]) => `
      <button class="nav-item ${path === "fleet" ? (state.route === "/fleet" ? "active" : "") : state.route === "/" + path ? "active" : ""}" data-route="/${path}">
        <span class="nav-icon">${icon}</span><span>${label}${sub ? `<small class="brand-sub">${sub}</small>` : ""}</span>
      </button>`).join("");
    return `<div class="app-shell">
      <aside class="sidebar">
        <div class="brand" role="button" tabindex="0" data-route="/fleet"><div class="brand-mark">◉</div><div><div class="brand-name">Deynao</div><div class="brand-sub">Supervision et diagnostic Oracle</div></div></div>
        <div class="nav-caption">Vue d'ensemble</div><nav class="nav-items">${nav}</nav>
        <div class="side-bottom">
          <div class="nav-caption">Aide</div><button class="side-action ${state.route === "/documentation" ? "active" : ""}" data-route="/documentation"><span class="nav-icon">▣</span>Documentation</button>
          <div class="nav-caption">Système</div>
          <button class="side-action" data-route="/settings"><span class="nav-icon">⚙</span>Paramètres</button>
          <button class="side-action" data-route="/users"><span class="nav-icon">♙</span>Utilisateurs</button>
          <div class="relative">
            <button class="side-action" data-action="language"><span class="nav-icon">文</span>${state.locale === "fr" ? "Français" : "English"}　⌄</button>
            ${state.openMenu === "language" ? `<div class="menu-pop"><button data-action="set-fr">🇫🇷 Français</button><button data-action="set-en">🇬🇧 English</button></div>` : ""}
          </div>
          <div class="relative">
            <button class="side-action" data-action="user-menu"><span class="nav-icon">◉</span><span><b>admin</b><small class="brand-sub">Administrateur</small></span></button>
            ${state.openMenu === "user" ? `<div class="menu-pop"><button data-action="password-modal">Changer mon mot de passe</button><button data-action="logout">Déconnexion</button></div>` : ""}
          </div>
          <div class="side-status"><span class="dot"></span><span><b>Système prêt</b><small>Service Deynao opérationnel</small></span></div>
          <div class="version">Version 1.0.3</div>
        </div>
      </aside><main class="main-area">${backendStatusNotice()}${content}</main></div>`;
  }
  function domainShell(content) {
    const connection = state.activeConnection || state.connections[0] || sampleConnection;
    const overview = domainKey() === "overview";
    const performance = domainKey() === "performance";
    const startupTime = state.oracleOverviewData?.metrics?.find(metric => metric.label === "Démarrage instance")?.value;
    const startupDate = startupTime ? new Date(startupTime.replace(" ", "T")) : null;
    const elapsedMinutes = startupDate && !Number.isNaN(startupDate.getTime())
      ? Math.max(1, Math.floor((Date.now() - startupDate.getTime()) / 60000))
      : null;
    const availability = elapsedMinutes != null
      ? (elapsedMinutes >= 60 ? `${Math.floor(elapsedMinutes / 60)}h${elapsedMinutes % 60 ? ` ${elapsedMinutes % 60}min` : ""}` : `${elapsedMinutes}min`)
      : (overview ? "1h 20min" : "5 min");
    const globalScore = state.oracleScores?.global;
    const demoOverviewScore = overview && !state.oracleConnected
      ? {
          score: 79,
          label: "1 domaine critique : Sauvegardes",
          tone: "amber",
          breakdown: [
            { domain: "performance", score: 85, tone: "green" },
            { domain: "capacity", score: 100, tone: "green" },
            { domain: "backups", score: 36, tone: "red" },
            { domain: "security", score: 65, tone: "amber" },
            { domain: "logging", score: 75, tone: "amber" },
            { domain: "oracle-alerts", score: 97, tone: "green" }
          ],
          details: ["Sauvegardes à auditer", "Audits et privilèges à vérifier", "Mode journalisation à vérifier"]
        }
      : null;
    const scoreData = globalScore || demoOverviewScore;
    const scoreValue = scoreData?.score != null ? `${scoreData.score}%` : (overview ? "—" : state.oracleConnected ? "Collecte…" : "—");
    const scoreLabel = overview
      ? 'Score de Santé' + infoIcon
      : !state.oracleConnected ? "Score de Santé" : "Connexion active";
    const scoreTone = scoreData?.tone || "blue";
    const scoreBadge = scoreData ? badge(`${scoreData.label}`, scoreTone) : badge("Score non disponible", "blue");
    const scoreProgress = scoreData?.score != null ? `<div class="score-progress" aria-hidden="true"><span style="width:${Math.max(0, Math.min(100, Number(scoreData.score) || 0))}%"></span></div>` : "";
    const scoreBox = `<div class="score-box"><b>${scoreValue}</b><span>${scoreLabel}</span>${scoreProgress}<div class="tiny">${scoreBadge}</div></div>`;

    let scorePopover;
    if (scoreData) {
      const breakdownHtml = (scoreData.breakdown || []).map(item => {
        const toneClass = item.tone === "red" ? "critical" : item.tone === "green" ? "excellent" : "good";
        const toneIcon = item.tone === "red" ? "⚠" : item.tone === "green" ? "✓" : "⌁";
        return `<div><span><i class="${toneClass}">${toneIcon}</i>${item.domain.charAt(0).toUpperCase() + item.domain.slice(1)} <small>${item.score}%</small></span><b class="${toneClass}-count">${item.score}</b></div>`;
      }).join("");
      const detailsHtml = scoreData.details?.length
        ? `<div class="score-popover-callout"><strong>Points d'attention</strong><span>${scoreData.details.join(" · ")}</span></div>`
        : "";
      scorePopover = `<section class="score-popover" id="${overview ? "overview-score-tooltip" : "domain-score-tooltip"}" role="dialog" aria-label="Détail du score de santé">
          <div class="score-popover-heading"><div><strong>${scoreData.score}%</strong><span class="score-popover-alert">ⓘ</span><small>Score de Santé Global</small></div><span class="score-popover-verdict">${scoreData.label}</span></div>
          <p class="score-popover-intro">Ce score évalue l'état global de votre base Oracle selon ${(scoreData.breakdown || []).length} indicateurs pondérés par criticité.</p>
          ${detailsHtml}
          <div class="score-popover-breakdown"><strong>RÉPARTITION PAR DOMAINE</strong>${breakdownHtml}</div>
          <details class="score-calculation"><summary>ⓘ　Comment est-il calculé ?</summary><p>Le score est calculé à chaque actualisation à partir des métriques Oracle collectées (SGA, PGA, CPU, tablespaces, sessions, verrous, etc.) et de leur pondération par domaine.</p></details>
          <small class="score-popover-footnote">Dernière mise à jour lors de la collecte Oracle.</small>
        </section>`;
    } else {
      scorePopover = `<section class="score-popover" id="${overview ? "overview-score-tooltip" : "domain-score-tooltip"}" role="dialog" aria-label="Détail du score de santé">
          <div class="score-popover-heading"><div><strong>—</strong><span class="score-popover-alert">ⓘ</span><small>Score de Santé Global</small></div><span class="score-popover-verdict">—</span></div>
          <p class="score-popover-intro">Le score sera calculé après la première collecte Oracle.</p>
          <details class="score-calculation"><summary>ⓘ　Comment est-il calculé ?</summary><p>Le score est calculé à chaque actualisation à partir des métriques système Oracle et de leur pondération.</p></details>
        </section>`;
    }
    const refreshLabel = refreshIntervals.find(option => option.milliseconds === state.refreshInterval)?.label || "Manuel";
    const refreshMenu = refreshIntervals.map(option => `<button type="button" role="menuitemradio" aria-checked="${state.refreshInterval === option.milliseconds}" class="refresh-option ${state.refreshInterval === option.milliseconds ? "selected" : ""}" data-action="set-refresh-interval" data-interval="${option.milliseconds}"><span class="refresh-option-check">${state.refreshInterval === option.milliseconds ? "✓" : ""}</span><span>${option.label}</span></button>`).join("");
    const nav = domains.map(([key, name]) => `<button class="nav-item ${domainKey() === key ? "active" : ""}" data-route="${key === "overview" ? "/supervision" : "/supervision/" + key}">${domainNavIcon(key)}${name}</button>`).join("");
    return `<div class="domain-shell ${overview ? "overview-shell" : ""} ${performance ? "performance-shell" : ""}"><aside class="domain-sidebar">
      <div class="brand" data-route="/fleet" role="button" tabindex="0"><div class="brand-mark">${deynaoMark}</div><div><div class="brand-name">Deynao</div><div class="brand-sub">Supervision et diagnostic Oracle</div></div></div>
      <div class="domain-nav"><div class="nav-caption">Navigation</div><nav class="nav-items">${nav}</nav></div>
      <div class="domain-bottom"><button class="side-action" data-route="/fleet">${houseIcon}Retour au parc</button></div>
    </aside><div class="main-area">
      <header class="domain-top"><div class="domain-heading"><div class="row"><span class="pill orange">${databaseIcon}</span><div><h2 style="margin:0" title="Base de données : ${esc(connection.name === "FREEDB" ? "FREE" : connection.name)}">${esc(connection.name === "FREEDB" ? "FREE" : connection.name)}</h2><span class="db-sep" aria-hidden="true">•</span><span class="env-pill">${esc(connection.environment === "TEST" ? "Test" : connection.environment)}</span></div></div>
        <div class="row"><div class="score-popover-wrap ${overview ? "overview-score-popover-wrap" : "domain-score-popover-wrap"}" tabindex="0" aria-describedby="${overview ? "overview-score-tooltip" : "domain-score-tooltip"}">${scoreBox}${scorePopover}</div>
          <span class="tiny muted">${clockIcon}${overview ? "Actualisé il y a 5s" : state.oracleConnected ? (state.oracleOverviewData ? "Collecte terminée" : "Collecte en attente") : "Actualisé à l'instant"}</span>
          <div class="refresh-control"><button class="btn small-btn refresh-trigger" type="button" data-action="toggle-refresh-menu" aria-haspopup="menu" aria-expanded="${state.refreshMenuOpen}"><span>Actualisation : ${refreshLabel}</span>${uiIcon("chevronDown", "refresh-trigger-chevron")}</button>${state.refreshMenuOpen ? `<div class="refresh-menu" role="menu" aria-label="Fréquence d'actualisation">${refreshMenu}</div>` : ""}</div>
          <button class="btn icon-btn" data-action="refresh-domain" aria-label="Actualiser maintenant">${uiIcon("refreshCw", "refresh-icon")}</button></div></div>
        <div class="domain-meta">${overview
          ? `<span><span class="domain-meta-label">Version :</span><b>${esc(state.oracleOverviewData?.metrics?.find(metric => metric.label === "Version")?.value || "23.0.0.0.0")}</b></span><span class="domain-meta-separator" aria-hidden="true">|</span><span>${clockIcon}<span class="domain-meta-label">Disponibilité :</span><b>${esc(availability)}</b></span>`
          : state.oracleConnected
            ? `<span><span class="domain-meta-label">Version Oracle :</span><b>${esc(state.oracleOverviewData?.metrics?.find(m=>m.label==="Version")?.value || "en attente")}</b></span><span class="domain-meta-separator" aria-hidden="true">|</span><span><span class="domain-meta-label">Démarrage :</span><b>${esc(state.oracleOverviewData?.metrics?.find(m=>m.label==="Démarrage instance")?.value || state.oracleOverviewError || "en attente")}</b></span>`
          : `<span><span class="domain-meta-label">Version :</span><b>23.0.0.0.0</b></span><span class="domain-meta-separator" aria-hidden="true">|</span><span>${clockIcon}<span class="domain-meta-label">Disponibilité :</span><b>58 min</b></span>`}</div></header>
      <main class="domain-content ${overview ? "overview-content" : ""}">${content}</main>
    </div></div>`;
  }
  function domainKey() { return state.route.split("/")[2] || "overview"; }
  function renderDomainTabs(tabs) {
    const icons = {
      "Vue d'ensemble":"◉", "Mémoire":"▤", "CPU":"▦", "I/O & Cache":"▱", "Aide":"?",
      "Détails 5":"☷", "Analyse":"⌁", "Recommandations":"↗", "Processus système":"⚙",
      "Processus utilisateur":"♙", "ARCHIVELOG":"▤", "REDO LOG":"↻", "UNDO":"↶",
      "En direct":"●", "Historique":"◷", "Chaînes de blocage":"⇄", "Sessions longues":"◷",
      "Analyse & Actions":"⚙", "Jobs applicatifs":"▦", "Jobs système":"⚙", "Détails":"☷",
      "Schémas":"⬡", "Tables":"▤", "Index":"▧", "Vues":"◫", "Alertes":"⚠",
      "Codes ORA":"⌕", "Comptes":"♙", "Audit Oracle":"◉", "Politiques":"☷",
      "Options":"☷", "Packs":"▦", "Plan d'action":"☑"
    };
    const label = domains.find(d=>d[0]===domainKey())?.[1] || "supervision";
    return `<div class="domain-tab-panel"><nav class="domain-tab-list" role="tablist" aria-label="Vues de ${esc(label)}">${tabs.map(t=>`<button class="domain-tab ${state.domainTab===t?"active":""}" title="${domainKey()==="capacity" && t==="Vue d'ensemble" ? "Synthèse de l'utilisation de l'espace et indicateurs clés" : esc(t)}" role="tab" aria-selected="${state.domainTab===t}" data-action="domain-tab:${esc(t)}"><span class="domain-tab-icon" aria-hidden="true">${icons[t] || "▤"}</span><span>${esc(t)}</span></button>`).join("")}</nav></div>`;
  }
  function render() {
    document.title = "Deynao — Supervision Oracle";
    if (state.route === "/login") { app.innerHTML = renderLogin(); return; }
    let content;
    if (state.route === "/fleet" || state.route === "/") content = renderFleet();
    else if (state.route === "/alerts-history") content = renderAlerts();
    else if (state.route === "/alerts-analysis") content = renderAnalysis();
    else if (state.route === "/settings") content = renderSettings();
    else if (state.route === "/mail-log") content = renderMailLog();
    else if (state.route === "/users") content = renderUsers();
    else if (state.route === "/documentation") content = renderDocs();
    else if (state.route.startsWith("/supervision")) content = renderDomain();
    else content = renderFleet();
    app.innerHTML = standardShell(content) + (state.modal ? renderModal() : "");
  }
  function renderLogin() {
    return `<div class="login-screen"><div class="login-card">
      <div class="row between tiny muted" style="margin-bottom:20px"><span>Deynao • application locale</span><button class="btn small-btn" data-action="toggle-locale">${state.locale === "fr" ? "FR　|　EN" : "EN　|　FR"}</button></div>
      <div class="login-brand"><div class="brand-mark">◉</div><h1>Deynao</h1><p class="subtitle">Supervision et diagnostic Oracle</p></div>
      <section class="card"><h2>Connexion</h2><p class="subtitle" style="margin-bottom:18px">Connectez-vous pour accéder à la supervision.</p>
        <form data-form="login" class="stack"><label class="field">Identifiant<input class="input" name="username" required autocomplete="username"></label>
          <label class="field">Mot de passe<input class="input" name="password" type="password" required autocomplete="current-password"></label>
          <p class="field-hint">Maquette locale : saisissez un identifiant et un mot de passe quelconques.</p>
          <button class="btn primary" type="submit">Se connecter</button></form></section>
    </div></div>`;
  }
  function renderFleet() {
    const filtered = state.connections.filter(c => {
      const q = state.search.toLowerCase();
      return (!q || [c.name,c.host,c.service,c.username].some(v => String(v).toLowerCase().includes(q)))
        && (state.environment === "Tous" || c.environment === state.environment)
        && (state.monitor === "Tous" || (state.monitor === "Surveillées auto" ? c.auto : !c.auto));
    });
    const counts = env => state.connections.filter(c => env === "Tous" || c.environment === env).length;
    const actions = `${btn("＋ Nouvelle connexion", "new-connection", "btn primary")}`;
    let list;
    if (!filtered.length) list = `<div class="card empty"><div class="empty-icon">⌕</div><h3>Aucune connexion trouvée</h3><p>Modifiez votre recherche ou vos filtres.</p>${btn("Réinitialiser les filtres","reset-filters","btn")}</div>`;
    else if (state.fleetView === "cards") list = `<div class="fleet-cards">${filtered.map(c => `<article class="card fleet-card">
      <div class="row between fleet-card-head"><div class="row"><span class="fleet-db-icon">▤</span><h3 style="margin:0">${esc(c.name)}</h3>${badge(c.environment, c.environment === "PROD" ? "red" : c.environment === "TEST" ? "blue" : "green")}${badge(profileState(c).label, profileState(c).tone)}${badge(c.auto ? "Surveillance auto" : "À la demande", c.auto ? "green" : "")}</div><div class="relative">${btn("⋮","connection-menu","btn icon-btn")}${state.openMenu === "connection" ? `<div class="menu-pop">
        <button data-action="quick-stats">▤　Statistiques rapides</button><button data-action="quick-diagnose">⌕　Diagnostic express</button><button data-action="copy-connection">▣　Copier les informations</button><button data-action="rename-connection">✎　Renommer</button><button data-action="edit-connection">⚙　Modifier</button><button data-action="toggle-auto">${c.auto ? "Désactiver" : "Activer"} la surveillance auto 24/7</button><button data-action="maintenance">▦　Maintenance planifiée</button><button class="danger" data-action="delete-connection">Supprimer</button></div>` : ""}</div></div>
      <div class="fleet-db-details"><div><span>◉</span> ${esc(c.host)}:${esc(c.port)}<br><span>♙</span> ${esc(c.username)}<br><span class="tiny muted">◷ Utilisée ${c.lastUsed === "à l'instant" ? "à l'instant" : `il y a ${esc(c.lastUsed || "récemment")}`}</span></div><div><span>▤</span> ${esc(c.service)}<br><span>▣</span> ${esc(c.hostname || "—")}</div></div>
      <div class="fleet-card-actions">${btn(profileIsActive(c) ? "▥　Tableau de bord en direct" : isSampleProfile(c) ? "＋　Configurer Oracle" : "⇄　Se reconnecter","open-supervision","btn primary",`data-connection-index="${state.connections.indexOf(c)}"`)}</div>
      ${profileIsActive(c) || isSampleProfile(c) ? "" : `<p class="tiny muted" style="margin:8px 0 0">Profil enregistré — le mot de passe est requis pour rouvrir la session serveur.</p>`}
    </article>`).join("")}</div>`;
    else list = `<section class="card"><div class="row between"><h3>Bases Oracle (Vue Tableau) – ${filtered.length} connexions</h3>${btn("▦ Export Excel","export","btn")}</div><div class="table-wrap"><table><thead><tr>${["Nom","Env.","Serveur","Service","Utilisateur","Supervision","Collecte","Score","Actions"].map(h=>`<th>${h}　↕</th>`).join("")}</tr></thead><tbody>${filtered.map(c=>`<tr><td><b>${esc(c.name)}</b></td><td>${badge(c.environment)}</td><td>${esc(c.host)}:${esc(c.port)}</td><td>${esc(c.service)}</td><td>${esc(c.username)}</td><td>${c.auto?"Auto":"À la demande"}</td><td>—</td><td>—</td><td><button class="btn small-btn" data-action="open-supervision" data-connection-index="${state.connections.indexOf(c)}">${profileIsActive(c) ? "Ouvrir" : isSampleProfile(c) ? "Configurer" : "Se reconnecter"}</button> <button class="btn small-btn" data-action="connection-menu">⋯</button></td></tr>`).join("")}</tbody></table></div><div class="row between tiny muted" style="margin-top:12px"><span>Lignes par page</span><select style="width:100px"><option>25</option><option>50</option><option>Tout</option></select><span>1–${filtered.length} / ${filtered.length}</span></div></section>`;
    return `<div class="fleet-page"><header class="fleet-header"><h1><span class="heading-icon">⬡</span>Parc de bases</h1>${actions}</header>
      <div class="fleet-summary"><span class="fleet-summary-chip">⬡　Parc: ${state.connections.length}</span><span class="fleet-divider">|</span><span class="fleet-summary-auto">◉　Surveillées auto: ${state.connections.filter(c=>c.auto).length}</span></div>
      <div class="page fleet-content">
      ${card(`<div class="fleet-filter-top"><div class="search"><input class="input" data-search placeholder="Rechercher par nom, IP, service…" value="${esc(state.search)}"></div><div class="filter-row">${["Tous","PROD","TEST","DEV"].map(e=>btn(`${e}　${counts(e)}`,"env:"+e,`btn small-btn ${state.environment===e?"active":""}`)).join("")}</div></div>
      <div class="toolbar between"><div class="filter-row">${["Surveillées auto","À la demande"].map(m=>btn(`${m}　${state.connections.filter(c=>m==="Surveillées auto"?c.auto:!c.auto).length}`,"monitor:"+m,`btn small-btn ${state.monitor===m?"active":""}`)).join("")}</div><div class="toolbar">${btn("▦ Cartes","view:cards",`btn small-btn ${state.fleetView==="cards"?"active":""}`)}${btn("☷ Tableau","view:table",`btn small-btn ${state.fleetView==="table"?"active":""}`)}${btn("⟳","refresh","btn icon-btn")}</div></div>`,"tight")}
      <div style="margin-top:12px">${list}</div>
      <div class="row between tiny muted" style="padding:18px 4px"><button class="btn small-btn" data-action="legend">ⓘ Légende des états</button><span>Mis à jour à l'instant　·　Deynao</span></div>
      </div></div>`;
  }

  function renderDomain() {
    const key = domainKey();
    if (key === "overview") return renderOverview();
    const config = {
      performance: { title:"Performance Oracle", intro:"Analyse détaillée des métriques de performance et optimisation", score:"85%", tabs:["Vue d'ensemble","Mémoire","CPU","I/O & Cache","Aide"], metrics:[["Utilisation SGA","88.01%","1.3 GB / 1.5 GB · Libre : 183.3 MB","amber"],["Utilisation PGA","2.7%","13.8 MB / 512 MB · Marge : 498 MB","green"],["CPU système","4.52%","Depuis le démarrage","green"],["Sessions","0 / 322","0 actives · 0 inactives","green"],["Cache Hit Ratio","96.35%","Lectures mémoire vs disque","green"],["Transactions","0/s","Commits + rollbacks","blue"]] },
      capacity: { title:"Capacité Oracle", intro:"Gestion intelligente de l’espace disque et des tablespaces", score:"100%", tabs:["Vue d'ensemble","Détails 5","Analyse","Recommandations","Aide"], metrics:[["Tablespaces à surveiller","1","Seuil : 90 % ; SYSTEM/SYSAUX : 85 %","amber"],["Utilisation totale","96.8%","18.04 GB / 18.63 GB","amber"],["Protection autoextend","5/5","Protection complète","green"],["Espace libre","604.16 MB","3.2% disponible","amber"]] },
      processes: { title:"Processus Oracle", intro:"Monitoring et analyse des processus Oracle", score:"100%", tabs:["Vue d'ensemble","Processus système","Processus utilisateur","Aide"], metrics:[["Slots processus","94 / 200","47.0% utilisé","green"],["Processus essentiels","5/5","PMON · SMON · LGWR · DBW0 · CKPT","green"],["Empreinte mémoire","324 MB","63.4% de PGA_AGGREGATE_TARGET","green"],["Processus utilisateur","0","Aucun processus utilisateur connecté","blue"]] },
      logging: { title:"Journalisation Oracle", intro:"Analyse détaillée des mécanismes de journalisation et résilience", score:"75%", tabs:["Vue d'ensemble","ARCHIVELOG","REDO LOG","UNDO","Aide"], metrics:[["Mode Archivelog","ARCHIVELOG","Mode ARCHIVELOG correctement configuré","green"],["Groupes REDO","3","600 MB · non multiplexé","green"],["Rétention UNDO","15 min","0% utilisé · 32 TB max · Autoextend · Cible: ≥30min","amber"],["Espace Archive","0%","0 B libre · FRA","green"]] },
      waits: { title:"Événements d’attente Oracle", intro:"Analyse des temps d’attente et goulots d’étranglement", score:"100%", tabs:["Vue d'ensemble","En direct","Historique","Analyse","Aide"], metrics:[["Sessions en attente","0","Aucune session bloquée","green"],["Attentes critiques","0","Aucune session bloquée","green"],["Latence I/O","0.23 ms","Excellent (< 5 ms)","green"],["Classes problématiques","0","Toutes les classes normales","green"]] },
      locks: { title:"Gestion des Verrous Oracle", intro:"Analyse des blocages, sessions longues et contentions", score:"100%", tabs:["Vue d'ensemble","Chaînes de blocage","Sessions longues","Analyse & Actions","Aide"], metrics:[["Sessions bloquantes","0","Aucun blocage","green"],["Deadlocks","0","Aucun deadlock","green"],["Sessions longues","0","Seuil de surveillance : > 1h","green"],["Verrous totaux","7","Verrous Oracle actifs observés","blue"]] },
      jobs: { title:"Jobs Oracle planifiés", intro:"Gestion et supervision des tâches automatisées", score:"100%", tabs:["Vue d'ensemble","Jobs applicatifs","Jobs système","Historique","Aide"], metrics:[["Jobs applicatifs","0","Hors jobs système","blue"],["Actifs","0","Aucun job applicatif","green"],["En cours","0","Aucun job en exécution","green"],["Planifiés","0","Prochaine exécution selon calendrier","blue"]] },
      files: { title:"Fichiers Critiques Oracle", intro:"Infrastructure fichiers critiques Oracle : SPFILE, control files, redo logs, datafiles", score:"85%", tabs:["Vue d'ensemble","Détails","Recommandations","Aide"], metrics:[["SPFILE","Présent","Configuration persistante","green"],["Control Files","2","Recommandé ≥ 3","amber"],["Groupes REDO","3","Non multiplexé","amber"],["Data Files","5","Fichiers de données détectés","blue"]] },
      objects: { title:"Objets de Base Oracle", intro:"Inventaire complet des objets Oracle", score:"85%", tabs:["Vue d'ensemble","Schémas","Tables","Index","Vues","Aide"], metrics:[["Schémas totaux","40","10 utilisateur / 30 système","blue"],["Tables totales","2 605","85 applicatives","blue"],["Index totaux","3 398","56 applicatifs","blue"],["Vues totales","8 790","2 applicatives","blue"]] },
      backups: { title:"Gestion des Sauvegardes", intro:"Supervision des sauvegardes Oracle RMAN et de l’espace de récupération (FRA)", score:"36%", tabs:["Vue d'ensemble","Historique","FRA","Recommandations","Aide"], metrics:[["Total sauvegardes","0","30 derniers jours","amber"],["Taux de réussite","—","Aucune sauvegarde à évaluer","blue"],["Volume produit","0.00 KB","Volume cumulé (30j)","blue"],["Durée moyenne","—","Aucune sauvegarde exécutée","blue"]] },
      "oracle-alerts": { title:"Alertes Oracle", intro:"Diagnostic des alertes Oracle (alert.log + V$DIAG_ALERT_EXT) — codes ORA, sévérité, fréquence", score:"97%", tabs:["Vue d'ensemble","Alertes","Codes ORA","Aide"], metrics:[["Total alertes","3","Sur 184 occurrences brutes","blue"],["Alertes critiques","0","Aucun problème détecté","green"],["Avertissements","0","Aucun avertissement","green"],["Période d'analyse","24 h","24 h · 7 j · 30 j","blue"]] },
      security: { title:"Sécurité Oracle", intro:"Analyse complète de la sécurité et conformité de votre base de données", score:"65%", tabs:["Vue d'ensemble","Comptes","Audit Oracle","Politiques","Aide"], metrics:[["Comptes à risque","0","Aucun compte à risque détecté","green"],["Comptes à pouvoir élevé","0 / 8","0% des comptes actifs","green"],["Politique MDP","Inactive","Profil DEFAULT à configurer","amber"],["Audit Oracle","À vérifier","2/4 profils configurés","amber"]] },
      licenses: { title:"Exposition Licences Oracle", intro:"Détection technique des options, packs et fonctionnalités — à vérifier contractuellement", score:"42%", tabs:["Vue d'ensemble","Options","Packs","Aide"], metrics:[["Édition observée","Enterprise","Version 23.26.3.0.0 · inférée depuis V$OPTION","amber"],["Options payantes","6","6 options sur 9 vérifiées","red"],["Packs à vérifier","2","Diagnostics Pack + Tuning Pack","amber"],["Validation","Requise","Validation contractuelle non couverte","blue"]] },
      recommendations: { title:"Recommandations Oracle", intro:"Plan d’action transverse — constats détectés par les analyses Deynao", score:"18", tabs:["Vue d'ensemble","Plan d'action","Aide"], metrics:[["Action immédiate","0","Aucune action urgente","green"],["Action prioritaire","6","À planifier","amber"],["Surveillance","6","Éléments à observer","amber"],["Optimisation","6","Améliorations ou validations","blue"]] }
    }[key] || { title:"Domaine Oracle", intro:"Diagnostic Oracle", score:"—", tabs:["Vue d'ensemble","Aide"], metrics:[] };
    const backendDomainScore = state.oracleDomainData?.domain === key ? state.oracleDomainData?.score : null;
    if (backendDomainScore && backendDomainScore.score != null) config.score = `${backendDomainScore.score}%`;
    else if (state.oracleScores?.domains?.[key]?.score != null) config.score = `${state.oracleScores.domains[key].score}%`;
    if (key === "capacity") return renderCapacity(config);
    if (state.oracleConnected) {
      config.metrics = state.oracleDomainData?.domain === key
        ? state.oracleDomainData.metrics.map(metric => [metric.label, metric.value, metric.foot, metric.tone])
        : [];
    }
    if (key === "processes") {
      const processMetrics = [
        { label:"Slots processus", icon:"◴", state:"Optimal", tone:"green" },
        { label:"Processus essentiels", icon:"♧", state:"Opérationnel", tone:"green" },
        { label:"Empreinte mémoire", icon:"▦", state:"Optimal", tone:"green" },
        { label:"Processus utilisateur", icon:"∿", state:"Aucun", tone:"neutral" }
      ];
      const processCards = processMetrics.map(item => {
        const metric = config.metrics.find(row => row[0] === item.label)
          || (item.label === "Processus utilisateur" ? config.metrics.find(row => row[0] === "Sessions utilisées") : undefined);
        const sessionValue = item.label === "Processus utilisateur" ? metric?.[1].match(/^\s*(\d+)/)?.[1] : undefined;
        const value = sessionValue || metric?.[1] || (state.oracleConnected ? "—" : "");
        const foot = item.label === "Processus utilisateur" && sessionValue
          ? `${metric[2]} · ${metric[1]}`
          : metric?.[2] || (state.oracleConnected ? (state.oracleDomainError || "Collecte Oracle en cours…") : "");
        const status = !state.oracleConnected && metric ? "Exemple"
          : !metric ? "Collecte…"
            : value === "—" ? "Indisponible"
              : metric[3] === "red" ? "À vérifier"
                : metric[3] === "amber" ? "Surveiller"
                  : item.label === "Processus utilisateur" && /^0(?:\s|$)/.test(value) ? "Aucun"
                    : item.label === "Empreinte mémoire" ? "Mesuré"
                      : item.state;
        const cardTone = metric?.[3] === "blue" || value === "—" ? "neutral" : metric?.[3] || item.tone;
        return `<article class="processes-metric ${cardTone}"><div class="processes-metric-heading"><span class="processes-metric-icon" aria-hidden="true">${item.icon}</span><span>${esc(item.label)}</span><span class="processes-metric-status">${esc(status)}</span></div><strong>${esc(value || "—")}</strong><small>${esc(foot)}</small></article>`;
      }).join("");
      const processTabs = renderDomainTabs(config.tabs);
      const processMetric = label => config.metrics.find(row => row[0] === label);
      const systemMetric = processMetric("Processus système");
      const oracleProcessMetric = processMetric("Processus Oracle");
      const memoryMetric = processMetric("Empreinte mémoire");
      const sessionLimitMetric = processMetric("Sessions utilisées");
      const sessionMetric = processMetric("Processus utilisateur") || sessionLimitMetric;
      const sessionCount = sessionMetric?.[1].match(/^\s*(\d+)/)?.[1];
      const essentialMetric = processMetric("Processus essentiels");
      const isDemoProcesses = !state.oracleConnected;
      const processDataLoaded = state.oracleDomainData?.domain === key;
      const essentialStates = ["PMON","SMON","LGWR","DBW0","CKPT"].map(name => ({
        name,
        running: essentialMetric?.[2].split(" · ").some(status => status === `${name} actif`) || false,
        verified: Boolean(essentialMetric && !isDemoProcesses && essentialMetric[2].includes(`${name} `))
      }));
      const overviewContent = `<section class="processes-content">
        <div class="processes-health ${isDemoProcesses ? "demo" : essentialMetric?.[3] === "green" ? "connected" : essentialMetric?.[3] === "red" || essentialMetric?.[3] === "amber" ? "warning" : "pending"}"><span aria-hidden="true">${isDemoProcesses ? "ⓘ" : essentialMetric?.[3] === "green" ? "✓" : "!"}</span><div><strong>${isDemoProcesses ? "Exemple local — état réel des processus non collecté" : state.oracleDomainError ? "État des processus indisponible" : essentialMetric?.[3] === "green" ? "Tous les processus essentiels sont opérationnels" : essentialMetric?.[3] === "red" || essentialMetric?.[3] === "amber" ? "Vérification requise pour un ou plusieurs processus essentiels" : essentialMetric ? "État des processus essentiels non vérifié" : processDataLoaded ? "État des processus essentiels non disponible dans la collecte actuelle" : "Collecte des processus en cours"}</strong><p>${isDemoProcesses ? "Les valeurs ci-dessous illustrent la présentation et ne décrivent pas une instance Oracle réelle." : state.oracleDomainError ? esc(state.oracleDomainError) : essentialMetric?.[1] === "—" ? "L’accès à V$BGPROCESS est indisponible pour le compte Oracle." : essentialMetric ? `${essentialMetric[1]} processus essentiels détectés · ${systemMetric && systemMetric[1] !== "—" ? `${systemMetric[1]} processus système en service` : "compteur système indisponible"}` : processDataLoaded ? "Les compteurs de base sont disponibles ; redémarrer le serveur après mise à jour permettra d’activer les mesures détaillées." : "Les compteurs seront affichés après la collecte des vues Oracle."}</p></div></div>
        <section class="processes-context"><header><span aria-hidden="true">ⓘ</span>Contexte technique</header><div class="processes-context-grid"><article><small>MODE DE CONNEXION</small><strong>${isDemoProcesses ? "Exemple hors ligne" : "Supervision à distance"}</strong><p>${isDemoProcesses ? (savedProfile() ? "Profil enregistré mais session Oracle inactive ; utilisez « Reconnecter » pour collecter les mesures réelles." : "Aucune connexion Oracle active ; les mesures réelles ne sont pas disponibles.") : "Deynao interroge les vues système Oracle en lecture seule."}</p></article><article><small>SOURCE DES DONNÉES</small><strong>${isDemoProcesses ? "Valeurs illustratives" : "Vues Oracle standard"}</strong><p>${isDemoProcesses ? "Aucune collecte effectuée." : "V$SESSION, V$PROCESS, V$BGPROCESS et V$PARAMETER"}</p></article><article class="processes-context-access"><small>ACCÈS AUX DONNÉES</small><div><span class="${isDemoProcesses || systemMetric?.[1] === "—" ? "unavailable" : ""}">${isDemoProcesses ? "Exemples locaux uniquement" : systemMetric?.[1] === "—" ? "Vue V$BGPROCESS indisponible" : "✓ Métriques système Oracle"}</span><span>${isDemoProcesses ? "Collecte non disponible" : "✓ Lecture seule"}</span></div></article></div></section>
        <section class="processes-summary-grid"><article class="processes-summary-card"><header><span class="system">▤</span>${systemMetric ? "Processus système" : oracleProcessMetric ? "Processus Oracle (total)" : "Processus système"}</header><div class="processes-summary-value"><strong>${systemMetric ? esc(systemMetric[1]) : oracleProcessMetric ? esc(oracleProcessMetric[1]) : "—"}</strong><span>${memoryMetric ? `Mémoire ${esc(memoryMetric[1])}` : isDemoProcesses ? "Compteur réel non disponible hors ligne" : "Mémoire non collectée"}</span>${systemMetric && systemMetric[1] !== "—" ? `<b>${esc(systemMetric[1])} en service</b>` : oracleProcessMetric && oracleProcessMetric[1] !== "—" ? `<b>Total V$PROCESS</b>` : ""}</div><p>${systemMetric ? esc(systemMetric[2]) : oracleProcessMetric ? `${esc(oracleProcessMetric[2])} · inclut les processus Oracle système et utilisateurs.` : isDemoProcesses ? "Les processus Oracle ne sont pas mesurés dans cet exemple." : "Collecte des processus d’arrière-plan indisponible."}</p></article><article class="processes-summary-card"><header><span class="user">♙</span>Processus utilisateur</header><div class="processes-summary-value"><strong>${sessionMetric ? esc(sessionMetric[1]) : sessionLimitMetric ? esc(sessionLimitMetric[1].match(/^\\s*(\\d+)/)?.[1] || "—") : "—"}</strong><span>${sessionMetric ? esc(sessionMetric[2]) : sessionLimitMetric ? `${esc(sessionLimitMetric[2])} · sessions actives / limite` : isDemoProcesses ? "Sessions non collectées hors ligne" : "Sessions non collectées"}</span>${sessionMetric && sessionMetric[1] !== "—" || sessionLimitMetric && sessionLimitMetric[1] !== "—" ? `<b>${/^(?:0|0\\s)/.test(sessionMetric?.[1] || sessionLimitMetric?.[1] || "") ? "Aucune" : "Mesuré"}</b>` : ""}</div><p>${isDemoProcesses ? "Aucune valeur affichée ne représente une session réelle." : "Compteur des sessions Oracle de type USER."}</p></article></section>
        <section class="processes-essential"><header><span><i aria-hidden="true">♧</i>Processus essentiels</span><b>${essentialMetric ? esc(essentialMetric[1]) : "Non collecté"}${essentialMetric && isDemoProcesses ? " · exemple" : ""}</b></header><div class="processes-essential-grid">${[["PMON","Nettoyage processus"],["SMON","Maintenance système"],["LGWR","Écriture des journaux"],["DBW0","Écriture des données"],["CKPT","Points de contrôle"]].map(([name,description],index) => { const status=essentialStates[index]; return `<article class="${essentialMetric && isDemoProcesses ? "example" : status.verified ? status.running ? "running" : "stopped" : "unverified"}"><strong>${essentialMetric && isDemoProcesses ? "ⓘ" : status.verified ? status.running ? "✓" : "!" : "·"} ${name}</strong><span>${description}</span><small>${essentialMetric && isDemoProcesses ? "exemple" : status.verified ? status.running ? "Actif" : "Non actif" : "Non vérifié"}</small></article>`; }).join("")}</div>${state.oracleConnected && !essentialMetric ? `<p class="processes-data-limit">${state.oracleDomainError ? esc(state.oracleDomainError) : "L’état individuel des processus essentiels n’est pas disponible pour ce compte Oracle."}</p>` : ""}</section>
      </section>`;
      const processCatalog = {
        PMON: { category:"Essentiel", description:"Surveille et nettoie les processus défaillants, libère les ressources (verrous, mémoire) et enregistre l'instance dans le listener." },
        SMON: { category:"Essentiel", description:"Effectue la récupération d'instance au démarrage, nettoie les segments temporaires et fusionne l'espace libre des tablespaces." },
        LGWR: { category:"Essentiel", description:"Écrit les entrées du buffer de redo log vers les fichiers redo log sur disque, garantissant la durabilité des transactions." },
        DBW0: { category:"Essentiel", description:"Premier processus d'écriture des blocs modifiés du buffer cache vers les fichiers de données." },
        DBW: { category:"Essentiel", description:"Écrit les blocs modifiés du buffer cache vers les fichiers de données." },
        CKPT: { category:"Essentiel", description:"Coordonne les points de contrôle et met à jour les en-têtes des fichiers de données et de contrôle." },
        MMON: { category:"Monitoring", description:"Collecte les statistiques de performance et gère l'Automatic Workload Repository (AWR)." },
        MMNL: { category:"Monitoring", description:"Assiste MMON dans la collecte des métriques et l'écriture des statistiques." },
        RECO: { category:"Récupération", description:"Résout automatiquement les transactions distribuées en échec et nettoie les transactions pendantes." },
        ARC: { category:"Archivage", description:"Archive les fichiers de redo log remplis vers la destination d'archivage configurée." }
      };
      const demoSystemProcesses = [
        ["PMON",1.3],["SMON",2.8],["LGWR",2.1],["DBW0",9.0],["CKPT",1.8],["MMON",5.5],["MMNL",1.5],["RECO",2.4],
        ["ARC0",21.4],["ARC1",21.4],["ARC2",21.4],["ARC3",21.4]
      ].map(([name, memory_mb]) => {
        const meta = processCatalog[name] || processCatalog[name.replace(/\d+$/, "")] || { category:"Système", description:"Processus d'arrière-plan Oracle." };
        return { name, memory_mb, category:meta.category, description:meta.description, running:true, uptime_seconds:28680 };
      });
      const demoUserSessions = [{
        username:"SYS",
        account_label:"Compte Oracle système",
        program:"SQL Developer",
        status:"INACTIVE",
        machine:"DISI-LPT4218",
        sid:12,
        serial_number:4,
        memory_bytes:3.9 * 1024 ** 2,
        duration_seconds:16500
      }];
      const demoExcludedSessions = 3;
      const domainDataLoaded = state.oracleDomainData?.domain === key;
      const realProcessRows = domainDataLoaded && Array.isArray(state.oracleDomainData?.processes) ? state.oracleDomainData.processes : null;
      const processesUnavailable = domainDataLoaded && state.oracleDomainData?.processes_available === false;
      const usingDemoProcesses = !state.oracleConnected;
      const processDetailsLoaded = usingDemoProcesses || domainDataLoaded;
      const systemProcessRows = (usingDemoProcesses ? demoSystemProcesses : (realProcessRows || []).map(row => {
        const name = String(row.name || "").trim();
        const meta = processCatalog[name] || processCatalog[name.replace(/\d+$/, "")] || {};
        const category = meta.category || (/^ARC\d+$/i.test(name) ? "Archivage" : /^DBW\d+$/i.test(name) ? "Essentiel" : "Système");
        return {
          name,
          category,
          description: meta.description || String(row.description || "").trim() || "Processus d'arrière-plan Oracle.",
          memory_mb: (Number(row.memory_bytes) || 0) / 1024 / 1024,
          running: row.running !== false,
          uptime_seconds: state.oracleDomainData?.uptime_seconds
        };
      })).filter(row => row.running);
      const processTotalMemory = systemProcessRows.reduce((total, row) => total + row.memory_mb, 0);
      const processCount = systemProcessRows.length || (Number.parseInt(String(systemMetric?.[1] ?? "").replace(/\D/g, ""), 10) || 0);
      const processTotalLabel = processTotalMemory > 0 ? formatProcessMemory(processTotalMemory, true) : (memoryMetric?.[1] && memoryMetric[1] !== "—" ? memoryMetric[1] : "—");
      const processAverageLabel = systemProcessRows.length ? formatProcessMemory(processTotalMemory / systemProcessRows.length, true) : null;
      const processMemorySummary = processAverageLabel ? `Mém. ${processTotalLabel} (Moy. ${processAverageLabel}/proc.)` : `Mém. ${processTotalLabel}`;
      const processLatency = usingDemoProcesses ? 50 : Number(state.oracleDomainData?.latency_ms);
      const processLatencyLabel = Number.isFinite(processLatency) ? `${Math.max(1, Math.round(processLatency))}ms` : "—";
      const processQuery = state.processSearch.trim().toLocaleLowerCase();
      const filteredSystemProcesses = systemProcessRows
        .filter(row => !state.processEssentialsOnly || row.category === "Essentiel")
        .filter(row => !processQuery || `${row.name} ${row.category} ${row.description}`.toLocaleLowerCase().includes(processQuery));
      const infoIcon = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="8" cy="8" r="6.4"></circle><path d="M8 7.2v4" stroke-linecap="round"></path><circle cx="8" cy="4.8" r=".8" fill="currentColor" stroke="none"></circle></svg>`;
      const searchIcon = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.4"></circle><path d="m10.4 10.4 3.1 3.1" stroke-linecap="round"></path></svg>`;
      const eyeIcon = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M1.6 8s2.4-4 6.4-4 6.4 4 6.4 4-2.4 4-6.4 4-6.4-4-6.4-4Z"></path><circle cx="8" cy="8" r="1.8"></circle></svg>`;
      const systemRows = filteredSystemProcesses.map(row => {
        const memoryPercent = processTotalMemory > 0 && row.memory_mb > 0 ? Math.max(1, Math.round(row.memory_mb / processTotalMemory * 100)) : 0;
        const badgeClass = row.category === "Essentiel" ? "essential" : row.category === "Monitoring" ? "monitoring" : row.category === "Récupération" ? "recovery" : row.category === "Archivage" ? "archive" : "neutral";
        const detailPayload = encodeURIComponent(JSON.stringify({ ...row, memory_pct:memoryPercent }));
        return `<div class="system-process-row" role="row">
          <div class="system-process-main" role="cell"><div class="system-process-name"><span class="system-process-dot" aria-hidden="true"></span><strong>${esc(row.name)}</strong><span class="system-process-badge ${badgeClass}">${esc(row.category)}</span></div><p title="${esc(row.description)}">${esc(row.description)}</p></div>
          <div role="cell"><span class="system-process-state ${row.running ? "" : "stopped"}"><span class="system-process-state-dot" aria-hidden="true"></span>${row.running ? "En service" : "Arrêté"}</span></div>
          <div class="system-process-memory" role="cell"><strong>${formatProcessMemory(row.memory_mb)}</strong><small>${memoryPercent}% du total</small></div>
          <div class="system-process-uptime" role="cell">${esc(formatProcessUptime(row.uptime_seconds))}</div>
          <div role="cell"><button type="button" class="system-process-details" data-action="process-details" data-process="${detailPayload}" aria-label="Voir les détails de ${esc(row.name)}">${eyeIcon}<span>Voir</span></button></div>
        </div>`;
      }).join("");
      const processEmptyMessage = !processDetailsLoaded
        ? (state.oracleDomainError || "Collecte des processus en cours…")
        : processesUnavailable
          ? "Le détail des processus n'est pas disponible pour ce compte Oracle."
          : domainDataLoaded && realProcessRows === null
            ? "Le serveur Deynao doit être redémarré pour activer la collecte détaillée des processus."
            : systemProcessRows.length
              ? "Aucun processus en service ne correspond à ces filtres."
              : "Aucun processus en service retourné par Oracle.";
      const systemContent = `<section class="system-processes">
        <div class="system-process-summary"><span class="system-process-summary-count">${processCount} processus système</span><span class="system-process-summary-memory">${esc(processMemorySummary)}</span><span class="system-process-summary-mode">Mode supervision à distance</span><span class="system-process-summary-latency">${processLatencyLabel}</span></div>
        <article class="system-process-card"><header class="system-process-card-head"><h2>Processus système</h2><span class="system-process-count-badge">${processCount} processus</span></header>
          <div class="system-process-callout">${infoIcon}<strong>Processus ARC multiples</strong><p>Chaque processus ARC visible correspond à une session d'archivage active. Plusieurs processus ARC peuvent coexister pour améliorer les performances d'archivage.</p></div>
          <div class="system-process-toolbar"><label class="system-process-search">${searchIcon}<input type="search" data-process-search placeholder="Rechercher un processus…" value="${esc(state.processSearch)}" aria-label="Rechercher un processus système"></label><button type="button" class="system-process-filter ${state.processEssentialsOnly ? "active" : ""}" data-action="process-essential-toggle" aria-pressed="${state.processEssentialsOnly}"><span class="system-process-checkbox" aria-hidden="true">${state.processEssentialsOnly ? "✓" : ""}</span>Essentiels uniquement</button></div>
          <div class="system-process-table" role="table" aria-label="Processus système Oracle"><div class="system-process-table-head" role="row"><span role="columnheader">Nom</span><span role="columnheader">Statut</span><span role="columnheader">Mémoire (MB)</span><span role="columnheader">Durée</span><span role="columnheader">Détails</span></div><div class="system-process-table-body" role="rowgroup">${systemRows || `<div class="system-process-empty" role="row"><span role="cell">${esc(processEmptyMessage)}</span></div>`}</div></div>
        </article>
      </section>`;
      const realUserSessions = domainDataLoaded && Array.isArray(state.oracleDomainData?.user_sessions) ? state.oracleDomainData.user_sessions : null;
      const userSessionsLoaded = usingDemoProcesses || domainDataLoaded;
      const userSessionsAvailable = usingDemoProcesses || state.oracleDomainData?.user_sessions_available !== false;
      const userSessionRows = (usingDemoProcesses ? demoUserSessions : (realUserSessions || [])).map(row => {
        const username = String(row.username || "").trim();
        const status = String(row.status || "").trim().toUpperCase();
        return {
          username,
          account_label: String(row.account_label || "").trim() || "Session utilisateur Oracle",
          program: String(row.program || "").trim() || "—",
          status,
          active: status === "ACTIVE",
          machine: String(row.machine || "").trim(),
          sid: Number(row.sid) || 0,
          serial_number: Number(row.serial_number) || 0,
          memory_mb: (Number(row.memory_bytes) || 0) / 1024 / 1024,
          duration_seconds: Number(row.duration_seconds) || Number(row.uptime_seconds) || 0
        };
      }).filter(row => row.username);
      const userSessionSortKey = state.userSessionSort === "memory" ? "memory_mb" : "username";
      const userSessionSortDirection = state.userSessionSortDirection === "desc" ? -1 : 1;
      const sortedUserSessions = [...userSessionRows].sort((a,b) => {
        if (userSessionSortKey === "memory_mb") return (a.memory_mb - b.memory_mb) * userSessionSortDirection;
        return a.username.localeCompare(b.username, "fr", { sensitivity:"base" }) * userSessionSortDirection;
      });
      const userSessionCount = userSessionsLoaded && (usingDemoProcesses || realUserSessions !== null)
        ? userSessionRows.length
        : (Number.parseInt(String(sessionMetric?.[1] ?? "").replace(/\D/g, ""), 10) || 0);
      const inactiveSessionCount = userSessionRows.filter(row => !row.active).length;
      const userSessionMemory = userSessionRows.reduce((total,row) => total + row.memory_mb, 0);
      const userSessionMemoryLabel = userSessionMemory > 0 ? formatProcessMemory(userSessionMemory, true) : "—";
      const userSessionAverageLabel = userSessionRows.length ? formatProcessMemory(userSessionMemory / userSessionRows.length, true) : null;
      const userSessionMemorySummary = userSessionAverageLabel ? `Mém. ${userSessionMemoryLabel} (Moy. ${userSessionAverageLabel}/proc.)` : `Mém. ${userSessionMemoryLabel}`;
      const excludedSessions = usingDemoProcesses ? demoExcludedSessions : (Number(state.oracleDomainData?.excluded_sessions) || 0);
      const userSessionSortArrow = sortKey => state.userSessionSort === sortKey ? (state.userSessionSortDirection === "asc" ? "↑" : "↓") : "↕";
      const userRows = sortedUserSessions.map(row => {
        const statusLabel = row.active ? "Actif" : "Inactif";
        const memoryPercent = userSessionMemory > 0 && row.memory_mb > 0 ? Math.max(1, Math.round(row.memory_mb / userSessionMemory * 100)) : 0;
        const detailPayload = encodeURIComponent(JSON.stringify({ ...row, memory_pct:memoryPercent }));
        return `<div class="user-session-row" role="row">
          <div class="user-session-main" role="cell"><div class="user-session-name"><span class="user-session-dot ${row.active ? "active" : "inactive"}" aria-hidden="true"></span><strong>${esc(row.username)}</strong></div><small class="user-session-account">${esc(row.account_label)}</small>${row.machine ? `<small class="user-session-machine">${esc(row.machine)}</small>` : ""}</div>
          <div class="user-session-program" role="cell">${esc(row.program)}</div>
          <div role="cell"><span class="user-session-status ${row.active ? "active" : "inactive"}"><span class="user-session-status-dot" aria-hidden="true"></span>${statusLabel}</span></div>
          <div class="user-session-memory" role="cell"><strong>${formatProcessMemory(row.memory_mb)}</strong></div>
          <div class="user-session-duration" role="cell">${esc(formatProcessUptime(row.duration_seconds))}</div>
          <div role="cell"><button type="button" class="user-session-details" data-action="user-session-details" data-user-session="${detailPayload}" aria-label="Voir les détails de la session ${esc(row.username)}">${eyeIcon}<span>Voir</span></button></div>
        </div>`;
      }).join("");
      const userEmptyMessage = !userSessionsLoaded
        ? (state.oracleDomainError || "Collecte des sessions en cours…")
        : !userSessionsAvailable
          ? "Le détail des sessions n'est pas disponible pour ce compte Oracle."
          : domainDataLoaded && realUserSessions === null
            ? "Le serveur Deynao doit être redémarré pour activer la collecte des sessions utilisateur."
            : "Aucune session utilisateur active.";
      const userContent = `<section class="system-processes user-sessions">
        <div class="system-process-summary"><span class="system-process-summary-count">${userSessionCount} processus utilisateur</span><span class="system-process-summary-memory">${inactiveSessionCount} inactif(s)</span><span class="system-process-summary-memory">${esc(userSessionMemorySummary)}</span><span class="system-process-summary-latency">${processLatencyLabel}</span></div>
        ${excludedSessions > 0 ? `<div class="user-session-note">${infoIcon}<span>${excludedSessions} processus de supervision Deynao exclu(s) du tableau ci-dessous - connexions ouvertes par l'outil en lecture seule pour collecter les métriques.</span></div>` : ""}
        <article class="system-process-card user-session-card"><header class="system-process-card-head user-session-card-head"><div><h2>Sessions utilisateur</h2><p class="user-session-subtitle">Connexions applicatives et utilisateurs connectés à la base. Données issues de V$SESSION / V$PROCESS.</p></div><span class="system-process-count-badge">${userSessionCount} session(s)</span></header>
          <div class="user-session-table" role="table" aria-label="Sessions utilisateur Oracle"><div class="user-session-table-head" role="row"><button type="button" role="columnheader" class="user-session-sort" data-action="user-session-sort" data-sort="username">Utilisateur <span aria-hidden="true">${userSessionSortArrow("username")}</span></button><span role="columnheader">Programme</span><span role="columnheader">Statut</span><button type="button" role="columnheader" class="user-session-sort" data-action="user-session-sort" data-sort="memory">Mémoire (MB) <span aria-hidden="true">${userSessionSortArrow("memory")}</span></button><span role="columnheader">Durée</span><span role="columnheader">Détails</span></div><div class="user-session-table-body" role="rowgroup">${userRows || `<div class="system-process-empty" role="row"><span role="cell">${esc(userEmptyMessage)}</span></div>`}</div></div>
          <footer class="user-session-footer"><span>Source : V$SESSION / V$PROCESS (lecture seule)</span><span>Temps de collecte : ${esc(processLatencyLabel)}</span></footer>
        </article>
      </section>`;
      const helpContent = `<section class="processes-tab-content"><article class="processes-tab-card processes-help"><header><span class="help">?</span><div><h3>Comprendre les processus Oracle</h3><p>Sources, compteurs et limites de la collecte.</p></div></header><div class="processes-help-grid"><section><strong>Slots processus</strong><p>Nombre de processus Oracle utilisés par rapport au paramètre PROCESSES. Cette limite contribue à fixer le nombre maximal de processus simultanés.</p></section><section><strong>Processus d’arrière-plan</strong><p>PMON, SMON, LGWR, DBW0 et CKPT participent aux opérations de nettoyage, récupération, journalisation, écriture et points de contrôle.</p></section><section><strong>Sessions utilisateur</strong><p>Un compteur agrégé peut être collecté depuis V$SESSION. Les identifiants et détails de session ne sont pas exposés par cette vue.</p></section><section><strong>Mode hors ligne</strong><p>Les exemples locaux sont illustratifs et ne doivent pas être interprétés comme des mesures réelles.</p></section></div></article></section>`;
      const processTabContent = state.domainTab === "Processus système" ? systemContent : state.domainTab === "Processus utilisateur" ? userContent : state.domainTab === "Aide" ? helpContent : overviewContent;
      return `<div class="domain-body processes-page"><section class="processes-dashboard"><header class="processes-dashboard-heading"><div class="processes-dashboard-title"><h2><span class="processes-heading-icon" aria-hidden="true">▤</span>${esc(config.title)}</h2><p>${esc(config.intro)}</p></div><div class="processes-dashboard-actions"><div class="processes-score"><span>Score des Processus <i aria-hidden="true">ⓘ</i></span><strong>${state.oracleConnected ? "—" : esc(config.score)}</strong></div>${btn("▤","export","btn processes-export csv",'aria-label="Exporter CSV" title="Exporter CSV"')}${btn("▤","export","btn processes-export pdf",'aria-label="Exporter PDF" title="Exporter PDF"')}${btn("⟳","refresh-domain","btn processes-refresh",'aria-label="Actualiser les processus" title="Actualiser les processus"')}</div></header><section class="processes-metric-grid">${processCards}</section></section>${processTabs}${processTabContent}</div>`;
    }
    const cards = config.metrics.map(([label,value,foot,tone]) => `<div class="card metric"><div class="metric-label">${esc(label)}</div><div class="metric-value">${esc(value)}</div><div>${badge(tone==="green"?"Optimal":tone==="amber"?"Surveiller":tone==="red"?"Critique":"Information",tone)}</div><div class="metric-foot" style="margin-top:8px">${esc(foot)}</div></div>`).join("");
    let details = "";
    if (key === "capacity") details = renderTablespaces();
    else if (key === "recommendations") details = renderRecommendations();
    else if (key === "performance") details = `<div class="grid grid-2">${card(`<h3>Métriques temps réel</h3><div class="kv"><div class="kv-item"><small>DB Time</small><b>0 sec/sec — Inactif</b></div><div class="kv-item"><small>Charge Oracle (AAS)</small><b>0 sec/sec — Inactif</b></div><div class="kv-item"><small>Exécutions SQL</small><b>0 /sec</b></div><div class="kv-item"><small>Sessions actives</small><b>Aucune session utilisateur</b></div></div>`)}${card(`<h3>Indicateurs de santé</h3><div class="stack">${["CPU","Cache","Capacité Sessions","I/O","Mémoire"].map((x,i)=>`<div><div class="row between"><span>${x}</span><b>${[95.5,96.3,100,96.3,88][i]}%</b></div><div class="progress"><span style="width:${[95,96,100,96,88][i]}%"></span></div></div>`).join("")}</div>`)}</div>`;
    else if (key === "oracle-alerts") details = card(`<div class="row between"><h3>Alertes Oracle récentes</h3><div class="filter-row">${["24 h","7 j","30 j"].map(x=>btn(x,"period:"+x,`btn small-btn ${x==="24 h"?"active":""}`)).join("")}</div></div><div class="empty"><div class="empty-icon">✓</div><h3>Aucune alerte critique</h3><p>Les occurrences Oracle de la période sélectionnée apparaîtront ici.</p></div>`);
    else details = card(`<div class="row between"><h3>${esc(state.domainTab)}</h3>${btn("⟳ Actualiser les données","refresh-domain","btn small-btn")}</div><p class="callout ${key==="backups"?"":"info"}">${key==="backups"?"Aucune sauvegarde enregistrée sur la période. Vérifiez la configuration RMAN et le plan de sauvegarde.":"Les données de ce domaine sont des exemples hors ligne. Une reproduction connectée affichera les valeurs collectées depuis Oracle."}</p><div class="table-wrap"><table><thead><tr><th>Indicateur</th><th>État</th><th>Dernière collecte</th><th>Détail</th></tr></thead><tbody>${config.metrics.map(m=>`<tr><td>${esc(m[0])}</td><td>${badge(m[1],m[3])}</td><td>À l'instant</td><td>${esc(m[2])}</td></tr>`).join("")}</tbody></table></div>`);
    if (state.oracleConnected) {
      const actualMetrics = state.oracleDomainData?.domain === key ? state.oracleDomainData.metrics : [];
      details = card(`<div class="row between"><h3>Collecte Oracle — ${esc(config.title)}</h3>${btn("⟳ Actualiser les données","refresh-domain","btn small-btn")}</div>${state.oracleDomainError ? `<p class="callout" role="alert">${esc(state.oracleDomainError)}</p>` : state.oracleDomainData ? `<p class="callout success">Mesures lues en temps réel depuis les vues Oracle indiquées. Aucune valeur de démonstration n’est utilisée dans cette vue.</p>` : `<p class="callout info">Collecte Oracle en cours…</p>`}${actualMetrics.length ? `<div class="table-wrap"><table><thead><tr><th>Indicateur</th><th>Valeur Oracle</th><th>Source / détail</th></tr></thead><tbody>${actualMetrics.map(m=>`<tr><td>${esc(m.label)}</td><td>${esc(m.value)}</td><td>${esc(m.foot)}</td></tr>`).join("")}</tbody></table></div>` : ""}`);
      if (key === "capacity") details += renderTablespaces();
      else if (key === "performance") details += card(`<h3>Analyses complémentaires</h3><p class="callout info">Cette version collecte les indicateurs du tableau ci-dessus. Les scores de santé, graphiques et recommandations détaillées ne sont pas calculés par le backend connecté.</p>`);
      else if (key === "recommendations") details += card(`<h3>Recommandations</h3><p class="callout info">Aucune recommandation automatique n’est calculée à partir des seules mesures collectées. Vérifiez les constats avec un DBA avant toute action.</p>`);
      else if (key === "oracle-alerts") details += card(`<h3>Détail des alertes</h3><p class="callout info">La collecte connectée fournit un compteur et la dernière occurrence. La liste détaillée des événements n’est pas encore collectée.</p>`);
    }
    if (key === "performance") {
      const sampleMetrics = [
        { label:"Utilisation SGA", value:"92.68%", foot:"1.4 GB / 1.5 GB (Libre 111.9 MB)", status:"Non-production", icon:"▤", bar:92.68, tone:"neutral" },
        { label:"Utilisation PGA", value:"1.9%", foot:"9.7 MB / 512 MB (Marge: 502 MB) · Limite: 2.0 GB", footLines:["9.7 MB / 512 MB (Marge: 502 MB)","Limite: 2.0 GB"], status:"Normal", icon:"▤", bar:1.9, tone:"green" },
        { label:"CPU Système", value:"1.58%", foot:"Depuis le démarrage · DB CPU: 0.94%", footLines:["Depuis le démarrage","DB CPU: 0.94%"], status:"Idle", icon:"▦", bar:1.58, tone:"neutral" },
        { label:"Sessions", value:"0/0", foot:"0 connectées / 322 max · 0 actives · 0 inactives", footLines:["0 connectées / 322 max","● 0 actives　• 0 inactives"], status:"Normal", icon:"♙", tone:"neutral" },
        { label:"Cache Hit Ratio", value:"89.92%", foot:"Lectures mémoire vs disque", status:"Non-production", icon:"ϟ", bar:89.92, tone:"neutral" },
        { label:"Transactions", value:"0/s", foot:"Commits + rollbacks", status:"Idle", icon:"∿", tone:"neutral" }
      ];
      const actualMetrics = state.oracleDomainData?.domain === key ? state.oracleDomainData.metrics : null;
      const metrics = actualMetrics?.length
        ? actualMetrics.map(metric => {
            const sample = sampleMetrics.find(item => item.label === metric.label);
            const percentage = Number.parseFloat(metric.value);
            return {
              label:metric.label,
              value:metric.value,
              foot:metric.foot,
              footLines:metric.foot.split(" · "),
              status:metric.tone === "amber" ? "À surveiller" : metric.tone === "green" ? "Normal" : "Oracle",
              icon:sample?.icon || "▤",
              bar:Number.isFinite(percentage) && metric.value.includes("%") ? Math.min(100, Math.max(0, percentage)) : null,
              tone:metric.tone === "green" ? "green" : metric.tone === "amber" ? "amber" : "neutral"
            };
          })
        : state.oracleConnected
          ? sampleMetrics.map(metric => ({
              ...metric,
              value:"—",
              foot:state.oracleDomainError ? "Mesure Oracle non disponible" : "Mesure Oracle en cours…",
              status:state.oracleDomainError ? "Indisponible" : "Collecte",
              bar:null,
              tone:"neutral"
            }))
          : sampleMetrics;
      const performanceCards = metrics.map(metric => {
        const statusTone = metric.status === "Normal" ? "normal" : metric.status === "Idle" ? "idle" : metric.status === "À surveiller" ? "watch" : "context";
        const bar = metric.bar === undefined || metric.bar === null
          ? ""
          : `<div class="performance-progress ${metric.tone}"><span style="width:${metric.bar}%"></span></div>`;
        const footLines = (metric.footLines || [metric.foot]).map((line, index) =>
          `<small class="${metric.label === "Sessions" && index === 1 ? "performance-session-counts" : ""}">${esc(line)}</small>`
        ).join("");
        return `<article class="performance-metric ${metric.tone === "green" ? "is-green" : metric.label === "CPU Système" ? "is-lavender" : metric.label === "Cache Hit Ratio" ? "is-white" : ""}">
          <div class="performance-metric-content"><div class="performance-metric-heading"><span>${esc(metric.label)}</span><span class="performance-status ${statusTone}">${esc(metric.status)}</span></div>
            <strong class="performance-metric-value">${esc(metric.value)}</strong>${footLines}${bar}</div>
          <span class="performance-metric-icon" aria-hidden="true">${metric.icon}</span>
        </article>`;
      }).join("");
      const performanceScore = state.oracleConnected ? "—" : "91%";
      const actualMetric = label => actualMetrics?.find(metric => metric.label === label);
      const percentValue = value => {
        const parsed = Number.parseFloat(value || "");
        return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : null;
      };
      const cpuUsage = percentValue(actualMetric("CPU système")?.value);
      const cacheRatio = percentValue(actualMetric("Cache Hit Ratio")?.value);
      const sgaUsage = percentValue(actualMetric("Utilisation SGA")?.value);
      const healthIndicators = [
        { label:"CPU", icon:"▦", value:state.oracleConnected ? (cpuUsage === null ? null : 100 - cpuUsage) : 98.4, note:"Capacité CPU disponible. 100% = aucune charge, 0% = saturé.", tone:"green" },
        { label:"Cache", icon:"▤", value:state.oracleConnected ? cacheRatio : 89.9, note:state.oracleConnected ? "Ratio de cache Oracle mesuré." : "Base de développement, test ou recette — ratio cache affiché à titre informatif, sans coloration de criticité.", tone:"neutral" },
        { label:"Capacité Sessions", icon:"♙", value:state.oracleConnected ? null : 100, note:"Capacité sessions disponible. 100% = toutes libres, 0% = limite atteinte.", tone:"green" },
        { label:"I/O", icon:"▱", value:state.oracleConnected ? null : 89.9, note:"Base de développement, test ou recette — efficacité I/O affichée à titre informatif, sans coloration de criticité.", tone:"neutral" },
        { label:"Mémoire", icon:"▤", value:state.oracleConnected ? (sgaUsage === null ? null : 100 - sgaUsage) : 92.7, note:"Base de développement, test ou recette — indicateur affiché à titre informatif, sans coloration de criticité.", tone:"neutral" }
      ];
      const indicatorRows = healthIndicators.map(indicator => {
        const value = indicator.value === null ? "—" : `${indicator.value.toFixed(1)}%`;
        const fill = indicator.value === null ? 0 : indicator.value;
        const healthy = indicator.tone === "green" && indicator.value !== null;
        return `<div class="performance-health-row ${healthy ? "is-healthy" : "is-neutral"}">
          <div class="performance-health-heading"><span><i>${indicator.icon}</i>${indicator.label}</span><strong>${value}</strong></div>
          <div class="performance-health-bar ${healthy ? "green" : ""}"><span style="width:${fill}%"></span></div>
          <small>${esc(indicator.note)}</small>
        </div>`;
      }).join("");
      const sessionsMetric = actualMetric("Sessions")?.value;
      const [activeSessions, totalSessions] = sessionsMetric
        ? sessionsMetric.split("/").map(value => value.trim())
        : state.oracleConnected ? ["—", "—"] : ["0", "0"];
      const realTimeMetrics = [
        ["◷","DB Time","Temps total passé en base de données",state.oracleConnected ? "—" : "0","sec/sec","Inactif","inactive"],
        ["∿","Charge Oracle (AAS)","Secondes de travail DB par seconde",state.oracleConnected ? "—" : "0","sec/sec","Inactif","inactive"],
        ["ϟ","Exécutions SQL","Requêtes exécutées par seconde",state.oracleConnected ? "—" : "0","/sec","Info","info"]
      ];
      const realtimeRows = realTimeMetrics.map(([icon,label,description,value,unit,status,tone]) =>
        `<article class="performance-realtime-row ${tone}"><span class="performance-realtime-icon">${icon}</span><div class="performance-realtime-label"><strong>${label}</strong><small>${description}</small></div><div class="performance-realtime-value"><strong>${value}</strong><small>${unit}</small></div><span class="performance-realtime-status">${state.oracleConnected ? "Non collecté" : status}</span></article>`
      ).join("");
      const consumersContent = state.oracleConnected
        ? totalSessions === "0" || totalSessions === "—"
          ? `<div class="performance-consumer-empty"><span aria-hidden="true">♙</span><strong>${totalSessions === "0" ? "Aucune session utilisateur" : "Collecte des sessions en cours…"}</strong></div>`
          : `<div class="performance-consumer-empty"><span aria-hidden="true">♙</span><strong>Liste détaillée des sessions non collectée</strong><small>${activeSessions} actives · ${totalSessions} sessions utilisateur au total</small></div>`
        : `<div class="performance-consumer-empty"><span aria-hidden="true">♙</span><strong>Aucune session utilisateur</strong></div>`;
      const performanceRecommendations = state.oracleConnected
        ? `<div class="performance-recommendation unavailable"><strong>Recommandations non calculées</strong><p>Cette version collecte les mesures Oracle, mais ne calcule pas encore d'analyse SQL ni de recommandations de performance.</p></div>`
        : `<article class="performance-recommendation"><div class="performance-recommendation-title"><span>⊙</span><div><strong>Améliorer la réutilisation du code SQL</strong><p>Hard parse ratio : 7.2% (cible &lt;3%). Utilisez des bind variables.</p><small><b>Action recommandée :</b> Identifier les requêtes sans bind variables et modifier l'application</small></div></div>
          <details class="performance-sql-details"><summary>‹› Voir le script SQL　⌄</summary><pre><code>SELECT sql_id, executions, parse_calls
FROM v$sql
WHERE parse_calls &gt; executions
ORDER BY parse_calls DESC;</code></pre></details>
        </article>`;
      const performanceOverview = `<div class="performance-overview-content">
        <section class="performance-section performance-health-section">
          <header class="performance-section-header"><h3><span>⌁</span>Indicateurs de santé</h3><p>Chaque indicateur mesure un aspect clé de la performance Oracle. Plus le score est élevé, meilleure est la santé.</p></header>
          <div class="performance-health-list">${indicatorRows}</div>
          <footer class="performance-health-legend"><span><i class="optimal"></i>Optimal</span><span><i class="attention"></i>Attention</span><span><i class="watch"></i>Surveillance</span><span><i class="critical"></i>Critique</span></footer>
        </section>
        <section class="performance-section performance-realtime-section">
          <header class="performance-section-header"><h3>Métriques temps réel</h3></header>
          <div class="performance-realtime-notice"><i></i>${state.oracleConnected ? "Mesures DB Time, AAS et exécutions SQL non disponibles dans la collecte actuelle" : "Base inactive - Métriques non significatives"}</div>
          <div class="performance-realtime-list">${realtimeRows}</div>
        </section>
        <section class="performance-section performance-consumers-section">
          <header class="performance-section-header"><h3>Top consommateurs de ressources</h3><div class="performance-consumer-counts"><span>${activeSessions} actives</span><span>${totalSessions} total</span></div></header>
          ${consumersContent}
        </section>
        <section class="performance-section performance-recommendations-section">
          <header class="performance-section-header"><h3><span>♧</span>Recommandations Performance <b>${state.oracleConnected ? "0" : "1"}</b></h3><p>Synthèse des recommandations issues de l'analyse Performance (mémoire, SQL, CPU, I/O, réactivité). Cliquez sur "Voir le script SQL" pour le détail technique.</p></header>
          <div class="performance-recommendations-list">${performanceRecommendations}</div>
        </section>
      </div>`;
      const readMemoryValue = value => {
        const match = String(value || "").match(/([\d.]+)\s*(KB|MB|GB)/i);
        if (!match) return null;
        const unit = match[2].toUpperCase();
        return Number(match[1]) * (unit === "GB" ? 1024 ** 3 : unit === "MB" ? 1024 ** 2 : 1024);
      };
      const formatMemoryValue = bytes => {
        if (bytes === null || !Number.isFinite(bytes)) return "Non collecté";
        if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
        if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
        return `${(bytes / 1024).toFixed(1)} KB`;
      };
      const memoryMetric = label => actualMetrics?.find(metric => metric.label === label);
      const sgaMetric = memoryMetric("Utilisation SGA");
      const pgaMetric = memoryMetric("Utilisation PGA");
      const sgaValues = (sgaMetric?.foot || "").split(" · ");
      const sgaSizes = sgaValues[0]?.split(" / ") || [];
      const sgaUsed = state.oracleConnected ? readMemoryValue(sgaSizes[0]) : 1.4 * 1024 ** 3;
      const sgaTarget = state.oracleConnected ? readMemoryValue(sgaSizes[1]) : 1.5 * 1024 ** 3;
      const sgaFree = state.oracleConnected
        ? readMemoryValue(sgaValues.find(value => value.startsWith("Libre :"))?.replace("Libre : ", ""))
        : 111.9 * 1024 ** 2;
      const pgaValues = (pgaMetric?.foot || "").split(" · ");
      const pgaSizes = pgaValues[0]?.split(" / ") || [];
      const pgaAllocated = state.oracleConnected ? readMemoryValue(pgaSizes[0]) : 9.7 * 1024 ** 2;
      const pgaTarget = state.oracleConnected ? readMemoryValue(pgaSizes[1]) : 512 * 1024 ** 2;
      const sgaPercent = state.oracleConnected
        ? percentValue(sgaMetric?.value)
        : 92.68;
      const pgaPercent = state.oracleConnected
        ? percentValue(pgaMetric?.value)
        : 1.9;
      const memoryMetricPending = state.oracleConnected && !actualMetrics?.length;
      const memoryValue = value => memoryMetricPending
        ? "Collecte en cours…"
        : formatMemoryValue(value);
      const memoryProgress = value => value === null ? 0 : Math.min(100, Math.max(0, value));
      const memorySourceNote = state.oracleConnected
        ? `<p class="memory-source-note">${memoryMetricPending ? esc(state.oracleDomainError || "Collecte Oracle en cours…") : "Les valeurs détaillées non collectées sont signalées explicitement."}</p>`
        : `<p class="memory-source-note">Valeurs de démonstration locales, non issues d’une collecte Oracle.</p>`;
      const sgaComponents = state.oracleConnected
        ? `<div class="memory-components-empty">Ventilation des composants SGA non collectée.</div>`
        : `<div class="memory-components">
            <div><span>Shared Pool</span><strong>606.0 MB</strong></div>
            <div><span>Buffer Cache</span><strong>792.0 MB</strong></div>
            <div><span>Large Pool</span><strong>16.0 MB</strong></div>
            <div><span>Java Pool</span><strong>16.0 MB</strong></div>
          </div>`;
      const memoryDistribution = pgaAllocated !== null && pgaTarget !== null && pgaTarget > 0
        ? Math.min(100, Math.max(0, pgaAllocated / pgaTarget * 100))
        : 0;
      const memoryView = `<div class="performance-memory-content">
        <section class="performance-section memory-panel">
          <header class="performance-section-header"><div><h3><span>▤</span>System Global Area (SGA)</h3><p>Mémoire partagée utilisée par les processus Oracle.</p></div><strong class="memory-percent">${sgaPercent === null ? "—" : `${sgaPercent.toFixed(2)}%`}</strong></header>
          <div class="memory-panel-body">
            <div class="memory-usage"><div class="memory-usage-heading"><span>Utilisation SGA</span><strong>${memoryValue(sgaUsed)} / ${memoryValue(sgaTarget)}</strong></div><div class="memory-track"><span class="sga-fill" style="width:${memoryProgress(sgaPercent)}%"></span></div></div>
            <div class="memory-facts">
              <div><span>Cible configurée</span><strong>${memoryValue(sgaTarget)}</strong></div>
              <div><span>Taille maximale</span><strong>${state.oracleConnected ? "Non collecté" : "1.5 GB"}</strong></div>
              <div><span>Espace libre</span><strong>${memoryValue(sgaFree)}</strong></div>
            </div>
            <div class="memory-subheading">Composants principaux</div>
            ${sgaComponents}
          </div>
        </section>
        <section class="performance-section memory-panel">
          <header class="performance-section-header"><div><h3><span>▤</span>Utilisation PGA</h3><p>Mémoire privée allouée aux processus serveur.</p></div><strong class="memory-percent">${pgaPercent === null ? "—" : `${pgaPercent.toFixed(2)}%`}</strong></header>
          <div class="memory-panel-body">
            <div class="memory-usage"><div class="memory-usage-heading"><span>Utilisation PGA</span><strong>${memoryValue(pgaAllocated)} / ${memoryValue(pgaTarget)}</strong></div><div class="memory-track"><span class="pga-fill" style="width:${memoryProgress(pgaPercent)}%"></span></div></div>
            <div class="memory-facts memory-pga-facts">
              <div><span>Cible PGA</span><strong>${memoryValue(pgaTarget)}</strong></div>
              <div><span>Mémoire allouée</span><strong>${memoryValue(pgaAllocated)}</strong></div>
              <div><span>Mémoire en cours d’utilisation</span><strong>${state.oracleConnected ? "Non collecté" : "7.9 MB"}</strong></div>
              <div><span>Limite PGA</span><strong>${state.oracleConnected ? "Non collecté" : "2.0 GB"}</strong></div>
              <div><span>Maximum historique</span><strong>${state.oracleConnected ? "Non collecté" : "120.0 MB"}</strong></div>
              <div><span>Mémoire libérable</span><strong>${state.oracleConnected ? "Non collecté" : "0.9 MB"}</strong></div>
            </div>
            <div class="memory-analysis">
              <section class="memory-workarea"><div class="memory-subheading">Statistiques Workarea</div>
                ${state.oracleConnected
                  ? `<div class="memory-unavailable">Statistiques Workarea non collectées.</div>`
                  : `<div class="memory-optimal"><span>Exécutions optimales</span><strong>100%</strong></div><div class="memory-track"><span class="workarea-fill" style="width:100%"></span></div><p>Les opérations Workarea ont été exécutées en mémoire.</p>`}
              </section>
              <section class="memory-distribution"><div class="memory-subheading">Distribution mémoire</div>
                <div class="memory-chart-row"><div class="memory-donut" style="--allocated:${memoryDistribution}%"><div><strong>${state.oracleConnected ? memoryValue(pgaAllocated) : "9.7 MB"}</strong><span>allouée</span></div></div>
                  <div class="memory-legend"><div><i class="allocated"></i><span>Allouée</span><strong>${memoryValue(pgaAllocated)}</strong></div><div><i class="available"></i><span>Disponible sur la cible</span><strong>${memoryValue(pgaAllocated !== null && pgaTarget !== null ? Math.max(0, pgaTarget - pgaAllocated) : null)}</strong></div></div>
                </div>
              </section>
            </div>
          </div>
        </section>
        ${memorySourceNote}
      </div>`;
      const cpuMetric = actualMetrics?.find(metric => metric.label === "CPU système");
      const cpuData = state.oracleDomainData?.domain === key ? state.oracleDomainData.cpu : null;
      const cpuMetrics = cpuData?.metrics || {};
      const cpuUnavailable = state.oracleConnected && !cpuData;
      const cpuHostUsage = state.oracleConnected ? percentValue(cpuMetric?.value) : 1.58;
      const cpuDisplay = (value, suffix = "", precision = 2, sample = "—") => {
        if (!state.oracleConnected) return sample;
        if (cpuUnavailable) return state.oracleDomainError || "Collecte en cours…";
        if (value === null || value === undefined) return "Non collecté";
        return `${Number(value).toFixed(precision)}${suffix}`;
      };
      const cpuNote = state.oracleConnected
        ? `<div class="cpu-notice"><span>ⓘ</span><div><strong>${cpuUnavailable ? esc(state.oracleDomainError || "Collecte Oracle en cours…") : "Les métriques proviennent des vues de performance Oracle."}</strong><p>Les données indisponibles pour le compte Oracle sont signalées sans estimation.</p></div></div>`
        : `<div class="cpu-notice"><span>ⓘ</span><div><strong>Base inactive - métriques non significatives</strong><p>Transactions &lt; 2/s : les métriques CPU sont indicatives uniquement.</p></div></div>`;
      const sampleWaitCategories = [
        ["User I/O", 65.6, "io"],
        ["Commit", 16.2, "commit"],
        ["Application", 10.1, "application"],
        ["Other", 4.4, "other"],
        ["Scheduler", 2, "scheduler"],
        ["Concurrency", 0.9, "concurrency"]
      ];
      const waitTone = label => ({
        "User I/O":"io", "Commit":"commit", "Application":"application",
        "Other":"other", "Scheduler":"scheduler", "Concurrency":"concurrency"
      }[label] || "other");
      const waitRows = state.oracleConnected
        ? cpuData?.availability.waits
          ? cpuData.waits.map(wait => [wait.label, wait.percent, waitTone(wait.label)])
          : null
        : sampleWaitCategories;
      const waitDistribution = !waitRows
        ? `<div class="cpu-unavailable">${cpuUnavailable ? esc(state.oracleDomainError || "Collecte des attentes en cours…") : "Droits insuffisants pour lire V$SYSTEM_WAIT_CLASS."}</div>`
        : `<div class="cpu-wait-list">${waitRows.map(([label, percent, tone]) => `<div class="cpu-wait-row"><span>${esc(label)}</span><div><i class="${tone}" style="width:${Math.min(100, Math.max(0, percent))}%"></i></div><strong>${Number(percent).toFixed(1)}%</strong></div>`).join("")}</div><div class="cpu-wait-legend"><span><i class="io"></i>User I/O</span><span><i class="commit"></i>Commit</span><span><i class="application"></i>Application</span><span><i class="other"></i>Other</span><span><i class="scheduler"></i>Scheduler</span><span><i class="concurrency"></i>Concurrency</span></div>`;
      const cpuSessions = !state.oracleConnected
        ? `<div class="cpu-empty"><span>♙</span><p>Aucune session consommatrice détectée</p></div>`
        : !cpuData?.availability.sessions
          ? `<div class="cpu-unavailable">${cpuUnavailable ? esc(state.oracleDomainError || "Collecte des sessions en cours…") : "Droits insuffisants pour lire les statistiques CPU des sessions."}</div>`
          : cpuData.sessions.length
            ? `<div class="cpu-table-wrap"><table class="cpu-table"><thead><tr><th>Session</th><th>Utilisateur</th><th>État</th><th>CPU cumulé</th><th>SQL ID</th></tr></thead><tbody>${cpuData.sessions.map(session => `<tr><td>${esc(session.sid)} / ${esc(session.serial_number)}</td><td>${esc(session.username)}</td><td>${esc(session.status)}</td><td>${Number(session.cpu_seconds).toFixed(2)} s</td><td>${esc(session.sql_id || "—")}</td></tr>`).join("")}</tbody></table></div>`
            : `<div class="cpu-empty"><span>♙</span><p>Aucune session consommatrice détectée</p></div>`;
      const sampleSql = `<div class="cpu-sql-list">
            <article class="cpu-sql-row slow"><div><strong>4h9ua92u8ukm9</strong><code>SELECT tablespace_name, SUM(allocated_bytes)</code><small>Exécutions : 153　DBSNMP</small></div><span>13.8s　<em>(90ms/exec)</em></span></article>
            <article class="cpu-sql-row warning"><div><strong>3d418kjk82mqt</strong><code>SELECT COUNT(*) AS backup_count, MAX(comp...)</code><small>Exécutions : 1　DBSNMP</small></div><span>0.2s　<em>(190ms/exec)</em></span></article>
            <article class="cpu-sql-row warning"><div><strong>4h9ua92u8ukm9</strong><code>SELECT tablespace_name, SUM(allocated_bytes)</code><small>Exécutions : 1　DBSNMP</small></div><span>0.2s　<em>(160ms/exec)</em></span></article>
            <article class="cpu-sql-row fast"><div><strong>gpzwyz4z64p2y</strong><code>SELECT name, value FROM v$parameter WHERE name...</code><small>Exécutions : 33　DBSNMP</small></div><span>0.1s　<em>(4ms/exec)</em></span></article>
            <article class="cpu-sql-row fast"><div><strong>4wgj0464gn4zt</strong><code>SELECT ROUND( 100 * (1 - physical.value</code><small>Exécutions : 33　DBSNMP</small></div><span>0.1s　<em>(4ms/exec)</em></span></article>
          </div>`;
      const cpuSqlRows = !state.oracleConnected
        ? sampleSql
        : !cpuData?.availability.sql
          ? `<div class="cpu-unavailable">${cpuUnavailable ? esc(state.oracleDomainError || "Collecte SQL en cours…") : "Droits insuffisants pour lire V$SQLAREA."}</div>`
          : cpuData.sql.length
            ? `<div class="cpu-sql-list">${cpuData.sql.map(sql => {
                const ms = Number(sql.cpu_ms_per_execution);
                const tone = ms < 10 ? "fast" : ms < 100 ? "medium" : ms < 1000 ? "warning" : "slow";
                return `<article class="cpu-sql-row ${tone}"><div><strong>${esc(sql.sql_id)}</strong><code title="${esc(sql.sql_text)}">${esc(sql.sql_text || "Texte SQL indisponible")}</code><small>Exécutions : ${esc(sql.executions)}　CPU cumulé : ${Number(sql.cpu_seconds).toFixed(2)} s</small></div><span>${Number(sql.cpu_seconds).toFixed(2)}s　<em>(${ms.toFixed(2)}ms/exec)</em></span></article>`;
              }).join("")}</div>`
            : `<div class="cpu-empty"><span>▤</span><p>Aucune requête SQL avec consommation CPU dans le cache partagé</p></div>`;
      const cpuSqlLegend = `<div class="cpu-sql-legend">CPU par exécution :　<i class="fast"></i> &lt; 10 ms　<i class="medium"></i> 10–100 ms　<i class="slow"></i> 100 ms – 1 s　<i class="critical"></i> ≥ 1 s<p>Un temps par exécution élevé signale une requête à examiner, pas une alerte : c’est courant pour les batchs et jobs planifiés (PL/SQL).</p></div>`;
      const cpuRatiosAvailable = !state.oracleConnected || Boolean(cpuData?.availability.metrics);
      const cpuView = `<div class="performance-cpu-content">
        ${cpuNote}
        <section class="performance-section cpu-metrics-section">
          <header class="performance-section-header"><h3><span>▦</span>Métriques CPU</h3></header>
          <div class="cpu-metrics-body">
            <div class="cpu-gauge-wrap"><div class="cpu-gauge" style="--cpu-fill:${cpuHostUsage === null ? 0 : cpuHostUsage}%"><div><strong>${state.oracleConnected ? cpuMetric?.value || "Non collecté" : "1.58%"}</strong><span>CPU Hôte</span></div></div></div>
            <div class="cpu-time-metrics">
              <div><strong>${cpuRatiosAvailable ? cpuDisplay(cpuMetrics.db_cpu_ratio, "%", 2, "0.94%") : "Non collecté"}</strong><span>DB CPU Time</span></div>
              <div><strong>${cpuRatiosAvailable ? cpuDisplay(cpuMetrics.wait_time_ratio, "%", 2, "99.06%") : "Non collecté"}</strong><span>Wait Time</span></div>
            </div>
            <div class="cpu-small-metrics"><div><span>DB Time par seconde</span><strong>${cpuDisplay(cpuMetrics.db_time_per_sec, ` ${cpuMetrics.db_time_unit || ""}`, 2, "0 sec/sec")}</strong></div><div><span>Temps de réponse SQL</span><strong>${cpuDisplay(cpuMetrics.response_time, ` ${cpuMetrics.response_time_unit || ""}`, 2, "0 ms")}</strong></div><div><span>CPU par seconde</span><strong>${cpuDisplay(cpuMetrics.cpu_per_sec, ` ${cpuMetrics.cpu_per_sec_unit || ""}`, 2, "0")}</strong></div></div>
          </div>
        </section>
        <section class="performance-section cpu-advanced-section">
          <header class="performance-section-header"><h3><span>↗</span>Indicateurs Avancés</h3></header>
          <div class="cpu-advanced-body">
            <div class="cpu-aas-card"><div class="cpu-aas-heading"><strong>♙　Sessions Actives Moyennes (AAS)　ⓘ</strong><span>${!state.oracleConnected ? "Base inactive - métriques non significatives" : cpuUnavailable ? "Collecte en cours" : cpuMetrics.aas === null ? "AAS non disponible" : "V$SYSMETRIC"}</span></div>
              <div class="cpu-aas-meter"><span>0</span><span>AAS / CPU = ${cpuDisplay(cpuMetrics.aas_per_cpu, "", 2, "0")}</span><span>2+</span></div><div class="cpu-aas-track"></div><div class="cpu-aas-labels"><span>Efficace</span><span>Saturé</span></div>
              <div class="cpu-aas-stats"><div><strong>${cpuDisplay(cpuMetrics.aas, "", 2, "0")}</strong><span>AAS</span></div><div><strong>${cpuDisplay(cpuMetrics.cpu_count, "", 0, "2")}</strong><span>Nombre de CPUs</span></div><div><strong>${cpuDisplay(cpuMetrics.aas_per_cpu, "", 2, "0")}</strong><span>Ratio AAS/CPU</span></div></div>
            </div>
            <div class="cpu-dbtime"><div><strong>◴　DB Time</strong><b>${cpuDisplay(cpuMetrics.db_time_per_sec, ` ${cpuMetrics.db_time_unit || ""}`, 2, "0 sec/sec")}</b></div><p>Temps total passé à traiter des requêtes (CPU + Wait). Métrique clé de charge Oracle.</p></div>
            <div class="cpu-interpretation"><strong>♧　Interprétation</strong><p>${state.oracleConnected ? "L’interprétation de la charge nécessite les métriques AAS, DB Time et CPU, qui ne sont pas toutes disponibles dans la collecte actuelle." : "La base de données est actuellement peu sollicitée. Les métriques CPU reflètent une activité minimale, ce qui est normal en dehors des heures de pointe."}</p></div>
            <div class="cpu-waits"><div class="cpu-subheading"><strong>◷　Répartition des Attentes</strong><span>(hors Idle)</span></div>${waitDistribution}</div>
          </div>
        </section>
        <section class="performance-section cpu-sessions-section"><header class="performance-section-header"><h3><span>♙</span>Top Sessions par CPU</h3></header>${cpuSessions}</section>
        <section class="performance-section cpu-sql-section"><header class="performance-section-header"><h3><span>▤</span>Top SQL par consommation CPU</h3><span class="cpu-cumulative">◷　Cumul</span></header>${cpuSqlRows}${cpuSqlLegend}</section>
        <p class="memory-source-note">${state.oracleConnected ? "Les compteurs CPU et attentes sont cumulatifs et leur interprétation dépend de la période d’activité de l’instance." : "Valeurs de démonstration locales, non issues d’une collecte Oracle."}</p>
      </div>`;
      const ioData = state.oracleDomainData?.domain === key ? state.oracleDomainData.io : null;
      const ioMetrics = ioData?.metrics || {};
      const ioPending = state.oracleConnected && !ioData;
      const ioNumber = (value, compact = false) => {
        if (value === null || value === undefined || !Number.isFinite(Number(value))) return "Non collecté";
        return new Intl.NumberFormat("fr-FR", {
          notation: compact ? "compact" : "standard",
          maximumFractionDigits: compact ? 1 : 0
        }).format(Number(value));
      };
      const ioValue = value => ioPending
        ? esc(state.oracleDomainError || "Collecte en cours…")
        : ioNumber(value);
      const ioNotice = state.oracleConnected
        ? `<div class="io-notice"><span>ⓘ</span><p>${ioPending ? esc(state.oracleDomainError || "Collecte Oracle en cours…") : "Les compteurs sont cumulés depuis le démarrage de l’instance."}</p></div>`
        : `<div class="io-notice"><span>ⓘ</span><p>Base peu active — les statistiques I/O cumulées reflètent l’historique depuis le démarrage.</p></div>`;
      const bufferAvailable = !state.oracleConnected || Boolean(ioData?.availability.stats);
      const libraryAvailable = !state.oracleConnected || Boolean(ioData?.availability.library_cache);
      const segmentAvailable = !state.oracleConnected || Boolean(ioData?.availability.segments);
      const bufferRatio = state.oracleConnected ? ioMetrics.buffer_hit_ratio : 89.92;
      const libraryRatio = state.oracleConnected ? ioMetrics.library_hit_ratio : 94.65;
      const diskReads = state.oracleConnected ? ioMetrics.physical_reads : 454_280;
      const diskWrites = state.oracleConnected ? ioMetrics.physical_writes : 1_100;
      const logicalReads = state.oracleConnected ? ioMetrics.logical_reads : 4_506_593;
      const cacheSection = (kind, title, ratio, available, rows) => {
        const status = !state.oracleConnected ? "Non significatif" : !available ? "Indisponible" : Number(ratio) < (kind === "buffer" ? 90 : 90) ? "À surveiller" : "Performant";
        const explanation = !state.oracleConnected
          ? kind === "buffer"
            ? "Pourcentage de lectures satisfaites depuis le cache mémoire"
            : "Pourcentage de requêtes SQL réutilisées sans recompilation"
          : available
            ? "Valeurs cumulées depuis le démarrage de l’instance"
            : "Droits insuffisants pour lire les statistiques Oracle du cache.";
        const entries = available
          ? rows.map(row => `<div class="io-stat-row ${row.tone || ""}"><span>${row.label}</span><strong>${row.value}</strong></div>`).join("")
          : `<div class="io-unavailable">${ioPending ? esc(state.oracleDomainError || "Collecte en cours…") : explanation}</div>`;
        const ratioValue = available && ratio !== null && ratio !== undefined
          ? `${Number(ratio).toFixed(2)}%`
          : ioPending
            ? esc(state.oracleDomainError || "Collecte en cours…")
            : "Non collecté";
        const savedRatio = logicalReads && ioMetrics.saved_reads !== null && ioMetrics.saved_reads !== undefined
          ? Number(ioMetrics.saved_reads) / Number(logicalReads) * 100
          : 89.9;
        const footer = kind === "buffer" && available
          ? state.oracleConnected
            ? Number(bufferRatio) >= 90
              ? `<div class="io-assessment good"><strong>✓ Buffer Cache performant.</strong> Le ratio mesuré est satisfaisant.</div>`
              : `<div class="io-assessment warning"><strong>⚠ Cache à surveiller.</strong> Quelques lectures physiques supplémentaires détectées.<p>Un ratio plus bas peut être normal en batch/reporting (full scans, direct path). Prioritaire si les waits I/O et DB Time augmentent.</p></div>`
            : `<div class="io-assessment warning"><strong>⚠ Cache à surveiller.</strong> Quelques lectures physiques supplémentaires détectées.<p>Un ratio plus bas peut être normal en batch/reporting (full scans, direct path). Prioritaire si les waits I/O et DB Time augmentent.</p></div>`
          : kind === "library" && available
            ? `<div class="io-assessment ${Number(libraryRatio) >= 90 ? "good" : "warning"}"><strong>${Number(libraryRatio) >= 90 ? "✓ Library Cache performant." : "⚠ Library Cache à surveiller."}</strong> ${Number(libraryRatio) >= 90 ? "Les requêtes SQL sont efficacement réutilisées." : "Vérifiez les recompilations et les requêtes utilisant des bind variables."}</div>`
            : "";
        return `<section class="performance-section io-cache-panel ${kind === "buffer" ? "buffer-panel" : "library-panel"}">
          <header class="performance-section-header"><h3><span>${kind === "buffer" ? "◉" : "▢"}</span>${title}</h3><span class="io-status ${status === "Performant" ? "good" : status === "À surveiller" ? "warning" : ""}">${status}</span></header>
          <div class="io-panel-body">
            <div class="io-ratio-heading"><span>Hit Ratio　ⓘ</span><strong>${ratioValue}</strong></div>
            <div class="io-ratio-track"><span style="width:${available && ratio !== null && ratio !== undefined ? Math.min(100, Math.max(0, Number(ratio))) : 0}%"></span></div>
            <p class="io-explanation">${explanation}</p>
            <div class="io-stat-list">${entries}</div>
            ${kind === "buffer" && available ? `<div class="io-saved-row"><span>⚠ Lectures évitées</span><strong>${ioValue(state.oracleConnected ? ioMetrics.saved_reads : 4_052_313)} (${Number(savedRatio).toFixed(1)}%)</strong></div>` : ""}
            <p class="io-cumulative-note">ⓘ Valeurs cumulées depuis le démarrage de l’instance</p>
            ${footer}
          </div>
        </section>`;
      };
      const bufferRows = [
        { label:"Lectures logiques", value:ioValue(logicalReads) },
        { label:"Lectures physiques", value:ioValue(diskReads) }
      ];
      const libraryRows = [
        { label:"Pins (exécutions)", value:ioValue(state.oracleConnected ? ioMetrics.library_pins : 628_351) },
        { label:"Hits (réutilisations)", value:ioValue(state.oracleConnected ? ioMetrics.library_hits : 594_717) },
        { label:"Reloads (recompilations)", value:ioValue(state.oracleConnected ? ioMetrics.library_reloads : 1_673), tone:"io-reload" }
      ];
      const readTotal = Number(diskReads) || 0;
      const writeTotal = Number(diskWrites) || 0;
      const ioTotal = readTotal + writeTotal;
      const readPercent = ioTotal ? readTotal / ioTotal * 100 : 0;
      const writePercent = ioTotal ? writeTotal / ioTotal * 100 : 0;
      const diskAvailable = !state.oracleConnected || Boolean(ioData?.availability.stats);
      const segmentRows = state.oracleConnected ? ioData?.segments || [] : [
        { owner:"AUD$UNIFIED", object_name:"AUDSYS.TABLE PARTITION", subobject_name:"SYSAUX", physical_reads:3000, physical_writes:8 },
        { owner:"SYS", object_name:"SYS_IL0000023255C00097$$", subobject_name:"AUDSYS.INDEX PARTITION (SYSAUX)", physical_reads:2000, physical_writes:3 },
        { owner:"SYS", object_name:"SYS_IL0000023255C00113$$", subobject_name:"AUDSYS.INDEX PARTITION (SYSAUX)", physical_reads:1600, physical_writes:4 },
        { owner:"SYS", object_name:"SYS_IL0000023255C00030$$", subobject_name:"AUDSYS.INDEX PARTITION (SYSAUX)", physical_reads:1600, physical_writes:4 }
      ];
      const ioView = `<div class="performance-io-content">
        ${ioNotice}
        ${cacheSection("buffer", "Buffer Cache", bufferRatio, bufferAvailable, bufferRows)}
        ${cacheSection("library", "Library Cache", libraryRatio, libraryAvailable, libraryRows)}
        <section class="performance-section io-disk-panel">
          <header class="performance-section-header"><h3><span>▱</span>Activité I/O disque</h3></header>
          <div class="io-panel-body">
            ${diskAvailable ? `<div class="io-disk-cards">
              <article><span>▱</span><strong>${ioNumber(diskReads, true)}</strong><small>Lectures physiques</small></article>
              <article class="writes"><span>↗</span><strong>${ioNumber(diskWrites, true)}</strong><small>Écritures physiques</small></article>
              <article class="logical"><span>◉</span><strong>${ioNumber(logicalReads, true)}</strong><small>Lectures logiques</small></article>
            </div>
            <div class="io-read-write"><strong>▥　Ratio Lectures / Écritures</strong><div><i style="width:${readPercent}%"></i><b style="width:${writePercent}%"></b></div><p><span>● Lectures : ${readPercent.toFixed(1)}%</span><span>● Écritures : ${writePercent.toFixed(1)}%</span></p></div>`
            : `<div class="io-unavailable">${ioPending ? esc(state.oracleDomainError || "Collecte en cours…") : "Droits insuffisants pour lire les compteurs I/O."}</div>`}
            <p class="io-cumulative-note">ⓘ Valeurs cumulées depuis le démarrage de l’instance</p>
          </div>
        </section>
        <section class="performance-section io-segments-panel">
          <header class="performance-section-header"><h3><span>▥</span>Top segments par I/O</h3></header>
          <div class="io-segments-list">${!segmentAvailable
            ? `<div class="io-unavailable">${ioPending ? esc(state.oracleDomainError || "Collecte en cours…") : "Droits insuffisants pour lire V$SEGMENT_STATISTICS."}</div>`
            : segmentRows.length
              ? segmentRows.map(segment => {
                  const reads = Number(segment.physical_reads) || 0;
                  const writes = Number(segment.physical_writes) || 0;
                  const total = reads + writes;
                  const readWidth = total ? reads / total * 100 : 0;
                  return `<article class="io-segment"><div class="io-segment-heading"><div><strong>${esc(segment.owner)}.${esc(segment.object_name)}</strong><small>${esc(segment.subobject_name || "Segment Oracle")}</small></div><b>${ioNumber(total, true)} Total I/O</b></div><div class="io-segment-track"><i style="width:${readWidth}%"></i><b style="width:${100-readWidth}%"></b></div><div class="io-segment-legend"><span>● Lectures : ${ioNumber(reads, true)}</span><span>● Écritures : ${ioNumber(writes, true)}</span></div></article>`;
                }).join("")
              : `<div class="io-unavailable">Aucune activité I/O de segment enregistrée depuis le démarrage.</div>`}
          </div><p class="io-cumulative-note">ⓘ Valeurs cumulées depuis le démarrage de l’instance</p>
        </section>
        <p class="memory-source-note">${state.oracleConnected ? "Données Oracle cumulées depuis le démarrage ; les sections indisponibles requièrent les privilèges sur les vues dynamiques correspondantes." : "Valeurs de démonstration locales, non issues d’une collecte Oracle."}</p>
      </div>`;
      const helpCode = sql => `<pre class="performance-help-code"><code>${esc(sql)}</code></pre>`;
      const helpSections = [
        {
          title:"Glossaire Rapide", level:"Débutant", icon:"▤",
          content:`<div class="help-glossary">
            <article><strong>SGA (System Global Area)</strong><p>Mémoire partagée entre les processus Oracle : Buffer Cache, Shared Pool et Redo Log Buffer. Paramètres principaux : <code>SGA_TARGET</code> et <code>MEMORY_TARGET</code>.</p></article>
            <article><strong>PGA (Program Global Area)</strong><p>Mémoire privée de chaque processus serveur, utilisée pour les tris, jointures hash et opérations temporaires. Cible définie par <code>PGA_AGGREGATE_TARGET</code>.</p></article>
            <article><strong>Buffer Cache</strong><p>Cache les blocs de données lus. Un hit évite une lecture disque ; interprétez son ratio selon la charge et les lectures physiques.</p></article>
            <article><strong>Library Cache</strong><p>Partie du Shared Pool qui conserve les curseurs et plans SQL. Les « reloads » indiquent qu’un objet a dû être rechargé.</p></article>
            <article><strong>Hit Ratio</strong><p>Proportion de demandes servies par un cache. Ce ratio dépend de la charge, du démarrage et des accès directs ; il ne suffit pas à lui seul pour dimensionner.</p></article>
            <article><strong>Wait Class</strong><p>Famille d’événements d’attente Oracle (User I/O, System I/O, Commit, Concurrency, Application, etc.). Les attentes Idle ne représentent pas du travail actif.</p></article>
            <article><strong>DB Time</strong><p>Temps cumulé des sessions actives passé à travailler ou attendre : CPU + attentes non Idle. À mettre en relation avec l’intervalle observé.</p></article>
            <article><strong>Sessions</strong><p>Connexions utilisateur à la base. Elles consomment des ressources et un slot de processus selon la configuration Oracle.</p></article>
            <article><strong>TPS (Transactions par seconde)</strong><p>Débit transactionnel mesuré sur un intervalle. Une valeur faible peut simplement indiquer une période calme.</p></article>
            <article><strong>AWR</strong><p>Automatic Workload Repository : historique de statistiques périodiques. Vérifiez la disponibilité et les licences Oracle avant son utilisation.</p></article>
            <article><strong>Redo Log Buffer</strong><p>Tampon mémoire des modifications avant écriture dans les fichiers Redo Log par LGWR.</p></article>
            <article><strong>Hard Parse vs Soft Parse</strong><p>Un hard parse construit un nouveau curseur et plan SQL ; un soft parse réutilise un curseur existant. Les bind variables favorisent la réutilisation.</p></article>
          </div>`
        },
        {
          title:"Qu'est-ce que la Performance Oracle ?", level:"Débutant", icon:"ⓘ",
          content:`<p>La performance Oracle mesure la capacité de la base à répondre rapidement et efficacement aux requêtes. Elle dépend de l’équilibre entre mémoire, CPU, I/O disque et sessions concurrentes.</p>
            <div class="help-callouts">
              <article class="blue"><strong>Mémoire — SGA et PGA</strong><p>La SGA est partagée entre les processus ; la PGA est privée par processus serveur. Le Buffer Cache conserve des blocs et le Shared Pool des curseurs et plans SQL.</p></article>
              <article class="green"><strong>CPU et I/O — Les ressources physiques</strong><p>Le CPU exécute les requêtes. Les accès disque sont plus coûteux que les accès mémoire ; les compteurs cumulés doivent être lus sur une période comparable.</p></article>
              <article class="amber"><strong>Sessions et Transactions — La charge applicative</strong><p>Les sessions consomment mémoire et processus. Les transactions entraînent des écritures Redo et peuvent attendre des ressources partagées.</p></article>
            </div>`
        },
        {
          title:"Pourquoi la Performance est Critique", level:"Débutant", icon:"♧",
          content:`<div class="help-callouts">
            <article class="red"><strong>Impact sur la disponibilité</strong><p>Une saturation du Shared Pool ou de la limite de sessions peut empêcher de nouvelles requêtes ou connexions. Vérifiez les erreurs et ressources avant toute modification.</p></article>
            <article class="amber"><strong>Impact sur les temps de réponse</strong><p>Un cache bas ou un CPU soutenu peut contribuer aux lenteurs, mais les attentes I/O, la concurrence et les requêtes elles-mêmes doivent également être examinées.</p></article>
            <article class="yellow"><strong>Impact sur la capacité de traitement</strong><p>Des requêtes coûteuses ou des accès non sélectifs peuvent consommer plus de CPU, mémoire et I/O. L’analyse doit s’appuyer sur les SQL réellement observées.</p></article>
          </div>`
        },
        {
          title:"Architecture Mémoire Oracle", level:"Intermédiaire", icon:"▣",
          content:`<p>Oracle répartit la mémoire entre une zone partagée par l’instance (SGA) et des zones privées utilisées par les processus (PGA).</p>
            ${helpCode(`INSTANCE ORACLE
├── SGA (partagée)
│   ├── Buffer Cache       blocs de données
│   ├── Shared Pool        Library Cache + dictionnaire
│   ├── Redo Log Buffer    modifications en attente
│   └── Large Pool / Java Pool
│       SGA_TARGET ou MEMORY_TARGET
└── PGA (privée par processus)
    ├── Session 1 : tris, hash joins, mémoire de travail
    ├── Session 2 : tris, hash joins, mémoire de travail
    └── PGA_AGGREGATE_TARGET`) }
            <div class="help-glossary help-memory-cards">
              <article><strong>Buffer Cache</strong><p>Garde en mémoire les blocs récemment utilisés. Un ratio élevé n’est pas à optimiser isolément : considérez aussi les lectures physiques et les attentes I/O.</p></article>
              <article><strong>Shared Pool</strong><p>Contient Library Cache et Dictionary Cache. Les plans réutilisés limitent les compilations répétées.</p></article>
              <article><strong>Redo Log Buffer</strong><p>Enregistre temporairement les changements avant leur écriture dans les Redo Logs.</p></article>
              <article><strong>PGA (par session)</strong><p>Chaque processus a sa propre PGA ; sa cible globale est pilotée par <code>PGA_AGGREGATE_TARGET</code>.</p></article>
            </div>`
        },
        {
          title:"Meilleures Pratiques", level:"Intermédiaire", icon:"♙",
          content:`<ol class="help-practices">
            <li><strong>Utiliser la gestion automatique de mémoire</strong><p>Préférer <code>MEMORY_TARGET</code> ou <code>SGA_TARGET</code> à un réglage manuel de chaque composant, sauf besoin mesuré.</p></li>
            <li><strong>Suivre les tendances du Buffer Cache</strong><p>Comparez les ratios avec les lectures physiques, les attentes et une période d’activité représentative.</p></li>
            <li><strong>Dimensionner la PGA selon la charge</strong><p>Considérez les sessions concurrentes et les opérations de tri/hash, puis validez avec les statistiques PGA.</p></li>
            <li><strong>Identifier les requêtes SQL coûteuses</strong><p>Examinez CPU, I/O, temps écoulé et nombre d’exécutions ; mesurez l’effet des changements.</p></li>
            <li><strong>Surveiller les Wait Events</strong><p>Concentrez-vous sur les attentes non Idle et leur évolution plutôt que sur un compteur isolé.</p></li>
            <li><strong>Gérer les sessions inactives</strong><p>Analysez leur durée et leur origine avant de configurer un profil ou une politique de déconnexion.</p></li>
            <li><strong>Utiliser les outils Oracle selon les licences</strong><p>AWR/ASH et certains conseils avancés peuvent nécessiter des options payantes. Vérifiez votre contrat et les droits applicables.</p></li>
          </ol>`
        },
        {
          title:"Commandes SQL Essentielles", level:"Expert", icon:"ϟ",
          content:`<h4>Mémoire SGA / PGA</h4><p>Paramètres mémoire et statistiques PGA :</p>
            ${helpCode(`SHOW PARAMETER sga_target;
SHOW PARAMETER pga_aggregate_target;
SHOW PARAMETER memory_target;

SELECT name, value
FROM v$pgastat
WHERE name IN ('aggregate PGA target parameter',
  'total PGA allocated', 'maximum PGA allocated');`)}
            <h4>Sessions actives</h4>${helpCode(`SELECT sid, serial#, username, status, sql_id,
       event, wait_class, seconds_in_wait
FROM v$session
WHERE type = 'USER' AND status = 'ACTIVE'
  AND wait_class <> 'Idle'
ORDER BY seconds_in_wait DESC;`)}
            <h4>Performance des caches</h4>${helpCode(`SELECT name, value
FROM v$sysstat
WHERE name IN ('db block gets', 'consistent gets', 'physical reads');

SELECT namespace, pins, pinhits, reloads
FROM v$librarycache
WHERE namespace IN ('SQL AREA', 'TABLE/PROCEDURE', 'BODY');`)}
            <h4>Diagnostic DB Time</h4>${helpCode(`SELECT stat_name, value
FROM v$sys_time_model
WHERE stat_name IN ('DB time', 'DB CPU')
ORDER BY value DESC;`)}
            <p class="help-caution">Exécutez les requêtes de diagnostic avec un compte en lecture seule et les privilèges nécessaires. N’exécutez pas de commande de modification sans revue DBA.</p>`
        },
        {
          title:"Stratégies de Dimensionnement", level:"Intermédiaire", icon:"▥",
          content:`<div class="help-callouts">
            <article class="green"><strong>Petites bases / charge modérée</strong><p>Établissez une baseline de la mémoire, de la concurrence, des tris disque et des attentes avant d’ajuster SGA ou PGA.</p>${helpCode(`-- Relever les paramètres existants
SHOW PARAMETER memory_target;
SHOW PARAMETER sga_target;
SHOW PARAMETER pga_aggregate_target;`)}</article>
            <article class="blue"><strong>Bases à forte charge</strong><p>Dimensionnez à partir d’observations en période de pointe, de la mémoire serveur réellement disponible et des contraintes de l’instance. Testez et documentez chaque changement.</p>${helpCode(`SELECT name, value
FROM v$pgastat
WHERE name LIKE '%PGA%'
ORDER BY name;`)}</article>
          </div>`
        },
        {
          title:"Scénarios d'Urgence", level:"Expert", icon:"⚠",
          content:`<div class="help-callouts">
            <article class="red"><strong>ORA-04031 : manque de mémoire partagée</strong><p>Les allocations du Shared Pool échouent. Vérifiez l’alerte, les paramètres, les fragments et les requêtes concernées. Ne videz pas de cache sans analyse d’impact.</p>${helpCode(`SELECT pool, name, bytes
FROM v$sgastat
WHERE pool = 'shared pool'
ORDER BY bytes DESC;`)}</article>
            <article class="amber"><strong>ORA-00018 : maximum de sessions atteint</strong><p>Les nouvelles connexions sont refusées. Identifiez les sessions, leurs programmes et leur durée ; vérifiez la limite configurée et les pools applicatifs.</p>${helpCode(`SELECT username, status, machine, program, COUNT(*) AS sessions
FROM v$session
GROUP BY username, status, machine, program
ORDER BY sessions DESC;`)}</article>
            <article class="yellow"><strong>Buffer Cache bas ou lectures physiques élevées</strong><p>Vérifiez l’évolution des lectures, les segments et les SQL actifs. Distinguez un batch ou full scan attendu d’une régression avant tout redimensionnement.</p></article>
            <article class="red"><strong>CPU élevé de manière prolongée</strong><p>Identifiez les SQL consommateurs, les sessions actives et les attentes. Privilégiez la cause racine plutôt que l’augmentation aveugle des ressources.</p></article>
          </div><p class="help-caution">En situation de production, suivez la procédure d’incident de votre organisation et faites valider les actions par le DBA responsable.</p>`
        },
        {
          title:"Arbre de Décision", level:"Intermédiaire", icon:"◎",
          content:`<p>Utilisez ce parcours pour orienter le diagnostic ; confirmez toujours le symptôme avec plusieurs métriques.</p>
            ${helpCode(`Dégradation de performance ?
├── Mémoire / cache
│   ├── Buffer Cache : vérifier lectures physiques et attentes I/O
│   └── PGA : vérifier mémoire allouée et workareas disque
├── CPU
│   ├── CPU soutenu : identifier les SQL et sessions actives
│   └── CPU normal + DB Time élevé : analyser les waits non Idle
└── I/O
    ├── Lectures physiques élevées : examiner SQL et segments
    └── Écritures / latence : examiner stockage et événements d’attente`) }
            <div class="help-callouts help-paths">
              <article class="blue"><strong>Chemin Mémoire</strong><p>Comparez SGA/PGA, lectures physiques, tris disque et période d’activité.</p></article>
              <article class="amber"><strong>Chemin CPU</strong><p>Si le CPU est élevé, classez les SQL par CPU ; sinon confrontez DB Time aux attentes.</p></article>
              <article class="green"><strong>Chemin I/O</strong><p>Examinez volumes physiques, attentes et segments, puis les requêtes qui accèdent à ces objets.</p></article>
            </div>`
        },
        {
          title:"Vérifier les Données Deynao", level:"Expert", icon:"⌕",
          content:`<p>Ces requêtes permettent de comparer manuellement les compteurs présentés. Utilisez un compte Oracle en lecture seule et tenez compte du fait que les compteurs sont généralement cumulés depuis le démarrage.</p>
            <h4>1. Vérifier le Buffer Cache Hit Ratio</h4>${helpCode(`SELECT name, value
FROM v$sysstat
WHERE name IN ('db block gets', 'consistent gets', 'physical reads');
-- Calcul : 100 * (1 - physical reads / (db block gets + consistent gets))`)}
            <h4>2. Vérifier le Library Cache</h4>${helpCode(`SELECT namespace, pins, pinhits, reloads
FROM v$librarycache
WHERE namespace = 'SQL AREA';`)}
            <h4>3. Vérifier l’activité disque</h4>${helpCode(`SELECT name, value
FROM v$sysstat
WHERE name IN ('physical reads', 'physical writes');`)}
            <h4>4. Vérifier les sessions actives</h4>${helpCode(`SELECT sid, serial#, username, status, sql_id
FROM v$session
WHERE type = 'USER' AND status = 'ACTIVE';`)}
            <h4>5. Vérifier les métriques CPU/DB Time récentes</h4>${helpCode(`SELECT metric_name, value, metric_unit
FROM v$sysmetric
WHERE group_id = 2
  AND metric_name IN ('Host CPU Utilization (%)',
    'Database CPU Time Ratio', 'Database Wait Time Ratio',
    'Database Time Per Sec');`)}`
        },
        {
          title:"Checklist de Maintenance", level:"Débutant", icon:"▤",
          content:`<p class="help-checklist-intro">Suivez ces contrôles périodiquement et comparez toujours les mesures sur des plages équivalentes.</p>
            <div class="help-checklist-grid">
              <article><h4>Vérifications quotidiennes (5 min)</h4><ol><li>Examiner l’état de l’instance et les alertes Oracle.</li><li>Contrôler les sessions actives et les attentes non Idle.</li><li>Vérifier Buffer Cache et lectures physiques ensemble.</li><li>Contrôler CPU, DB Time et volume transactionnel.</li><li>Repérer toute variation inhabituelle depuis la dernière collecte.</li></ol></article>
              <article><h4>Vérifications hebdomadaires (15 min)</h4><ol><li>Analyser les tendances SGA/PGA et les maxima.</li><li>Examiner les SQL coûteuses en CPU et I/O.</li><li>Rechercher les attentes non Idle récurrentes.</li><li>Vérifier les sessions longues et la capacité processus.</li><li>Comparer les segments les plus actifs à la semaine précédente.</li><li>Confirmer la collecte des outils historiques autorisés.</li></ol></article>
              <article><h4>Vérifications mensuelles (30 min)</h4><ol><li>Revoir la capacité mémoire et CPU à partir des périodes de pointe.</li><li>Évaluer la croissance du nombre de sessions.</li><li>Réviser profils et politiques de connexion.</li><li>Planifier les évolutions matérielles ou logicielles.</li><li>Optimiser les SQL identifiées avec une mesure avant/après.</li></ol></article>
              <article class="pro"><h4>Conseils de Pro</h4><p>Conservez une baseline, documentez les changements et validez les options Oracle/licences utilisées. Toute recommandation automatique doit être vérifiée par un DBA.</p></article>
            </div>`
        },
        {
          title:"Questions Fréquentes", level:"Débutant", icon:"ⓘ",
          content:`<div class="help-faq">
            <article><strong>Que signifie un Buffer Cache Hit Ratio bas ?</strong><p>Il peut refléter un workload de lecture, des full scans, un cache froid ou un besoin de revue SQL. Vérifiez lectures physiques, attentes et fenêtre d’observation avant toute action.</p></article>
            <article><strong>Pourquoi les compteurs sont-ils cumulés depuis le démarrage ?</strong><p>Les vues de statistiques exposent souvent des compteurs cumulés. Pour évaluer un débit, comparez deux instantanés horodatés et traitez les redémarrages.</p></article>
            <article><strong>Quelle différence entre DB Time et DB CPU ?</strong><p>DB Time inclut CPU et attentes des sessions actives ; DB CPU ne mesure que le temps CPU consommé par Oracle.</p></article>
            <article><strong>Que signifie une session « en attente » ?</strong><p>Une session active peut attendre une ressource. Examinez l’événement et sa classe ; les attentes Idle ne constituent pas une charge active.</p></article>
            <article><strong>Pourquoi le CPU hôte peut-il être indisponible ?</strong><p>La collecte dépend des métriques et privilèges accessibles à l’utilisateur. Le CPU serveur et le CPU consommé par Oracle sont des mesures différentes.</p></article>
            <article><strong>Comment augmenter la SGA ou la PGA ?</strong><p>Établissez d’abord le besoin et vérifiez la mémoire disponible, la configuration automatique et les règles de changement de votre environnement.</p></article>
            <article><strong>Que faire si les performances baissent soudainement ?</strong><p>Comparer aux baselines, vérifier alertes, sessions actives, SQL, attentes, changements récents et ressources système.</p></article>
            <article><strong>Pourquoi AWR/ASH peut-il être absent ?</strong><p>La disponibilité dépend de l’édition, des privilèges et des licences Oracle. Utilisez seulement les fonctionnalités autorisées.</p></article>
            <article><strong>Le score de performance est-il calculé ?</strong><p>Dans cette version, le score n’est pas calculé à partir des mesures connectées ; ne l’interprétez pas comme un diagnostic réel.</p></article>
            <article><strong>Les suggestions de cet onglet sont-elles des actions automatiques ?</strong><p>Non. Ce guide est informatif ; validez chaque commande et changement avec un DBA avant exécution.</p></article>
          </div>`
        }
      ];
      const helpView = `<div class="performance-help-content">
        <header class="performance-help-banner"><span class="performance-help-book">▤</span><div><h2>Guide de Performance Oracle</h2><p>Guide complet · 12 modules · Du débutant à l’expert</p></div><div class="performance-help-controls"><span data-help-count>12/12 sections ouvertes</span><button class="btn" data-action="help-collapse">⌃ Tout fermer</button></div></header>
        <nav class="performance-help-index" aria-label="Sommaire du guide">
          <div class="performance-help-index-title">▤　Sommaire - Cliquez pour naviguer</div>
          <div>${helpSections.map((section, index) => `<button data-action="help-jump:${index + 1}"><b>${index + 1}</b><span>${section.icon}</span>${section.title}</button>`).join("")}</div>
        </nav>
        <div class="performance-help-sections">${helpSections.map((section, index) => `<details class="performance-help-section help-level-${index + 1}" id="performance-help-${index + 1}" open>
          <summary><b>${index + 1}</b><span>${section.icon}</span><strong>${section.title}</strong><em>${section.level}</em><i aria-hidden="true">⌃</i></summary>
          <div class="performance-help-body">${section.content}</div>
        </details>`).join("")}</div>
        <aside class="performance-help-note"><strong>ⓘ　Deynao — Supervision et diagnostic Oracle</strong><p>Deynao observe les mesures disponibles et aide à orienter l’analyse. Toute modification de configuration reste sous la responsabilité de l’équipe DBA.</p></aside>
      </div>`;
      return `<div class="performance-page">
        <section class="performance-dashboard">
          <div class="performance-dashboard-accent"></div>
          <div class="performance-dashboard-inner">
            <header class="performance-dashboard-header">
              <div class="performance-title"><span class="performance-title-icon">⌁</span><div><h2>Performance Oracle</h2><p>Analyse détaillée des métriques de performance et optimisation</p></div></div>
              <div class="performance-toolbar"><div class="performance-score"><small>Score de performance <span aria-hidden="true">ⓘ</span></small><strong>${performanceScore}</strong>${state.oracleConnected ? `<span class="performance-score-note">Non calculé</span>` : ""}</div>
                ${btn("▤　CSV","export","btn performance-export csv")}${btn("▤　PDF","export","btn performance-export pdf")}
                <button class="btn icon-btn performance-refresh" data-action="refresh-domain" aria-label="Actualiser les données">⟳</button>
              </div>
            </header>
            ${state.oracleConnected && state.oracleDomainError ? `<p class="performance-error" role="alert">${esc(state.oracleDomainError)}</p>` : ""}
            <div class="performance-metrics">${performanceCards}</div>
          </div>
        </section>
        ${renderDomainTabs(config.tabs)}
        ${state.domainTab === "Vue d'ensemble" ? performanceOverview : ""}
        ${state.domainTab === "Mémoire" ? memoryView : ""}
        ${state.domainTab === "CPU" ? cpuView : ""}
        ${state.domainTab === "I/O & Cache" ? ioView : ""}
        ${state.domainTab === "Aide" ? helpView : ""}
        <div class="footer-note">Deynao — Supervision et diagnostic Oracle · ${state.oracleConnected ? "Mesures Oracle réelles · score Deynao calculé" : "Données de démonstration locales"}</div>
      </div>`;
    }
    if (key === "logging") {
      const loggingData = state.oracleDomainData?.domain === key ? state.oracleDomainData : null;
      const metricValue = label => loggingData?.metrics?.find(metric => metric.label === label)?.value ?? "—";
      const retentionValue = rawValue => {
        const raw = String(rawValue ?? "—").trim();
        const seconds = Number(raw.match(/([\d.]+)/)?.[1] || 0);
        if (!Number.isFinite(seconds) || seconds <= 0) return raw;
        if (seconds >= 3600) return `${Math.round(seconds / 3600)} h`;
        if (seconds >= 60) return `${Math.round(seconds / 60)} min`;
        return `${Math.round(seconds)} s`;
      };
      const live = state.oracleConnected;
      const archValue = live ? String(metricValue("Mode Archivelog")) : "ARCHIVELOG";
      const archOk = archValue.toUpperCase() === "ARCHIVELOG";
      const redoValue = live ? String(metricValue("Groupes REDO")) : "3";
      const redoSize = live ? String(metricValue("Taille REDO")) : "600 MB";
      const redoOk = Number.parseInt(redoValue.replace(/\D/g, ""), 10) > 0;
      const undoRaw = live ? String(metricValue("Rétention UNDO")) : "15 min";
      const undoValue = live ? retentionValue(undoRaw) : "15 min";
      const undoSeconds = Number(undoRaw.match(/([\d.]+)/)?.[1] || 0);
      const archiveValue = live ? "—" : "0%";
      const statuses = {
        mode: live ? (archOk ? ["Optimal","normal"] : ["Attention","critical"]) : ["Attention","critical"],
        redo: live ? (redoOk ? ["Optimal","normal"] : ["Attention","critical"]) : ["Optimal","normal"],
        undo: live ? (undoSeconds >= 1800 ? ["Optimal","normal"] : ["Surveiller","watch"]) : ["Surveiller","watch"],
        archive: ["Optimal","normal"],
      };
      const loggingIcons = {
        mode: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v8"></path><path d="m8.5 11.5 3.5 3.5 3.5-3.5"></path></svg>`,
        redo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"></ellipse><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"></path><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"></path></svg>`,
        undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path><path d="M12 7v5l4 2"></path></svg>`,
        archive: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path></svg>`
      };
      const loggingCard = (icon, title, value, foot, status, statusClass, theme) => `<article class="performance-metric logging-metric logging-metric--${theme}"><div class="performance-metric-content"><span class="logging-metric-icon" aria-hidden="true">${loggingIcons[icon]}</span><div class="performance-metric-heading"><span>${esc(title)}</span><span class="performance-status ${statusClass}">${esc(status)}</span></div><div class="performance-metric-value">${esc(value)}</div><small>${esc(foot)}</small></div></article>`;
      const loggingFeatureIcon = name => {
        const paths = {
          backup:'<path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6l-8-3Z"></path><path d="m9 12 2 2 4-4"></path>',
          pitr:'<path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path><path d="M12 7v5l3 2"></path>',
          undo:'<path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path><path d="M9 12h6"></path><path d="m13 9-3 3 3 3"></path>',
          layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"></path><path d="m3 12 9 5 9-5"></path><path d="m3 16 9 5 9-5"></path>',
          warning:'<path d="M12 3 2.8 20h18.4L12 3Z"></path><path d="M12 9v5"></path><circle cx="12" cy="17.2" r=".8" fill="currentColor" stroke="none"></circle>',
          code:'<path d="m8 8-4 4 4 4"></path><path d="m16 8 4 4-4 4"></path><path d="m13 5-2 14"></path>',
          check:'<circle cx="12" cy="12" r="9"></circle><path d="m8 12 2.5 2.5L16 9"></path>'
        };
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
      };
      const loggingKpiCard = (title, status, statusClass, value, foot, meta, detail) => `<article class="logging-kpi-card">
        <header class="logging-kpi-head"><h4>${esc(title)}</h4><span class="logging-kpi-status ${statusClass}">${esc(status)}</span></header>
        <div class="logging-kpi-value">${esc(value)}</div>
        <p class="logging-kpi-foot">${esc(foot)}</p>
        <div class="logging-kpi-meta">${meta.map(([label, content]) => `<div><small>${esc(label)}</small><strong>${esc(content)}</strong></div>`).join("")}</div>
        <button type="button" class="logging-kpi-link" data-action="logging-details" data-detail="${esc(detail)}">Voir détails</button>
      </article>`;
      const loggingFeatureCard = (tone, icon, title, description) => `<article class="logging-recovery-card ${tone}">
        <span class="logging-feature-icon" aria-hidden="true">${loggingFeatureIcon(icon)}</span>
        <div class="logging-recovery-copy"><strong>${esc(title)}</strong><p>${esc(description)}</p></div>
      </article>`;
      const loggingRecommendation = (tone, title, badge, description, action, gain) => `<article class="logging-reco-card ${tone}">
        <div class="logging-reco-title"><span class="logging-reco-icon" aria-hidden="true">${loggingFeatureIcon(tone === "optimize" ? "undo" : "warning")}</span><strong>${esc(title)}</strong><span class="logging-reco-badge">${esc(badge)}</span></div>
        <div class="logging-reco-body"><p>${esc(description)}</p>
        <div class="logging-reco-action">→ ${esc(action)}</div>
        <footer class="logging-reco-footer"><span class="logging-reco-gain">${esc(gain)}</span><button type="button" class="logging-reco-link" data-action="logging-script">${loggingFeatureIcon("code")}<span>Voir le script SQL</span></button></footer></div>
      </article>`;
      const archLastSwitch = live ? "—" : "13h 42min";
      const archDestination = live ? "—" : "FRA";
      const archUsed = live ? "—" : "4.07 GB";
      const redoRate = live ? "—" : "0.1 switch/h";
      const redoMultiplex = live ? "—" : "NON";
      const undoUsage = live ? "—" : "1%";
      const undoAutoextend = live ? "—" : "OUI";
      const undoMax = live ? "—" : "32 TB";
      const undoRetentionDetail = live ? undoRaw : "900 s (15 min)";
      const rollbackDescription = undoSeconds >= 1800 ? "Rétention UNDO conforme · Requêtes longues protégées" : live ? `Rétention ${undoValue} · Requêtes longues à risque` : "Rétention 15min — Requêtes longues à risque";
      const multiplexDescription = live ? "Multiplexage REDO non collecté" : "Groupes ≥3 mais non multiplexés · Perte possible sur crash disque";
      const loggingOverview = `<section class="logging-overview" aria-label="Vue d'ensemble de la journalisation">
        <section class="logging-overview-section logging-kpi-section">
          <header class="logging-overview-heading"><h3>Indicateurs opérationnels</h3><p>Activité et utilisation à la dernière actualisation - Complémentaire aux statuts ci-dessus</p></header>
          <div class="logging-kpi-grid">
            ${loggingKpiCard("ARCHIVELOG", ...statuses.mode, archLastSwitch, "Dernier switch log", [["Destination", archDestination],["Espace utilisé", archUsed]], "archivelog")}
            ${loggingKpiCard("REDO LOG", ...statuses.redo, redoRate, "Cible recommandée : < 4/h", [["Taille totale", redoSize],["Multiplexé", redoMultiplex]], "redo")}
            ${loggingKpiCard("UNDO", ...statuses.undo, undoUsage, "Utilisation espace UNDO", [["Autoextend", undoAutoextend],["Capacité max", undoMax]], "undo")}
          </div>
        </section>
        <section class="logging-overview-section logging-recovery-section">
          <header class="logging-overview-heading logging-recovery-heading"><div class="logging-recovery-heading-line"><span class="logging-recovery-heading-icon" aria-hidden="true">${loggingFeatureIcon("pitr")}</span><h3>Capacité de récupération</h3></div><p>Évaluation de la protection de vos données en cas d’incident</p></header>
          <div class="logging-recovery-grid">
            ${loggingFeatureCard(archOk ? "green" : "amber", "backup", "Sauvegarde à chaud", archOk ? "Sauvegarde possible sans arrêt de la base" : "Sauvegarde impossible sans arrêt de la base")}
            ${loggingFeatureCard(archOk ? "green" : "amber", "pitr", "Récupération point-in-time", archOk ? "Restauration à n'importe quel instant possible (PITR)" : "Restauration point-in-time indisponible")}
            ${loggingFeatureCard(undoSeconds >= 1800 ? "green" : "amber", "undo", "Protection rollback", rollbackDescription)}
            ${loggingFeatureCard(live ? "amber" : "amber", "layers", "Multiplexage journaux", multiplexDescription)}
          </div>
        </section>
        <section class="logging-overview-section logging-reco-section">
          <header class="logging-overview-heading logging-reco-heading"><span class="logging-reco-heading-icon" aria-hidden="true">${loggingFeatureIcon("warning")}</span><h3>Recommandations prioritaires</h3><span class="logging-reco-count">2</span></header>
          <div class="logging-reco-list">
            ${loggingRecommendation("watch", "REDO LOG non multiplexés", "Surveillance", "Chaque groupe REDO n'a qu'une seule copie (1 membre). En cas de perte du disque contenant les fichiers REDO, les transactions en cours seront perdues et la base pourrait nécessiter une restauration complète.", "Ajouter un membre à chaque groupe REDO sur un disque séparé", "Gain potentiel sur le score journalisation : +5%")}
            ${loggingRecommendation("optimize", "Optimiser la rétention UNDO", "Optimisation", `La rétention UNDO est de ${undoRetentionDetail}. Cible recommandée : ≥1800s (30min) pour éviter ORA-01555 sur les requêtes longues.`, "Augmenter UNDO_RETENTION à 1800 secondes (30 minutes)", "Gain potentiel sur le score journalisation : +5%")}
          </div>
        </section>
      </section>`;
      const archiveIcon = name => {
        const paths = {
          destination:'<ellipse cx="12" cy="5" rx="8" ry="3"></ellipse><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"></path><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"></path>',
          space:'<circle cx="12" cy="12" r="9"></circle><path d="m8.5 12 2.3 2.3 4.7-4.8"></path>',
          clock:'<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
          files:'<path d="M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"></path><path d="M6 8V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"></path><path d="M9 13h6"></path>',
          average:'<path d="M4 20V10"></path><path d="M10 20V4"></path><path d="M16 20v-7"></path><path d="M22 20H2"></path>',
          estimate:'<path d="M3 17 9 11l4 4 8-8"></path><path d="M15 7h6v6"></path>'
        };
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
      };
      const archiveStatus = live ? (archOk ? "Active" : "Inactive") : "Active";
      const archiveDestination = live ? "—" : "FRA";
      const archivePathNote = live ? "Chemin non collecté" : "Emplacement par défaut Oracle";
      const archiveSpacePct = live ? "—" : "0%";
      const archiveSpaceWidth = live ? 0 : 0;
      const archiveFree = live ? "—" : "0 B";
      const archiveTotal = live ? "—" : "0 B";
      const archiveLastSwitch = live ? "—" : "17h 59min";
      const archiveFiles = live ? "—" : "28 fichiers";
      const archiveAverage = live ? "—" : "149 MB";
      const archiveEstimate = live ? "—" : "4.07 GB";
      const archiveCapabilities = archOk
        ? [["Sauvegarde à chaud", "backup"], ["Récupération point-in-time", "pitr"]]
        : [["Sauvegarde à froid uniquement", "backup"]];
      const loggingArchive = `<section class="logging-archive" aria-label="Configuration ARCHIVELOG">
        <header class="logging-archive-banner">
          <div class="logging-archive-banner-head"><h3>Configuration ARCHIVELOG</h3><span class="logging-archive-status"><i aria-hidden="true"></i>${esc(archiveStatus)}</span></div>
          <p>${archOk ? "Protection complète — Sauvegarde à chaud et récupération point-in-time disponibles" : "Mode ARCHIVELOG inactif — La récupération à un instant donné n'est pas disponible"}</p>
        </header>
        <section class="logging-archive-card">
          <div class="logging-archive-row logging-archive-destination"><div class="logging-archive-row-label"><span class="logging-archive-row-icon blue" aria-hidden="true">${archiveIcon("destination")}</span><span>Destination</span></div><span class="logging-archive-chip">${esc(archiveDestination)}</span></div>
          <div class="logging-archive-path"><strong>Chemin de destination</strong><small>${esc(archivePathNote)}</small></div>
          <div class="logging-archive-space">
            <div class="logging-archive-space-head"><div class="logging-archive-row-label"><span class="logging-archive-row-icon green" aria-hidden="true">${archiveIcon("space")}</span><span>Espace suffisant</span></div><strong>${esc(archiveSpacePct)}</strong></div>
            <div class="logging-archive-progress" aria-hidden="true"><span style="width:${archiveSpaceWidth}%"></span></div>
            <div class="logging-archive-space-foot"><span>Espace libre: ${esc(archiveFree)}</span><span>Espace total: ${esc(archiveTotal)}</span></div>
          </div>
          <div class="logging-archive-divider" aria-hidden="true"></div>
          <h4 class="logging-archive-activity-title"><span aria-hidden="true">${archiveIcon("clock")}</span>Activité d'archivage</h4>
          <div class="logging-archive-activity">
            <div class="logging-archive-activity-row"><div class="logging-archive-activity-label"><span class="logging-archive-activity-icon orange" aria-hidden="true">${archiveIcon("clock")}</span><span>Dernier basculement</span></div><strong>${esc(archiveLastSwitch)}</strong></div>
            <div class="logging-archive-activity-row"><div class="logging-archive-activity-label"><span class="logging-archive-activity-icon blue" aria-hidden="true">${archiveIcon("files")}</span><span>Archives sur disque</span></div><strong>${esc(archiveFiles)}</strong></div>
            <div class="logging-archive-activity-row"><div class="logging-archive-activity-label"><span class="logging-archive-activity-icon green" aria-hidden="true">${archiveIcon("average")}</span><span>Taille moyenne</span></div><strong>${esc(archiveAverage)}</strong></div>
            <div class="logging-archive-activity-row highlighted"><div class="logging-archive-activity-label"><span class="logging-archive-activity-icon purple" aria-hidden="true">${archiveIcon("estimate")}</span><span>Estimé/jour</span></div><strong>${esc(archiveEstimate)}</strong></div>
          </div>
        </section>
        <div class="logging-archive-capabilities"><span>Capacités actives :</span>${archiveCapabilities.map(([label, icon]) => `<span class="logging-archive-capability">${loggingFeatureIcon(icon)}${esc(label)}</span>`).join("")}</div>
      </section>`;
      const redoGroupCount = live ? (String(redoValue).match(/\d+/)?.[0] || "—") : "3";
      const redoGroupCountLabel = `${redoGroupCount} ${redoGroupCount === "1" ? "groupe" : "groupes"}`;
      const redoTotalSize = live ? redoSize : "600 MB";
      const redoGroupSize = live ? "—" : "200 MB";
      const redoMultiplexLabel = live ? "—" : "non multiplexé";
      const redoPhysicalFiles = live ? "—" : "3";
      const redoFrequency = live ? "—" : "0.1/h";
      const redoSwitchRate = live ? "—" : "0.1 switch/h";
      const redoImpact = live ? "—" : "Faible impact";
      const redoStatus = live ? (redoOk ? "Optimal" : "Attention") : "Optimal";
      const redoStatusClass = live ? (redoOk ? "normal" : "critical") : "normal";
      const redoSubtitle = live
        ? (redoOk ? "Groupes REDO configurés — Détail du multiplexage non collecté" : "Aucun groupe REDO détecté — Vérifier la configuration")
        : "Groupes suffisants mais non multiplexés — Risque en cas de panne disque";
      const redoParsedGroups = Number.parseInt(String(redoValue).replace(/\D/g, ""), 10);
      const redoGroupRows = live
        ? Array.from({ length: Math.max(1, Number.isFinite(redoParsedGroups) ? redoParsedGroups : 1) }, (_, index) => ({
            index: index + 1,
            name: `Groupe #${index + 1}`,
            path: "—",
            size: "—",
            state: "Non collecté",
            flag: "(—)",
            tone: "inactive",
          }))
        : [
            { index: 1, name: "Groupe #1", path: "/opt/oracle/oradata/FREE/redo01.log", size: "200 MB", state: "En attente", flag: "(INACTIVE)", tone: "inactive" },
            { index: 2, name: "Groupe #2", path: "/opt/oracle/oradata/FREE/redo02.log", size: "200 MB", state: "En attente", flag: "(INACTIVE)", tone: "inactive" },
            { index: 3, name: "Groupe #3", path: "/opt/oracle/oradata/FREE/redo03.log", size: "200 MB", state: "En cours", flag: "(CURRENT)", tone: "current" },
          ];
      const redoCheckIcon = `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 6 2.5 2.5L10 3"></path></svg>`;
      const loggingRedo = `<section class="logging-redo" aria-label="Configuration REDO LOG">
        <header class="logging-archive-banner">
          <div class="logging-archive-banner-head"><h3>Configuration REDO LOG</h3><span class="logging-archive-status ${redoStatusClass === "normal" ? "" : "critical"}"><i aria-hidden="true"></i>${esc(redoStatus)}</span></div>
          <p>${esc(redoSubtitle)}</p>
        </header>
        <section class="logging-redo-card logging-redo-config">
          <div class="logging-redo-row structure"><span class="logging-redo-row-label"><span class="logging-redo-row-icon" aria-hidden="true">${archiveIcon("destination")}</span>Structure</span><strong>${esc(redoGroupCountLabel)}</strong></div>
          <div class="logging-redo-row">Taille totale<strong>${esc(redoTotalSize)}</strong></div>
          <div class="logging-redo-row">Taille par groupe<strong>${esc(redoGroupSize)}</strong></div>
          <div class="logging-redo-row">Multiplexage<strong>${esc(redoMultiplexLabel)}</strong></div>
          <div class="logging-redo-row">Fichiers physiques<strong>${esc(redoPhysicalFiles)}</strong></div>
          <div class="logging-redo-warning">Sans multiplexage, une panne disque peut provoquer la perte des journaux de transactions actifs</div>
        </section>
        <section class="logging-redo-card logging-redo-activity">
          <header class="logging-redo-activity-head"><h4>Activité</h4><strong>${esc(redoFrequency)}</strong></header>
          <div class="logging-redo-activity-row"><span>Fréquence de commutation (24h glissantes)</span><strong>${esc(redoSwitchRate)}</strong></div>
          <div class="logging-redo-activity-row"><span>Cible recommandée</span><strong>&lt; 4/h</strong></div>
          <div class="logging-redo-activity-row"><span>Impact performance</span><strong>${esc(redoImpact)}</strong></div>
        </section>
        <section class="logging-redo-card logging-redo-groups">
          <header class="logging-redo-groups-head">
            <div><h4>Détail des groupes REDO</h4><p>Chaque groupe contient un ou plusieurs membres (copies physiques). Oracle écrit simultanément dans tous les membres d'un groupe pour le multiplexage.</p></div>
            <span class="logging-redo-group-count">${esc(redoGroupCountLabel)}</span>
          </header>
          <div class="logging-redo-group-list">
            ${redoGroupRows.map(row => `<article class="logging-redo-group ${row.tone === "current" ? "current" : ""}">
              <span class="logging-redo-group-index">${row.index}</span>
              <div class="logging-redo-group-copy"><strong>${esc(row.name)}</strong><span>${esc(row.path)}</span></div>
              <div class="logging-redo-group-meta"><span class="logging-redo-group-size">${esc(row.size)}</span><span class="logging-redo-group-status">${esc(row.state)}</span><span class="logging-redo-group-flag">${esc(row.flag)}</span></div>
            </article>`).join("")}
          </div>
        </section>
        <section class="logging-redo-optimal">
          <h4><span aria-hidden="true">${loggingFeatureIcon("check")}</span>Votre configuration est optimale</h4>
          <ul>
            <li>${redoCheckIcon}Maintenez cette configuration - elle protège efficacement vos données</li>
            <li>${redoCheckIcon}Surveillez l'évolution de l'activité dans le temps</li>
            <li>${redoCheckIcon}Vérifiez que les membres de chaque groupe restent sur des disques distincts</li>
          </ul>
        </section>
        <section class="logging-redo-reco-section">
          <h3 class="logging-redo-reco-label">Recommandations</h3>
          <article class="logging-redo-reco">
            <div class="logging-redo-reco-head"><span class="logging-redo-reco-icon" aria-hidden="true">${loggingFeatureIcon("warning")}</span><strong>REDO LOG non multiplexés</strong><span class="logging-redo-reco-badge">Surveillance</span></div>
            <div class="logging-redo-reco-body">
              <p>Chaque groupe REDO n'a qu'une seule copie (1 membre). En cas de perte du disque contenant les fichiers REDO, les transactions en cours seront perdues et la base pourrait nécessiter une restauration complète.</p>
              <div class="logging-redo-reco-action">→ Ajouter un membre à chaque groupe REDO sur un disque séparé</div>
              <footer class="logging-redo-reco-footer"><span>Gain potentiel : +5%</span><button type="button" class="logging-reco-link" data-action="logging-script">${loggingFeatureIcon("code")}<span>Voir le script SQL</span></button></footer>
            </div>
          </article>
        </section>
      </section>`;
      const undoNumber = label => {
        const raw = String(metricValue(label));
        return /^\d+$/.test(raw) ? Number(raw) : null;
      };
      const undoText = (label, demo) => {
        const raw = live ? String(metricValue(label)) : demo;
        return raw === "" ? "—" : raw;
      };
      const undoBytes = (bytes, demo) => {
        if (bytes === null) return live ? "—" : demo;
        const units = [["TB", 1024 ** 4], ["GB", 1024 ** 3], ["MB", 1024 ** 2], ["KB", 1024]];
        for (const [unit, size] of units) {
          if (bytes >= size) {
            const value = bytes / size;
            return `${Number.isInteger(value) || value >= 100 ? Math.round(value) : value.toFixed(1)} ${unit}`;
          }
        }
        return `${Math.round(bytes)} B`;
      };
      const undoTablespace = undoText("Tablespace UNDO", "UNDOTBS1");
      const undoUsedValue = live ? undoNumber("Espace UNDO utilisé") : 34 * 1024 ** 2;
      const undoTotalValue = live ? undoNumber("Espace UNDO total") : 210 * 1024 ** 2;
      const undoMaxValue = live ? undoNumber("Capacité max UNDO") : 32 * 1024 ** 4;
      const undoMode = undoText("Mode gestion UNDO", "AUTO");
      const undoFileCount = undoText("Fichiers UNDO", "1");
      const undoSegments = undoText("Segments UNDO actifs", "10");
      const undoAutoextendRaw = undoText("Autoextend UNDO", "OUI");
      const undoPath = undoText("Chemin UNDO", "/opt/oracle/oradata/FREE/FREEPDB1/undotbs01.dbf");
      const undoSaturationErrors = live ? undoNumber("Erreurs saturation UNDO") : 0;
      const undoCapacity = undoMaxValue && undoMaxValue > 0 ? undoMaxValue : undoTotalValue;
      const undoUsedPct = undoUsedValue !== null && undoCapacity ? Math.min(100, undoUsedValue / undoCapacity * 100) : null;
      const undoPctLabel = undoUsedPct === null ? "—" : undoUsedPct < 0.1 ? "<0.1%" : `${undoUsedPct.toFixed(1)}%`;
      const undoSpaceTone = undoUsedPct === null ? "ok" : undoUsedPct >= 90 ? "critical" : undoUsedPct >= 75 ? "warn" : "ok";
      const undoSpaceLabel = undoUsedPct === null ? "Espace non collecté" : undoSpaceTone === "critical" ? "Espace critique" : undoSpaceTone === "warn" ? "Espace à surveiller" : "Espace sain";
      const undoBarWidth = undoUsedPct === null ? 0 : Math.max(undoUsedPct, 2);
      const undoRetentionSeconds = live ? undoSeconds : 900;
      const undoRetentionMinutes = `${Math.round(undoRetentionSeconds / 60)}min`;
      const undoRetentionOk = undoRetentionSeconds >= 1800;
      const undoRetentionLabel = undoRetentionSeconds > 0 ? `${Math.round(undoRetentionSeconds)}s (${undoRetentionMinutes})` : "—";
      const undoAutoOn = undoAutoextendRaw === "OUI";
      const undoSaturationTone = undoSaturationErrors === null ? "warn" : undoSaturationErrors > 0 ? "critical" : "ok";

      const undoRow = (label, value) => `<div class="logging-undo-row"><span>${esc(label)}</span><strong>${value}</strong></div>`;
      const undoConfigItem = (tone, title, text, trailing, note = "") => `<div class="logging-undo-item ${tone}"><div class="logging-undo-item-copy"><strong>${esc(title)}</strong><p>${esc(text)}</p>${note ? `<small>${esc(note)}</small>` : ""}</div>${trailing}</div>`;
      const loggingUndoStatus = undoRetentionOk ? "Optimal" : "Surveiller";
      const loggingUndoBanner = `<header class="logging-undo-banner ${undoRetentionOk ? "ok" : ""}">
          <div class="logging-undo-banner-head">
            <div class="logging-undo-banner-title"><span aria-hidden="true">${loggingIcons.undo}</span><h3>Configuration UNDO</h3></div>
            <div class="logging-undo-badges"><span class="logging-undo-badge">${loggingUndoStatus}</span><span class="logging-undo-badge plain">${esc(undoRetentionMinutes)}</span></div>
          </div>
          <p>${undoRetentionOk ? "Rétention conforme" : "Rétention standard"} — Cible recommandée: ≥30 minutes pour protéger les requêtes longues (ORA-01555)</p>
        </header>`;
      const loggingUndoTablespace = `<section class="logging-undo-card logging-undo-tablespace">
          <div class="logging-undo-card-head"><div class="logging-undo-card-title"><span aria-hidden="true">${loggingFeatureIcon("layers")}</span>État du tablespace</div><span class="logging-undo-chip">${esc(undoTablespace)}</span></div>
          <div class="logging-undo-space">
            <div class="logging-undo-space-head ${undoSpaceTone}"><span>${undoSpaceLabel}</span><span>${undoPctLabel}</span></div>
            <div class="logging-undo-progress ${undoSpaceTone}" aria-hidden="true"><span style="width:${undoBarWidth}%"></span></div>
            <div class="logging-undo-space-foot"><span>Utilisé: ${undoBytes(undoUsedValue, "—")}</span><span>Total: ${undoBytes(undoTotalValue, "—")}</span><span>Capacité max (autoextend): ${undoBytes(undoMaxValue, "—")}</span></div>
          </div>
          <div class="logging-undo-rows">
            ${undoRow("Nombre de fichiers", esc(undoFileCount))}
            ${undoRow("Mode de gestion", `<span class="logging-undo-chip">${esc(undoMode)}</span>`)}
            ${undoRow("Segments actifs", esc(undoSegments))}
          </div>
          <div class="logging-undo-path">Emplacement des fichiers de données<code>${esc(undoPath)}</code></div>
        </section>`;
      const undoMaxLabel = undoBytes(undoMaxValue, "—");
      const undoSaturationText = undoSaturationErrors === null
        ? "Statistiques V$UNDOSTAT non collectées"
        : undoSaturationErrors > 0
          ? `${undoSaturationErrors} erreur(s) de saturation observée(s) sur les dernières 24 h`
          : "Aucune erreur de saturation observée sur les dernières 24 h";
      const loggingUndoConfig = `<section class="logging-undo-card logging-undo-config">
          <h4 class="logging-undo-config-title"><span aria-hidden="true">${loggingFeatureIcon("check")}</span>Configuration &amp; Sécurité</h4>
          ${undoConfigItem(undoRetentionOk ? "ok" : "warn", "Politique de rétention", undoRetentionOk ? "Conforme — Requêtes longues protégées" : "Standard — Augmenter à ≥1800s pour les requêtes longues", `<span class="logging-undo-item-value">${esc(undoRetentionLabel)}</span>`, "Cible recommandée : ≥1800s (30min)")}
          ${undoConfigItem(undoAutoOn ? "ok" : "warn", "Extension automatique", undoAutoOn ? "Croissance automatique en cas de besoin" : "Autoextend non actif sur tous les fichiers", `<span class="logging-undo-item-pill">${undoAutoOn ? "Active" : undoAutoextendRaw === "PARTIEL" ? "Partiel" : undoAutoextendRaw === "NON" ? "Désactivé" : "—"}</span>`, `Taille maximale: ${undoMaxLabel}`)}
          ${undoConfigItem(undoSaturationTone, "Risque saturation UNDO (ORA-30036)", undoSaturationText, `<span class="logging-undo-item-pill">${undoSaturationErrors === null ? "Inconnu" : undoSaturationErrors > 0 ? "Risque" : "Aucun risque"}</span>`)}
        </section>`;
      const loggingUndoReco = undoRetentionOk
        ? ""
        : `<section class="logging-undo-reco-section"><h4 class="logging-undo-reco-label">Recommandations</h4>${loggingRecommendation("optimize", "Optimiser la rétention UNDO", "Optimisation", `La rétention UNDO est de ${undoRetentionLabel}. Cible recommandée : ≥1800s (30min) pour éviter ORA-01555 sur les requêtes longues.`, "Augmenter UNDO_RETENTION à 1800 secondes (30 minutes)", "Gain potentiel : +5%")}</section>`;
      const loggingUndo = `<section class="logging-undo" aria-label="Configuration UNDO">${loggingUndoBanner}${loggingUndoTablespace}${loggingUndoConfig}${loggingUndoReco}</section>`;

      const archFoot = live ? (archOk ? "Mode ARCHIVELOG correctement configuré" : "Mode journalisation à vérifier") : "Mode ARCHIVELOG correctement configuré";
      const redoFoot = live ? (redoSize !== "—" ? `${redoSize} · V$LOG` : "Taille cumulée indisponible") : "600 MB · non multiplexé";
      const undoFoot = live ? "V$PARAMETER · Cible: ≥30min" : "0% utilisé · 32 TB max · Autoextend · Cible: ≥30min";
      const archiveFoot = live ? "Espace FRA non collecté" : "0 B libre · FRA";
      return `<div class="domain-body logging-page">
        <section class="performance-dashboard logging-dashboard">
          <div class="performance-dashboard-accent logging-dashboard-accent"></div>
          <div class="performance-dashboard-inner">
            <header class="performance-dashboard-header">
              <div class="performance-title"><span class="performance-title-icon logging-title-icon" aria-hidden="true">▤</span><div><h2>Journalisation Oracle</h2><p>Analyse détaillée des mécanismes de journalisation et résilience</p></div></div>
              <div class="performance-toolbar logging-toolbar"><div class="performance-score logging-score"><small>Score de Journalisation <span aria-hidden="true">ⓘ</span></small><strong>${live ? "—" : esc(config.score)}</strong>${live ? `<span class="performance-score-note">Non calculé</span>` : ""}</div>${btn("▤　CSV","export","btn performance-export logging-export csv")}${btn("▤　PDF","export","btn performance-export logging-export pdf")}<button class="btn icon-btn performance-refresh" data-action="refresh-domain" aria-label="Actualiser les données">⟳</button></div>
            </header>
            <div class="logging-metrics">${loggingCard("mode", "Mode Archivelog", archValue, archFoot, ...statuses.mode, "peach")}${loggingCard("redo", "Groupes REDO", redoValue, redoFoot, ...statuses.redo, "green")}${loggingCard("undo", "Rétention UNDO", undoValue, undoFoot, ...statuses.undo, "yellow")}${loggingCard("archive", "Espace Archive", archiveValue, archiveFoot, ...statuses.archive, "green")}</div>
          </div>
        </section>
        ${renderDomainTabs(config.tabs)}
        ${state.domainTab === "Vue d'ensemble" ? `${loggingOverview}${backendNotice()}` : state.domainTab === "ARCHIVELOG" ? `${loggingArchive}${backendNotice()}` : state.domainTab === "REDO LOG" ? `${loggingRedo}${backendNotice()}` : state.domainTab === "UNDO" ? `${loggingUndo}${backendNotice()}` : `${backendNotice()}${details}`}
        <div class="footer-note">Deynao — Supervision et diagnostic Oracle · ${state.oracleConnected ? "Mesures Oracle réelles · score Deynao calculé" : "Données de démonstration locales"}</div>
      </div>`;
    }
    return `<div class="domain-body"><div class="row between" style="margin-bottom:17px"><div><h2><span class="heading-icon">${domains.find(d=>d[0]===key)?.[2]||"▤"}</span>${esc(config.title)}</h2><p class="subtitle">${esc(config.intro)}</p></div><div class="toolbar">${badge(state.oracleConnected?`Score : ${config.score}`:key==="recommendations"?`Total items : ${config.score}`:`Score : ${config.score}`,state.oracleConnected?"blue":key==="backups"||key==="security"||key==="logging"?"amber":"orange")}${btn("CSV","export","btn small-btn")}${btn("PDF","export","btn small-btn")}</div></div>
      ${backendNotice()}
      <div class="grid grid-4" style="margin-bottom:18px">${cards || (state.oracleConnected ? card(`<div class="empty"><p>${state.oracleDomainError ? "Les indicateurs ne sont pas disponibles pour cette collecte." : "Collecte Oracle en cours…"}</p></div>`) : "")}</div>
      ${details}${renderDomainTabs(config.tabs)}<div class="footer-note">Deynao — Supervision et diagnostic Oracle · ${state.oracleConnected ? "Mesures Oracle réelles · score Deynao calculé" : "Données de démonstration locales"}</div></div>`;
  }
  function renderOverview() {
    const quickItems = [
      ["performance", "Performance", "⌁", "85%", "Mémoire et requêtes efficaces", "green"],
      ["capacity", "Capacité", "▱", "100%", "1 tablespace à surveiller", "green"],
      ["backups", "Sauvegardes", "⬡", "36%", "Sauvegarde des archive logs manquante — RPO compromis", "red"],
      ["security", "Sécurité", "⬡", "65%", "Quelques contrôles à vérifier", "amber"],
      ["logging", "Journalisation", "▤", "75%", "Configuration à vérifier", "amber"],
      ["oracle-alerts", "Alertes", "⚠", "97%", "4 alertes sur 24h", "green"],
      ["objects", "Objets", "⬡", "85%", "Inventaire d'objets sain", "green"],
      ["locks", "Verrous", "♙", "100%", "Aucun verrou bloquant", "green"],
      ["jobs", "Jobs", "▦", "100%", "Aucun job en échec", "green"],
      ["waits", "Attentes", "◷", "100%", "Attentes Oracle sous contrôle", "green"],
      ["files", "Fichiers", "▱", "85%", "Fichiers Oracle sains", "green"],
      ["processes", "Processus", "▧", "100%", "Processus Oracle stables", "green"],
      ["recommendations", "Recommandations", "↗", "", "Plan d'action — 18 items, 6 à planifier", "amber"],
      ["licenses", "Licences", "⚖", "", "Vue d'exposition licence disponible", "orange"]
    ];
    const overviewMetrics = state.oracleOverviewData?.metrics || [];
    const metricValue = label => overviewMetrics.find(metric => metric.label === label)?.value;
    const sessions = metricValue("Sessions");
    const [activeSessions, totalSessions] = sessions ? String(sessions).split("/").map(value => value.trim()) : [];
    const tablespacesMetric = overviewMetrics.find(metric => metric.label === "Tablespaces");
    const maxTablespaceUsage = tablespacesMetric?.foot?.match(/([\d.]+)%/)?.[1];
    const tablespaceUsage = state.oracleConnected ? maxTablespaceUsage : "99.0";
    const actionButton = (label, priority) =>
      `<button class="overview-action ${priority}" data-route="/supervision/recommendations"><span>→</span><span class="overview-action-label">${label}</span></button>`;
    return `<div class="overview-page">
      <div class="overview-toolbar">${btn(`${uiIcon("fileText", "overview-export-icon")}<span>Exporter en PDF</span>`, "export", "btn subtle", 'title="Exporter la vue d\'ensemble en PDF" aria-label="Exporter la vue d\'ensemble en PDF"')}</div>
      <section class="overview-summary">
        <div class="overview-summary-heading">${uiIcon("shieldCheck", "overview-section-icon")}<h2 class="overview-eyebrow">Synthèse exécutive</h2></div>
        <div class="overview-posture">
          <div class="overview-shield">${uiIcon("shieldCheck", "overview-posture-icon")}</div>
          <div class="overview-posture-content">
            <div class="overview-posture-heading"><span>Posture globale</span><strong>Attention</strong></div>
            <p>Plusieurs domaines méritent attention. 0 action immédiate et 6 prioritaires identifiées.</p>
            <div class="overview-plan">
              <div><span>Plan d'action complet</span><span>18 au total</span></div>
              <div class="overview-priority-pills">
                <button data-route="/supervision/recommendations"><i class="red"></i><span class="overview-priority-count">0</span><span class="overview-priority-label">Immédiate</span></button>
                <button data-route="/supervision/recommendations"><i class="orange"></i><span class="overview-priority-count">6</span><span class="overview-priority-label">Prioritaire</span></button>
                <button data-route="/supervision/recommendations"><i class="amber"></i><span class="overview-priority-count">6</span><span class="overview-priority-label">Surveillance</span></button>
                <button data-route="/supervision/recommendations"><i class="blue"></i><span class="overview-priority-count">6</span><span class="overview-priority-label">Optimisation</span></button>
              </div>
            </div>
          </div>
        </div>
        <div class="overview-health">
          <article class="overview-health-card good"><div class="overview-health-label">${uiIcon("shieldCheck", "overview-health-icon")}<span>Disponibilité</span></div><strong>Opérationnelle</strong><small>Disponibilité : 1h 20min</small></article>
          <article class="overview-health-card good"><div class="overview-health-label">${uiIcon("gauge", "overview-health-icon")}<span>Performance opérationnelle</span></div><strong>85% — Excellent</strong><small>Mémoire et temps de réponse satisfaisants</small></article>
          <article class="overview-health-card good"><div class="overview-health-label">${uiIcon("trendingDown", "overview-health-icon")}<span>Niveau de risque</span></div><strong>Faible</strong><small>0 actions immédiates, 6 prioritaires</small></article>
        </div>
        <div class="overview-insights">
          <div class="overview-list">
            <h3 class="overview-eyebrow">${uiIcon("triangleAlert", "overview-insight-icon")}Points d'attention</h3>
            <div class="overview-list-items">
              <div class="overview-notice critical"><i></i><span>Sauvegardes (36%) — Sauvegardes à auditer</span></div>
              <div class="overview-notice warning"><i></i><span>Sécurité (65%) — Audits et privilèges à vérifier</span></div>
              <div class="overview-notice warning"><i></i><span>Journalisation (75%) — Mode journalisation à vérifier</span></div>
            </div>
            <button class="overview-link" data-route="/supervision/recommendations">Voir toutes les recommandations${uiIcon("chevronRight", "overview-link-chevron")}</button>
          </div>
          <div class="overview-list">
            <h3 class="overview-eyebrow">${uiIcon("activity", "overview-insight-icon")}Actions recommandées</h3>
            <div class="overview-list-items">
              ${actionButton("Auditer la stratégie de sauvegarde (Sauvegardes).", "critical")}
              ${actionButton("Auditer avant action les contrôles de sécurité (Sécurité).", "warning")}
              ${actionButton("Vérifier la configuration de journalisation (Journalisation).", "warning")}
            </div>
          </div>
        </div>
      </section>
      <section class="overview-quick">
        <div class="overview-quick-heading">${uiIcon("layoutGrid", "overview-section-icon")}<h2>Accès rapide aux 14 domaines de supervision</h2><p>— cliquez pour ouvrir la vue détaillée</p></div>
        <div class="overview-quick-grid">${quickItems.map(([key,name,,score,description,tone]) =>
          `<button class="overview-quick-card ${tone}" data-route="/supervision/${key}">
            <span class="overview-quick-inner">
              <i class="overview-quick-dot"></i>
              <span class="overview-quick-content">
                <span class="overview-quick-title"><span class="overview-quick-icon">${iconSvg(domainIconMarkup[key])}</span><b>${name}</b><small>${score}</small></span>
                <small class="overview-quick-description">${description}</small>
              </span>
              ${uiIcon("chevronRight", "overview-quick-chevron")}
            </span>
          </button>`).join("")}</div>
      </section>
      <section class="overview-widgets" aria-label="État opérationnel">
        <article class="overview-widget">
          <div class="overview-widget-heading">${uiIcon("hardDrive", "overview-widget-icon")}<h3>Tablespaces à surveiller</h3></div>
          <div class="overview-widget-body">
            ${tablespaceUsage
              ? `<div class="overview-tablespace">
                  <div class="row between"><b>${state.oracleConnected ? "Utilisation maximale" : "SYSTEM"}</b><strong>${esc(tablespaceUsage)}%</strong></div>
                  <div class="progress amber"><span style="width:${Math.min(Number(tablespaceUsage), 100)}%"></span></div>
                  <div class="overview-tablespace-info"><p>${state.oracleConnected ? `${esc(tablespacesMetric?.value || "—")} tablespaces · utilisation physique maximale` : "Surveillance recommandée"}</p>${uiIcon("info", "overview-tablespace-info-icon")}</div>
                  <p class="overview-tablespace-foot">${state.oracleConnected ? "Marge disponible · surveiller la croissance" : "Marge : 32767.6 GB · Autoextend actif"}</p>
                </div>`
              : `<div class="overview-widget-empty">Les données des tablespaces ne sont pas disponibles pour cette collecte.</div>`}
            <button class="overview-widget-link" data-route="/supervision/capacity">Voir détail Capacité${uiIcon("chevronRight", "overview-widget-chevron")}</button>
          </div>
        </article>
        <article class="overview-widget">
          <div class="overview-widget-heading">${uiIcon("server", "overview-widget-icon")}<h3>Sessions utilisateur Oracle</h3></div>
          <div class="overview-widget-body">
            <div class="overview-status">
              ${state.oracleConnected && sessions
                ? `${Number(activeSessions) ? uiIcon("circleAlert", "overview-status-svg warning") : uiIcon("circleCheck", "overview-status-svg")}<p>${esc(activeSessions)} session${Number(activeSessions) === 1 ? "" : "s"} active${Number(activeSessions) === 1 ? "" : "s"} détectée${Number(activeSessions) === 1 ? "" : "s"} sur ${esc(totalSessions || "—")}</p>`
                : state.oracleConnected
                  ? `${uiIcon("info", "overview-status-svg unavailable")}<p>Les sessions utilisateur ne sont pas disponibles pour cette collecte.</p>`
                  : `${uiIcon("circleCheck", "overview-status-svg")}<p>Aucune session active détectée</p>`}
            </div>
            <button class="overview-widget-link" data-route="/supervision/performance">Voir détail Performance${uiIcon("chevronRight", "overview-widget-chevron")}</button>
          </div>
        </article>
        <article class="overview-widget">
          <div class="overview-widget-heading">${uiIcon("circleAlert", "overview-widget-icon")}<h3>Alertes critiques 24h<button class="overview-info" title="État des alertes Oracle des dernières 24 heures" aria-label="Information sur les alertes">${uiIcon("info", "overview-info-icon")}</button></h3></div>
          <div class="overview-widget-body">
            <div class="overview-status">
              ${state.oracleConnected
                ? `${uiIcon("info", "overview-status-svg unavailable")}<p>La synthèse des alertes 24h est disponible dans le domaine Alertes Oracle.</p>`
                : `${uiIcon("circleCheck", "overview-status-svg")}<p>Aucune alerte critique sur les dernières 24h</p>`}
            </div>
            <button class="overview-widget-link" data-route="/supervision/oracle-alerts">Voir le dashboard des alertes${uiIcon("chevronRight", "overview-widget-chevron")}</button>
          </div>
        </article>
      </section>
      <section class="overview-priority-help">
        <div class="overview-priority-inner"><div class="overview-priority-row">
          <button class="overview-priority-toggle" data-action="toggle-guide" aria-expanded="${state.guideOpen}">${uiIcon("lightbulb", "overview-priority-icon")}<span>Que regarder en priorité ?</span></button>
          <button class="overview-help-link" data-action="toggle-guide" aria-expanded="${state.guideOpen}">${state.guideOpen ? "Masquer" : "Voir l'aide"}${uiIcon(state.guideOpen ? "chevronUp" : "chevronDown", "overview-help-chevron")}</button>
        </div></div>
        ${state.guideOpen ? `<ul class="overview-priority-content">
          <li><strong>Le score de santé global</strong> (en haut à droite) donne une lecture rapide de l'état général. Cliquez sur le score pour voir le détail du calcul.</li>
          <li><strong>Les indicateurs vitaux</strong> (Disponibilité, Performance, Niveau de risque) résument l'état opérationnel en 3 chiffres clés.</li>
          <li><strong>Les points d'attention</strong> listent ce qui mérite surveillance — il ne s'agit pas systématiquement d'urgences.</li>
          <li><strong>Une action « Immédiate »</strong> peut concerner une configuration Oracle critique (ex. : sauvegarde DR, autobackup controlfile) à corriger rapidement, sans nécessairement bloquer le fonctionnement actuel de la base.</li>
          <li><strong>Le domaine Recommandations</strong> centralise le plan d'action complet — actions immédiates, prioritaires, avec effort estimé et impact attendu.</li>
          <li><strong>L'accès rapide aux 14 domaines</strong> permet d'explorer chaque thème — cliquez sur une carte pour ouvrir la vue dédiée.</li>
        </ul>` : ""}
      </section>
      <footer class="overview-footer">Score calculé sur 12 domaines pondérés<span class="overview-footer-separator">·</span><span class="overview-footer-brand">Deynao — Supervision et diagnostic Oracle</span></footer>
    </div>`;
  }
  function renderCapacity(config) {
    const connected = state.oracleConnected;
    const liveData = state.oracleDomainData?.domain === "capacity" ? state.oracleDomainData : null;
    const demoSpaces = [
      { name:"SYSTEM", used_percent:99.04, used:"366.44 MB", allocated:"370.00 MB", used_bytes:384237527, allocated_bytes:387973120, autoextend:true, autoextend_available_bytes:32767.64 * 1024 ** 3, type:"PERMANENT" },
      { name:"TEMP", used_percent:99.72, used:"17.08 GB", allocated:"17.13 GB", used_bytes:18325377679, allocated_bytes:18379049369, autoextend:true, autoextend_available_bytes:14.92 * 1024 ** 3, type:"TEMPORARY" },
      { name:"SYSAUX", used_percent:70.64, used:"635.75 MB", allocated:"900.00 MB", used_bytes:666632192, allocated_bytes:943718400, autoextend:true, autoextend_available_bytes:32767.12 * 1024 ** 3, type:"PERMANENT" },
      { name:"UNDOTBS1", used_percent:12.98, used:"27.25 MB", allocated:"210.00 MB", used_bytes:28573696, allocated_bytes:220200960, autoextend:true, autoextend_available_bytes:32767.79 * 1024 ** 3, type:"PERMANENT" },
      { name:"USERS", used_percent:0, used:"0.00 MB", allocated:"100.00 MB", used_bytes:0, allocated_bytes:104857600, autoextend:true, autoextend_available_bytes:32767.90 * 1024 ** 3, type:"PERMANENT" }
    ];
    const spaces = liveData?.tablespaces || (connected ? [] : demoSpaces);
    const isDemo = !connected;
    const metricRows = liveData?.metrics || (connected ? null : config.metrics.map(([label,value,foot,tone]) => ({label,value,foot,tone})));
    const metricValues = new Map((metricRows || []).map(metric => [metric.label, metric]));
    const missingStatus = connected ? (state.oracleDomainError ? "Indisponible" : "Collecte…") : "Exemple local";
    const metricCards = [
      { label:"Tablespaces à surveiller", icon:"◉", fallback:"—", foot:"Seuil : 90 % · SYSTEM/SYSAUX : 85 %", tone:"amber" },
      { label:"Utilisation totale", icon:"▤", fallback:"—", foot:"Espace utilisé / alloué", tone:"blue" },
      { label:"Protection autoextend", icon:"↗", fallback:"—", foot:"Fichiers avec autoextend activé", tone:"green" },
      { label:"Espace libre", icon:"▱", fallback:"—", foot:"Capacité totale disponible", tone:"orange" }
    ].map(item => {
      const metric = metricValues.get(item.label);
      const stateLabel = isDemo ? "Exemple" : metric ? (metric.tone === "amber" ? "À surveiller" : "Mesure Oracle") : missingStatus;
      const stateTone = metric?.tone === "green" ? "green" : metric?.tone === "red" ? "red" : metric?.tone === "amber" ? "amber" : item.tone;
      return `<article class="capacity-kpi ${stateTone}"><div class="capacity-kpi-heading"><i aria-hidden="true">${item.icon}</i><span>${item.label}</span><span class="capacity-kpi-state">${esc(stateLabel)}</span></div><strong>${esc(metric?.value || item.fallback)}</strong><small>${esc(metric?.foot || (connected ? (state.oracleDomainError || "Mesure Oracle en cours de collecte.") : item.foot))}</small></article>`;
    }).join("");
    const thresholdFor = space => ["SYSTEM","SYSAUX"].includes(String(space.name).toUpperCase()) ? 85 : 90;
    const severity = space => {
      const percent = Number(space.used_percent) || 0;
      return percent >= thresholdFor(space) ? "critical" : percent >= 75 ? "warning" : "normal";
    };
    const watchedSpaces = spaces.filter(space => space.type !== "TEMPORARY" && severity(space) === "critical");
    const chartSpaces = [...spaces].sort((a,b) => (Number(b.used_percent) || 0) - (Number(a.used_percent) || 0)).slice(0,10);
    const chart = chartSpaces.length
      ? `<div class="capacity-chart"><div class="capacity-chart-axis" aria-hidden="true"><span class="capacity-chart-axis-title">Utilisation</span><span>100</span><span>25</span></div><div class="capacity-chart-bars">${chartSpaces.map(space => {
          const percent = Math.min(100, Math.max(0, Number(space.used_percent) || 0));
          const level = space.type === "TEMPORARY" ? "temporary" : severity(space) === "critical" ? (space.autoextend ? "watch" : "urgent") : severity(space) === "warning" ? "attention" : "normal";
          return `<div class="capacity-chart-column"><div class="capacity-chart-track"><span class="${level}" style="height:${Math.max(2, percent)}%" title="${esc(space.name)} : ${percent.toFixed(2)} %"></span></div><b title="${esc(space.name)}">${esc(space.name)}</b></div>`;
        }).join("")}</div></div>`
      : `<div class="capacity-empty">${state.oracleDomainError ? esc(state.oracleDomainError) : "Collecte des tablespaces en cours…"}</div>`;
    const renderSpaceGroup = (title, items, tone, icon = "", showHeader = true) => items.length
      ? `<section class="capacity-space-group ${tone}">${showHeader ? `<header><span class="capacity-space-group-icon" aria-hidden="true">${icon}</span><h3>${title}</h3><span class="capacity-group-count ${tone}">${items.length}</span></header>` : ""}<div class="capacity-space-grid">${items.map(space => {
          const percent = Math.min(100, Math.max(0, Number(space.used_percent) || 0));
          const level = severity(space);
          const toneClass = space.type === "TEMPORARY" ? "temporary" : level === "critical" ? "critical" : "normal";
          const warningState = space.type !== "TEMPORARY" && level === "critical";
          const percentLabel = percent === 0 ? "0" : percent.toFixed(2).replace(/\.?0+$/, "");
          return `<article class="capacity-space-card ${toneClass}"><div class="capacity-space-card-heading"><div class="capacity-space-identity"><strong>${esc(space.name)}</strong><span class="capacity-space-status ${space.autoextend ? "enabled" : "disabled"}">${space.autoextend ? "ϟ Extension auto" : "Extension auto désactivée"}</span></div><span class="capacity-space-state ${toneClass}" aria-label="${warningState ? "Utilisation élevée" : "État normal"}">${warningState ? "⚠" : "✓"}</span></div><div class="capacity-space-progress"><span class="${toneClass}" style="width:${percent}%"></span></div><div class="capacity-space-card-footer"><span>${percentLabel}% utilisés</span><span>${esc(space.used)}</span></div></article>`;
        }).join("")}</div></section>`
      : "";
    const watchedPermanent = spaces.filter(space => severity(space) === "critical" && space.type !== "TEMPORARY");
    const temporarySpaces = spaces.filter(space => space.type === "TEMPORARY");
    const otherSpaces = spaces.filter(space => severity(space) !== "critical" && space.type !== "TEMPORARY");
    const spaceGroups = spaces.length
      ? `${watchedPermanent.length ? `<div class="capacity-space-alert"><span aria-hidden="true">ⓘ</span>Tablespaces à surveiller (autoextend actif) (${watchedPermanent.filter(space => space.autoextend).length})</div>` : ""}${renderSpaceGroup("Tablespaces à surveiller", watchedPermanent, "critical", "ⓘ", false)}${renderSpaceGroup("Tablespaces Temporaires", temporarySpaces, "temporary", "▤")}${renderSpaceGroup("Autres tablespaces", otherSpaces, "normal")}`
      : `<div class="capacity-empty">${connected && !liveData ? (state.oracleDomainError ? esc(state.oracleDomainError) : "Collecte des tablespaces en cours…") : "Aucun tablespace n’a été retourné par Oracle."}</div>`;
    const filteredTableSpaces = spaces
      .filter(space => !state.capacityCriticalOnly || (space.type !== "TEMPORARY" && severity(space) === "critical"))
      .filter(space => !state.capacitySearch || `${space.name} ${space.type}`.toLocaleLowerCase().includes(state.capacitySearch.toLocaleLowerCase().trim()))
      .sort((a,b) => (Number(a.used_percent) - Number(b.used_percent)) * (state.capacitySortDescending ? -1 : 1));
    const allocatedTotal = spaces.reduce((total, space) => total + (Number(space.allocated_bytes) || 0), 0);
    const usedTotal = spaces.reduce((total, space) => total + (Number(space.used_bytes) || 0), 0);
    const detailsRows = filteredTableSpaces.map(space => {
      const percent = Math.min(100, Math.max(0, Number(space.used_percent) || 0));
      const level = space.type === "TEMPORARY" ? "temporary" : severity(space) === "critical" ? "critical" : severity(space) === "warning" ? "warning" : "normal";
      const label = space.type === "TEMPORARY" ? "Temporaire" : ["SYSTEM","SYSAUX"].includes(space.name.toUpperCase()) ? "Système" : "Utilisateur";
      const usedBytes = Number.isFinite(Number(space.used_bytes)) ? Number(space.used_bytes) : (Number(space.allocated_bytes) || 0) * percent / 100;
      const freeBytes = Math.max(0, (Number(space.allocated_bytes) || 0) - usedBytes);
      const autoextendCapacity = Number(space.autoextend_available_bytes) || 0;
      return `<tr><td><strong>${esc(space.name)}</strong></td><td><span class="capacity-type-pill ${level}">${label}</span></td><td><div class="capacity-table-usage"><span class="capacity-table-progress"><i class="${level}" style="width:${percent}%"></i></span><span class="${level}">${percent.toFixed(percent ? 2 : 0)}%</span></div></td><td>${esc(space.allocated || capacityFormatBytes(space.allocated_bytes))}</td><td>${esc(space.used || capacityFormatBytes(usedBytes))}</td><td>${capacityFormatBytes(freeBytes)}</td><td><span class="capacity-autoextend ${space.autoextend ? "enabled" : "disabled"}"><i aria-hidden="true">${space.autoextend ? "▣" : "—"}</i>${space.autoextend ? `<b>${capacityFormatBytes(autoextendCapacity)}</b>` : `<span>Désactivé</span>`}</span></td></tr>`;
    }).join("");
    const spaceDetailsSection = `<section class="capacity-details capacity-table-details"><header class="capacity-table-heading"><h2>Tous les tablespaces</h2><span class="capacity-table-count">${filteredTableSpaces.length} / ${spaces.length}</span><div class="capacity-table-tools"><label class="capacity-table-search"><span aria-hidden="true">⌕</span><input type="search" data-capacity-search placeholder="Rechercher" value="${esc(state.capacitySearch)}" aria-label="Rechercher un tablespace"></label><button class="capacity-critical-filter ${state.capacityCriticalOnly ? "active" : ""}" type="button" data-action="capacity-critical-toggle" aria-pressed="${state.capacityCriticalOnly}"><span aria-hidden="true">▽</span>Critiques uniquement<span class="capacity-switch" aria-hidden="true"></span></button></div></header><div class="table-wrap capacity-table-wrap"><table class="capacity-table"><thead><tr><th>Tablespace</th><th>Type</th><th><button type="button" data-action="capacity-sort" class="capacity-sort-button">Utilisation <span aria-hidden="true">${state.capacitySortDescending ? "⌄" : "⌃"}</span></button></th><th>Alloué</th><th>Utilisé</th><th>Libre</th><th>Extension auto</th></tr></thead><tbody>${detailsRows || `<tr><td class="capacity-table-empty" colspan="7">${spaces.length ? "Aucun résultat pour ces filtres." : connected && !liveData ? (state.oracleDomainError ? esc(state.oracleDomainError) : "Collecte des tablespaces en cours…") : "Aucun tablespace disponible."}</td></tr>`}</tbody><tfoot><tr><td colspan="3">Affichage de ${filteredTableSpaces.length} sur ${spaces.length} tablespaces</td><td colspan="4">Total alloué : ${capacityFormatBytes(allocatedTotal)} | Total utilisé : ${capacityFormatBytes(usedTotal)}</td></tr></tfoot></table></div></section>`;
    const spaceOverviewSection = `<section class="capacity-overview-spaces"><header class="capacity-overview-spaces-heading"><h2><span aria-hidden="true">▤</span>État des tablespaces</h2></header>${spaceGroups}</section>`;
    let tabContent;
    if (state.domainTab === "Détails 5") {
      tabContent = spaceDetailsSection;
    } else if (state.domainTab === "Analyse") {
      const analysisBytes = space => {
        const allocated = Math.max(0, Number(space.allocated_bytes) || 0);
        const used = Math.max(0, Number.isFinite(Number(space.used_bytes)) ? Number(space.used_bytes) : allocated * (Number(space.used_percent) || 0) / 100);
        return { allocated, used, percent: allocated ? Math.min(100, used / allocated * 100) : Math.min(100, Math.max(0, Number(space.used_percent) || 0)) };
      };
      const spaceGroups = [
        { name:"Espace système", spaces:spaces.filter(space => space.type === "TEMPORARY" || /^(SYSTEM|SYSAUX|UNDOTBS\d*)$/i.test(space.name)) },
        { name:"Espace utilisateur", spaces:spaces.filter(space => space.type === "USER" || !(/^(SYSTEM|SYSAUX|UNDOTBS\d*)$/i.test(space.name) || space.type === "TEMPORARY")) }
      ].filter(group => group.spaces.length);
      const spaceTypeRows = spaceGroups.map((group, index) => {
        const totals = group.spaces.reduce((sum, space) => {
          const bytes = analysisBytes(space);
          return { used:sum.used + bytes.used, allocated:sum.allocated + bytes.allocated };
        }, { used:0, allocated:0 });
        const percent = totals.allocated ? Math.min(100, totals.used / totals.allocated * 100) : 0;
        return `<div class="capacity-type-row ${index === 0 ? "system" : "user"}"><div class="capacity-type-row-heading"><span><i aria-hidden="true">${index === 0 ? "▤" : "▣"}</i>${group.name}</span><strong>${capacityFormatBytes(totals.used)}<small>sur ${capacityFormatBytes(totals.allocated)}</small><small>${percent.toFixed(1)}% utilisé</small></strong></div><div class="capacity-type-track"><span style="width:${percent}%" ></span></div></div>`;
      }).join("");
      const analysisRows = [...spaces].sort((a,b) => analysisBytes(b).allocated - analysisBytes(a).allocated).slice(0,10).map((space,index) => {
        const { allocated, used, percent } = analysisBytes(space);
        const tone = space.type === "TEMPORARY" ? "temporary" : severity(space) === "critical" ? (space.autoextend ? "watch" : "urgent") : severity(space) === "warning" ? "attention" : percent === 0 ? "empty" : "normal";
        const usedLabel = space.used || capacityFormatBytes(used);
        const allocatedLabel = space.allocated || capacityFormatBytes(allocated);
        return `<div class="capacity-topspace-row"><div class="capacity-topspace-heading"><span>#${index + 1} <strong>${esc(space.name)}</strong></span><span>${esc(usedLabel)} / ${esc(allocatedLabel)}</span></div><div class="capacity-topspace-track"><span class="${tone}" style="width:${percent}%"></span></div></div>`;
      }).join("");
      const growthAlerts = watchedSpaces;
      const temporarySpaces = spaces.filter(space => space.type === "TEMPORARY");
      const growthAlertRows = growthAlerts.length ? growthAlerts.map(space => {
        const { percent } = analysisBytes(space);
        return `<article class="capacity-growth-alert"><div class="capacity-growth-heading"><strong>${esc(space.name)}</strong><span class="capacity-autoextend-badge ${space.autoextend ? "enabled" : "disabled"}">${space.autoextend ? "✓ Autoextend actif" : "Autoextend inactif"}</span><b>${percent.toFixed(1)}%</b></div><div class="capacity-growth-track"><span style="width:${percent}%"></span></div><p>${space.autoextend ? `${capacityFormatBytes(space.autoextend_available_bytes)} encore disponible grâce à l’autoextend. Surveiller la croissance et planifier une extension future.` : `Seuil de ${thresholdFor(space)} % dépassé sans autoextend. Vérifier l’espace disponible et planifier une extension.`}</p></article>`;
      }).join("") : `<p class="capacity-growth-empty">${connected && !liveData ? (state.oracleDomainError ? esc(state.oracleDomainError) : "Les alertes de croissance seront disponibles après la collecte Oracle.") : "Aucun tablespace permanent ne dépasse son seuil de surveillance."}</p>`;
      const tempRows = temporarySpaces.map(space => `<div class="capacity-temp-row">${esc(space.name)} - ${analysisBytes(space).percent.toFixed(1)}% (normal pour TEMP)</div>`).join("");
      const growthSummary = growthAlerts.length
        ? `${growthAlerts.length} tablespace(s) en surveillance : ${growthAlerts.some(space => space.autoextend) ? "autoextend actif et marge disponible." : "extension automatique inactive."} L’échéancier détaillé par tablespace est dans l’onglet Recommandations.`
        : "Aucun tablespace permanent ne dépasse son seuil de surveillance. Continuez à suivre la croissance de l’espace.";
      tabContent = `<section class="capacity-analysis">
        <article class="capacity-analysis-panel"><header><h2><span aria-hidden="true">◷</span>Répartition de l'espace</h2></header><div class="capacity-analysis-content">
          <h3>Par type de tablespace</h3><div class="capacity-type-list">${spaceTypeRows || `<p class="capacity-growth-empty">${connected && !liveData ? (state.oracleDomainError ? esc(state.oracleDomainError) : "Collecte Oracle en cours…") : "Aucun tablespace disponible."}</p>`}</div>
          <h3 class="capacity-topspace-title">Top 10 tablespaces par taille</h3><div class="capacity-topspace-legend"><span><i class="urgent"></i>Critique</span><span><i class="watch"></i>Surveillance</span><span><i class="attention"></i>Attention</span><span><i class="normal"></i>Normal</span><span><i class="temporary"></i>TEMP (normal à 100%)</span></div><div class="capacity-topspace-list">${analysisRows || `<p class="capacity-growth-empty">${connected && !liveData ? (state.oracleDomainError ? esc(state.oracleDomainError) : "Collecte Oracle en cours…") : "Aucun tablespace disponible."}</p>`}</div>
        </div></article>
        <article class="capacity-analysis-panel"><header><h2><span aria-hidden="true">⌁</span>Analyse de croissance</h2></header><div class="capacity-analysis-content">
          <div class="capacity-growth-info"><span aria-hidden="true">ⓘ</span>Analyse basée sur l'utilisation actuelle et la configuration autoextend. Les tablespaces avec autoextend actif peuvent grandir automatiquement jusqu'à leur MAXSIZE.</div>
          <h3 class="capacity-growth-section-title">ⓘ <span>Tablespaces à surveiller (autoextend actif) (${growthAlerts.filter(space => space.autoextend).length})</span></h3>${growthAlertRows}
          ${temporarySpaces.length ? `<h3 class="capacity-temporary-title"><span aria-hidden="true">▤</span>Tablespaces temporaires (TEMP)</h3><div class="capacity-growth-info temp"><span aria-hidden="true">ⓘ</span>Les tablespaces TEMP se vident automatiquement après utilisation. Une utilisation élevée (même 100%) est normale et ne nécessite généralement pas d'action immédiate, sauf si TEMP reste bloqué à 100% pendant plusieurs jours (sessions zombies - requêtes tuées mais non libérées).</div><div class="capacity-temp-list">${tempRows}</div>` : ""}
          <div class="capacity-global-recommendation"><strong><span aria-hidden="true">ⓘ</span>Recommandation globale</strong><p>${growthSummary}</p></div>
        </div></article>
      </section>`;
    } else if (state.domainTab === "Recommandations") {
      const urgentRecommendations = watchedSpaces.filter(space => !space.autoextend);
      const monitoredRecommendations = watchedSpaces.filter(space => space.autoextend);
      const preventiveRecommendations = spaces.filter(space => space.type !== "TEMPORARY" && severity(space) === "warning");
      const recommendationCount = urgentRecommendations.length + monitoredRecommendations.length + preventiveRecommendations.length;
      const renderRecommendation = (space, index, level) => {
        const { percent } = (() => {
          const allocated = Math.max(0, Number(space.allocated_bytes) || 0);
          const used = Math.max(0, Number.isFinite(Number(space.used_bytes)) ? Number(space.used_bytes) : allocated * (Number(space.used_percent) || 0) / 100);
          return { percent:allocated ? Math.min(100, used / allocated * 100) : Math.min(100, Math.max(0, Number(space.used_percent) || 0)) };
        })();
        const margin = Math.max(0, Number(space.autoextend_available_bytes) || 0);
        const levelLabel = level === "urgent" ? "Action immédiate" : level === "preventive" ? "Préventif" : "Surveillance";
        const effort = level === "urgent" ? "Moyen" : "Faible";
        const risk = level === "urgent" ? "Élevé" : level === "preventive" ? "Faible" : "Moyen";
        const interval = level === "urgent" ? "Dès que possible" : level === "preventive" ? "Trimestrielle" : "Revue annuelle";
        const sqlName = String(space.name).replace(/'/g, "''");
        const plan = level === "urgent"
          ? ["Libérer ou ajouter de l’espace sans attendre", "Vérifier la capacité du stockage et les fichiers associés"]
          : level === "preventive"
            ? ["Suivre la tendance d’utilisation", "Planifier une extension avant le dépassement du seuil"]
            : ["Surveillance annuelle suffisante - Marge très confortable", "Vérifier l’espace disque disponible sur le serveur"];
        return `<article class="capacity-recommendation-card ${level}">
          <div class="capacity-recommendation-body">
            <div class="capacity-recommendation-heading"><strong>${index + 1}. Surveiller ${esc(space.name)}</strong><span class="capacity-recommendation-badge effort">◷ Effort: ${effort}</span><span class="capacity-recommendation-badge risk">⚠ Risque: ${risk}</span><span class="capacity-recommendation-badge delay">◎ Délai : ${interval}</span>${space.autoextend ? `<span class="capacity-recommendation-badge margin">▥ ${capacityFormatBytes(margin)}</span>` : ""}<span class="capacity-recommendation-level">${levelLabel}</span></div>
            <p class="capacity-recommendation-usage">Utilisation actuelle : ${percent.toFixed(2)}%${space.autoextend ? ` • Marge avant MAXSIZE : ${capacityFormatBytes(margin)}` : " • Autoextend inactif"}</p>
            ${space.autoextend ? `<span class="capacity-autoextend-badge enabled">✓ Autoextend</span>` : `<span class="capacity-autoextend-badge disabled">Autoextend désactivé</span>`}
            <div class="capacity-recommendation-plan"><span>Plan de surveillance:</span><ul>${plan.map(step => `<li>${step}</li>`).join("")}</ul></div>
            <details class="capacity-recommendation-details"><summary>⌄　Voir les détails (Pourquoi, Conséquences, SQL)</summary><div class="capacity-recommendation-detail-content"><div><strong>Pourquoi</strong><p>${esc(space.name)} utilise ${percent.toFixed(2)}% de l’espace alloué, au-delà du seuil de ${thresholdFor(space)}% défini pour ce tablespace.</p></div><div><strong>Conséquences</strong><p>Si la marge disponible est épuisée, les écritures peuvent échouer. L’autoextend ne garantit pas que le stockage du serveur dispose d’espace suffisant.</p></div><div><strong>Vérification Oracle (lecture seule)</strong><pre><code>SELECT tablespace_name, used_space, tablespace_size, used_percent
FROM dba_tablespace_usage_metrics
WHERE tablespace_name = '${esc(sqlName)}';</code></pre></div></div></details>
          </div>
        </article>`;
      };
      const waitMessage = connected && !liveData ? `<p class="callout info">${state.oracleDomainError ? esc(state.oracleDomainError) : "Les recommandations seront calculées après la collecte Oracle."}</p>` : !spaces.length ? `<p class="callout info">Aucun tablespace n’a été retourné ; aucune recommandation ne peut être calculée.</p>` : "";
      const recommendationGroups = [
        { title:"Action immédiate", items:urgentRecommendations, level:"urgent" },
        { title:"Surveillance renforcée (avec autoextend actif)", items:monitoredRecommendations, level:"monitor" },
        { title:"Actions préventives", items:preventiveRecommendations, level:"preventive" }
      ].filter(group => group.items.length);
      const recommendationContent = waitMessage || (recommendationCount
        ? recommendationGroups.map(group => `<section class="capacity-recommendation-group ${group.level}"><header><span aria-hidden="true">${group.level === "urgent" ? "ⓘ" : group.level === "preventive" ? "◷" : "⦿"}</span><h3>${group.title}</h3></header><div class="capacity-recommendation-list">${group.items.map((space,index) => renderRecommendation(space,index,group.level)).join("")}</div></section>`).join("")
        : `<div class="capacity-empty"><strong>Aucune action recommandée pour le moment.</strong><p>Aucun tablespace permanent ne dépasse son seuil de surveillance. Continuez à suivre l’utilisation et la marge d’extension.</p></div>`);
      tabContent = `<section class="capacity-recommendation-page">
        <article class="capacity-recommendation-summary"><h2><span aria-hidden="true">▥</span>Analyse de vos ${connected && !liveData ? "—" : spaces.length} tablespaces</h2><div class="capacity-recommendation-counters"><div class="capacity-recommendation-counter urgent"><span aria-hidden="true">ⓘ</span><strong>${connected && !liveData ? "—" : urgentRecommendations.length}</strong><small>actions urgentes</small></div><div class="capacity-recommendation-counter monitored"><span aria-hidden="true">⦿</span><strong>${connected && !liveData ? "—" : monitoredRecommendations.length}</strong><small>surveillances</small></div><div class="capacity-recommendation-counter preventive"><span aria-hidden="true">◷</span><strong>${connected && !liveData ? "—" : preventiveRecommendations.length}</strong><small>préventives</small></div></div><p class="capacity-recommendation-status"><span aria-hidden="true">ⓘ</span>${connected && !liveData ? (state.oracleDomainError ? esc(state.oracleDomainError) : "Les recommandations seront disponibles après la collecte Oracle.") : urgentRecommendations.length ? `${urgentRecommendations.length} tablespace(s) nécessitent une action immédiate.` : recommendationCount ? `Situation sous contrôle. ${recommendationCount} tablespace(s) nécessitent une surveillance régulière.` : "Situation sous contrôle. Aucun tablespace ne nécessite d’action pour le moment."}</p></article>
        ${recommendationContent}
        <p class="capacity-recommendation-help"><span aria-hidden="true">ⓘ</span>Pour plus d’informations sur la gestion de l’espace et les bonnes pratiques, consultez l’onglet Aide.</p>
      </section>`;
    } else if (state.domainTab === "Aide") {
      tabContent = `<section class="capacity-panel"><h2>Comprendre la capacité Oracle</h2><div class="capacity-help-grid"><article><b>Utilisation</b><p>Part de l’espace alloué actuellement utilisé dans chaque tablespace.</p></article><article><b>Seuils de surveillance</b><p>90 % par défaut ; 85 % pour SYSTEM et SYSAUX afin de signaler plus tôt une marge faible.</p></article><article><b>Autoextend</b><p>Indique si au moins un fichier du tablespace est configuré pour s’étendre automatiquement. Cela ne garantit pas la disponibilité du stockage.</p></article><article><b>Source des données</b><p>En mode connecté, les valeurs proviennent des vues Oracle accessibles au compte de supervision. Les exemples hors connexion sont illustratifs.</p></article></div></section>`;
    } else {
      const autoextendAlerts = watchedSpaces.filter(space => space.autoextend);
      const urgentAlerts = watchedSpaces.filter(space => !space.autoextend);
      const warningText = urgentAlerts.length
        ? `${urgentAlerts.length} tablespace(s) au-dessus du seuil sans autoextend actif : vérification urgente recommandée.`
        : autoextendAlerts.length
          ? `${autoextendAlerts.length} tablespace(s) en usage élevé (>90 %, ou >85 % pour SYSTEM/SYSAUX) avec autoextend actif. Surveillance recommandée.`
          : "Aucun tablespace permanent ne dépasse son seuil de surveillance.";
      tabContent = `<div class="capacity-overview">${watchedSpaces.length || !connected ? `<div class="capacity-overview-alert ${urgentAlerts.length ? "urgent" : "watch"}"><span aria-hidden="true">ⓘ</span><div><strong>${urgentAlerts.length ? "Action immédiate" : "Tablespaces à surveiller"}</strong><p>${connected ? (state.oracleDomainError ? esc(state.oracleDomainError) : warningText) : warningText}</p></div></div>` : liveData ? `<div class="capacity-overview-alert normal"><span aria-hidden="true">✓</span><div><strong>Aucune alerte de capacité</strong><p>${warningText}</p></div></div>` : `<div class="capacity-overview-alert pending"><span aria-hidden="true">…</span><div><strong>Collecte Oracle en cours</strong><p>Les indicateurs et l’état des tablespaces seront disponibles après la collecte.</p></div></div>`}<section class="capacity-chart-panel"><header><h2>Distribution de l'utilisation de l'espace</h2><span class="capacity-top-badge">Top 10</span></header>${chart}<footer class="capacity-chart-legend"><span><i class="temporary"></i>TEMP (Temporaire)</span><span><i class="urgent"></i>Action immédiate (urgence réelle)</span><span><i class="watch"></i>Surveillance (avec autoextend)</span><span><i class="attention"></i>Attention</span><span><i class="normal"></i>Normal</span></footer></section>${spaceOverviewSection}</div>`;
    }
    const tabNavigation = renderDomainTabs(config.tabs);
    const tabLayout = state.domainTab === "Vue d'ensemble"
      ? `<div class="capacity-overview-shell">${tabNavigation}${tabContent}</div>`
      : `${tabNavigation}${tabContent}`;
    return `<div class="domain-body capacity-page">${backendNotice()}<section class="capacity-summary"><header class="capacity-page-heading"><div class="capacity-page-title"><h2><span class="heading-icon">▱</span>${esc(config.title)}</h2><p class="subtitle">${esc(config.intro)}</p></div><div class="capacity-page-actions"><div class="capacity-score"><span>Score de Capacité <i aria-hidden="true">ⓘ</i></span><strong>${esc(config.score)}</strong></div>${btn("▤ CSV","export","btn capacity-export csv")}${btn("▤ PDF","export","btn capacity-export pdf")}${btn("⟳","refresh-domain","btn capacity-refresh")}</div></header>
        <section class="capacity-kpi-grid">${metricCards}</section></section>${tabLayout}
      <div class="footer-note">Deynao — Capacité Oracle · ${connected ? "Données collectées depuis Oracle · score Deynao calculé" : "Exemples locaux à titre illustratif"}</div></div>`;
  }

  function renderOracleOverview() {
    const metrics = state.oracleDomainData?.domain === "overview" ? state.oracleDomainData.metrics : [];
    return `<div class="domain-body"><div class="row between" style="margin-bottom:17px"><div><h2><span class="heading-icon">⌂</span>Vue d'ensemble Oracle</h2><p class="subtitle">Informations et compteurs collectés directement depuis la base connectée.</p></div>${btn("⟳ Actualiser","refresh-domain","btn small-btn")}</div>
      ${backendNotice()}${state.oracleOverviewError ? `<p class="callout" role="alert">${esc(state.oracleOverviewError)}</p>` : !metrics.length ? `<p class="callout info">Collecte Oracle en cours…</p>` : ""}
      ${metrics.length ? card(`<div class="card-title"><h2 style="margin:0">Informations Oracle en direct</h2>${badge("Source Oracle","green")}</div><div class="grid grid-3">${metrics.map(m=>`<div class="kv-item"><small>${esc(m.label)}</small><b>${esc(m.value)}</b><p class="tiny muted" style="margin:6px 0 0">${esc(m.foot)}</p></div>`).join("")}</div>`) : ""}
      <div class="footer-note">Les indicateurs dépendent des vues Oracle auxquelles le compte connecté a accès.</div></div>`;
  }
  function renderTablespaces() {
    if (state.oracleConnected) {
      const data = state.oracleDomainData?.domain === "capacity" ? state.oracleDomainData.tablespaces : null;
      if (!data) {
        return card(`<h3>État des tablespaces</h3><p class="callout ${state.oracleDomainError ? "" : "info"}">${state.oracleDomainError ? esc(state.oracleDomainError) : "Collecte des tablespaces en cours…"}</p>`);
      }
      if (!data.length) return card(`<h3>État des tablespaces</h3><p class="callout info">Aucun tablespace n’a été retourné par Oracle.</p>`);
      return card(`<div class="card-title"><h3>État des tablespaces</h3></div><div class="grid grid-2">${data.map(space=>{const percent=Number(space.used_percent)||0;const tone=percent>=90?"amber":"green";return `<div class="card tight"><div class="row between"><b>${esc(space.name)}</b>${badge(space.autoextend?"Autoextend actif":"Autoextend inactif",space.autoextend?"green":"amber")}</div><div class="progress ${tone}" style="margin:12px 0"><span style="width:${Math.min(percent,100)}%"></span></div><div class="row between tiny"><span>${percent.toFixed(2)}% utilisés</span><b>${esc(space.used)} / ${esc(space.allocated)}</b></div></div>`}).join("")}</div>`);
    }
    const spaces=[["SYSTEM",99.04,"370.00 MB","Surveillance recommandée"],["TEMP",99.72,"17.08 GB","Tablespace temporaire"],["SYSAUX",68.66,"900.00 MB","Normal"],["UNDOTBS1",15.45,"210.00 MB","Normal"],["USERS",0,"100.00 MB","Normal"]];
    return card(`<div class="card-title"><h3>État des tablespaces</h3></div><div class="grid grid-2">${spaces.map(([n,p,size,status])=>`<div class="card tight"><div class="row between"><b>${n}</b>${badge(p>90?"Extension auto":"Normal",p>90?"amber":"green")}</div><div class="progress ${p>90?"amber":"green"}" style="margin:12px 0"><span style="width:${p}%"></span></div><div class="row between tiny"><span>${p}% utilisés</span><b>${size}</b></div><p class="tiny muted" style="margin:8px 0 0">${status}</p></div>`).join("")}</div>`);
  }
  function renderRecommendations() {
    return `<div class="grid grid-2">${[["immediate","ACTION IMMÉDIATE","0","Aucune action urgente"],["priority","ACTION PRIORITAIRE","6","6 actions à organiser"],["watch","SURVEILLANCE","6","6 éléments à observer"],["optimize","OPTIMISATION","6","6 améliorations ou validations"]].map(([cls,title,n,description])=>`<div class="recommend-card ${cls}" data-action="recommend-filter"><div class="row between"><b>${title}</b><span>${cls==="priority"?"À planifier":cls==="watch"?"Surveiller":"Optimal"}</span></div><div class="metric-value">${n}</div><span>${description}</span></div>`).join("")}</div><div style="height:15px"></div>${card(`<h3>Diagnostic du plan d'action</h3><p class="callout">6 actions prioritaires identifiées, principalement sur Sauvegardes. À organiser dans une fenêtre de maintenance.</p><div class="row between"><b>Couverture complète : 13/13 vues analysées</b>${btn("Exporter le plan d'action en CSV","export","btn small-btn")}</div><div class="table-wrap" style="margin-top:13px"><table><thead><tr><th>Priorité</th><th>Domaine</th><th>Constat</th><th>Action recommandée</th><th>État</th></tr></thead><tbody>${["Sauvegardes","Sécurité","Journalisation","Fichiers","Capacité","Licences"].map((x,i)=>`<tr><td>${badge("Prioritaire","amber")}</td><td>${x}</td><td>Contrôle à vérifier</td><td>Auditer et planifier une action.</td><td>À planifier</td></tr>`).join("")}</tbody></table></div>`)}`;
  }

  function renderAlerts() {
    const tabs=["Toutes","Actives","Résolues"];
    return `<div class="page">${pageHead("◷ Historique des alertes","Alertes levées par la supervision Deynao — distinct du journal Oracle (alert.log).",btn("ⓘ Comment fonctionnent les alertes ?","alert-help","btn"))}
      ${card(`<div class="toolbar between"><div class="filter-row">${tabs.map(t=>btn(t,"alert:"+t,`btn small-btn ${state.alertFilter===t?"active":""}`)).join("")}</div><div class="toolbar">${btn("▦ Export Excel","export","btn small-btn")}${btn("⟳ Actualiser","refresh","btn small-btn")}</div></div>`,"tight")}
      <div style="height:12px"></div>${card(`<div class="grid grid-3"><div class="search"><input class="input" placeholder="Rechercher (base, message, règle)…"></div><label class="field">Base<select><option>Toutes les bases</option>${state.connections.map(c=>`<option>${esc(c.name)}</option>`).join("")}</select></label><label class="field">Par page<select><option>25</option><option selected>50</option><option>100</option></select></label></div>
      <div class="row between" style="margin-top:16px"><div><b class="tiny">Sévérité</b><div class="filter-row" style="margin-top:7px">${["Critique","Avertissement","Info"].map(t=>btn(t,"severity:"+t,"btn small-btn")).join("")}</div></div><div><b class="tiny">Période</b><div class="filter-row" style="margin-top:7px">${["24 h","7 j","30 j","Tout","Personnalisée"].map(t=>btn(t,"period:"+t,`btn small-btn ${t==="Tout"?"active":""}`)).join("")}</div></div>${btn("↺ Réinitialiser","reset-alerts","btn small-btn")}</div>`)}
      <div class="grid grid-2" style="margin-top:13px">${card(`<b>◷　0 active</b>`,"tight")}${card(`<b>✓　0 résolue</b>`,"tight")}</div>
      ${card(`<div class="empty"><div class="empty-icon">✓</div><h2>Aucune alerte — tout est calme</h2><p>Aucune alerte de supervision pour ce filtre. Les alertes apparaîtront ici dès qu'une base présentera un problème.</p></div>`)}
      </div>`;
  }
  function renderAlertHelpModal() {
    const tab = state.alertHelpTab;
    const body = tab === "overview" ? `<h3>Que fait l'alerting de Deynao ?</h3><p>Deynao surveille en fond les bases en supervision automatique. Une alerte est levée quand un problème tient dans le temps, un e-mail est envoyé, et l'alerte se résout d'elle-même quand la situation revient à la normale.</p><div class="callout info"><b>Quand serai-je alerté ?</b><p>Le délai réel = temporisation de la règle + prochain passage du collecteur. Les règles sans temporisation partent dès le prochain cycle où la condition est vraie.</p></div><h3 style="margin-top:15px">Deux garde-fous prioritaires</h3><ul><li>Authentification bloquée : Deynao arrête les tentatives et prévient.</li><li>Base injoignable : aucune autre alerte ne s’empile tant que cette situation persiste.</li></ul>` : tab === "rules" ? `<h3>Les règles de supervision</h3><p>Les règles s’appuient sur les métriques collectées et leur seuil. Une temporisation permet de filtrer les variations transitoires.</p><div class="table-wrap"><table><thead><tr><th>Règle</th><th>Condition</th><th>Sévérité</th></tr></thead><tbody><tr><td>Disponibilité Oracle</td><td>Base injoignable</td><td>Critique</td></tr><tr><td>Utilisation tablespace</td><td>Seuil maintenu</td><td>Avertissement</td></tr><tr><td>Collecteur</td><td>Absence de battement</td><td>Info</td></tr></tbody></table></div>` : `<h3>Cycle de vie d'une alerte</h3><ol><li>La condition est détectée par le collecteur.</li><li>La temporisation de la règle est vérifiée.</li><li>L’alerte est créée et notifiée.</li><li>Lorsque la métrique revient à la normale, l’alerte est résolue et conservée dans l’historique.</li></ol>`;
    return `<div class="modal-backdrop" data-action="backdrop"><section class="modal wide" role="dialog" aria-modal="true" aria-label="Comment fonctionnent les alertes"><header class="modal-head"><h2>ⓘ Comment fonctionnent les alertes ?</h2>${btn("✕","close-modal","btn icon-btn")}</header><div class="modal-body"><p class="subtitle">Quand, sur quelles métriques et à quel seuil Deynao vous alerte</p><div class="tabs">${[["overview","Vue d'ensemble"],["rules","Les règles"],["lifecycle","Cycle de vie"]].map(([k,n])=>btn(n,"help-tab:"+k,`tab ${tab===k?"active":""}`)).join("")}</div>${body}</div><footer class="modal-foot"><span class="tiny muted">100 % transparent · Seuils lus depuis le moteur de supervision</span>${btn("Fermer","close-modal","btn")}</footer></section></div>`;
  }

  function renderAnalysis() {
    return `<div class="page"><div class="page-head"><div><h1>Analyse Avancée Oracle</h1><p class="subtitle">Diagnostic automatisé de vos fichiers alert.log Oracle</p><p class="muted">Diagnostic automatisé des fichiers alert.log Oracle avec recommandations basées sur la documentation Oracle et la classification Deynao.</p></div><span class="brand-mark">◉</span></div>
      <div class="upload" id="drop-zone"><div class="empty-icon">⇧</div><h2>Déposez votre fichier alert.log ici</h2><p class="muted">Formats supportés : .log, .txt, .out (max 100 Mo)</p><label class="btn primary" for="alert-file">▣ Parcourir les fichiers</label><input id="alert-file" type="file" accept=".log,.txt,.out"><p class="tiny muted" style="margin-top:17px">▣ Solution on-premise — vos données restent sur votre infrastructure</p>${state.uploadName?`<div class="callout success" style="margin-top:14px">Fichier sélectionné : <b>${esc(state.uploadName)}</b> ${btn("Analyser","analyze-file","btn primary small-btn")}</div>`:""}</div>
      <h2 style="margin-top:30px">Pourquoi Deynao</h2><div class="grid grid-4">${[["Analyse intelligente multi-versions","Analyse automatique Oracle 11g à 23ai, extraction des codes d'erreur et classification."],["Base Oracle + DIAG-LONG","Plus de 160 codes Oracle documentés et liens vers la documentation officielle."],["Regroupement intelligent","Regroupe les occurrences répétées en alertes uniques en conservant le compteur exact."],["Déploiement on-premise","Les fichiers restent dans votre réseau, sans transmission vers un service externe."]].map(([h,p])=>card(`<h3>${h}</h3><p class="muted">${p}</p>`)).join("")}</div>
      <section class="card" style="margin-top:18px"><button class="btn subtle" data-action="toggle-guide">⌄　Comment récupérer votre fichier alert.log ?　<span class="muted">${state.guideOpen?"Masquer":"Afficher"} le guide de récupération</span></button>${state.guideOpen?`<div class="stack" style="margin-top:18px"><p>Guide simple pour localiser le fichier alert.log de votre base Oracle.</p><div class="grid grid-2">${card(`<h3>Étape 1 : Identifier l'emplacement</h3><p>Connectez-vous à Oracle et exécutez :</p><code>SHOW PARAMETER diagnostic_dest</code><p>Ou : <code>SELECT value FROM v$parameter WHERE name = 'diagnostic_dest';</code></p>`)}${card(`<h3>Étape 2 : Naviguer jusqu'au fichier</h3><p><code>[DIAGNOSTIC_DEST]/diag/rdbms/[NOM_BASE]/[SID]/trace/</code></p><p>Le fichier s'appelle <b>alert_[SID].log</b>.</p>`)}</div><h3>Exemples Windows</h3><code>C:\\app\\oracle\\diag\\rdbms\\orcl\\ORCL\\trace\\alert_ORCL.log</code><p class="muted">Pour une analyse pertinente, utilisez les 2–3 derniers jours et gardez une copie avant toute manipulation.</p></div>`:""}</section>
      ${card(`<div class="row between"><div><h2>Prêt à commencer ?</h2><p class="muted">Importez votre fichier alert.log pour démarrer l'analyse automatisée</p></div>${btn("⌕ Analyser mon fichier alert.log","browse-alert","btn primary")}</div>`,"accent-top")}</div>`;
  }

  function renderSettings() {
    const s = state.settings;
    return `<div class="page">${pageHead("⚙ Paramètres","Configuration de l'application Deynao.")}
      <div class="stack">${card(`<div class="card-title"><h2>✉ Messagerie</h2></div><p class="subtitle">Serveur SMTP utilisé pour envoyer les alertes par e-mail.</p><div class="callout info" style="margin:14px 0">Ces réglages proviennent de la configuration d'installation. Enregistrez-les pour les piloter depuis cette page.</div>
        <form data-form="settings" class="stack"><label class="checkline"><input type="checkbox" name="enabled" ${s.enabled?"checked":""}> <span><b>Activer l'alerting par e-mail</b><br><span class="field-hint">Lorsque activé, Deynao envoie automatiquement les alertes aux destinataires ci-dessous.</span></span></label>
        <div class="form-grid">${field("Serveur","server",s.server||"","", "text","smtp.client.example")}${field("Port","port",s.port||"587","","number")}${field("Utilisateur","user",s.user||"","", "text","dba@client.example")}${field("Mot de passe","smtpPass","","","password")}${`<label class="field">Chiffrement TLS<select name="tls"><option>Automatique (recommandé)</option><option>Obligatoire</option><option>Désactivé</option></select><span class="field-hint">Automatique convient à la plupart des serveurs.</span></label>`}${field("Expéditeur","sender",s.sender||"","","email","dba@client.example")}${`<label class="field">Langue des e-mails<select name="emailLocale"><option>Français</option><option>English</option></select><span class="field-hint">Indépendante de la langue de l'interface.</span></label>`}<label class="field full">Destinataires<input class="input" name="recipients" value="${esc(s.recipients||"")}" placeholder="dba@client.example, ops@client.example"><span class="field-hint">Séparez les adresses par des virgules.</span></label></div>
        <label class="checkline"><input type="checkbox" name="daily" ${s.daily?"checked":""}><span><b>Rapport quotidien par e-mail</b><br><span class="field-hint">Synthèse quotidienne de l'état de Deynao, du parc et des alertes.</span></span></label>
        <div class="row">${btn("Envoyer le rapport maintenant","send-report","btn",s.recipients?"":"disabled")}</div><p class="field-hint">L'envoi immédiat au destinataire de test n'affecte pas l'envoi planifié.</p>
        <div class="form-grid"><label class="field full">Envoyer le mail de test à<input class="input" type="email" name="testEmail" value="${esc(s.testEmail||"")}" placeholder="dba@client.example"><span class="field-hint">Adresse d'essai mémorisée sur cet appareil.</span></label></div>
        <div class="row between"><div class="toolbar">${btn("Vérifier la connexion","smtp-test","btn")}${btn("Envoyer un mail de test","smtp-send","btn")}</div><div class="toolbar"><button class="btn" type="reset">Annuler</button><button class="btn primary" type="submit">Enregistrer</button></div></div></form>`)}
        ${card(`<div class="card-title"><h2>⚖ Licence</h2></div><div class="grid grid-3">${[["État","Valide"],["Édition","Évaluation"],["Client","Démo locale"],["Expiration","—"],["Instances couvertes","5"],["Fonctionnalités","alerting, multibase"]].map(([a,b])=>`<div class="kv-item"><small>${a}</small><b>${b}</b></div>`).join("")}</div><div class="row" style="margin-top:15px"><input class="input" style="max-width:500px" placeholder="Collez ici la clé fournie par Deynao…">${btn("Activer","activate-license","btn primary")}</div>`)}
        ${card(`<div class="row between"><div><h2>♥ Santé de Deynao</h2><p class="subtitle">Auto-surveillance de l'application Deynao.</p></div>${badge("Opérationnel","green")}</div><div class="grid grid-3" style="margin-top:14px">${[["État","Opérationnel"],["Version","1.0.3"],["En service depuis","59 min"],["Base de données","Opérationnelle"],["Migrations","À jour"],["Collecteur","Actif · dernier battement il y a quelques secondes"],["File d'e-mails","Normale"]].map(([a,b])=>`<div class="kv-item"><small>${a}</small><b>${b}</b></div>`).join("")}</div><div class="row between" style="margin-top:15px"><span class="tiny muted">Dernière vérification : à l'instant</span>${btn("⟳ Rafraîchir","refresh","btn small-btn")}</div>`)}
        ${card(`<div class="row between"><div><h2>▣ Journal des envois</h2><p class="subtitle">Derniers e-mails de notification émis par Deynao.</p></div>${btn("Rafraîchir","refresh","btn small-btn")}</div><div class="empty"><h3>Aucun envoi enregistré</h3></div><div class="row between"><span class="tiny muted">Dernière vérification : à l'instant</span>${btn("Voir le journal complet →","route:/mail-log","btn small-btn")}</div>`)}
      </div></div>`;
  }
  function renderMailLog() {
    return `<div class="page">${pageHead("▣ Journal des envois","Tous les e-mails de notification émis par Deynao (audit) — filtrez, paginez, exportez.",btn("ⓘ Comment fonctionne le Journal des envois ?","mail-help","btn"))}
      ${card(`<div class="toolbar between"><div class="filter-row">${["Tous","Envoyés","Échecs"].map(x=>btn(x,"mailfilter:"+x,`btn small-btn ${state.journalFilter===x?"active":""}`)).join("")}</div><div class="toolbar">${btn("▦ Export Excel","export","btn small-btn")}${btn("⟳ Actualiser","refresh","btn small-btn")}</div></div>`,"tight")}
      <div style="height:13px"></div>${card(`<div class="grid grid-4"><div class="search"><input class="input" placeholder="Rechercher (base, type, message)…"></div><label class="field">Type<select><option>Tous les types</option><option>Alerte levée</option><option>Rappel</option><option>Escalade</option><option>Résolue</option><option>Rapport quotidien</option><option>Alerte</option></select></label><label class="field">Période<select><option>Tout</option><option>24 h</option><option>7 j</option><option>30 j</option></select></label><label class="field">Par page<select><option>25</option><option selected>50</option><option>100</option></select></label></div><div class="row between" style="margin-top:14px"><span>${btn("↺ Réinitialiser","reset-mail","btn small-btn")}</span></div>`)}
      <div class="grid grid-2" style="margin-top:13px">${card("<b>✉　0 envoyé(s)</b>","tight")}${card("<b>⚠　0 échec(s)</b>","tight")}</div>${card(`<div class="empty"><div class="empty-icon">✉</div><h2>Aucun envoi</h2><p>Aucun e-mail de notification pour ce filtre. Les envois apparaîtront ici dès que Deynao émettra une alerte ou un rapport.</p></div>`)}</div>`;
  }
  function renderUsers() {
    return `<div class="page">${pageHead("♙ Utilisateurs","Gérez les comptes qui accèdent à Deynao.",btn("＋ Nouvel utilisateur","new-user","btn primary"))}
      <div class="table-wrap"><table><thead><tr>${["Identifiant","Nom","Rôle","Actif","Dernière connexion","Actions"].map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${state.users.map((u,i)=>`<tr><td><b>${esc(u.username)}</b>${u.username==="admin"?` <span class="pill">vous</span>`:""}</td><td>${esc(u.name||"—")}</td><td><select data-user-role="${i}" ${u.username==="admin"?"disabled":""}><option ${u.role==="Administrateur"?"selected":""}>Administrateur</option><option ${u.role==="Opérateur"?"selected":""}>Opérateur</option><option ${u.role==="Lecteur"?"selected":""}>Lecteur</option></select></td><td>${u.active?"● Actif":"○ Inactif"}</td><td>${esc(u.last||"Jamais")}</td><td>${u.username==="admin"?"—":`${btn("Réinitialiser","reset-user:"+i,"btn small-btn")} ${btn(u.active?"Désactiver":"Activer","disable-user:"+i,"btn small-btn")} ${btn("Supprimer","delete-user:"+i,"btn small-btn danger")}`}</td></tr>`).join("")}</tbody></table></div></div>`;
  }
  function renderDocs() {
    const entries=[["Ajouter une base à superviser","Le Parc, sur la page d'accueil"],["Voir l'état de santé de toutes les bases","Le Parc, sur la page d'accueil"],["Lire une note de santé et sa couverture","Le scénario 3, plus bas sur cette page"],["Retrouver les alertes passées ou en cours","L'écran Historique des alertes"],["Comprendre les règles d'alerte et leurs seuils","Historique des alertes, bouton « Comment fonctionnent les alertes ? »"],["Recevoir les alertes par e-mail","Paramètres, section Messagerie"],["Vérifier que les e-mails partent bien","Paramètres, carte Journal des envois"],["Analyser le journal Oracle d'une base (alert.log)","L'écran Alertes Oracle"],["Activer ou vérifier la licence","Paramètres, section Licence"],["Gérer les comptes utilisateurs","Écran Utilisateurs"]];
    const pdfs=["Activer votre licence","Quel paquet choisir ? Portable ou service Windows","FAQ et limites","Mise à jour pas à pas","Paramétrage e-mail (SMTP)","Prérequis réseau","Présentation de Deynao","Règles d'alerte","Sécurité et confiance","Transparence Oracle"];
    return `<div class="page">${pageHead("▣ Documentation","Guides et ressources pour administrer Deynao.")}
      ${card(`<h2>Comment faire pour…</h2><div class="grid grid-2">${entries.map(([a,b],i)=>`<button class="btn" style="height:auto;min-height:62px;justify-content:flex-start;text-align:left;white-space:normal" data-action="doc-entry:${i}"><span class="heading-icon">↗</span><span><b>${a}</b><br><small class="muted">${b}</small></span></button>`).join("")}</div>`)}
      <div class="grid grid-2" style="margin-top:16px">${card(`<h2>Quand quelque chose arrive</h2>${["Une alerte arrive","Une base passe en orange","Lire une note et sa couverture"].map(x=>`<div class="kv-item" style="margin-top:8px"><b>${x}</b><p class="tiny muted" style="margin:5px 0">Comprendre l’état, ses causes et les prochaines actions utiles.</p></div>`).join("")}`)}${card(`<h2>Prise en main</h2><p>Créer le compte Oracle de supervision en lecture seule et installer Deynao comme service.</p>${btn("Ouvrir la supervision","route:/fleet","btn primary")}`)}</div>
      ${card(`<h2>Comprendre les domaines</h2><div class="grid grid-2">${[["Activité et performance","Performance, attentes, verrous, processus."],["Capacité et contenu","Capacité, fichiers, objets."],["Exploitation et continuité","Jobs, journalisation, sauvegardes, alertes."],["Sécurité, conformité et synthèse","Sécurité, licences, recommandations."]].map(([a,b])=>`<div class="kv-item"><b>${a}</b><p class="tiny muted">${b}</p></div>`).join("")}</div>`)}
      ${card(`<h2>Documents de référence</h2><div class="grid grid-2">${pdfs.map(x=>`<button class="btn" data-action="pdf:${esc(x)}" style="justify-content:flex-start">▤　${x}　<span class="muted">PDF</span></button>`).join("")}</div>`)}
      </div>`;
  }
  function renderModal() {
    if (state.modal === "alert-help") return renderAlertHelpModal();
    if (state.modal === "mail-help") return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="Journal des envois"><header class="modal-head"><h2>Comment fonctionne le Journal des envois ?</h2>${btn("✕","close-modal","btn icon-btn")}</header><div class="modal-body"><p>Cette page conserve une trace d’audit des e-mails de notification émis par Deynao.</p><ul><li>Les filtres permettent de distinguer les messages envoyés et les échecs.</li><li>Les types incluent alertes, rappels, escalades, résolutions et rapports quotidiens.</li><li>La recherche et la période réduisent les résultats exportés.</li></ul></div><footer class="modal-foot">${btn("Fermer","close-modal","btn")}</footer></section></div>`;
    if (state.modal === "connection") {
      const draft = state.connectionDraft || {};
      const reconnect = Boolean(state.connectionDraft);
      const environment = draft.environment || "PROD";
      const environmentOptions = [["","Sélectionner un environnement..."],["DEV","Développement"],["TEST","Test"],["PROD","Production"]]
        .map(([value, label]) => `<option value="${value}" ${value === environment ? "selected" : ""}>${label}</option>`).join("");
      const ro = reconnect ? true : false;
      return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="${reconnect ? "Reconnecter la connexion" : "Nouvelle connexion"}"><header class="modal-head"><div><h2>▤ ${reconnect ? `Reconnecter ${esc(draft.name || draft.service || "la connexion")}` : "Nouvelle Connexion"}</h2><span class="tiny muted">${reconnect ? "Session Oracle inactive — le mot de passe est requis" : "Connectez une base Oracle à superviser"}</span></div>${btn("✕","close-modal","btn icon-btn")}</header>
      <form data-form="connection"><div class="modal-body stack">${reconnect ? `<div class="callout info full"><b>Profil enregistré dans le parc</b><br>Le mot de passe n’est jamais conservé. Les champs de connexion sont verrouillés ; saisissez uniquement le mot de passe pour rouvrir la session Oracle côté serveur.</div>` : ""}<div class="form-grid">${field("Nom de connexion","name",draft.name || "","","text","Production Oracle",ro)}${field("Serveur *","host",draft.host || "","","text","srv-oracle-prod ou 192.168.1.100",ro)}${field("Port *","port",draft.port || "1521","","text","",ro)}${field("Service *","service",draft.service || "","","text","ORCL",ro)}${field("Utilisateur *","username",draft.username || "","","text","system",ro)}
      <label class="checkline full"><input type="checkbox" name="sysdba" ${draft.sysdba ? "checked" : ""}${ro ? " disabled" : ""}><span><b>Se connecter en tant que SYSDBA</b><br><span class="field-hint">À cocher uniquement si ce compte possède les privilèges SYSDBA/SYSOPER.</span></span></label>
      <div class="callout info full"><b>Compte de supervision dédié (recommandé)</b><br>Bonne pratique : superviser avec un compte dédié en LECTURE SEULE, plutôt que SYS ou un compte applicatif.</div>
      <label class="field">Environnement *<select name="environment" required${ro ? " disabled" : ""}>${environmentOptions}</select></label>${field("Mot de passe *","password","","","password")}
      ${reconnect ? "" : `<label class="checkline full"><input type="checkbox" name="save" checked><span><b>Conserver cette base dans mon parc</b><br><span class="field-hint">${state.backendAvailable ? "Les informations non secrètes sont conservées dans le navigateur. Le mot de passe reste en mémoire serveur et disparaît à l’arrêt." : "Connexion conservée sur cet appareil dans cette maquette."}</span></span></label>`}</div></div>
      <footer class="modal-foot" style="justify-content:space-between"><button class="btn" type="button" data-action="test-connection">Tester la connexion</button><div class="toolbar"><button class="btn" type="button" data-action="close-modal">Annuler</button><button class="btn primary" type="submit">${reconnect ? "Reconnecter" : "Se connecter"}</button></div></footer></form></section></div>`;
    }
    if (state.modal === "process-detail" && state.processDetail) {
      const p = state.processDetail;
      const memoryPercent = Number(p.memory_pct) || 0;
      return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="Détails du processus ${esc(p.name)}"><header class="modal-head"><div><h2>${esc(p.name)}</h2><span class="tiny muted">${esc(p.category)} · ${p.running ? "En service" : "Arrêté"}</span></div>${btn("✕","close-modal","btn icon-btn")}</header><div class="modal-body stack">
        <div class="process-detail-grid"><div><small>Nom</small><b>${esc(p.name)}</b></div><div><small>Catégorie</small><b>${esc(p.category)}</b></div><div><small>Statut</small><b><span class="system-process-state"><span class="system-process-state-dot" aria-hidden="true"></span>${p.running ? "En service" : "Arrêté"}</span></b></div><div><small>Mémoire</small><b>${formatProcessMemory(p.memory_mb)}</b><span class="process-detail-secondary">${memoryPercent}% du total</span></div><div><small>Durée</small><b>${esc(formatProcessUptime(p.uptime_seconds))}</b></div></div>
        <div><h3>Rôle du processus</h3><p class="process-detail-description">${esc(p.description)}</p></div>
        <p class="callout info">Données lues en lecture seule depuis les vues Oracle V$BGPROCESS et V$PROCESS.</p>
      </div><footer class="modal-foot">${btn("Fermer","close-modal","btn")}</footer></section></div>`;
    }
    if (state.modal === "user-session-detail" && state.userSessionDetail) {
      const s = state.userSessionDetail;
      const memoryPercent = Number(s.memory_pct) || 0;
      return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="Détails de la session ${esc(s.username)}"><header class="modal-head"><div><h2>${esc(s.username)}</h2><span class="tiny muted">${esc(s.account_label)} · ${s.active ? "Actif" : "Inactif"}</span></div>${btn("✕","close-modal","btn icon-btn")}</header><div class="modal-body stack">
        <div class="process-detail-grid"><div><small>Utilisateur</small><b>${esc(s.username)}</b></div><div><small>Compte</small><b>${esc(s.account_label)}</b></div><div><small>Programme</small><b>${esc(s.program)}</b></div><div><small>Statut</small><b><span class="user-session-status ${s.active ? "active" : "inactive"}"><span class="user-session-status-dot" aria-hidden="true"></span>${s.active ? "Actif" : "Inactif"}</span></b></div><div><small>Mémoire</small><b>${formatProcessMemory(s.memory_mb)}</b><span class="process-detail-secondary">${memoryPercent}% du total</span></div><div><small>Durée</small><b>${esc(formatProcessUptime(s.duration_seconds))}</b></div><div><small>Machine</small><b>${esc(s.machine || "—")}</b></div><div><small>SID / Serial</small><b>${s.sid || "—"} / ${s.serial_number || "—"}</b></div></div>
        <p class="callout info">Données lues en lecture seule depuis les vues Oracle V$SESSION et V$PROCESS.</p>
      </div><footer class="modal-foot">${btn("Fermer","close-modal","btn")}</footer></section></div>`;
    }
    if (state.modal === "quick-stats") {
      const c=state.connections[0]||sampleConnection;
      return `<div class="modal-backdrop" data-action="backdrop"><section class="modal wide" role="dialog" aria-modal="true" aria-label="Statistiques Oracle"><header class="modal-head"><div><h2>▤ Statistiques Oracle</h2><div class="row">${badge(c.name)}${badge(c.environment,"amber")}</div></div>${btn("✕","close-modal","btn icon-btn")}</header><div class="modal-body stack">
        <div class="callout"><div class="row between"><b>Score de santé</b><strong style="font-size:30px">78%</strong></div><b>Attention</b><p>Points d'attention : Sauvegardes 36%, Sécurité 65%, Journalisation 75%.</p></div>
        <div><h3>Informations de l'instance</h3><div class="kv">${[["Nom de l'instance","FREE"],["Statut","OUVERT"],["Statut base de données","ACTIF"],["Connexions","AUTORISÉES"],["Version","Oracle AI Database 26ai Free"],["Disponibilité","58 min"],["Mode de journalisation","ARCHIVELOG"],["Mode d'ouverture","LECTURE ÉCRITURE"],["Hôte",c.hostname],["Type de licence","Non déterminée"]].map(([a,b])=>`<div class="kv-item"><small>${a}</small><b>${b}</b></div>`).join("")}</div></div>
        <div><h3>Sessions Oracle</h3><div class="grid grid-4">${[["Actives","0"],["En attente","0"],["Inactives","0"],["Maximum","322"]].map(([a,b])=>`<div class="kv-item"><small>${a}</small><b>${b}</b></div>`).join("")}</div><p class="tiny muted">Les connexions de supervision Deynao peuvent être exclues des compteurs.</p></div>
        ${renderTablespaces()}<details><summary>Plan d'action et recommandations détaillés　Voir le détail</summary><p>Auditer la stratégie de sauvegarde, la sécurité et le multiplexage des journaux.</p></details>
      </div><footer class="modal-foot">${btn("Copier le rapport détaillé","copy-report","btn")}${btn("Supervision complète","open-supervision","btn primary")}</footer></section></div>`;
    }
    if (state.modal === "user") return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="Nouvel utilisateur"><header class="modal-head"><h2>♙ Nouvel utilisateur</h2>${btn("✕","close-modal","btn icon-btn")}</header><form data-form="user"><div class="modal-body stack">
      ${field("Identifiant","username")}${field("Nom affiché (optionnel)","name")}${field("Mot de passe","password","","12 caractères min., dont au moins 3 types parmi minuscule, majuscule, chiffre, caractère spécial.","password")}
      <label class="checkline"><input type="checkbox" name="force" checked><span><b>Forcer le changement du mot de passe à la 1ʳᵉ connexion</b><br><span class="field-hint">Décochez pour un compte de service.</span></span></label>
      <label class="field">Rôle<select name="role"><option>Administrateur</option><option>Opérateur</option><option selected>Lecteur</option></select></label></div><footer class="modal-foot"><button type="button" class="btn" data-action="close-modal">Annuler</button><button type="submit" class="btn primary">Créer le compte</button></footer></form></section></div>`;
    if (state.modal === "password") return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="Changer mon mot de passe"><header class="modal-head"><h2>Changer mon mot de passe</h2>${btn("✕","close-modal","btn icon-btn")}</header><form data-form="password"><div class="modal-body stack">${field("Ancien mot de passe","old","","","password")}${field("Nouveau mot de passe","new","","12 caractères min., dont au moins 3 types parmi minuscule, majuscule, chiffre, caractère spécial.","password")}${field("Confirmer le nouveau mot de passe","confirm","","","password")}</div><footer class="modal-foot"><button type="button" class="btn" data-action="close-modal">Annuler</button><button type="submit" class="btn primary">Mettre à jour</button></footer></form></section></div>`;
    if (state.modal === "rename") return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="Renommer la connexion"><header class="modal-head"><h2>Renommer la connexion</h2>${btn("✕","close-modal","btn icon-btn")}</header><form data-form="rename"><div class="modal-body">${field("Nom de connexion","name",state.connections[0]?.name||"")}</div><footer class="modal-foot"><button type="button" class="btn" data-action="close-modal">Annuler</button><button type="submit" class="btn primary">Enregistrer</button></footer></form></section></div>`;
    if (state.modal === "alert-confirm") return `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="Confirmer la suppression"><header class="modal-head"><h2>Supprimer la connexion ?</h2>${btn("✕","close-modal","btn icon-btn")}</header><div class="modal-body"><p>Cette action retire la connexion du parc local.</p></div><footer class="modal-foot"><button class="btn" data-action="close-modal">Annuler</button><button class="btn danger" data-action="confirm-delete">Supprimer</button></footer></section></div>`;
    return "";
  }

  function downloadCsv(filename, rows) {
    const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g,'""')}"`).join(";")).join("\r\n");
    const link=document.createElement("a");
    link.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}));
    link.download=filename; link.click(); URL.revokeObjectURL(link.href);
  }
  function updatePerformanceHelpCount() {
    const sections = app.querySelectorAll(".performance-help-section");
    const open = app.querySelectorAll(".performance-help-section[open]").length;
    const count = app.querySelector("[data-help-count]");
    if (count) count.textContent = `${open}/${sections.length} sections ouvertes`;
    const control = app.querySelector('[data-action="help-collapse"]');
    if (control) {
      control.dataset.action = open === sections.length ? "help-collapse" : "help-expand";
      control.textContent = open === sections.length ? "⌃ Tout fermer" : "⌄ Tout ouvrir";
    }
  }
  function handleAction(action, target, ev) {
    if (!action) return;
    if (action.startsWith("route:")) return routeTo(action.slice(6));
    if (action.startsWith("domain:")) return routeTo("/supervision/"+action.slice(7));
    if (action.startsWith("env:")) { state.environment=action.slice(4); return render(); }
    if (action.startsWith("monitor:")) { state.monitor=action.slice(7); return render(); }
    if (action.startsWith("view:")) { state.fleetView=action.slice(5); return render(); }
    if (action.startsWith("alert:")) { state.alertFilter=action.slice(6); return render(); }
    if (action.startsWith("mailfilter:")) { state.journalFilter=action.slice(11); return render(); }
    if (action.startsWith("severity:")) { target.classList.toggle("active"); return; }
    if (action.startsWith("period:")) { target.parentElement.querySelectorAll(".btn").forEach(x=>x.classList.remove("active")); target.classList.add("active"); return; }
    if (action.startsWith("help-tab:")) { state.alertHelpTab=action.slice(9); return render(); }
    if (action === "help-collapse" || action === "help-expand") {
      app.querySelectorAll(".performance-help-section").forEach(section => {
        section.open = action === "help-expand";
      });
      updatePerformanceHelpCount();
      return;
    }
    if (action.startsWith("help-jump:")) {
      const section = app.querySelector(`#performance-help-${Number(action.slice(10))}`);
      if (section) {
        section.open = true;
        section.scrollIntoView({ behavior:"smooth", block:"start" });
        updatePerformanceHelpCount();
      }
      return;
    }
    if (action.startsWith("domain-tab:")) { state.domainTab=action.slice(11); return render(); }
    if (action === "process-essential-toggle") { state.processEssentialsOnly=!state.processEssentialsOnly; return render(); }
    if (action === "process-details") {
      try {
        state.processDetail = JSON.parse(decodeURIComponent(target.dataset.process || ""));
        state.modal = "process-detail";
      } catch {
        toast("Détails du processus indisponibles.");
      }
      return render();
    }
    if (action === "user-session-details") {
      try {
        state.userSessionDetail = JSON.parse(decodeURIComponent(target.dataset.userSession || ""));
        state.modal = "user-session-detail";
      } catch {
        toast("Détails de la session indisponibles.");
      }
      return render();
    }
    if (action === "user-session-sort") {
      const sortKey = target.dataset.sort === "memory" ? "memory" : "username";
      if (state.userSessionSort === sortKey) {
        state.userSessionSortDirection = state.userSessionSortDirection === "asc" ? "desc" : "asc";
      } else {
        state.userSessionSort = sortKey;
        state.userSessionSortDirection = sortKey === "memory" ? "desc" : "asc";
      }
      return render();
    }
    if (action === "capacity-critical-toggle") { state.capacityCriticalOnly=!state.capacityCriticalOnly; return render(); }
    if (action === "capacity-sort") { state.capacitySortDescending=!state.capacitySortDescending; return render(); }
    if (action.startsWith("reset-user:")) { toast("Lien de réinitialisation prêt (simulation locale)."); return; }
    if (action.startsWith("disable-user:")) { const i=+action.slice(13); state.users[i].active=!state.users[i].active; persist("users",state.users); return render(); }
    if (action.startsWith("delete-user:")) { const i=+action.slice(12); if(confirm("Supprimer cet utilisateur ?")) {state.users.splice(i,1);persist("users",state.users);render();} return; }
    if (action.startsWith("pdf:")) { toast("Document PDF non embarqué dans cette maquette hors ligne."); return; }
    if (action.startsWith("doc-entry:")) {
      const i=+action.slice(10); const targets=["/fleet","/supervision","/supervision","/alerts-history","/alerts-history","/settings","/mail-log","/alerts-analysis","/settings","/users"];
      return routeTo(targets[i]||"/documentation");
    }
    if (action === "new-connection") { state.connectionDraft=null; state.modal="connection"; state.openMenu=null; return render(); }
    if (action === "reconnect-oracle") { return requestReconnect(savedProfile()); }
    if (action === "disconnect-oracle") {
      apiRequest("/api/disconnect",{method:"POST"}).then(()=>{
        state.oracleRequestId++;state.oracleConnected=false;state.oracleConnection=null;state.oracleDomainData=null;state.oracleScores=null;
        state.oracleOverviewData=null;state.oracleDomainError="";state.oracleOverviewError="";
        state.activeConnection=null;toast("Session Oracle fermée. Les profils du parc sont conservés.");render();
      }).catch(error=>toast(error.message));
      return;
    }
    if (action === "new-user") { state.modal="user"; return render(); }
    if (action === "alert-help") { state.modal="alert-help"; state.alertHelpTab="overview"; return render(); }
    if (action === "mail-help") { state.modal="mail-help"; return render(); }
    if (action === "close-modal") { state.modal=null; state.connectionDraft=null; state.processDetail=null; state.userSessionDetail=null; return render(); }
    if (action === "backdrop") { if (target === ev.target) {state.modal=null;state.connectionDraft=null;state.processDetail=null;state.userSessionDetail=null;render();} return; }
    if (action === "language") { state.openMenu=state.openMenu==="language"?null:"language"; return render(); }
    if (action === "set-fr") {state.locale="fr";persist("locale",state.locale);state.openMenu=null;return render();}
    if (action === "set-en") {state.openMenu=null;toast("La maquette statique est disponible en français uniquement.");return render();}
    if (action === "toggle-locale") {toast("La maquette statique est disponible en français uniquement.");return;}
    if (action === "user-menu") {state.openMenu=state.openMenu==="user"?null:"user";return render();}
    if (action === "password-modal") {state.modal="password";state.openMenu=null;return render();}
    if (action === "logout") {persist("authenticated",false);return routeTo("/login");}
    if (action === "new-connection" || action === "edit-connection") {state.connectionDraft=null;state.modal="connection";state.openMenu=null;return render();}
    if (action === "connection-menu") {state.openMenu=state.openMenu==="connection"?null:"connection";return render();}
    if (action === "quick-stats") {state.openMenu=null;state.modal="quick-stats";return render();}
    if (action === "quick-diagnose") {state.openMenu=null;return state.oracleConnected?routeTo("/supervision/recommendations"):requestReconnect(savedProfile());}
    if (action === "copy-connection" || action === "copy-report") {navigator.clipboard?.writeText(JSON.stringify(state.connections[0]||sampleConnection)).then(()=>toast("Informations copiées.")).catch(()=>toast("Copie indisponible dans ce navigateur."));return;}
    if (action === "rename-connection") {state.openMenu=null;state.modal="rename";return render();}
    if (action === "edit-connection") {state.openMenu=null;state.modal="connection";return render();}
    if (action === "toggle-auto") {state.connections[0].auto=!state.connections[0].auto;persist("connections",state.connections);state.openMenu=null;return render();}
    if (action === "maintenance") {state.openMenu=null;toast("Planification de maintenance — paramètres de démonstration.");return;}
    if (action === "delete-connection") {state.openMenu=null;state.modal="alert-confirm";return render();}
    if (action === "confirm-delete") {state.connections=[];persist("connections",state.connections);state.modal=null;return render();}
    if (action === "open-supervision") {
      const index = Number(target.dataset.connectionIndex);
      const profile = Number.isInteger(index) && state.connections[index] ? state.connections[index] : savedProfile();
      if (profile) {
        state.activeConnection = profile;
        profile.lastUsed = "à l'instant";
        persist("connections", state.connections);
      }
      if (profile && profileIsActive(profile)) return routeTo("/supervision");
      if (profile && isSampleProfile(profile)) { state.connectionDraft=null; state.modal="connection"; return render(); }
      return requestReconnect(profile);
    }
    if (action === "reset-filters") {state.search="";state.environment="Tous";state.monitor="Tous";return render();}
    if (action === "reset-alerts" || action === "reset-mail") {state.alertFilter="Toutes";state.journalFilter="Tout";toast("Filtres réinitialisés.");return render();}
    if (action === "legend") {toast("États : opérationnel, attention, surveillance, critique et à la demande.");return;}
    if (action === "toggle-password") {const input=target.parentElement.querySelector("input");if(input){input.type=input.type==="password"?"text":"password";target.textContent=input.type==="password"?"Afficher":"Masquer";}return;}
    if (action === "toggle-refresh-menu") {state.refreshMenuOpen=!state.refreshMenuOpen;return render();}
    if (action === "set-refresh-interval") {
      const interval=Number(target.dataset.interval);
      if(!refreshIntervals.some(option=>option.milliseconds===interval)){toast("Fréquence d'actualisation invalide.");return;}
      state.refreshInterval=interval;
      state.refreshMenuOpen=false;
      persist("refreshInterval",interval);
      configureAutoRefresh();
      return render();
    }
    if (action === "refresh-domain" && state.oracleConnected) {loadOracleDomain(domainKey());return;}
    if (action === "logging-details") {toast("Détail de démonstration indisponible hors ligne.");return;}
    if (action === "logging-script") {toast("Script SQL de démonstration indisponible hors ligne.");return;}
    if (action === "refresh" || action === "refresh-domain") {toast("Données locales actualisées.");return;}
    if (action === "export") {
      downloadCsv("deynao-export.csv",[["Nom","Environnement","Serveur","Service","Utilisateur"],...state.connections.map(c=>[c.name,c.environment,c.host+":"+c.port,c.service,c.username])]);toast("Export CSV généré localement.");return;
    }
    if (action === "toggle-guide") {state.guideOpen=!state.guideOpen;return render();}
    if (action === "browse-alert") {document.getElementById("alert-file")?.click();return;}
    if (action === "analyze-file") {toast("Analyse hors ligne simulée : aucun moteur Oracle n'est inclus.");return;}
    if (action === "test-connection") {
      if (!state.backendAvailable) {toast("Test simulé : ouvrez la nouvelle application via FastAPI pour tester Oracle.");return;}
      const form=target.closest("form");
      const data=new FormData(form);
      const payload={host:data.get("host"),port:Number(data.get("port")||1521),service:data.get("service"),username:data.get("username"),password:data.get("password"),environment:data.get("environment"),name:data.get("name"),sysdba:data.has("sysdba")};
      if(!payload.host||!payload.service||!payload.username||!payload.password){toast("Renseignez l’hôte, le service, l’utilisateur et le mot de passe avant le test.");return;}
      target.disabled=true;
      apiRequest("/api/test-connection",{method:"POST",body:JSON.stringify(payload)})
        .then(result=>{if(result.local_only){toast("Test en mode local : pilote Oracle indisponible — connexion non vérifiée contre la base.");}else{toast("Connexion Oracle testée avec succès.");}})
        .catch(error=>toast(error.message))
        .finally(()=>{if(target.isConnected)target.disabled=false;});
      return;
    }
    if (action === "smtp-test" || action === "smtp-send" || action === "send-report") {toast("Envoi SMTP indisponible hors ligne. Les paramètres peuvent être enregistrés localement.");return;}
    if (action === "activate-license") {toast("Activation de licence impossible hors ligne.");return;}
    if (action === "recommend-filter") {state.domainTab="Plan d'action";toast("Plan d'action filtré par niveau.");return render();}
    if (action === "test-something") toast("Action de démonstration.");
  }

  app.addEventListener("click", event => {
    const routeEl=event.target.closest("[data-route]");
    if(routeEl){routeTo(routeEl.dataset.route);return;}
    const actionEl=event.target.closest("[data-action]");
    if(actionEl){handleAction(actionEl.dataset.action,actionEl,event);return;}
  });
  app.addEventListener("toggle", event => {
    if (event.target.matches(".performance-help-section")) updatePerformanceHelpCount();
  }, true);
  document.addEventListener("click", event => {
    if(state.refreshMenuOpen && !event.target.closest(".refresh-control")) {
      state.refreshMenuOpen=false;
      render();
    }
  });
  app.addEventListener("input", event => {
    if(event.target.matches("[data-search]")){state.search=event.target.value;const cursor=event.target.selectionStart;render();const next=app.querySelector("[data-search]");next?.focus();next?.setSelectionRange(cursor,cursor);}
    if(event.target.matches("[data-capacity-search]")){state.capacitySearch=event.target.value;const cursor=event.target.selectionStart;render();const next=app.querySelector("[data-capacity-search]");next?.focus();next?.setSelectionRange(cursor,cursor);}
    if(event.target.matches("[data-process-search]")){state.processSearch=event.target.value;const cursor=event.target.selectionStart;render();const next=app.querySelector("[data-process-search]");next?.focus();next?.setSelectionRange(cursor,cursor);}
    if(event.target.id==="alert-file"){const f=event.target.files?.[0];if(!f)return;if(f.size>100*1024*1024){toast("Fichier trop volumineux (100 Mo maximum).");return;}if(!/\.(log|txt|out)$/i.test(f.name)){toast("Format non pris en charge.");return;}state.uploadName=f.name;render();}
  });
  app.addEventListener("change", event => {
    if(event.target.matches("[data-user-role]")){state.users[+event.target.dataset.userRole].role=event.target.value;persist("users",state.users);toast("Rôle mis à jour.");}
  });
  app.addEventListener("submit", async event => {
    const form=event.target;
    if(!form.matches("form[data-form]"))return;
    event.preventDefault();
    const data=new FormData(form);
    if(form.dataset.form==="login"){persist("authenticated",true);return routeTo("/fleet");}
    if(form.dataset.form==="connection"){
      const isReconnect = Boolean(state.connectionDraft);
      const c={name:isReconnect ? state.connectionDraft.name : (data.get("name")||data.get("service")),host:isReconnect ? state.connectionDraft.host : data.get("host"),port:isReconnect ? state.connectionDraft.port : (data.get("port")||"1521"),service:isReconnect ? state.connectionDraft.service : data.get("service"),username:isReconnect ? state.connectionDraft.username : data.get("username"),environment:isReconnect ? state.connectionDraft.environment : data.get("environment"),sysdba:isReconnect ? state.connectionDraft.sysdba : data.has("sysdba"),auto:false,lastUsed:"à l'instant",hostname:"Oracle"};
      if(!c.host||!c.service||!c.username||!c.environment||!data.get("password")){toast("Renseignez tous les champs obligatoires.");return;}
      if(state.backendAvailable){
        try {
          const result=await apiRequest("/api/connect",{method:"POST",body:JSON.stringify({
            name:c.name,host:c.host,port:Number(c.port),service:c.service,username:c.username,
            password:String(data.get("password")),environment:c.environment,sysdba:c.sysdba
          })});
          if(result.local_only){
            state.oracleConnected=false;
            state.oracleConnection=null;
            upsertProfile(result.connection);
            state.activeConnection=result.connection;
            state.modal=null;
            state.connectionDraft=null;
            toast("Connexion enregistrée en mode local (pilote Oracle indisponible — collecte Oracle non disponible).");
            return routeTo("/supervision");
          }
          state.oracleConnected=true;
          state.oracleConnection=result.connection;
          state.oracleDomainData=null;state.oracleScores=null;state.oracleOverviewData=null;state.oracleDomainError="";state.oracleOverviewError="";
          upsertProfile(result.connection);
          state.modal=null;
          state.connectionDraft=null;
          toast("Connexion Oracle vérifiée. Aucune information secrète n’a été enregistrée.");
          return routeTo("/supervision");
        } catch(error) {
          if(error.message && error.message.includes("pilote Oracle n’est pas installé")){
            state.activeConnection=c;
            state.modal=null;
            state.connectionDraft=null;
            toast("Connexion enregistrée en mode local (pilote Oracle indisponible).");
            return routeTo("/supervision");
          }
          toast(error.message);
          return;
        }
      }
      if(data.get("save")){state.connections.unshift(c);persist("connections",state.connections);toast("Connexion ajoutée au parc local.");}
      else toast("Connexion ponctuelle — non conservée dans le parc.");
      state.activeConnection=c;state.modal=null;state.connectionDraft=null;routeTo("/supervision");
    }
    if(form.dataset.form==="user"){
      const username=String(data.get("username")||"").trim(), password=String(data.get("password")||"");
      if(!username||!strongPassword(password)){toast("Identifiant requis ; mot de passe de 12 caractères minimum avec au moins 3 types de caractères.");return;}
      if(state.users.some(u=>u.username===username)){toast("Cet identifiant existe déjà.");return;}
      state.users.push({username,name:data.get("name")||"",role:data.get("role"),active:true,last:"Jamais"});persist("users",state.users);state.modal=null;toast("Utilisateur créé localement.");render();
    }
    if(form.dataset.form==="settings"){
      state.settings={enabled:data.has("enabled"),server:data.get("server"),port:data.get("port"),user:data.get("user"),sender:data.get("sender"),emailLocale:data.get("emailLocale"),recipients:data.get("recipients"),daily:data.has("daily"),testEmail:data.get("testEmail"),tls:data.get("tls")};
      persist("settings",state.settings);toast("Paramètres enregistrés sur cet appareil.");render();
    }
    if(form.dataset.form==="rename"){if(state.connections[0]){state.connections[0].name=data.get("name");persist("connections",state.connections);}state.modal=null;render();}
    if(form.dataset.form==="password"){
      if(data.get("new")!==data.get("confirm")){toast("La confirmation ne correspond pas.");return;}
      if(!data.get("old")){toast("Renseignez l'ancien mot de passe.");return;}
      if(!strongPassword(String(data.get("new")))){toast("Le nouveau mot de passe doit contenir 12 caractères minimum et au moins 3 types de caractères.");return;}
      state.modal=null;toast("Mot de passe mis à jour (simulation locale).");render();
    }
  });
  window.addEventListener("hashchange",()=>{
    const route=location.hash.slice(1)||"/fleet";
    if(route===state.route)return;
    state.route=route;render();
    if(route.startsWith("/supervision"))loadOracleDomain(route.split("/")[2]||"overview");
  });
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"&&state.refreshMenuOpen){state.refreshMenuOpen=false;render();return;}
    if(event.key==="Escape"&&state.modal){state.modal=null;state.connectionDraft=null;state.processDetail=null;state.userSessionDetail=null;render();}
  });
  if(!location.hash) location.hash=state.route;
  configureAutoRefresh();
  render();
  initializeBackend();
})();
