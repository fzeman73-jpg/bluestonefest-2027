/* ============================================================
   KONFIGURACE — tady měňte odkazy, nic jiného není potřeba
   ============================================================ */
const CONFIG = {
  // Odkaz na akci v GoOut. Tlačítka „Koupit“ se přepnou na GoOut
  // automaticky, jakmile je odkaz vyplněný A nastal saleStart.
  // Do té doby vedou na formulář „Dej mi vědět“.
  ticketUrl: "",
  saleStart: "2026-11-15T00:00:00+01:00", // start předprodeje
  // Meta Pixel ID z Business Manageru (15–16 číslic). Prázdné = žádné měření
  // a žádná cookie lišta. Pixel se načte jen po souhlasu návštěvníka.
  metaPixelId: "1858381068538076",
  // Google Analytics 4 – ID měření (G-…). Načte se taky jen po souhlasu.
  gaId: "G-CDNWD8GHRX",
  // Formulář „Dejte mi vědět“ → Google Apps Script (zápis do Google tabulky + e-mail)
  signupUrl: "https://script.google.com/macros/s/AKfycbxwUANpuI0SbvmZ2tTiHzQUFEW7sZBiCNBO9zXqb0MHmBhKYmbKO6TqDb_tZFCtmSps/exec",
  instagram: "https://www.instagram.com/bluestone_fest/",
  facebook: "https://www.facebook.com/bluestonefest",
  festivalStart: "2027-07-10T14:00:00+02:00",
  earlyBirdSoldOut: false // po vyprodání 200 ks přepněte na true
};

const SALE_LIVE = !!CONFIG.ticketUrl && Date.now() >= new Date(CONFIG.saleStart).getTime();

/* ---------- souhlas s cookies + Meta Pixel ---------- */
const Consent = (function () {
  const KEY = "bs_consent"; // "all" | "necessary"
  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const set = v => { try { localStorage.setItem(KEY, v); } catch (e) {} };
  let pixelOn = false, gaOn = false;
  const enabled = () => !!(CONFIG.metaPixelId || CONFIG.gaId);

  function loadGA() {
    if (gaOn || !CONFIG.gaId) return;
    gaOn = true;
    window["ga-disable-" + CONFIG.gaId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    const t = document.createElement("script");
    t.async = true; t.src = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.gaId;
    document.head.appendChild(t);
    window.gtag("js", new Date());
    window.gtag("config", CONFIG.gaId);
  }

  function loadAll() { loadPixel(); loadGA(); }

  function loadPixel() {
    if (pixelOn || !CONFIG.metaPixelId) return;
    pixelOn = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", CONFIG.metaPixelId);
    window.fbq("track", "PageView");
  }

  function injectStyles() {
    const css = `
.cc{position:fixed;left:12px;right:12px;bottom:12px;z-index:1000;max-width:560px;margin:0 auto;
  background:var(--navy,#000a3d);color:#fff;border-radius:14px;border:2px solid var(--orange,#f5a623);padding:16px 18px;box-shadow:0 10px 40px rgba(0,0,0,.35);
  font-size:14px;line-height:1.45}
.cc[hidden]{display:none}
.cc p{margin:0 0 12px}
.cc a{color:inherit;text-decoration:underline}
.cc__btns{display:flex;gap:8px;flex-wrap:wrap}
.cc__btns button{flex:1 1 140px;cursor:pointer;border-radius:999px;padding:10px 14px;font:inherit;font-weight:700;border:2px solid #fff}
.cc__all{background:var(--orange,#fff);border-color:var(--orange,#fff)!important;color:var(--navy,#000a3d)}
.cc__nec{background:transparent;color:#fff}
.cc-open{background:none;border:0;padding:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer;opacity:.8}`;
    const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
  }

  function banner() {
    let el = document.querySelector(".cc");
    if (el) return el;
    injectStyles();
    el = document.createElement("div");
    el.className = "cc"; el.hidden = true;
    el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Souhlas s cookies");
    el.innerHTML = '<p>Rádi bychom měřili návštěvnost webu (Google Analytics) a to, jak fungují naše reklamy na Facebooku a Instagramu (Meta Pixel). ' +
      'Bez tvého souhlasu nic takového nenačteme. <a href="/ochrana-osobnich-udaju.html">Víc info</a></p>' +
      '<div class="cc__btns"><button type="button" class="cc__all">Souhlasím</button>' +
      '<button type="button" class="cc__nec">Jen nezbytné</button></div>';
    document.body.appendChild(el);
    el.querySelector(".cc__all").onclick = () => { set("all"); el.hidden = true; loadAll(); };
    el.querySelector(".cc__nec").onclick = () => {
      set("necessary"); el.hidden = true;
      if (pixelOn && window.fbq) window.fbq("consent", "revoke");
      if (gaOn && CONFIG.gaId) window["ga-disable-" + CONFIG.gaId] = true;
    };
    return el;
  }

  function open() { if (enabled()) banner().hidden = false; }

  function init() {
    if (!enabled()) return;
    // odkaz „Nastavení cookies“ v patičce
    const privacy = document.querySelector('.foot a[href="ochrana-osobnich-udaju.html"]');
    if (privacy) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "cc-open"; b.textContent = "Nastavení cookies";
      b.onclick = open;
      privacy.after(" · ", b);
    }
    const c = get();
    const ask = new URLSearchParams(location.search).has("cookies");
    if (c === "all" && !ask) loadAll();
    else if (!c || ask) open();
  }

  // Meta název události → GA4 doporučená událost
  const GA_EVENT = { Lead: "generate_lead", InitiateCheckout: "begin_checkout" };
  function track(event, params) {
    if (pixelOn && window.fbq) window.fbq("track", event, params || {});
    if (gaOn && window.gtag) window.gtag("event", GA_EVENT[event] || event, params || {});
  }

  return { init, track, open };
})();
Consent.init();

/* ---------- vstupenky ---------- */
// Odkaz na GoOut včetně UTM parametrů, se kterými návštěvník přišel z reklamy
function ticketHref() {
  try {
    const u = new URL(CONFIG.ticketUrl);
    const here = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(k => {
      if (here.has(k) && !u.searchParams.has(k)) u.searchParams.set(k, here.get(k));
    });
    return u.toString();
  } catch (e) { return CONFIG.ticketUrl; }
}

if (SALE_LIVE) {
  const href = ticketHref();
  const price = CONFIG.earlyBirdSoldOut ? "1 059" : "990";
  document.querySelectorAll("[data-ticket]").forEach(a => {
    a.href = href; a.target = "_blank"; a.rel = "noopener";
    a.addEventListener("click", () => Consent.track("InitiateCheckout", { currency: "CZK" }));
  });
  // texty tlačítek, které mluví o „předprodeji od 15. 11.“
  const txt = (sel, t) => { const el = document.querySelector(sel); if (el) el.textContent = t; };
  txt(".nav .btn[data-ticket]", "Vstupenky");
  txt(".hero__cta .btn[data-ticket]", "Koupit vstupenky");
  txt(".final .btn[data-ticket]", "Koupit vstupenky");
  txt(".sticky-cta", "Koupit vstupenky · od " + price + " Kč");
  // formulář „Dej mi vědět“ už není potřeba
  const su = document.querySelector(".signup");
  if (su) su.style.display = "none";
  // texty, které před startem zvou k zanechání e-mailu
  const lead = document.querySelector("#vstupenky .sec__head .lead");
  if (lead) lead.innerHTML = "Pět kapel za cenu jednoho koncertu. Předprodej právě běží a cena v čase poroste. <strong>Kup si lístky hned.</strong>";
  const note = document.querySelector("#vstupenky > .wrap > .note");
  if (note) note.textContent = "Všechny ceny jsou včetně DPH. Vstupenky prodáváme přes GoOut.";
  document.querySelectorAll("#faq details").forEach(d => {
    const s = d.querySelector("summary");
    if (s && /Kdy začne předprodej/.test(s.textContent)) {
      s.textContent = "Kde koupím vstupenky?";
      d.querySelector("p").innerHTML = 'Předprodej běží od 15. 11. 2026 přes GoOut. <a class="link" href="' + href + '" target="_blank" rel="noopener">Koupit vstupenky →</a>';
    }
  });
  const btn = document.querySelector(".final .btn[data-ticket]");
  if (btn) btn.textContent = "Koupit vstupenky";
}

["instagram", "facebook"].forEach(k => {
  document.querySelectorAll(`[data-social="${k}"]`).forEach(a => {
    if (CONFIG[k]) { a.href = CONFIG[k]; a.target = "_blank"; a.rel = "noopener"; }
    else a.style.display = "none";
  });
});
{ const e = document.querySelector("[data-social-empty]");
  if (e && (CONFIG.instagram || CONFIG.facebook)) e.remove(); }

/* ---------- aktuální cenová vlna ---------- */
(function () {
  const today = new Date();
  const d = s => new Date(s + "T00:00:00+01:00");
  const items = [...document.querySelectorAll("[data-waves] li")];
  if (CONFIG.earlyBirdSoldOut) items[0].classList.add("is-past");
  let marked = false;
  items.forEach((li, i) => {
    if (i === 0 && CONFIG.earlyBirdSoldOut) return;
    const from = d(li.dataset.from), to = d(li.dataset.to);
    to.setDate(to.getDate() + 1);
    if (today >= to) li.classList.add("is-past");
    else if (!marked && today >= from) { li.classList.add("is-now"); marked = true; }
  });
  // Před startem prodeje zvýrazníme super early bird jako „první vlnu“
  if (!marked && items[0] && !items[0].classList.contains("is-past")) items[0].classList.add("is-now");

  const banner = document.querySelector("[data-phase-banner]");
  if (today < new Date(CONFIG.saleStart)) return; // před startem nechat text „Předprodej od 15. 11.“
  const now = document.querySelector("[data-waves] li.is-now");
  if (banner && now) {
    banner.querySelector("b").textContent = now.querySelector("h3").textContent + " " + now.querySelector(".waves__price").textContent;
    banner.querySelector("span").textContent = now.querySelector(".waves__when").textContent;
  }
})();

/* ---------- formulář: zájem o předprodej ---------- */
(function () {
  const f = document.querySelector("[data-signup]");
  if (!f) return;
  // Vlastní validace se srozumitelnou hláškou: iOS Safari u neplatného formuláře
  // nic neukáže a tlačítko pak působí jako nefunkční.
  f.noValidate = true;
  const msg = f.querySelector("[data-signup-msg]");
  const btn = f.querySelector("button");
  const ok = f.querySelector('input[name="souhlas"]');
  const say = (cls, html) => { msg.className = "signup__msg" + (cls ? " " + cls : ""); msg.innerHTML = html; };
  f.addEventListener("submit", async e => {
    e.preventDefault();
    const email = f.email.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      say("is-err", "Zadej prosím platný e-mail."); f.email.focus(); return;
    }
    if (!ok.checked) {
      say("is-err", "Zaškrtni prosím souhlas s kontaktováním."); ok.focus(); return;
    }
    btn.disabled = true; say("", "Odesílám…");
    try {
      const r = await fetch(CONFIG.signupUrl, {
        method: "POST",
        body: JSON.stringify({
          jmeno: f.jmeno.value, email: email, souhlas: "ano",
          stranka: location.href
        })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.success !== true) throw new Error(j.message || r.status);
      f.reset();
      Consent.track("Lead"); // jen událost, e-mail se do Mety neposílá
      say("is-ok", "Díky! Ozveme se ti, jakmile 15. 11. spustíme předprodej.");
    } catch (err) {
      say("is-err", 'Odeslání se nepovedlo. Napiš nám prosím na <a href="mailto:iva.kuchar@gmail.com">iva.kuchar@gmail.com</a>.');
    } finally { btn.disabled = false; }
  });
})();

/* ---------- odpočet ---------- */
(function () {
  const target = new Date(CONFIG.festivalStart).getTime();
  const el = k => document.querySelector(`[data-cd="${k}"]`);
  function tick() {
    let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    el("d").textContent = Math.floor(s / 86400); s %= 86400;
    el("h").textContent = Math.floor(s / 3600); s %= 3600;
    el("m").textContent = Math.floor(s / 60);
    el("s").textContent = s % 60;
  }
  tick(); setInterval(tick, 1000);
})();

/* ---------- galerie + lightbox ---------- */
(function () {
  const items = [...document.querySelectorAll("[data-gal] .ph")];
  const SHOW = 14;
  const more = document.querySelector("[data-gal-more]");
  if (items.length > SHOW) items.slice(SHOW).forEach(a => a.classList.add("is-hidden"));
  else if (more) more.remove();
  if (more) more.addEventListener("click", () => { items.forEach(a => a.classList.remove("is-hidden")); more.remove(); });

  const lb = document.querySelector("[data-lbox]");
  const img = lb.querySelector("img");
  let i = 0;
  const show = n => { i = (n + items.length) % items.length; img.src = items[i].href; lb.hidden = false; };
  items.forEach((a, n) => a.addEventListener("click", e => { e.preventDefault(); show(n); }));
  lb.querySelector(".lb__x").onclick = () => lb.hidden = true;
  lb.querySelector(".lb__prev").onclick = e => { e.stopPropagation(); show(i - 1); };
  lb.querySelector(".lb__next").onclick = e => { e.stopPropagation(); show(i + 1); };
  lb.addEventListener("click", e => { if (e.target === lb) lb.hidden = true; });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") lb.hidden = true;
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
  });

  // pouze jedno video hraje najednou
  const vids = [...document.querySelectorAll("#galerie video")];
  vids.forEach(v => v.addEventListener("play", () => vids.forEach(o => o !== v && o.pause())));
})();

/* ---------- navigace ---------- */
const nav = document.querySelector(".nav");
const burger = document.querySelector(".nav__burger");
const sticky = document.querySelector(".sticky-cta");
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("is-solid", y > 40);
  if (sticky) sticky.classList.toggle("is-on", y > window.innerHeight * 0.8);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".nav__links a").forEach(a =>
  a.addEventListener("click", () => { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", false); })
);
