/**
 * Global fade-up on scroll. Mark any node with class "reveal-element".
 * Optional delay: style="--reveal-delay: 150ms"
 */
(function initRevealOnScroll() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function bind() {
    const nodes = document.querySelectorAll('.reveal-element:not([data-reveal-bound])');
    if (!nodes.length) return;

    if (reduceMotion) {
      nodes.forEach(function (el) {
        el.classList.add('is-visible');
        el.setAttribute('data-reveal-bound', '');
      });
      return;
    }

    const io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    nodes.forEach(function (el) {
      el.setAttribute('data-reveal-bound', '');
      io.observe(el);
    });
  }

  // Alpine x-for mounts after alpine:initialized
  document.addEventListener('alpine:initialized', bind);
  document.addEventListener('DOMContentLoaded', function () {
    bind();
    setTimeout(bind, 80);
  });
})();
