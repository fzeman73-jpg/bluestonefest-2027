/* ============================================================
   KONFIGURACE — tady měňte odkazy, nic jiného není potřeba
   ============================================================ */
const CONFIG = {
  // Odkaz na prodej vstupenek v Boom Events. Dokud je prázdný,
  // tlačítka vedou na sekci Vstupenky na webu.
  ticketUrl: "",
  instagram: "",
  facebook: "",
  // Video z minulého ročníku: YouTube ID (např. "dQw4w9WgXcQ")
  // nebo cesta k souboru v repozitáři (např. "assets/video/bluestone-2026.mp4").
  video: "",
  festivalStart: "2027-07-10T14:00:00+02:00",
  earlyBirdSoldOut: false // po vyprodání 200 ks přepněte na true
};

/* ---------- vstupenky ---------- */
document.querySelectorAll("[data-ticket]").forEach(a => {
  if (CONFIG.ticketUrl) {
    a.href = CONFIG.ticketUrl;
    a.target = "_blank";
    a.rel = "noopener";
  }
});
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
  const now = document.querySelector("[data-waves] li.is-now");
  if (banner && now) {
    banner.querySelector("b").textContent = now.querySelector("h3").textContent + " " + now.querySelector(".waves__price").textContent;
    banner.querySelector("span").textContent = now.querySelector(".waves__when").textContent;
  }
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

/* ---------- video ---------- */
(function () {
  const slot = document.querySelector("[data-video-slot]");
  if (!slot || !CONFIG.video) return;
  if (/^[\w-]{11}$/.test(CONFIG.video)) {
    slot.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${CONFIG.video}" title="Bluestone Fest video" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
  } else {
    slot.innerHTML = `<video src="${CONFIG.video}" controls playsinline preload="metadata" poster="assets/img/223.jpg"></video>`;
  }
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
