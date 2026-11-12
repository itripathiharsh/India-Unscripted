/**
 * India Unscripted — Scrollytelling, Telemetry & Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live IST Clock
  const clockEl = document.getElementById('istClock');
  function updateIST() {
    if (!clockEl) return;
    const now = new Date();
    // Indian Standard Time is UTC + 5:30
    const istTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (330 * 60000));
    const hours = String(istTime.getHours()).padStart(2, '0');
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const seconds = String(istTime.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds} IST`;
  }
  updateIST();
  setInterval(updateIST, 1000);

  // 2. Scroll Progress Bar
  const progressBar = document.getElementById('scrollProgressBar');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });

  // 3. Soundscape Button Handler
  const soundBtn = document.getElementById('soundscapeToggle');
  const soundLabel = document.getElementById('soundscapeLabel');
  if (soundBtn && window.soundscape) {
    soundBtn.addEventListener('click', () => {
      const active = window.soundscape.toggle();
      if (active) {
        soundBtn.classList.add('active');
        if (soundLabel) soundLabel.textContent = 'Temple Drone (108Hz) Playing';
      } else {
        soundBtn.classList.remove('active');
        if (soundLabel) soundLabel.textContent = 'Atmospheric Sound: Muted';
      }
    });
  }

  // 4. Scrollytelling Chapter Observation
  const chapterCards = document.querySelectorAll('.chapter-card');
  const railTitle = document.getElementById('railChapterTitle');
  const railMeta = document.getElementById('railChapterMeta');
  const railBullets = document.querySelectorAll('.rail-step-bullet');

  const chapterData = {
    'ch-1': {
      num: 'CHAPTER I',
      title: 'The Dawn Awakening: Sacred Varanasi',
      coords: '25.3176° N, 82.9739° E · Elev. 80m',
      season: 'Best: Oct – Mar · River Level: Calm'
    },
    'ch-2': {
      num: 'CHAPTER II',
      title: 'The Saffron Mirage: Thar Desert',
      coords: '26.9157° N, 70.9083° E · Elev. 225m',
      season: 'Best: Nov – Feb · Stargazing: Pristine'
    },
    'ch-3': {
      num: 'CHAPTER III',
      title: 'The Iron Spine: Western Ghats Rail',
      coords: '15.3144° N, 74.3143° E · Elev. 610m',
      season: 'Best: Jul – Oct (Waterfalls) & Nov – Feb'
    },
    'ch-4': {
      num: 'CHAPTER IV',
      title: 'The Emerald Stillness: Kerala Backwaters',
      coords: '9.4981° N, 76.3388° E · Elev. 1m',
      season: 'Best: Oct – Mar · Waterway: Jackfruit Hull'
    },
    'ch-5': {
      num: 'CHAPTER V',
      title: 'The High Roof: Ladakh Monasteries',
      coords: '34.0583° N, 77.6333° E · Elev. 3,600m',
      season: 'Best: Jun – Sep · Oxygen: 68% of sea level'
    },
    'ch-6': {
      num: 'CHAPTER VI',
      title: 'The Stone Labyrinth: Hampi Ruins',
      coords: '15.3350° N, 76.4600° E · Elev. 467m',
      season: 'Best: Nov – Feb · Granite Boulders: 14th Century'
    }
  };

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -40% 0px',
    threshold: 0.2
  };

  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const data = chapterData[id];
        if (data && railTitle && railMeta) {
          railTitle.textContent = data.title;
          railMeta.innerHTML = `<span>${data.coords}</span><span>${data.season}</span>`;

          railBullets.forEach(b => {
            if (b.dataset.target === id) {
              b.classList.add('active');
            } else {
              b.classList.remove('active');
            }
          });
        }
      }
    });
  }, observerOptions);

  chapterCards.forEach(card => chapterObserver.observe(card));

  // Click on bullet to scroll to chapter
  railBullets.forEach(bullet => {
    bullet.addEventListener('click', () => {
      const targetId = bullet.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // 5. Currency Converter
  const currencySelect = document.getElementById('currencySelector');
  const rates = {
    USD: { symbol: '$', rate: 1.0 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    AUD: { symbol: 'A$', rate: 1.52 },
    INR: { symbol: '₹', rate: 85.5 }
  };

  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      const cur = e.target.value;
      const info = rates[cur] || rates.USD;
      document.querySelectorAll('[data-usd]').forEach(el => {
        const usd = parseFloat(el.dataset.usd);
        const converted = Math.round(usd * info.rate);
        el.textContent = `${info.symbol}${converted.toLocaleString()}`;
      });
    });
  }

  // 6. Interactive Personalization Wizard Tabs
  const wizardSteps = document.querySelectorAll('.w-step');
  const wizardPanels = document.querySelectorAll('.wizard-panel');
  const nextBtns = document.querySelectorAll('.btn-wizard-next');
  const prevBtns = document.querySelectorAll('.btn-wizard-prev');

  function setStep(stepIndex) {
    wizardSteps.forEach((s, i) => {
      if (i === stepIndex) s.classList.add('active');
      else s.classList.remove('active');
    });

    wizardPanels.forEach((p, i) => {
      if (i === stepIndex) p.classList.add('active');
      else p.classList.remove('active');
    });
  }

  wizardSteps.forEach((step, idx) => {
    step.addEventListener('click', () => setStep(idx));
  });

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = Array.from(wizardPanels).findIndex(p => p.classList.contains('active'));
      if (current < wizardPanels.length - 1) {
        setStep(current + 1);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = Array.from(wizardPanels).findIndex(p => p.classList.contains('active'));
      if (current > 0) {
        setStep(current - 1);
      }
    });
  });

  // Vibe Chips Toggle
  const vibeChips = document.querySelectorAll('.vibe-chip');
  vibeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      updateBlueprintPicks();
    });
  });

  function updateBlueprintPicks() {
    const selected = Array.from(document.querySelectorAll('.vibe-chip.selected')).map(c => c.dataset.vibe);
    const countEl = document.getElementById('selectedVibesCount');
    if (countEl) countEl.textContent = `${selected.length} themes chosen`;
  }

  // 7. Dynamic Itinerary Generation Button
  const genItineraryBtn = document.getElementById('generateBlueprintBtn');
  if (genItineraryBtn) {
    genItineraryBtn.addEventListener('click', () => {
      const resultBox = document.getElementById('blueprintResultBox');
      const nameInput = document.getElementById('wizName')?.value || 'Traveler';
      const nights = document.getElementById('wizNights')?.value || '14';
      const pace = document.querySelector('input[name="wizPace"]:checked')?.value || 'balanced';

      if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        resultBox.innerHTML = `
          <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid var(--border-gold); padding: 28px; border-radius: var(--radius-md); margin-top: 24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
              <span class="mono" style="color:var(--gold-leaf); text-transform:uppercase;">Custom Route Draft Generated</span>
              <span class="badge" style="background:var(--saffron-ochre); color:#000; font-weight:700; padding:4px 10px; border-radius:4px;">100% Bespoke</span>
            </div>
            <h3 style="font-size:1.8rem; margin-bottom:8px;">${nameInput}'s ${nights}-Night Odyssey across India</h3>
            <p style="color:var(--text-secondary); margin-bottom:20px;">Paced for <strong>${pace} exploration</strong>. Engineered with zero back-tracking, private AC rail transfers, and verified heritage boutique stays.</p>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px; margin-bottom:24px;">
              <div style="background:var(--bg-card); padding:16px; border-radius:8px; border:1px solid var(--border-subtle);">
                <div class="mono" style="color:var(--text-muted); font-size:0.75rem;">LEG 1 (DAYS 1–4)</div>
                <h4 style="margin:4px 0;">Delhi & Golden Triangle</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary);">Red Fort walks, sunrise at Taj Mahal, artisan marble studio.</p>
              </div>
              <div style="background:var(--bg-card); padding:16px; border-radius:8px; border:1px solid var(--border-subtle);">
                <div class="mono" style="color:var(--text-muted); font-size:0.75rem;">LEG 2 (DAYS 5–9)</div>
                <h4 style="margin:4px 0;">Ganges Dawn & Varanasi</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary);">Vande Bharat Express transfer, private sunrise boat, Aarti ceremony.</p>
              </div>
              <div style="background:var(--bg-card); padding:16px; border-radius:8px; border:1px solid var(--border-subtle);">
                <div class="mono" style="color:var(--text-muted); font-size:0.75rem;">LEG 3 (DAYS 10–14)</div>
                <h4 style="margin:4px 0;">Kerala Backwaters & Spice Coast</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary);">Kochi port walk, private wooden houseboat cruise, Munnar tea trail.</p>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; border-top:1px solid var(--border-subtle); padding-top:20px;">
              <div>
                <span class="mono" style="color:var(--text-muted); font-size:0.8rem;">ESTIMATED ALL-INCLUSIVE COST</span>
                <div style="font-size:1.8rem; font-weight:800; color:var(--gold-leaf);"><span data-usd="2350">$2,350</span> <small style="font-size:0.85rem; color:var(--text-secondary); font-weight:400;">/ person</small></div>
              </div>
              <a href="book.html" class="btn-primary" style="padding:12px 28px;">Lock Route with 20% Deposit →</a>
            </div>
          </div>
        `;
      }
    });
  }
});

