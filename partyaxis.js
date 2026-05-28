function $(sel) {
  return document.querySelector(sel);
}

function $all(sel) {
  return Array.from(document.querySelectorAll(sel));
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setWarn(el, isWarn) {
  if (!el) return;
  el.classList.toggle("warn", Boolean(isWarn));
}

function getConfig() {
  return window.PARTYAXIS_CONFIG || null;
}

// #region agent log
function __partyaxisDbg(hypothesisId, location, message, data) {
  const payload = {
    sessionId: "0be169",
    hypothesisId,
    location,
    message,
    data: data || {},
    timestamp: Date.now(),
    runId: "pre",
  };
  try {
    const w = window;
    w.__PARTYAXIS_DEBUG_LOG = w.__PARTYAXIS_DEBUG_LOG || [];
    w.__PARTYAXIS_DEBUG_LOG.push(payload);
    if (w.__PARTYAXIS_DEBUG_LOG.length > 80) w.__PARTYAXIS_DEBUG_LOG.shift();
  } catch (_) {
    /* ignore */
  }
  try {
    if (typeof console !== "undefined" && console.info && new URLSearchParams(window.location.search).get("debug") === "1") {
      console.info(`[PartyAxisDebug] ${message}`, data || {});
    }
  } catch (_) {
    /* ignore */
  }
  __partyaxisDbgPanelRefresh();
}

function __partyaxisDbgPanelRefresh() {
  try {
    if (new URLSearchParams(window.location.search).get("debug") !== "1") return;
    const root = document.body || document.documentElement;
    if (!root) return;
    let el = document.getElementById("partyaxis-debug-panel");
    if (!el) {
      el = document.createElement("pre");
      el.id = "partyaxis-debug-panel";
      el.setAttribute(
        "style",
        "position:fixed;bottom:0;left:0;right:0;max-height:32vh;overflow:auto;background:#111;color:#cfc;font:11px/1.35 monospace;z-index:99999;margin:0;padding:10px;border-top:1px solid #444;",
      );
      root.appendChild(el);
    }
    const log = window.__PARTYAXIS_DEBUG_LOG || [];
    el.textContent = JSON.stringify(log.slice(-20), null, 2);
  } catch (_) {
    /* ignore */
  }
}
// #endregion

function usesPhpApi() {
  const b = getConfig()?.apiBase;
  return typeof b === "string" && b.trim().length > 0;
}

function apiUrl(path) {
  const base = String(getConfig()?.apiBase || "").replace(/\/$/, "");
  const p = String(path || "").replace(/^\//, "");
  return `${base}/${p}`;
}

async function apiFetchJson(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && typeof options.body === "string" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const r = await fetch(apiUrl(path), { credentials: "include", ...options, headers });
  const text = await r.text();
  let j = {};
  try {
    j = text ? JSON.parse(text) : {};
  } catch {
    // #region agent log
    __partyaxisDbg("H2", "partyaxis.js:apiFetchJson", "parse_non_json", {
      path: String(path || ""),
      status: r.status,
      textLen: text ? text.length : 0,
    });
    // #endregion
    const looksLikePhpSource = /^\s*<\?php\b/i.test(String(text || "")) || /declare\(strict_types=1\)/i.test(String(text || ""));
    if (looksLikePhpSource) {
      // #region agent log
      __partyaxisDbg("H6", "partyaxis.js:apiFetchJson", "php_source_detected", {
        path: String(path || ""),
        status: r.status,
      });
      // #endregion
      throw new Error("__PREVIEW_PHP_SOURCE__");
    }
    throw new Error(text || r.statusText);
  }
  if (!r.ok) {
    // #region agent log
    __partyaxisDbg("H3", "partyaxis.js:apiFetchJson", "http_error", {
      path: String(path || ""),
      status: r.status,
      errHead: String(j.error || j.message || "").slice(0, 120),
    });
    // #endregion
    const err = new Error(j.error || j.message || text || r.statusText);
    err.status = r.status;
    err.body = j;
    throw err;
  }
  return j;
}

async function loadBackendAuth() {
  if (!usesPhpApi()) return null;
  try {
    const j = await apiFetchJson("me.php");
    if (!j?.user) return null;
    return {
      session: { user: { id: String(j.user.id), email: j.user.email } },
      profile: { role: j.user.role, email: j.user.email },
    };
  } catch (e) {
    if (String(e?.message || "") === "__PREVIEW_PHP_SOURCE__") {
      return { previewPhp: true };
    }
    return null;
  }
}

function showConfigBanner(message) {
  if (document.getElementById("partyaxis-config-banner")) return;
  const banner = document.createElement("div");
  banner.id = "partyaxis-config-banner";
  banner.className = "config-banner";
  banner.textContent = message;
  document.body.prepend(banner);
}

function ensureAuthModals() {
  if (document.getElementById("partyaxis-auth-modals")) return;

  const root = document.createElement("div");
  root.id = "partyaxis-auth-modals";
  root.innerHTML = `
    <div id="signup-modal" class="auth-modal hidden" role="dialog" aria-modal="true" aria-labelledby="signup-modal-title">
      <div class="auth-modal-backdrop" data-close-auth tabindex="-1"></div>
      <div class="auth-modal-sheet panel">
        <button type="button" class="auth-modal-close" data-close-auth aria-label="Close">&times;</button>
        <h2 id="signup-modal-title" class="section-title">Sign up</h2>
        <p class="muted small">Create an account to publish an ad.</p>
        <form id="signup-form" novalidate>
          <label for="signup-email">Email</label>
          <input id="signup-email" type="email" placeholder="you@example.com" autocomplete="email" required>
          <label for="signup-password">Password</label>
          <input id="signup-password" type="password" placeholder="Minimum 8 characters" minlength="8" autocomplete="new-password" required>
          <label for="signup-confirm">Confirm password</label>
          <input id="signup-confirm" type="password" placeholder="Re-enter password" minlength="8" autocomplete="new-password" required>
          <div id="signup-agreements-wrap" class="auth-step-hidden">
            <p class="muted small" style="margin:0.75rem 0 0.5rem">Before creating your account:</p>
            <label class="inline-check">
              <input id="terms-check" type="checkbox" required>
              <span>I agree to the <a href="terms.html" target="_blank" rel="noopener">Terms &amp; Conditions</a>.</span>
            </label>
            <label class="inline-check">
              <input id="privacy-check" type="checkbox" required>
              <span>I have read the <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>.</span>
            </label>
            <label class="inline-check">
              <input id="rules-check" type="checkbox" required>
              <span>I agree to the acceptable-use and safety rules in the <a href="terms.html#acceptable-use" target="_blank" rel="noopener">Terms</a> (including lawful, respectful listings).</span>
            </label>
            <label class="inline-check">
              <input id="age-check" type="checkbox" required>
              <span>I confirm I am <strong>21+</strong>.</span>
            </label>
            <button class="btn" type="submit" style="margin-top:0.75rem">Create account</button>
          </div>
          <p id="signup-message" class="status" aria-live="polite"></p>
        </form>
      </div>
    </div>
    <div id="login-modal" class="auth-modal hidden" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div class="auth-modal-backdrop" data-close-auth tabindex="-1"></div>
      <div class="auth-modal-sheet panel">
        <button type="button" class="auth-modal-close" data-close-auth aria-label="Close">&times;</button>
        <h2 id="login-modal-title" class="section-title">Log in</h2>
        <p class="muted small">Sign in to publish an ad.</p>
        <form id="login-form" novalidate>
          <label for="login-email">Email</label>
          <input id="login-email" type="email" placeholder="you@example.com" autocomplete="username" required>
          <label for="login-password">Password</label>
          <input id="login-password" type="password" placeholder="Your password" autocomplete="current-password" required>
          <button class="btn" type="submit" style="margin-top:0.5rem">Log in</button>
          <p id="login-message" class="status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  root.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-auth]")) closeAuthModals();
  });
}

function openAuthModal(which) {
  ensureAuthModals();
  closeAuthModals();
  const id = which === "signup" ? "signup-modal" : "login-modal";
  const el = document.getElementById(id);
  if (!el) return;
  if (which === "signup") {
    document.getElementById("signup-form")?.reset();
    document.getElementById("signup-message") && (document.getElementById("signup-message").textContent = "");
    updateSignupAgreementsVisibility();
  } else {
    setText("login-message", "");
    const lm = document.getElementById("login-message");
    if (lm) setWarn(lm, false);
  }
  el.classList.remove("hidden");
  document.body.classList.add("auth-modal-open");
  const focusSel = which === "signup" ? "#signup-email" : "#login-email";
  setTimeout(() => document.querySelector(focusSel)?.focus(), 50);
}

function closeAuthModals() {
  document.querySelectorAll("#partyaxis-auth-modals .auth-modal").forEach((m) => m.classList.add("hidden"));
  document.body.classList.remove("auth-modal-open");
}

function openLoginModal() {
  openAuthModal("login");
}

function signupStep1Complete() {
  const email = document.getElementById("signup-email")?.value.trim() || "";
  const p = document.getElementById("signup-password")?.value || "";
  const c = document.getElementById("signup-confirm")?.value || "";
  const emailOk = email.length > 3 && email.includes("@");
  return emailOk && p.length >= 8 && p === c;
}

function updateSignupAgreementsVisibility() {
  const wrap = document.getElementById("signup-agreements-wrap");
  if (!wrap) return;
  wrap.classList.toggle("auth-step-hidden", !signupStep1Complete());
}

let authModalAnchorsWired = false;

function wireAuthModalAnchors() {
  if (authModalAnchorsWired) return;
  authModalAnchorsWired = true;

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!document.body.classList.contains("auth-modal-open")) return;
    closeAuthModals();
  });

  document.body.addEventListener("click", (e) => {
    const authOk = usesPhpApi();
    const open = e.target.closest("[data-auth-open]");
    if (open) {
      e.preventDefault();
      if (!authOk) {
        return;
      }
      const which = open.getAttribute("data-auth-open");
      if (which === "signup") openAuthModal("signup");
      if (which === "login") openAuthModal("login");
      return;
    }

    const legacySignup = e.target.closest('a[href="signup.html"]');
    const legacyLogin = e.target.closest('a[href="login.html"]');
    if (legacySignup || legacyLogin) {
      e.preventDefault();
      if (!authOk) {
        return;
      }
      if (legacySignup) openAuthModal("signup");
      if (legacyLogin) openAuthModal("login");
    }
  });
}

function formatEventWhen(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function renderEventCard(event) {
  const when = formatEventWhen(event.start_at);
  const vis = event.visibility === "invite_only" ? "invite_only" : "public";
  const img = event.image_url || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";

  const article = document.createElement("article");
  article.className = "event-card";
  article.dataset.date = event.start_at.slice(0, 10);
  article.dataset.visibility = vis;
  article.dataset.keywords = `${event.title} ${event.description || ""} ${event.city || ""} ${event.event_type}`.toLowerCase();

  article.innerHTML = `
    <img src="${img}" alt="">
    <div class="event-body">
      <span class="badge">${event.status === "approved" ? "Live" : event.status}</span>
      <h3>${escapeHtml(event.title)}</h3>
      <p class="muted">${escapeHtml(when)} • ${escapeHtml(event.city || "Singapore")}</p>
    </div>
  `;
  return article;
}

function seedDemoEvents(grid, { highlightOnly }) {
  const demos = [
    {
      title: "Rooftop sunset session",
      start_at: "2026-05-02T18:00:00.000Z",
      city: "Singapore",
      event_type: "party",
      visibility: "public",
      description: "DJ sets and skyline views.",
      status: "approved",
      is_highlight: true,
    },
    {
      title: "Lantern night market",
      start_at: "2026-05-09T17:00:00.000Z",
      city: "Singapore",
      event_type: "market",
      visibility: "public",
      description: "Street food, music, and crafts.",
      status: "approved",
      is_highlight: false,
    },
    {
      title: "Members lounge (invite)",
      start_at: "2026-05-14T21:00:00.000Z",
      city: "Singapore",
      event_type: "social",
      visibility: "invite_only",
      description: "Members-only evening.",
      status: "approved",
      is_highlight: false,
    },
  ];
  const list = highlightOnly ? demos.filter((d) => d.is_highlight) : demos;
  grid.innerHTML = "";
  list.forEach((ev) => grid.appendChild(renderEventCard(ev)));
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isInternalOrTechnicalErrorMessage(m) {
  const s = String(m || "").toLowerCase();
  if (!s) return true;
  if (s.includes("config.example") || s.includes("config.php") || s.includes("api/")) return true;
  if (s.includes("api not configured")) return true;
  if (s.includes("sql") || s.includes("pdo") || s.includes("stack trace")) return true;
  return false;
}

function userFacingError(err, fallback) {
  const m = String(err?.message || "").trim();
  if (!m) return fallback;
  if (m.length > 180 || /[\r\n<{]/.test(m)) return fallback;
  if (isInternalOrTechnicalErrorMessage(m)) return fallback;
  return m;
}

function parseAiQuery(text) {
  const q = text.toLowerCase();
  const intent = { keyword: "", weekend: false, week: false, month: false };

  if (q.includes("weekend") || q.includes("this weekend")) intent.weekend = true;
  if (q.includes("this week")) intent.week = true;
  if (q.includes("this month")) intent.month = true;

  // naive keyword extraction: strip common words
  const cleaned = text
    .replace(/this weekend|weekend|this week|this month|looking for|i am|i'm|im|party|events?/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  intent.keyword = cleaned;

  return intent;
}

function applyKeywordFilter(keyword) {
  const cards = $all("#events-grid .event-card");
  const kw = keyword.trim().toLowerCase();
  cards.forEach((card) => {
    const hay = (card.dataset.keywords || card.textContent || "").toLowerCase();
    const match = !kw || hay.includes(kw);
    card.dataset.keywordMatch = match ? "1" : "0";
  });
}

function applyCombinedFilters() {
  const filterDate = $("#filter-date");
  const filterRange = $("#filter-range");
  const filterVisibility = $("#filter-visibility");
  const cards = $all("#events-grid .event-card");

  function inSelectedRange(cardDate, range) {
    if (range === "all") return true;
    const now = new Date();
    const diffMs = cardDate.getTime() - now.getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    if (range === "week") return diffMs >= 0 && diffMs <= dayMs * 7;
    if (range === "month") return diffMs >= 0 && diffMs <= dayMs * 31;
    if (range === "weekend") {
      // next Saturday/Sunday window from "now" (simple heuristic)
      const day = now.getDay(); // 0 Sun
      const daysUntilSat = (6 - day + 7) % 7;
      const sat = new Date(now);
      sat.setHours(0, 0, 0, 0);
      sat.setDate(sat.getDate() + (daysUntilSat === 0 && now.getHours() >= 12 ? 7 : daysUntilSat));
      const sun = new Date(sat);
      sun.setDate(sun.getDate() + 1);
      sun.setHours(23, 59, 59, 999);
      return cardDate >= sat && cardDate <= sun;
    }
    return true;
  }

  const dateValue = filterDate ? filterDate.value : "";
  const rangeValue = filterRange ? filterRange.value : "all";
  const visibilityValue = filterVisibility ? filterVisibility.value : "all";

  cards.forEach((card) => {
    const cardDateText = card.dataset.date;
    const cardVisibility = card.dataset.visibility || "public";
    const cardDate = new Date(`${cardDateText}T00:00:00`);

    const matchesDate = !dateValue || cardDateText === dateValue;
    const matchesRange = inSelectedRange(cardDate, rangeValue);
    const matchesVisibility = visibilityValue === "all" || cardVisibility === visibilityValue;
    const matchesKeyword = card.dataset.keywordMatch !== "0";

    card.style.display = matchesDate && matchesRange && matchesVisibility && matchesKeyword ? "" : "none";
  });
}

async function wireHeaderAuth() {
  let authSlot = document.getElementById("header-auth");
  const headerActions = document.querySelector(".header-actions");
  if (!authSlot && headerActions) {
    authSlot = document.createElement("div");
    authSlot.id = "header-auth";
    authSlot.className = "header-auth";
    headerActions.appendChild(authSlot);
  }
  if (!authSlot) return;

  if (!usesPhpApi()) {
    authSlot.innerHTML = ``;
    return;
  }

  const ctx = await loadBackendAuth();
  // #region agent log
  __partyaxisDbg("H7", "partyaxis.js:wireHeaderAuth", "header_ctx_state", {
    hasCtx: Boolean(ctx),
    hasSession: Boolean(ctx?.session),
    previewPhp: Boolean(ctx?.previewPhp),
  });
  // #endregion
  if (ctx?.previewPhp) {
    // #region agent log
    __partyaxisDbg("H7", "partyaxis.js:wireHeaderAuth", "header_preview_message", {});
    // #endregion
    authSlot.innerHTML = ``;
    return;
  }
  if (!ctx?.session) {
    // #region agent log
    __partyaxisDbg("H7", "partyaxis.js:wireHeaderAuth", "header_not_signed_in", {});
    // #endregion
    document.querySelectorAll('[data-auth-open="signup"], [data-auth-open="login"]').forEach((el) => { el.style.display = ""; });
    authSlot.innerHTML = ``;
    return;
  }

  document.querySelectorAll('[data-auth-open="signup"], [data-auth-open="login"]').forEach((el) => { el.style.display = "none"; });
  const { session, profile } = ctx;
  const role = profile?.role || "user";
  // #region agent log
  __partyaxisDbg("H7", "partyaxis.js:wireHeaderAuth", "header_signed_in", {
    role,
  });
  // #endregion
  authSlot.innerHTML = `
    <span class="muted">${escapeHtml(session.user.email || "")}</span>
    ${["admin", "moderator"].includes(role) ? `<a class="btn btn-small btn-outline" href="/bosslogin/">Console</a>` : ""}
    <button class="btn btn-small btn-outline" type="button" id="header-logout">Logout</button>
  `;

  $("#header-logout")?.addEventListener("click", async () => {
    try {
      await apiFetchJson("logout.php", { method: "POST", body: "{}" });
    } catch {
      /* still navigate */
    }
    window.location.href = "index.html";
  });
}

function newsletterEmailOk() {
  const email = document.getElementById("newsletter-email")?.value.trim() || "";
  return email.length > 3 && email.includes("@");
}

async function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;
  if (form.dataset.partyaxisNewsletterBound === "1") return;
  form.dataset.partyaxisNewsletterBound = "1";

  const consentWrap = () => document.getElementById("newsletter-consent-wrap");

  if (!usesPhpApi()) {
    document.getElementById("newsletter-continue")?.addEventListener("click", () => {
      const msg = document.getElementById("newsletter-message");
      setText("newsletter-message", "Newsletter isn’t available on this preview.");
      setWarn(msg, true);
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("newsletter-message");
      setText("newsletter-message", "Newsletter isn’t available on this preview.");
      setWarn(msg, true);
    });
    return;
  }

  document.getElementById("newsletter-continue")?.addEventListener("click", () => {
    const msg = document.getElementById("newsletter-message");
    if (!newsletterEmailOk()) {
      setText("newsletter-message", "Enter a valid email, then click Continue.");
      setWarn(msg, true);
      return;
    }
    consentWrap()?.classList.remove("auth-step-hidden");
    document.getElementById("newsletter-consent")?.focus();
    setText("newsletter-message", "Review and tick the agreement, then Subscribe.");
    setWarn(msg, false);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletter-email")?.value.trim();
    const consent = document.getElementById("newsletter-consent")?.checked;
    const msg = document.getElementById("newsletter-message");
    const wrap = consentWrap();

    if (wrap?.classList.contains("auth-step-hidden")) {
      setText("newsletter-message", "Click Continue first, then agree and Subscribe.");
      setWarn(msg, true);
      return;
    }

    if (!email) {
      setText("newsletter-message", "Enter your email.");
      setWarn(msg, true);
      return;
    }
    if (!consent) {
      setText("newsletter-message", "Please tick the agreement to subscribe.");
      setWarn(msg, true);
      return;
    }

    try {
      await apiFetchJson("newsletter.php", {
        method: "POST",
        body: JSON.stringify({
          email,
          source: window.location.pathname,
          marketing_consent: true,
        }),
      });
    } catch (err) {
      setText("newsletter-message", userFacingError(err, "Couldn’t subscribe. Try again."));
      setWarn(msg, true);
      return;
    }

    setText("newsletter-message", "Subscribed. Thank you!");
    setWarn(msg, false);
    form.reset();
    document.getElementById("newsletter-consent") && (document.getElementById("newsletter-consent").checked = false);
    wrap?.classList.add("auth-step-hidden");
  });
}

async function initSignup() {
  const form = document.getElementById("signup-form");
  if (!form) return;
  if (form.dataset.partyaxisBound === "1") return;
  form.dataset.partyaxisBound = "1";

  if (!usesPhpApi()) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("signup-message");
      setText("signup-message", "Accounts aren’t open on this preview yet.");
      setWarn(msg, true);
    });
    return;
  }

  ["signup-email", "signup-password", "signup-confirm"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", () => {
      updateSignupAgreementsVisibility();
      const msg = document.getElementById("signup-message");
      if (msg) {
        msg.textContent = "";
        setWarn(msg, false);
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;

    const terms = document.getElementById("terms-check")?.checked;
    const privacy = document.getElementById("privacy-check")?.checked;
    const rules = document.getElementById("rules-check")?.checked;
    const age = document.getElementById("age-check")?.checked;

    const msg = document.getElementById("signup-message");

    if (!signupStep1Complete()) {
      setText("signup-message", "Enter a valid email and matching passwords (8+ characters).");
      setWarn(msg, true);
      updateSignupAgreementsVisibility();
      return;
    }

    updateSignupAgreementsVisibility();
    const wrap = document.getElementById("signup-agreements-wrap");
    if (wrap?.classList.contains("auth-step-hidden")) {
      setText("signup-message", "Complete the fields above to continue.");
      setWarn(msg, true);
      return;
    }

    if (!email || password.length < 8) {
      setText("signup-message", "Enter valid email and password (8+ chars).");
      setWarn(msg, true);
      return;
    }
    if (password !== confirm) {
      setText("signup-message", "Passwords do not match.");
      setWarn(msg, true);
      return;
    }
    if (!terms || !privacy || !rules || !age) {
      setText("signup-message", "Please complete all agreements to continue.");
      setWarn(msg, true);
      return;
    }

    try {
      await apiFetchJson("register.php", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          terms_accepted: true,
          privacy_accepted: true,
          rules_accepted: true,
          age_21_plus: true,
        }),
      });
    } catch (err) {
      setText("signup-message", userFacingError(err, "Couldn’t create account. Try again."));
      setWarn(msg, true);
      return;
    }
    setText("signup-message", "Account created. Redirecting...");
    setWarn(msg, false);
    closeAuthModals();
    window.location.href = "create-event.html";
  });
}

async function initLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;
  if (form.dataset.partyaxisBound === "1") return;
  form.dataset.partyaxisBound = "1";

  if (!usesPhpApi()) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("login-message");
      setText("login-message", "Sign-in isn’t available on this preview. You can still browse sample events.");
      setWarn(msg, true);
    });
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const msg = document.getElementById("login-message");

    let user;
    try {
      const j = await apiFetchJson("login.php", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      user = j.user;
    } catch (err) {
      setText("login-message", userFacingError(err, "Couldn’t sign in. Check email and password."));
      setWarn(msg, true);
      return;
    }
    closeAuthModals();
    if (["admin", "moderator"].includes(user?.role)) {
      window.location.href = "bosslogin/";
      return;
    }
    window.location.href = "create-event.html";
  });
}

async function initCreateEvent() {
  const form = document.getElementById("event-form");
  if (!form) return;

  if (!usesPhpApi()) {
    setText("event-message", "Posting ads isn’t available on this preview.");
    setWarn(document.getElementById("event-message"), true);
    return;
  }

  const ctx = await loadBackendAuth();
  if (ctx?.previewPhp) {
    setText("event-message", "Posting ads isn’t available in this preview (PHP isn’t running here).");
    setWarn(document.getElementById("event-message"), true);
    return;
  }
  const session = ctx?.session;
  if (!session) {
    setText("event-message", "Please sign in to publish (use Log in in the header).");
    setWarn(document.getElementById("event-message"), true);
    openLoginModal();
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("event-message");

    const eventType = document.getElementById("event-type").value;
    const title = document.getElementById("event-title").value.trim();
    const date = document.getElementById("event-date").value;
    const time = document.getElementById("event-time").value;
    const location = document.getElementById("event-location").value.trim();
    const imageUrl = document.getElementById("event-image").value.trim();
    const description = document.getElementById("event-description").value.trim();
    const visibility = document.getElementById("event-visibility")?.value || "public";
    const terms = document.getElementById("event-terms")?.checked;

    if (!eventType || !title || !date || !time || !location || !description) {
      setText("event-message", "Please complete required fields.");
      setWarn(msg, true);
      return;
    }
    if (!terms) {
      setText("event-message", "Please confirm your listing complies with the Terms & Conditions.");
      setWarn(msg, true);
      return;
    }

    const startAt = new Date(`${date}T${time}:00`);
    const payload = {
      event_type: eventType,
      title,
      description,
      start_at: startAt.toISOString(),
      city: "Singapore",
      location_name: location,
      address: location,
      visibility,
      image_url: imageUrl || null,
    };

    try {
      await apiFetchJson("events.php", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      setText("event-message", userFacingError(err, "Couldn’t submit. Try again."));
      setWarn(msg, true);
      return;
    }

    setText("event-message", "Submitted for admin approval.");
    setWarn(msg, false);
    form.reset();
  });
}

async function loadPublicEvents({ highlightOnly }) {
  const grid = document.getElementById("events-grid");
  if (!grid) return;

  if (usesPhpApi()) {
    try {
      const q = highlightOnly ? "events.php?highlight=1" : "events.php";
      const j = await apiFetchJson(q);
      grid.innerHTML = "";
      (j.data || [])
        .filter((ev) => ev && ev.start_at)
        .forEach((ev) => grid.appendChild(renderEventCard(ev)));
      applyCombinedFilters();
      // #region agent log
      __partyaxisDbg("H4", "partyaxis.js:loadPublicEvents", "php_path_ok", {
        highlightOnly: Boolean(highlightOnly),
        count: Array.isArray(j.data) ? j.data.length : -1,
      });
      // #endregion
    } catch (err) {
      // #region agent log
      __partyaxisDbg("H3", "partyaxis.js:loadPublicEvents", "php_path_catch", {
        highlightOnly: Boolean(highlightOnly),
        status: err?.status,
        msgLen: String(err?.message || "").length,
      });
      // #endregion
      if (String(err?.message || "") === "__PREVIEW_PHP_SOURCE__") {
        seedDemoEvents(grid, { highlightOnly });
        applyCombinedFilters();
        // #region agent log
        __partyaxisDbg("H6", "partyaxis.js:loadPublicEvents", "fallback_seed_demo_events", {
          highlightOnly: Boolean(highlightOnly),
        });
        // #endregion
        return;
      }
      const line = userFacingError(err, "Couldn’t load events. Refresh the page or try again in a moment.");
      grid.innerHTML = `<p class="muted">${escapeHtml(line)}</p>`;
    }
    return;
  }

  seedDemoEvents(grid, { highlightOnly });
  applyCombinedFilters();
}

async function initEventsPage() {
  await loadPublicEvents({ highlightOnly: false });

  const aiForm = document.getElementById("ai-search-form");
  const aiInput = document.getElementById("ai-search");
  const filterRange = $("#filter-range");

  aiForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = aiInput?.value || "";
    const intent = parseAiQuery(text);

    if (intent.weekend && filterRange) filterRange.value = "weekend";
    else if (intent.week && filterRange) filterRange.value = "week";
    else if (intent.month && filterRange) filterRange.value = "month";

    applyKeywordFilter(intent.keyword);
    applyCombinedFilters();

    const cfg = getConfig();
    if (cfg?.aiParseUrl) {
      try {
        const resp = await fetch(cfg.aiParseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text }),
        });
        if (resp.ok) {
          const parsed = await resp.json();
          if (parsed?.keyword) applyKeywordFilter(parsed.keyword);
          if (parsed?.range && filterRange) filterRange.value = parsed.range;
          applyCombinedFilters();
        }
      } catch {
        // ignore network errors; parser already applied
      }
    }
  });

  document.getElementById("filter-search-btn")?.addEventListener("click", () => {
    applyCombinedFilters();
  });
}

function adminBadge(status) {
  const safe = escapeHtml(status || "unknown");
  return `<span class="admin-badge admin-badge-${safe}">${safe.replace("_", " ")}</span>`;
}

function adminEventTemplate(ev) {
  const isHighlight = Number(ev.is_highlight) === 1 || ev.is_highlight === true;
  const subtitle = [
    `ID: ${ev.id}`,
    ev.event_type || "event",
    ev.start_at || "no date",
    ev.host_email ? `by ${ev.host_email}` : "unknown host",
  ].join(" • ");
  return `
    <div class="admin-card" data-id="${escapeHtml(String(ev.id))}" data-kind="event">
      <div class="admin-card-main">
        <div class="admin-card-topline">
          <strong>${escapeHtml(ev.title || "Untitled")}</strong>
          ${adminBadge(ev.status)}
          ${isHighlight ? `<span class="admin-badge">highlight</span>` : ""}
        </div>
        <div class="muted">${escapeHtml(subtitle)}</div>
        <details class="admin-details">
          <summary>View details</summary>
          <div class="admin-mini-row"><span>Location</span><strong>${escapeHtml(ev.location_name || ev.address || "-")}</strong></div>
          <div class="admin-mini-row"><span>Visibility</span><strong>${escapeHtml(ev.visibility || "public")}</strong></div>
          <div class="admin-mini-row"><span>Description</span><strong>${escapeHtml((ev.description || "").slice(0, 500))}</strong></div>
          ${ev.rejection_reason ? `<div class="admin-mini-row"><span>Reject reason</span><strong>${escapeHtml(ev.rejection_reason)}</strong></div>` : ""}
        </details>
      </div>
      <div class="admin-actions">
        <button class="btn btn-small admin-approve" type="button">Approve</button>
        <button class="btn btn-small btn-outline admin-reject" type="button">Reject</button>
        <button class="btn btn-small btn-outline admin-highlight" type="button">${isHighlight ? "Unhighlight" : "Highlight"}</button>
        <button class="btn btn-small btn-outline admin-delete" type="button">Delete</button>
      </div>
    </div>
  `;
}

function setAdminGateMessage(text) {
  const el = document.querySelector(".admin-gate-text");
  if (el) el.textContent = text;
}

function unlockAdminChrome() {
  document.body.classList.remove("admin-gate-pending");
  document.body.classList.add("admin-unlocked");
  document.title = "Party Axis | Admin";
}

async function initAdmin() {
  const root = document.getElementById("admin-root");
  if (!root) return;

  if (!usesPhpApi()) {
    setAdminGateMessage("This console isn’t available on this preview.");
    return;
  }

  const ctx = await loadBackendAuth();
  if (ctx?.previewPhp) {
    setAdminGateMessage("This console needs a live PHP API. Open it from your hosted site.");
    return;
  }
  if (!ctx?.session) {
    setAdminGateMessage("Redirecting to sign in…");
    window.location.replace("../index.html#login");
    return;
  }

  if (!["admin", "moderator"].includes(ctx.profile?.role)) {
    setAdminGateMessage("Redirecting…");
    window.location.replace("../events.html");
    return;
  }

  unlockAdminChrome();

  document.getElementById("logout-btn")?.addEventListener("click", async () => {
    try {
      await apiFetchJson("logout.php", { method: "POST", body: "{}" });
    } catch {
      /* still leave */
    }
    window.location.href = "../index.html#login";
  });

  async function postAdminAction(payload, fallback) {
    try {
      await apiFetchJson("admin-action.php", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await refresh(document.getElementById("admin-status-filter")?.value || "pending_review");
    } catch (err) {
      alert(userFacingError(err, fallback || "Action failed."));
    }
  }

  function bindAdminActionsPhp() {
    document.getElementById("admin-status-filter")?.addEventListener("change", (e) => refresh(e.target.value));

    root.querySelectorAll(".admin-approve").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.closest(".admin-card")?.dataset.id;
        if (id) postAdminAction({ event_id: Number(id), action: "approve", note: "" }, "Approve failed.");
      });
    });

    root.querySelectorAll(".admin-reject").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.closest(".admin-card")?.dataset.id;
        if (!id) return;
        const reason = window.prompt("Rejection reason (optional)") || "Rejected by moderator";
        postAdminAction({ event_id: Number(id), action: "reject", note: reason }, "Reject failed.");
      });
    });

    root.querySelectorAll(".admin-highlight").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.closest(".admin-card")?.dataset.id;
        if (id) postAdminAction({ event_id: Number(id), action: "toggle_highlight" }, "Highlight update failed.");
      });
    });

    root.querySelectorAll(".admin-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.closest(".admin-card")?.dataset.id;
        if (!id || !window.confirm("Delete this event permanently?")) return;
        postAdminAction({ event_id: Number(id), action: "delete_event" }, "Delete failed.");
      });
    });

    root.querySelectorAll(".admin-save-role").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".admin-card");
        const id = card?.dataset.id;
        const role = card?.querySelector(".admin-role-select")?.value;
        if (!id || !role) return;
        postAdminAction({ user_id: Number(id), action: "set_user_role", role }, "Role update failed.");
      });
    });
  }

  async function refresh(status = "pending_review") {
    let data;
    try {
      data = await apiFetchJson(`admin.php?status=${encodeURIComponent(status)}`);
    } catch (e) {
      if (e.status === 401) {
        window.location.replace("../index.html#login");
        return;
      }
      if (e.status === 403) {
        window.location.replace("../events.html");
        return;
      }
      root.innerHTML = `<p class="muted">Couldn’t load this page. Try signing in again.</p>`;
      return;
    }

    const canManageUsers = Boolean(data.can_manage_users);
    const stats = data.stats || {};
    const selected = data.status || status;
    const options = ["pending_review", "approved", "rejected", "draft", "all"]
      .map((x) => `<option value="${x}" ${selected === x ? "selected" : ""}>${x.replace("_", " ")}</option>`)
      .join("");

    const eventsHtml = (data.events || []).map(adminEventTemplate).join("");

    const usersHtml = (data.users || [])
      .map((u) => {
        const roleOptions = ["user", "moderator", "admin"]
          .map((role) => `<option value="${role}" ${u.role === role ? "selected" : ""}>${role}</option>`)
          .join("");
        return `
          <div class="admin-card" data-id="${escapeHtml(String(u.id))}" data-kind="user">
            <div>
              <strong>${escapeHtml(u.email)}</strong>
              <div class="muted">User ID: ${escapeHtml(String(u.id))} • Current role: ${escapeHtml(u.role)}</div>
            </div>
            <div class="admin-actions">
              <select class="input admin-role-select" aria-label="User role">${roleOptions}</select>
              <button class="btn btn-small btn-outline admin-save-role" type="button">Save</button>
            </div>
          </div>
        `;
      })
      .join("");

    const subscribersHtml = (data.subscribers || [])
      .map((s) => `<div class="admin-mini-row"><span>${escapeHtml(s.email)}</span><strong>${escapeHtml(s.created_at || "")}</strong></div>`)
      .join("");

    const auditHtml = (data.audits || [])
      .map((a) => `<div class="admin-mini-row"><span>${escapeHtml(a.action)} • event ${escapeHtml(String(a.event_id || "-"))}</span><strong>${escapeHtml(a.admin_email || "system")} ${escapeHtml(a.created_at || "")}</strong></div>`)
      .join("");

    root.innerHTML = `
      <div class="panel">
        <h2>${canManageUsers ? "Admin" : "Moderator"} Console</h2>
        <p class="muted">Signed in as ${escapeHtml(data.me?.email || "")} • Role: ${escapeHtml(data.me?.role || "")}</p>
        <div class="admin-stats">
          <div class="admin-stat"><strong>${Number(stats.pending_review || 0)}</strong><span>Pending</span></div>
          <div class="admin-stat"><strong>${Number(stats.approved || 0)}</strong><span>Approved</span></div>
          <div class="admin-stat"><strong>${Number(stats.rejected || 0)}</strong><span>Rejected</span></div>
          ${canManageUsers ? `<div class="admin-stat"><strong>${Number(stats.users || 0)}</strong><span>Users</span></div>` : ""}
        </div>
      </div>

      <div class="panel">
        <div class="admin-section-head">
          <div><h2>Events</h2><p class="muted">Approve, reject, highlight, or delete listings.</p></div>
          <select id="admin-status-filter" class="input" aria-label="Filter events by status">${options}</select>
        </div>
        ${eventsHtml || `<p class="muted">No events found.</p>`}
      </div>

      ${canManageUsers ? `
      <div class="panel">
        <h2>Users</h2>
        ${usersHtml || `<p class="muted">No users.</p>`}
      </div>
      <div class="panel">
        <h2>Newsletter subscribers</h2>
        ${subscribersHtml || `<p class="muted">No subscribers.</p>`}
      </div>` : ""}

      <div class="panel">
        <h2>Audit log</h2>
        ${auditHtml || `<p class="muted">No audit logs.</p>`}
      </div>
    `;

    bindAdminActionsPhp();
  }

  await refresh();
}

async function main() {
  const page = document.body.dataset.page || "public";
  // #region agent log
  __partyaxisDbg("H1", "partyaxis.js:main", "main_start", {
    page,
    usesApi: usesPhpApi(),
    apiBaseLen: String(getConfig()?.apiBase || "").length,
  });
  // #endregion

  ensureAuthModals();
  wireAuthModalAnchors();
  initSignup();
  initLogin();

  if (page === "admin") {
    await initAdmin();
    return;
  }

  await wireHeaderAuth();
  await initNewsletter();

  if (page === "create-event") await initCreateEvent();
  if (page === "events") await initEventsPage();
  if (page === "highlights") await loadPublicEvents({ highlightOnly: true });

  if (usesPhpApi() && (location.hash === "#signup" || location.hash === "#login")) {
    const h = location.hash;
    history.replaceState(null, "", location.pathname + location.search);
    if (h === "#signup") openAuthModal("signup");
    if (h === "#login") openAuthModal("login");
  }
  // #region agent log
  __partyaxisDbg("H1", "partyaxis.js:main", "main_complete", { page });
  // #endregion
}

document.addEventListener("DOMContentLoaded", () => {
  // year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  main().catch((err) => {
    console.error(err);
    // #region agent log
    __partyaxisDbg("H5", "partyaxis.js:DOMContentLoaded", "main_rejected", {
      msgLen: String(err?.message || "").length,
      name: String(err?.name || ""),
    });
    // #endregion
    showConfigBanner("Something went wrong loading this page. Refresh and try again.");
  });
});
