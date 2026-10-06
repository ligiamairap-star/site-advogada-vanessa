/* ==========================================================================
   Dra. Vanessa — Advocacia · scripts
   ========================================================================== */

/* EDITAR: número de WhatsApp com DDI + DDD, só dígitos (ex.: 5511999998888) */
const WHATSAPP_NUMBER = "5511958582279";
/* EDITAR: como o número aparece no site */
const WHATSAPP_DISPLAY = "(11) 95858-2279";

const whatsUrl = (msg) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

/* Links de WhatsApp ------------------------------------------------------ */
document.querySelectorAll("[data-whats]").forEach((el) => {
  el.href = whatsUrl(el.dataset.whats);
  el.target = "_blank";
  el.rel = "noopener";
});
document.querySelectorAll("[data-phone-display]").forEach((el) => {
  el.textContent = WHATSAPP_DISPLAY;
});

/* Ano no rodapé */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Header ao rolar -------------------------------------------------------- */
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* Menu mobile ------------------------------------------------------------ */
const nav = document.getElementById("nav");
const toggle = document.getElementById("nav-toggle");

const setMenu = (open) => {
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  document.body.style.overflow = open ? "hidden" : "";
};

toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) {
    setMenu(false);
    toggle.focus();
  }
});

/* Link ativo na navegação ----------------------------------------------- */
const navLinks = [...document.querySelectorAll(".nav__link")];
const sections = navLinks
  .map((l) => document.querySelector(l.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((l) =>
        l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

/* Fallback da revelação ao rolar ---------------------------------------
   Só roda em navegadores sem scroll-driven animations (ex.: Firefox). */
if (!CSS.supports("(animation-timeline: view()) and (animation-range: entry)")) {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--d", i % 3);
    revealObserver.observe(el);
  });
}

/* Máscara de telefone ---------------------------------------------------- */
const phoneInput = document.getElementById("f-telefone");
phoneInput.addEventListener("input", () => {
  const d = phoneInput.value.replace(/\D/g, "").slice(0, 11);
  let out = d;
  if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  phoneInput.value = out;
});

/* Formulário → WhatsApp ------------------------------------------------- */
const form = document.getElementById("contact-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = new FormData(form);
  const msg = [
    "Olá, Dra. Vanessa! Vim pelo site e gostaria de agendar uma consulta.",
    "",
    `*Nome:* ${data.get("nome")}`,
    `*Telefone:* ${data.get("telefone")}`,
    `*Área:* ${data.get("area")}`,
  ];
  if (data.get("mensagem")) msg.push(`*Caso:* ${data.get("mensagem")}`);

  window.open(whatsUrl(msg.join("\n")), "_blank", "noopener");
  form.reset();
});
