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
