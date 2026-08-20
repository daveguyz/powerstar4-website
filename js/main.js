/* ═══════════════════════════════════════════════════════════
   POWERSTAR4 — interactive behaviour
   ═══════════════════════════════════════════════════════════ */
"use strict";

/* ── Preloader ── */
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("preloader").classList.add("done"), 500);
});

/* ── Footer year ── */
document.getElementById("year").textContent = new Date().getFullYear();

/* ── Navbar: scroll state + progress bar + active link ── */
const navbar = document.getElementById("navbar");
const progress = document.getElementById("scroll-progress");
const toTop = document.getElementById("to-top");
const sections = [...document.querySelectorAll("section[id]")];
const navAnchors = [...document.querySelectorAll(".nav-links a")];

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle("scrolled", y > 40);
  toTop.classList.toggle("show", y > 600);

  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

  let current = sections[0]?.id;
  for (const s of sections) if (y >= s.offsetTop - 220) current = s.id;
  navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

/* ── Mobile menu ── */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", open);
});
navAnchors.forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open");
  hamburger.classList.remove("open");
}));

/* ── Scroll-reveal ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ── Animated counters ── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const dur = 1600;
    const t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll(".counter").forEach(el => counterObserver.observe(el));

/* ── Typed rotating words ── */
const words = [
  "Customs Clearing.",
  "Sea Freight.",
  "Air Freight.",
  "Vehicle Imports.",
  "Corridor Transit.",
  "Your Paperwork.",
];
const typedEl = document.getElementById("typed");
let wi = 0, ci = 0, deleting = false;
(function type() {
  const word = words[wi];
  typedEl.textContent = word.slice(0, ci);
  let delay = deleting ? 40 : 85;
  if (!deleting && ci === word.length) { delay = 1700; deleting = true; }
  else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
  else ci += deleting ? -1 : 1;
  setTimeout(type, delay);
})();

/* ── Hero particles (floating star-dust) ── */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

function sizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
function makeParticles() {
  const n = Math.min(70, Math.floor(canvas.width / 18));
  particles = Array.from({ length: n }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.2 + 0.6,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    hue: Math.random(),
  }));
}
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.hue < 0.75
      ? "rgba(163, 230, 53, 0.45)"
      : p.hue < 0.9 ? "rgba(96, 165, 250, 0.45)" : "rgba(248, 113, 113, 0.5)";
    ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
sizeCanvas(); makeParticles(); drawParticles();
addEventListener("resize", () => { sizeCanvas(); makeParticles(); });

/* ── 3D tilt on the hero logo card ── */
const tiltCard = document.getElementById("tilt-card");
if (matchMedia("(pointer: fine)").matches) {
  tiltCard.addEventListener("mousemove", e => {
    const r = tiltCard.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    tiltCard.style.transform = `rotateY(${dx * 16}deg) rotateX(${dy * -16}deg)`;
    tiltCard.style.animation = "none";
  });
  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "";
    tiltCard.style.animation = "";
  });
}

/* ── Quote estimator ── */
const estService = document.getElementById("est-service");
const estCargo = document.getElementById("est-cargo");
const estValue = document.getElementById("est-value");
const estValueOut = document.getElementById("est-value-out");
const estTotal = document.getElementById("est-total");
const estWhatsapp = document.getElementById("est-whatsapp");
const segBtns = [...document.querySelectorAll("#est-urgency .seg-btn")];
let urgencyMult = 1;

const fmt = n => n.toLocaleString("en-US");

function updateEstimate() {
  const base = +estService.selectedOptions[0].dataset.base;
  const cargoMult = +estCargo.value;
  const value = +estValue.value;
  // Value factor: small % of cargo value, softened with sqrt so it stays sensible
  const valueFactor = Math.round(Math.sqrt(value) * 4);
  const total = Math.round((base * cargoMult * urgencyMult + valueFactor) / 50) * 50;

  estValueOut.textContent = "N$ " + fmt(value);

  // animate the number
  const from = +estTotal.textContent.replace(/,/g, "") || 0;
  const t0 = performance.now();
  (function tick(t) {
    const p = Math.min((t - t0) / 400, 1);
    estTotal.textContent = fmt(Math.round(from + (total - from) * p));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);

  const msg = `Hi Powerstar4! I'd like a firm quote.%0A%0AService: ${estService.selectedOptions[0].text}%0ACargo: ${estCargo.selectedOptions[0].text}%0AApprox. value: N$ ${fmt(value)}%0AUrgency: ${segBtns.find(b => b.classList.contains("active")).textContent.trim()}%0AWebsite estimate: N$ ${fmt(total)}`;
  estWhatsapp.href = `https://wa.me/264810000000?text=${msg}`;
}
segBtns.forEach(b => b.addEventListener("click", () => {
  segBtns.forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  urgencyMult = +b.dataset.mult;
  updateEstimate();
}));
[estService, estCargo].forEach(el => el.addEventListener("change", updateEstimate));
estValue.addEventListener("input", updateEstimate);
updateEstimate();

/* ── Testimonial slider ── */
const slides = document.getElementById("slides");
const slideEls = [...slides.children];
const dotsWrap = document.getElementById("dots");
let index = 0, timer;

slideEls.forEach((_, i) => {
  const d = document.createElement("button");
  d.className = "dot" + (i === 0 ? " active" : "");
  d.setAttribute("aria-label", "Go to testimonial " + (i + 1));
  d.addEventListener("click", () => go(i));
  dotsWrap.appendChild(d);
});
const dots = [...dotsWrap.children];

function go(i) {
  index = (i + slideEls.length) % slideEls.length;
  slideEls.forEach(s => s.style.transform = `translateX(-${index * 100}%)`);
  dots.forEach((d, j) => d.classList.toggle("active", j === index));
  restartAuto();
}
function restartAuto() {
  clearInterval(timer);
  timer = setInterval(() => go(index + 1), 6000);
}
document.getElementById("prev").addEventListener("click", () => go(index - 1));
document.getElementById("next").addEventListener("click", () => go(index + 1));
restartAuto();

// swipe support
let touchX = null;
slides.addEventListener("touchstart", e => touchX = e.touches[0].clientX, { passive: true });
slides.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });

/* ── FAQ: close others when one opens ── */
const faqItems = [...document.querySelectorAll(".faq-item")];
faqItems.forEach(item => item.addEventListener("toggle", () => {
  if (item.open) faqItems.forEach(o => { if (o !== item) o.open = false; });
}));

/* ── Contact form → opens email client with a prefilled message ── */
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("cf-name").value.trim();
  const phone = document.getElementById("cf-phone").value.trim();
  const email = document.getElementById("cf-email").value.trim();
  const service = document.getElementById("cf-service").value;
  const msg = document.getElementById("cf-msg").value.trim();

  const subject = encodeURIComponent(`Website enquiry: ${service} — ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nPhone/WhatsApp: ${phone}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${msg}`
  );
  location.href = `mailto:powerstarfourtradingcc2026@gmail.com?subject=${subject}&body=${body}`;
  document.getElementById("form-note").textContent =
    "✔ Opening your email app… If nothing happens, email us directly at powerstarfourtradingcc2026@gmail.com";
});
