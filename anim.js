/**
 * anim.js — smooth scroll-reveal for ProLine
 * Marks elements with .reveal; Intersection Observer adds .is-visible.
 */
(() => {
  "use strict";

  // Elements to animate on scroll
  const SELECTORS = [
    ".services article",
    ".shop-header",
    ".shop-card",
    "footer p",
    "footer a",
  ];

  // Add .reveal class to all targets
  SELECTORS.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.classList.add("reveal");
    });
  });

  // Intersection Observer — trigger once per element
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // fire once only
        }
      });
    },
    {
      threshold: 0.12,      // 12% visible → trigger
      rootMargin: "0px 0px -40px 0px",
    }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();
