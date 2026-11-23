/**
 * Hero "Slow Breathing Curves" — overlapping sine waves on canvas.
 * Calm, slow, muted grey-blue lines on deep navy/graphite.
 */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const BG = '#0f172a';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Independent wave params (phase advances very slowly)
  const waves = [
    { y: 0.28, ampRatio: 0.07, freq: 0.0042, speed: 0.00028, phase: 0.0, width: 1.25, color: 'rgba(148, 163, 184, 0.28)' },
    { y: 0.42, ampRatio: 0.09, freq: 0.0031, speed: 0.00022, phase: 1.4, width: 1.1, color: 'rgba(148, 163, 184, 0.22)' },
    { y: 0.55, ampRatio: 0.06, freq: 0.0050, speed: 0.00034, phase: 2.8, width: 1.4, color: 'rgba(148, 163, 184, 0.30)' },
    { y: 0.68, ampRatio: 0.08, freq: 0.0026, speed: 0.00018, phase: 0.7, width: 1.15, color: 'rgba(148, 163, 184, 0.18)' },
    { y: 0.48, ampRatio: 0.05, freq: 0.0062, speed: 0.00040, phase: 4.1, width: 1.0, color: 'rgba(148, 163, 184, 0.20)' },
  ];

  let width = 0;
  let height = 0;
  let rafId = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduceMotion) drawFrame(false);
  }

  function drawWave(wave) {
    const mid = height * wave.y;
    const amp = height * wave.ampRatio;

    ctx.beginPath();
    ctx.lineWidth = wave.width;
    ctx.strokeStyle = wave.color;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Step every 3px — smooth enough, cheap on mobile
    for (let x = 0; x <= width; x += 3) {
      const y =
        mid +
        Math.sin(x * wave.freq + wave.phase) * amp +
        Math.sin(x * wave.freq * 0.55 + wave.phase * 1.35) * (amp * 0.4);

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function drawFrame(advance) {
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < waves.length; i++) {
      const wave = waves[i];
      drawWave(wave);
      if (advance) wave.phase += wave.speed;
    }
  }

  function loop() {
    drawFrame(true);
    rafId = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);

  if (reduceMotion) {
    drawFrame(false);
  } else {
    rafId = requestAnimationFrame(loop);
  }

  // Cleanup if page is long-lived / navigated away
  window.addEventListener('pagehide', function () {
    if (rafId) cancelAnimationFrame(rafId);
  });
})();
