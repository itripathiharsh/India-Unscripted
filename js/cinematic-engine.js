/* ============================================================
   India Unscripted — Luxury Cinematic Title Sequence Engine
   100% Code-Generated Vector & Canvas Continuous Rig
   Authentic Survey of India Subcontinent Cartography
   ============================================================ */

(function () {
  const introContainer = document.getElementById('cinematicIntro');
  if (!introContainer) return;

  const skipBtn = document.getElementById('introSkipBtn');
  let isFinished = false;
  let animFrameId = null;

  // Check if visitor has already seen the intro
  const urlParams = new URLSearchParams(window.location.search);
  const forceReplay = urlParams.has('replay') || urlParams.has('intro');

  let hasSeen = false;
  try {
    hasSeen = !forceReplay && (
      localStorage.getItem('india_unscripted_intro_seen') === 'true' ||
      sessionStorage.getItem('india_unscripted_intro_seen') === 'true'
    );
  } catch (e) {}

  if (hasSeen) {
    document.documentElement.classList.add('intro-seen');
    introContainer.classList.add('finished');
    introContainer.style.display = 'none';
    document.body.style.overflow = '';
    isFinished = true;
  } else {
    // First time visitor: mark as seen so navigating to other pages or clicking "Experience" will never replay it
    try {
      localStorage.setItem('india_unscripted_intro_seen', 'true');
      sessionStorage.setItem('india_unscripted_intro_seen', 'true');
    } catch (e) {}
    // Prevent scroll during intro
    document.body.style.overflow = 'hidden';
  }

  function finishIntro() {
    if (isFinished) return;
    isFinished = true;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    try {
      localStorage.setItem('india_unscripted_intro_seen', 'true');
      sessionStorage.setItem('india_unscripted_intro_seen', 'true');
    } catch (e) {}
    document.documentElement.classList.add('intro-seen');

    introContainer.classList.add('finished');
    document.body.style.overflow = '';
    setTimeout(() => {
      introContainer.style.display = 'none';
    }, 900);
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      finishIntro();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.code === 'Space') {
      finishIntro();
    }
  });

  // Load Authentic Survey of India Boundaries
  fetch('assets/intro/india_authentic_paths.json')
    .then(res => res.json())
    .then(paths => {
      const group = document.getElementById('mapDistrictsGroup');
      if (group && paths) {
        let fragment = '';
        for (let i = 0; i < paths.length; i++) {
          fragment += `<path d="${paths[i]}" />`;
        }
        group.innerHTML = fragment;
      }
    })
    .catch(e => console.warn('Could not load district paths:', e));

  // Generate Astrolabe Degree Ticks (72 intervals, 5 deg)
  const ticksGroup = document.getElementById('astrolabeTicks');
  if (ticksGroup) {
    let ticks = '';
    for (let i = 0; i < 72; i++) {
      const deg = i * 5;
      const isCardinal = deg % 90 === 0;
      const isMajor = deg % 45 === 0;
      const r1 = isCardinal ? 200 : (isMajor ? 208 : 220);
      const r2 = 236;
      const rad = (deg * Math.PI) / 180;
      const x1 = 250 + Math.cos(rad) * r1;
      const y1 = 250 + Math.sin(rad) * r1;
      const x2 = 250 + Math.cos(rad) * r2;
      const y2 = 250 + Math.sin(rad) * r2;
      const sw = isCardinal ? 2.4 : (isMajor ? 1.5 : 0.8);
      ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke-width="${sw}" />`;
    }
    ticksGroup.innerHTML = ticks;
  }

  // Floating Atmospheric Dust Particles Canvas
  const pCanvas = document.getElementById('particlesCanvas');
  const pCtx = pCanvas ? pCanvas.getContext('2d') : null;
  let pW = window.innerWidth;
  let pH = window.innerHeight;

  function resizeParticles() {
    if (!pCanvas) return;
    pW = pCanvas.width = window.innerWidth;
    pH = pCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeParticles);
  resizeParticles();

  const particles = [];
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vy: -0.3 - Math.random() * 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      size: 0.8 + Math.random() * 2.2,
      baseAlpha: 0.2 + Math.random() * 0.6,
      pulseSpeed: 1.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2
    });
  }

  // Route Path Animation Setup
  const routeLine = document.getElementById('moltenRouteLine');
  const routeGlowLine = document.getElementById('moltenRouteGlow');
  let routeTotalLen = 1400;
  if (routeLine) {
    routeTotalLen = routeLine.getTotalLength() || 1400;
    routeLine.style.strokeDasharray = routeTotalLen;
    routeLine.style.strokeDashoffset = routeTotalLen;
  }
  if (routeGlowLine) {
    routeGlowLine.style.strokeDasharray = routeTotalLen;
    routeGlowLine.style.strokeDashoffset = routeTotalLen;
  }

  const s1 = document.getElementById('scene1');
  const s2 = document.getElementById('scene2');
  const s3 = document.getElementById('scene3');
  const s4 = document.getElementById('scene4');
  const s5 = document.getElementById('scene5');
  const cameraRig = document.getElementById('cameraRig');
  const astrolabeSvg = document.getElementById('astrolabeSvg');
  const promiseStar = document.getElementById('promiseStar');
  const wpGroups = document.querySelectorAll('.wp-group');

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  const TOTAL_DURATION = 7.5;
  let startTime = null;

  function renderFrameAt(t) {
    // 1. Dust Particles
    if (pCtx) {
      pCtx.clearRect(0, 0, pW, pH);
      particles.forEach(p => {
        const curY = (p.y + p.vy * t * 60) % pH;
        const curX = (p.x + p.vx * t * 60) % pW;
        const py = curY < 0 ? curY + pH : curY;
        const px = curX < 0 ? curX + pW : curX;
        const alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(t * p.pulseSpeed + p.phase));

        pCtx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
        pCtx.beginPath();
        pCtx.arc(px, py, p.size, 0, Math.PI * 2);
        pCtx.fill();
      });
    }

    // 2. Continuous Camera Dolly
    if (cameraRig) {
      const zoom = 1.0 + (t / TOTAL_DURATION) * 0.08;
      cameraRig.style.transform = `scale(${zoom.toFixed(4)})`;
    }

    // 3. Scene 1: Heritage Sanctuary Pillar & Arch (0.0s – 2.0s)
    if (s1) {
      let op1 = 0;
      if (t < 2.2) {
        if (t < 0.5) op1 = t / 0.5;
        else if (t < 1.6) op1 = 1.0;
        else op1 = clamp((2.1 - t) / 0.5, 0, 1);
        s1.style.transform = `translateX(${((1 - easeOutCubic(clamp(t / 1.5, 0, 1))) * -40).toFixed(1)}px)`;
      }
      s1.style.opacity = op1.toFixed(3);
    }

    // 4. Scene 2: Celestial Astrolabe Compass (1.6s – 3.6s)
    if (s2) {
      let op2 = 0;
      if (t >= 1.5 && t < 3.8) {
        if (t < 2.1) op2 = clamp((t - 1.5) / 0.6, 0, 1);
        else if (t < 3.0) op2 = 1.0;
        else op2 = clamp((3.6 - t) / 0.6, 0, 1);

        const rot = (t - 1.5) * 14 - 15;
        if (astrolabeSvg) astrolabeSvg.style.transform = `rotate(${rot.toFixed(2)}deg)`;
      }
      s2.style.opacity = op2.toFixed(3);
    }

    // 5. Scene 3: Authentic Survey of India Subcontinent & Flowing Route (3.0s – 5.4s)
    if (s3) {
      let op3 = 0;
      if (t >= 2.9 && t < 5.6) {
        if (t < 3.5) op3 = clamp((t - 2.9) / 0.6, 0, 1);
        else if (t < 4.8) op3 = 1.0;
        else op3 = clamp((5.5 - t) / 0.7, 0, 1);

        const routeProg = clamp((t - 3.3) / 1.4, 0, 1);
        const dashOffset = ((1 - easeInOutCubic(routeProg)) * routeTotalLen).toFixed(1);
        if (routeLine) routeLine.style.strokeDashoffset = dashOffset;
        if (routeGlowLine) routeGlowLine.style.strokeDashoffset = dashOffset;

        wpGroups.forEach((wp, idx) => {
          const threshold = idx / 4.5;
          const wpOp = clamp((routeProg - threshold) * 4, 0, 1);
          wp.style.opacity = wpOp.toFixed(2);
        });
      }
      s3.style.opacity = op3.toFixed(3);
    }

    // 6. Scene 4: Brand Identity (4.8s – 6.6s)
    if (s4) {
      let op4 = 0;
      if (t >= 4.7 && t < 6.8) {
        if (t < 5.3) op4 = clamp((t - 4.7) / 0.6, 0, 1);
        else if (t < 6.1) op4 = 1.0;
        else op4 = clamp((6.7 - t) / 0.6, 0, 1);

        const liftY = (1 - easeOutCubic(clamp((t - 4.7) / 0.9, 0, 1))) * 25;
        s4.style.transform = `translateY(${liftY.toFixed(1)}px)`;
      }
      s4.style.opacity = op4.toFixed(3);
    }

    // 7. Scene 5: Dawn Mountain Ridges & Promise (6.0s – 7.5s)
    if (s5) {
      let op5 = 0;
      if (t >= 5.9) {
        if (t < 6.6) op5 = clamp((t - 5.9) / 0.7, 0, 1);
        else op5 = 1.0;

        const starProg = clamp((t - 6.2) / 1.1, 0, 1);
        if (promiseStar) {
          promiseStar.style.left = `${(starProg * 100).toFixed(1)}%`;
        }
      }
      s5.style.opacity = op5.toFixed(3);
    }
  }

  function loop(now) {
    if (isFinished) return;
    if (!startTime) startTime = now;
    const elapsed = (now - startTime) / 1000;

    renderFrameAt(elapsed);

    if (elapsed < TOTAL_DURATION) {
      animFrameId = requestAnimationFrame(loop);
    } else {
      finishIntro();
    }
  }

  // Start Animation immediately on page load only for first-time visitors
  if (!hasSeen) {
    animFrameId = requestAnimationFrame(loop);
  }

  // Global Replay Helper for Navigation / Header button
  window.replayIntro = function () {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    isFinished = false;
    startTime = null;
    document.documentElement.classList.remove('intro-seen');
    document.body.style.overflow = 'hidden';
    introContainer.style.display = 'block';
    introContainer.classList.remove('finished');
    window.scrollTo({ top: 0, behavior: 'instant' });
    animFrameId = requestAnimationFrame(loop);
  };
})();
