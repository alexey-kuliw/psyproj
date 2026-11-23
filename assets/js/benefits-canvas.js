/**
 * Benefits "Untangling thoughts" — slow vertical Bezier curves.
 * Transparent clear so section bg (graphite-900) shows through; lines stay visible.
 */
(function initBenefitsCanvas() {
  const canvas = document.getElementById('benefits-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const curves = [
    { x: 0.18, sway: 70, speed: 0.00028, phase: 0.0, width: 1, color: 'rgba(148, 163, 184, 0.16)' },
    { x: 0.42, sway: 88, speed: 0.00022, phase: 1.7, width: 1, color: 'rgba(148, 163, 184, 0.13)' },
    { x: 0.62, sway: 64, speed: 0.00032, phase: 3.2, width: 1.1, color: 'rgba(148, 163, 184, 0.18)' },
    { x: 0.78, sway: 76, speed: 0.00018, phase: 4.5, width: 0.9, color: 'rgba(148, 163, 184, 0.12)' },
  ];

  let width = 0;
  let height = 0;
  let t = 0;
  let rafId = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(rect.width) || canvas.clientWidth || window.innerWidth);
    height = Math.max(1, Math.floor(rect.height) || canvas.clientHeight || window.innerHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduceMotion) drawFrame(false);
  }

  function drawCurve(curve, time) {
    const base = width * curve.x;
    const s = curve.sway;

    const xTop = base + Math.sin(time * curve.speed + curve.phase) * s * 0.6;
    const cp1x = base + Math.sin(time * curve.speed + curve.phase + 1.1) * s;
    const cp2x = base + Math.cos(time * curve.speed + curve.phase + 0.6) * s * 1.2;
    const xMid = base + Math.sin(time * curve.speed + curve.phase + 1.5) * s * 0.45;
    const cp3x = base + Math.cos(time * curve.speed + curve.phase + 1.8) * s * 0.95;
    const cp4x = base + Math.sin(time * curve.speed + curve.phase + 2.4) * s * 0.85;
    const xBot = base + Math.sin(time * curve.speed + curve.phase + 3.1) * s * 0.55;

    ctx.beginPath();
    ctx.lineWidth = curve.width;
    ctx.strokeStyle = curve.color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(xTop, -40);
    ctx.bezierCurveTo(cp1x, height * 0.2, cp2x, height * 0.35, xMid, height * 0.5);
    ctx.bezierCurveTo(cp3x, height * 0.68, cp4x, height * 0.85, xBot, height + 40);
    ctx.stroke();
  }

  function drawFrame(advance) {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < curves.length; i++) {
      drawCurve(curves[i], t);
    }

    if (advance) t += 1;
  }

  function loop() {
    drawFrame(true);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    resize();
    if (reduceMotion) {
      drawFrame(false);
      return;
    }
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  // Layout may still be settling when script runs
  start();
  requestAnimationFrame(start);
  window.addEventListener('resize', resize);
  window.addEventListener('load', start);

  window.addEventListener('pagehide', function () {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  });
})();
