document.addEventListener("DOMContentLoaded", () => {
  // ─── Live Date & Time ───
  const liveDateEl = document.getElementById("dashboard-live-date");
  const liveTimeEl = document.getElementById("dashboard-live-time");

  function updateLiveDateTime() {
    const now = new Date();
    if (liveDateEl) {
      liveDateEl.textContent = now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    if (liveTimeEl) {
      liveTimeEl.textContent = now.toLocaleTimeString("en-IN", {
        hour12: false,
      });
    }
  }
  updateLiveDateTime();
  if (liveTimeEl) setInterval(updateLiveDateTime, 1000);

  // ─── Mobile Menu ───
  const menuBtn = document.getElementById("mobile-menu-btn");
  const menuOverlay = document.getElementById("mobile-menu-overlay");
  const menuClose = document.getElementById("mobile-menu-close");

  const openMenu = () => {
    if (!menuOverlay) return;
    menuOverlay.classList.add("open");
    menuOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    if (!menuOverlay) return;
    menuOverlay.classList.remove("open");
    menuOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  menuBtn?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);
  menuOverlay?.addEventListener("click", (e) => {
    if (e.target === menuOverlay) closeMenu();
  });
  document
    .querySelectorAll(".mobile-nav-link")
    .forEach((l) => l.addEventListener("click", closeMenu));

  // ─── Smooth Scroll ───
  const HEADER_OFFSET = 80;
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;

    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
      behavior: "smooth",
    });
  });

  // ─── FAQ Accordion ───
  document.querySelectorAll(".faq-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isActive = item.classList.contains("active");

      document
        .querySelectorAll(".faq-item.active")
        .forEach((i) => i.classList.remove("active"));

      if (!isActive) item.classList.add("active");
    });
  });

  // ─── Scroll Animations ───
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  document
    .querySelectorAll(".animate-on-scroll, .aos")
    .forEach((el) => observer.observe(el));

  // ─── Active Nav ───
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function highlightNav() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach((sec) => {
      if (
        scrollY >= sec.offsetTop &&
        scrollY < sec.offsetTop + sec.offsetHeight
      ) {
        navLinks.forEach((l) => {
          l.classList.remove("active");
          if (l.getAttribute("href") === `#${sec.id}`) {
            l.classList.add("active");
          }
        });
      }
    });
  }
  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();

  // ─── SVG Loader ───
  const svgContainer = document.querySelector(".svg-container");

  function loadDiagram() {
    if (!svgContainer) return;

    const isMobile = window.innerWidth < 1024;
    const path = isMobile
      ? "assets/images/res-diagram.svg"
      : "assets/images/diagram.svg";

    fetch(path)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then((svg) => (svgContainer.innerHTML = svg))
      .catch(() => {
        svgContainer.innerHTML =
          '<p style="text-align:center;padding:2rem;color:#999">Diagram unavailable</p>';
      });
  }

  if (svgContainer) {
    loadDiagram();
    let t;
    window.addEventListener("resize", () => {
      clearTimeout(t);
      t = setTimeout(loadDiagram, 250);
    });
  }

  // ─── Reflection Effect ───
  document.querySelectorAll(".reflection-wrapper").forEach((wrapper) => {
    const card = wrapper.querySelector(".reflection-card");
    const mirror = wrapper.querySelector(".reflection-mirror");
    if (!card || !mirror) return;

    const clone = card.cloneNode(true);
    Object.assign(clone.style, {
      transform: "scaleY(-1)",
      opacity: "0.25",
      pointerEvents: "none",
      filter: "blur(0.5px)",
    });

    mirror.appendChild(clone);
  });

  // ─── MUI Floating Labels ───
  document.querySelectorAll(".mui-textfield").forEach((tf) => {
    const input = tf.querySelector(".mui-input");
    if (!input) return;

    const update = () => {
      const hasVal =
        input.tagName === "SELECT"
          ? input.value !== ""
          : input.value.trim() !== "";

      tf.classList.toggle("has-value", hasVal);
    };

    update();
    input.addEventListener("input", update);
    input.addEventListener("change", update);
    input.addEventListener("focus", () => tf.classList.add("focused"));
    input.addEventListener("blur", () => {
      tf.classList.remove("focused");
      update();
    });
  });

  // ─── Modal ───
  const modal = document.getElementById("demoModal");
  const closeBtn = document.getElementById("closeDemoModal");

  function openModal() {
    if (!modal) return;
    modal.classList.add("modal-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("modal-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".free-demo-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    })
  );

  closeBtn?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});
