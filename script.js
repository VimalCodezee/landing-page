/**
 * HRMS Landing Page — Interactive Features
 * Mobile menu, smooth scrolling, FAQ accordion, scroll animations, active nav
 */

document.addEventListener("DOMContentLoaded", () => {
  // ─── Live date & time (dashboard) ───
  const liveDateEl = document.getElementById("dashboard-live-date");
  const liveTimeEl = document.getElementById("dashboard-live-time");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function updateLiveDateTime() {
    const now = new Date();
    if (liveDateEl) {
      const d = now.getDate();
      const m = monthNames[now.getMonth()];
      const y = now.getFullYear();
      liveDateEl.textContent = `${d} ${m} ${y}`;
    }
    if (liveTimeEl) {
      const h = String(now.getHours()).padStart(2, "0");
      const min = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      liveTimeEl.textContent = `${h}:${min}:${s}`;
    }
  }
  updateLiveDateTime();
  if (liveTimeEl) setInterval(updateLiveDateTime, 1000);

  // ─── Mobile Menu ───
  const menuBtn = document.getElementById("mobile-menu-btn");
  const menuOverlay = document.getElementById("mobile-menu-overlay");
  const menuClose = document.getElementById("mobile-menu-close");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function openMenu() {
    if (menuOverlay) {
      menuOverlay.classList.add("open");
      menuOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closeMenu() {
    if (menuOverlay) {
      menuOverlay.classList.remove("open");
      menuOverlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  menuBtn?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);
  menuOverlay?.addEventListener("click", (e) => {
    if (e.target === menuOverlay) closeMenu();
  });
  mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

  // ─── Smooth Scrolling (header & footer nav, in-page anchors) ───
  const headerOffsetPx = 80;
  function scrollToSection(e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    const top =
      target.getBoundingClientRect().top + window.scrollY - headerOffsetPx;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }
  document.addEventListener("click", scrollToSection);

  // ─── FAQ Accordion ───
  document.querySelectorAll(".faq-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const wasActive = item.classList.contains("active");

      // close all
      document
        .querySelectorAll(".faq-item.active")
        .forEach((i) => i.classList.remove("active"));

      // toggle clicked
      if (!wasActive) item.classList.add("active");
    });
  });

  // ─── Scroll Animations (IntersectionObserver) ───
  const animElements = document.querySelectorAll(".animate-on-scroll");

  if (animElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.hasAttribute("data-scroll-visible")) {
            observer.unobserve(el);
            return;
          }
          el.setAttribute("data-scroll-visible", "true");
          observer.unobserve(el);
          el.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    animElements.forEach((el) => observer.observe(el));
  }

  // ─── Animate.css Scroll Animations for Sections ───
  // Use data-animate so each section is only matched once (no duplicate observations)
  const sectionNodes = document.querySelectorAll("section[data-animate]");
  const sectionsToAnimate = Array.from(sectionNodes);

  if (sectionsToAnimate.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target;
          // Set flag first so any duplicate callback (or same entry twice) cannot re-run
          if (section.hasAttribute("data-scroll-animated")) {
            sectionObserver.unobserve(section);
            return;
          }
          section.setAttribute("data-scroll-animated", "true");
          sectionObserver.unobserve(section);
          const anim = (
            section.getAttribute("data-animate") || "fadeInUp"
          ).trim();
          const animationClass = anim.startsWith("animate__")
            ? anim
            : "animate__" + anim;
          section.classList.add("animate__animated", animationClass);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    sectionsToAnimate.forEach((section) => sectionObserver.observe(section));
  }

  // ─── FAQ Items Slide-in Animation ───
  const faqItems = document.querySelectorAll(".faq-item");

  if (faqItems.length) {
    const faqObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const item = entry.target;
          if (item.hasAttribute("data-faq-animated")) {
            faqObserver.unobserve(item);
            return;
          }
          item.setAttribute("data-faq-animated", "true");
          faqObserver.unobserve(item);
          item.classList.add("faq-visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    faqItems.forEach((item) => faqObserver.observe(item));
  }

  // ─── Active Nav Highlighting ───
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function highlightNav() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav(); // run once on load

  // ─── Load SVG Diagram (Responsive) ───
  const svgContainer = document.querySelector(".svg-container");

  function loadDiagram() {
    if (!svgContainer) return;

    // Check if mobile view (width < 1024px, matching lg breakpoint)
    const isMobile = window.innerWidth < 1024;
    const svgPath = isMobile
      ? "assets/images/res-diagram.svg"
      : "assets/images/diagram.svg";

    fetch(svgPath)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load SVG");
        return response.text();
      })
      .then((svgContent) => {
        svgContainer.innerHTML = svgContent;
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
        // Fallback to desktop version if mobile version fails
        if (isMobile) {
          fetch("assets/images/diagram.svg")
            .then((response) => {
              if (!response.ok) throw new Error("Failed to load fallback SVG");
              return response.text();
            })
            .then((svgContent) => {
              svgContainer.innerHTML = svgContent;
            })
            .catch((fallbackError) => {
              console.error("Error loading fallback SVG:", fallbackError);
              svgContainer.innerHTML =
                '<p style="color: #999; text-align: center; padding: 2rem;">Diagram unavailable</p>';
            });
        } else {
          svgContainer.innerHTML =
            '<p style="color: #999; text-align: center; padding: 2rem;">Diagram unavailable</p>';
        }
      });
  }

  // Load diagram on page load
  if (svgContainer) {
    loadDiagram();

    // Reload diagram on window resize (debounced)
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        loadDiagram();
      }, 250); // Debounce resize events
    });
  }

  // ─── Create Reflection Effect ───
  const reflectionWrappers = document.querySelectorAll(".reflection-wrapper");
  reflectionWrappers.forEach((wrapper) => {
    const reflectionCard = wrapper.querySelector(".reflection-card");
    const reflectionMirror = wrapper.querySelector(".reflection-mirror");
    if (reflectionCard && reflectionMirror) {
      // Clone the card content for true reflection
      const clone = reflectionCard.cloneNode(true);
      clone.classList.remove("hover:-translate-y-1", "group");
      clone.style.transform = "scaleY(-1)";
      clone.style.opacity = "0.25";
      clone.style.pointerEvents = "none";
      clone.style.filter = "blur(0.5px)";
      clone.style.maskImage =
        "linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)";
      clone.style.webkitMaskImage =
        "linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)";
      reflectionMirror.appendChild(clone);
    }
  });

  // ─── MUI TextField Floating Labels ───
  const muiTextfields = document.querySelectorAll(".mui-textfield");

  function updateLabelState(textfield) {
    const input = textfield.querySelector(".mui-input");
    if (!input) return;

    const hasValue = input.value && input.value.trim() !== "";
    const isSelect = input.tagName === "SELECT";
    const selectHasValue = isSelect && input.value !== "";

    if (hasValue || selectHasValue) {
      textfield.classList.add("has-value");
    } else {
      textfield.classList.remove("has-value");
    }
  }

  // Initialize all textfields on load
  muiTextfields.forEach((textfield) => {
    updateLabelState(textfield);

    const input = textfield.querySelector(".mui-input");
    if (!input) return;

    // Handle input events
    input.addEventListener("input", () => updateLabelState(textfield));
    input.addEventListener("change", () => updateLabelState(textfield));

    // Handle focus/blur for visual feedback
    input.addEventListener("focus", () => {
      textfield.classList.add("focused");
    });

    input.addEventListener("blur", () => {
      textfield.classList.remove("focused");
      updateLabelState(textfield);
    });
  });
});
