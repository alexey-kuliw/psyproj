/**
 * FAQ concentric ripples — slow expanding circles.
 * Transparent clear so section bg (graphite-900) shows through.
 */
(function initFaqCanvas() {
  const section = document.getElementById('faq');
  const canvas = document.getElementById('faq-canvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CYCLE_MS = 250000;
  const PEAK_OPACITY = 0.12;
  const LINE_WIDTH = 1.2;
  const RING_COUNT = 5;

  const rings = Array.from({ length: RING_COUNT }, (_, i) => ({
    phase: i / RING_COUNT,
  }));

  let width = 0;
  let height = 0;
  let maxRadius = 0;
  let cx = 0;
  let cy = 0;
  let rafId = 0;
  let visible = false;
  let startTime = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(rect.width) || canvas.clientWidth || window.innerWidth);
    height = Math.max(1, Math.floor(rect.height) || canvas.clientHeight || window.innerHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Slightly right — behind sticky FAQ title on desktop (md+)
    cx = width * (width >= 768 ? 0.78 : 0.5);
    cy = height * 0.48;
    maxRadius = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy)) * 1.05;

    if (reduceMotion || !visible) drawFrame(0);
  }

  function drawFrame(now) {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < rings.length; i++) {
      const progress = ((now / CYCLE_MS) + rings[i].phase) % 1;
      const radius = progress * maxRadius;
      const opacity = Math.sin(progress * Math.PI) * PEAK_OPACITY;
      if (opacity < 0.002 || radius < 0.5) continue;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(148, 163, 184, ' + opacity + ')';
      ctx.lineWidth = LINE_WIDTH;
      ctx.stroke();
    }
  }

  function loop(now) {
    if (!startTime) startTime = now;
    drawFrame(now - startTime);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (reduceMotion || rafId) return;
    startTime = 0;
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);

  if (reduceMotion) {
    drawFrame(CYCLE_MS * 0.35);
  } else {
    const observer = new IntersectionObserver(
      function (entries) {
        visible = entries[0] && entries[0].isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: '80px 0px', threshold: 0 }
    );
    observer.observe(section);
  }

  window.addEventListener('pagehide', stop);
})();
