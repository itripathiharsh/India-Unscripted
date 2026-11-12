/* ============================================================
   India Unscripted — Cinematic Website Intro Controller
   Sequence:
   - Scene 1 (0.0s – 1.0s): Opening — Heritage arch side-lit in gold + "A Journey Through India"
   - Scene 2 (1.0s – 2.1s): The Compass — Astrolabe emblem rotates and settles with golden radiance
   - Scene 3 (2.1s – 3.4s): The Route — Subcontinent outline + golden route drawing North to South
   - Scene 4 (3.4s – 4.7s): The Brand — Astrolabe emblem + INDIA UNSCRIPTED + Bespoke Expeditions
   - Scene 5 (4.7s – 5.7s): The Promise — Mountain dawn silhouette + BEYOND THE ORDINARY
   - Scene 6 (5.7s – 6.6s): Seamless cross-dissolve to homepage
   ============================================================ */

(function () {
  const introEl = document.getElementById('cinematicIntro');
  if (!introEl) return;

  const scenes = [
    document.getElementById('introScene1'),
    document.getElementById('introScene2'),
    document.getElementById('introScene3'),
    document.getElementById('introScene4'),
    document.getElementById('introScene5')
  ];

  let isFinished = false;
  let timerIds = [];

  function activateScene(index) {
    if (isFinished) return;
    scenes.forEach((s, idx) => {
      if (s) {
        if (idx === index) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      }
    });
  }

  function finishIntro() {
    if (isFinished) return;
    isFinished = true;
    timerIds.forEach(id => clearTimeout(id));
    timerIds = [];

    // Restore scroll
    document.body.style.overflow = '';

    // Dissolve intro overlay into live homepage
    introEl.classList.add('finished');
    setTimeout(() => {
      introEl.style.display = 'none';
    }, 950);
  }

  // Hook Skip button & Keyboard triggers
  const skipBtn = document.getElementById('introSkipBtn');
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

  function startSequence() {
    if (isFinished) return;
    timerIds.forEach(id => clearTimeout(id));
    timerIds = [];

    document.body.style.overflow = 'hidden';

    // Scene 1: Immediate start
    activateScene(0);

    // Timeline execution matching storyboard
    timerIds.push(setTimeout(() => activateScene(1), 1000));
    timerIds.push(setTimeout(() => activateScene(2), 2100));
    timerIds.push(setTimeout(() => activateScene(3), 3400));
    timerIds.push(setTimeout(() => activateScene(4), 4700));
    timerIds.push(setTimeout(() => finishIntro(), 5700));
  }

  // Global helper to replay intro on demand (from nav, telemetry, or console)
  window.replayIntro = function () {
    timerIds.forEach(id => clearTimeout(id));
    timerIds = [];
    isFinished = false;

    // Reset styles and classes
    introEl.style.display = 'flex';
    introEl.classList.remove('finished');
    document.body.style.overflow = 'hidden';

    // Reset each scene
    scenes.forEach(s => {
      if (s) s.classList.remove('active');
    });

    // Force reflow
    void introEl.offsetHeight;

    window.scrollTo({ top: 0, behavior: 'instant' });
    startSequence();
  };

  // Launch when page is visible and painted
  function initIntro() {
    if (document.hidden) {
      const onVisible = () => {
        if (!document.hidden) {
          document.removeEventListener('visibilitychange', onVisible);
          requestAnimationFrame(() => startSequence());
        }
      };
      document.addEventListener('visibilitychange', onVisible);
    } else {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          requestAnimationFrame(() => startSequence());
        });
      } else {
        requestAnimationFrame(() => startSequence());
      }
    }
  }

  initIntro();
})();
