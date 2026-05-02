/**
 * ============================================================================
 * script.js — Portafolio Julio César Zorrilla
 * - Animaciones al hacer scroll (Intersection Observer)
 * - Sombra en navbar al desplazarse
 * - Modal de proyectos (título y descripción dinámicos)
 * - Formulario de contacto (validación Bootstrap + mensaje local)
 * - Botón volver arriba
 * ============================================================================
 */

(function () {
  "use strict";

  /* ---------- Cargar datos desde site-config.js ---------- */
  function applySiteConfig() {
    const cfg = window.JCZ_SITE;
    if (!cfg) return;

    const waBtn = document.getElementById("jcz-wa-btn");
    const waFloat = document.getElementById("jcz-wa-float");
    const mailLink = document.getElementById("jcz-mail-link");
    const mailRow = document.getElementById("jcz-mail-row");
    const phoneText = document.getElementById("jcz-phone-text");
    const locText = document.getElementById("jcz-location-text");
    const footSocial = document.getElementById("jcz-footer-social");

    const d = (cfg.whatsappDigitos || "").replace(/\D/g, "");
    if (waBtn && d.length >= 11) {
      const msg = encodeURIComponent(
        "Hola " + (cfg.nombre || "Julio") + ", te contacto desde tu sitio web."
      );
      waBtn.href = "https://wa.me/" + d + "?text=" + msg;
      waBtn.classList.remove("disabled", "opacity-50");
    } else if (waBtn) {
      waBtn.href = "#contacto";
      waBtn.title = "Configurá WhatsApp en assets/js/site-config.js";
    }

    if (waFloat) {
      if (d.length >= 11) {
        const msg = encodeURIComponent(
          "Hola " + (cfg.nombre || "Julio") + ", te contacto desde tu sitio web."
        );
        waFloat.href = "https://wa.me/" + d + "?text=" + msg;
        waFloat.classList.remove("d-none");
      } else {
        waFloat.classList.add("d-none");
        waFloat.href = "#contacto";
        waFloat.title = "Configurá WhatsApp en assets/js/site-config.js";
      }
    }

    if (mailLink && mailRow) {
      const em = (cfg.email || "").trim();
      if (em) {
        mailLink.href = "mailto:" + em;
        mailLink.textContent = em;
        mailRow.classList.remove("d-none");
      } else {
        mailRow.classList.add("d-none");
      }
    }

    if (phoneText && cfg.telefonoTexto) {
      phoneText.textContent = cfg.telefonoTexto;
    }

    if (locText && cfg.ubicacion) {
      const u = cfg.ubicacion;
      locText.textContent = [u.ciudad, u.departamento, u.pais].filter(Boolean).join(", ");
    }

    if (footSocial) {
      const msg = encodeURIComponent(
        "Hola " + (cfg.nombre || "Julio") + ", te contacto desde tu sitio web."
      );
      const waHref =
        d.length >= 11 ? "https://wa.me/" + d + "?text=" + msg : "";

      const items = [
        waHref && {
          href: waHref,
          label: "WhatsApp",
          icon: "bi-whatsapp",
          className: "footer-social-link--wa",
        },
        cfg.linkedin && {
          href: cfg.linkedin,
          label: "LinkedIn",
          icon: "bi-linkedin",
        },
        cfg.github && {
          href: cfg.github,
          label: "GitHub",
          icon: "bi-github",
        },
        cfg.instagram && {
          href: cfg.instagram,
          label: "Instagram",
          icon: "bi-instagram",
        },
      ].filter(Boolean);

      footSocial.innerHTML = "";
      items.forEach(function (item) {
        const a = document.createElement("a");
        a.href = item.href;
        a.className = "footer-social-link" + (item.className ? " " + item.className : "");
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.title = item.label;
        a.innerHTML = '<i class="bi ' + item.icon + '" aria-hidden="true"></i>';
        footSocial.appendChild(a);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applySiteConfig);
  } else {
    applySiteConfig();
  }

  /* ---------- Navbar: sombra al hacer scroll ---------- */
  const navbar = document.querySelector(".nav-glass");

  function updateNavbarShadow() {
    if (!navbar) return;
    if (window.scrollY > 24) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNavbarShadow, { passive: true });
  updateNavbarShadow();

  /* ---------- Scroll reveal: elementos con clase .reveal ---------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08,
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* Sin IntersectionObserver: mostrar todo */
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Modal proyectos: cargar título y descripción desde data-* ---------- */
  const modalProyecto = document.getElementById("modal-proyecto");

  if (modalProyecto) {
    modalProyecto.addEventListener("show.bs.modal", function (event) {
      const button = event.relatedTarget;
      if (!button) return;
      const title = button.getAttribute("data-title") || "Proyecto";
      const desc = button.getAttribute("data-desc") || "";

      const titleEl = modalProyecto.querySelector("#modal-proyecto-label");
      const descEl = modalProyecto.querySelector("#modal-proyecto-desc");
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
    });
  }

  /* ---------- Formulario contacto ---------- */
  const formContacto = document.getElementById("form-contacto");
  const formFeedback = document.getElementById("form-feedback");

  if (formContacto) {
    formContacto.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!formContacto.checkValidity()) {
        formContacto.classList.add("was-validated");
        if (formFeedback) {
          formFeedback.classList.add("d-none");
        }
        return;
      }

      formContacto.classList.remove("was-validated");

      /* Aquí podés integrar Formspree, EmailJS, o envío al backend */
      if (formFeedback) {
        formFeedback.textContent =
          "¡Gracias! En esta versión el formulario no envía correo todavía: conectalo a tu PHP, Formspree o EmailJS cuando quieras publicar el sitio.";
        formFeedback.classList.remove("d-none", "text-danger");
        formFeedback.classList.add("text-success");
      }

      formContacto.reset();
    });
  }

  /* ---------- Cerrar menú móvil al hacer clic en un enlace ---------- */
  const navCollapse = document.querySelector("#navbarNav");
  const bsCollapse = navCollapse && window.bootstrap
    ? bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false })
    : null;

  document.querySelectorAll('.navbar-nav .nav-link[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth < 992 && navCollapse && navCollapse.classList.contains("show") && bsCollapse) {
        bsCollapse.hide();
      }
    });
  });

  /* ---------- Volver arriba ---------- */
  const btnTop = document.getElementById("btn-top");
  if (btnTop) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 400) {
          btnTop.classList.add("btn-top--visible");
        } else {
          btnTop.classList.remove("btn-top--visible");
        }
      },
      { passive: true }
    );
    btnTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
