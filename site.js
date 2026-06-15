/* JioLeh site interactions */
(function () {
  const root = document.documentElement;
  const storageKey = "jioleh-theme";

  function readTheme() {
    try {
      return localStorage.getItem(storageKey) || "light";
    } catch (e) {
      return "light";
    }
  }

  function setTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(storageKey, next);
    } catch (e) {}
  }

  function initThemeToggle() {
    setTheme(readTheme());
    document.addEventListener("click", function (e) {
      const toggle = e.target.closest("[data-theme-toggle]");
      if (!toggle) return;
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  function initNav() {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initReveal() {
    const els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;

    const showIfNear = function (factor) {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      els.forEach(function (el) {
        if (el.classList.contains("in")) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * (factor || 0.92) && rect.bottom > -40) {
          el.classList.add("in");
        }
      });
    };

    showIfNear(1.4);

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

      els.forEach(function (el) {
        if (!el.classList.contains("in")) io.observe(el);
      });
    }

    const onScroll = function () { showIfNear(0.92); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", onScroll);
    setTimeout(onScroll, 300);
    setTimeout(function () {
      els.forEach(function (el) { el.classList.add("in"); });
    }, 2200);
  }

  function lockScroll(on) {
    document.body.style.overflow = on ? "hidden" : "";
  }

  function initMobileNav() {
    const burger = document.querySelector(".nav-burger");
    const menu = document.getElementById("mobileMenu");
    if (!burger || !menu) return;

    function close() {
      menu.hidden = true;
      burger.setAttribute("aria-expanded", "false");
    }
    function open() {
      menu.hidden = false;
      burger.setAttribute("aria-expanded", "true");
    }
    burger.addEventListener("click", function () {
      if (menu.hidden) open(); else close();
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 920) close();
    });
    // expose for other handlers
    initMobileNav._close = close;
  }

  function initGetAppModal() {
    const modal = document.getElementById("getApp");
    if (!modal) return;
    let lastTrigger = null;

    function open(trigger) {
      lastTrigger = trigger || null;
      if (initMobileNav._close) initMobileNav._close();
      modal.hidden = false;
      lockScroll(true);
      const x = modal.querySelector(".modal-x");
      if (x) x.focus();
    }
    function close() {
      if (modal.hidden) return;
      modal.hidden = true;
      lockScroll(false);
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
    }

    document.addEventListener("click", function (e) {
      const trigger = e.target.closest("[data-get-app]");
      if (trigger) { e.preventDefault(); open(trigger); return; }
      if (e.target.closest("[data-modal-close]")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    initGetAppModal._close = close;
  }

  function initLightbox() {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.hidden = true;
    const img = document.createElement("img");
    img.alt = "";
    box.appendChild(img);
    document.body.appendChild(box);

    function close() {
      box.hidden = true;
      lockScroll(false);
    }
    document.addEventListener("click", function (e) {
      const target = e.target;
      if (target.tagName === "IMG" && target.closest(".phone, .gcard")) {
        img.src = target.currentSrc || target.src;
        img.alt = target.alt || "";
        box.hidden = false;
        lockScroll(true);
        return;
      }
      if (!box.hidden && (target === box || target === img)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function initScrollSpy() {
    if (!("IntersectionObserver" in window)) return;
    const links = Array.prototype.slice.call(
      document.querySelectorAll(".nav-links a[href^='#']")
    ).filter(function (a) { return a.getAttribute("href").length > 1; });
    if (!links.length) return;

    const map = {};
    const sections = [];
    links.forEach(function (a) {
      const id = a.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (sec) { map[id] = a; sections.push(sec); }
    });
    if (!sections.length) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove("active"); });
        const a = map[entry.target.id];
        if (a) a.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }

  function initBackToTop() {
    const btn = document.getElementById("toTop");
    if (!btn) return;
    const onScroll = function () {
      btn.classList.toggle("show", window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  function initImages() {
    document.querySelectorAll("img").forEach(function (img) {
      img.decoding = "async";
      if (!img.closest(".hero")) img.loading = "lazy";
    });
  }

  function initYear() {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  function init() {
    initThemeToggle();
    initNav();
    initMobileNav();
    initGetAppModal();
    initLightbox();
    initScrollSpy();
    initBackToTop();
    initReveal();
    initImages();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
