/**
 * India Unscripted — 3D Subcontinent Transit Web Controller
 * Handles 3D perspective tilt, live monument pins, category filtering,
 * and dynamic on-ground dispatch synchronization.
 */
(function() {
  function initTransitMap() {
    const stage = document.getElementById('transitPerspectiveStage');
    const chassis = document.getElementById('subcontinentChassis');
    if (!stage || !chassis) return;

    // 1. Mouse-Tracking Parallax 3D Tilt
    const isMobileScreen = window.innerWidth <= 768;
    let isFlatMode = isMobileScreen;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let rafId = null;

    if (isMobileScreen) {
      chassis.classList.add('flat-mode');
      chassis.style.transform = 'none';
    }

    function updateParallax() {
      if (!isFlatMode) {
        currentTiltX += (targetTiltX - currentTiltX) * 0.1;
        currentTiltY += (targetTiltY - currentTiltY) * 0.1;
        
        const rotX = 24 + (-currentTiltY * 10);
        const rotY = currentTiltX * 14;
        chassis.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(-2deg) translateZ(0)`;
      }
      rafId = requestAnimationFrame(updateParallax);
    }
    rafId = requestAnimationFrame(updateParallax);

    stage.addEventListener('mousemove', (e) => {
      if (isFlatMode) return;
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to +0.5
      targetTiltX = x;
      targetTiltY = y;
    });

    stage.addEventListener('mouseleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
    });

    // 2. 2D / 3D View Switcher
    const btn3D = document.getElementById('toggle3DView');
    const btnFlat = document.getElementById('toggleFlatView');

    if (btn3D && btnFlat) {
      btn3D.addEventListener('click', () => {
        isFlatMode = false;
        btn3D.classList.add('active');
        btnFlat.classList.remove('active');
        chassis.classList.remove('flat-mode');
        chassis.style.transform = `rotateX(24deg) rotateY(0deg) rotateZ(-2deg) translateZ(0)`;
      });

      btnFlat.addEventListener('click', () => {
        isFlatMode = true;
        btnFlat.classList.add('active');
        btn3D.classList.remove('active');
        chassis.classList.add('flat-mode');
        chassis.style.transform = `rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0)`;
      });
    }

    // 3. Category Realm Filters
    const filterGroup = document.getElementById('mapFilterGroup');
    const pins = Array.from(document.querySelectorAll('.monument-3d-pin'));

    if (filterGroup) {
      filterGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-pill');
        if (!btn) return;

        filterGroup.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        pins.forEach(pin => {
          if (filter === 'all' || pin.dataset.category === filter) {
            pin.classList.remove('dimmed');
          } else {
            pin.classList.add('dimmed');
          }
        });
      });
    }

    // 4. Dispatch Panel Elements
    const elName = document.getElementById('mapCityName');
    const elEra = document.getElementById('mapCityEra');
    const elBadge = document.getElementById('mapCityBadge');
    const elImg = document.getElementById('mapCityImg');
    const elDesc = document.getElementById('mapCityDesc');
    const elSensory = document.getElementById('mapCitySensory');
    const elTip = document.getElementById('mapCityTip');
    const btnAdd = document.getElementById('mapAddToRouteBtn');

    let activePin = null;

    function activateMonument(pin) {
      if (!pin) return;
      if (activePin) activePin.classList.remove('active');
      activePin = pin;
      activePin.classList.add('active');

      const card = pin.querySelector('.floating-monument-card');
      if (!card) return;

      const name = card.dataset.name;
      const city = card.dataset.city;
      const badge = card.dataset.badge;
      const era = card.dataset.era;
      const img = card.dataset.img;
      const arch = card.dataset.arch;
      const sensory = card.dataset.sensory;
      const tip = card.dataset.tip;

      if (elName) elName.textContent = `${name}, ${city}`;
      if (elEra) elEra.textContent = era;
      if (elBadge) elBadge.textContent = badge;
      if (elDesc) elDesc.textContent = arch;
      if (elSensory) elSensory.textContent = sensory;
      if (elTip) elTip.textContent = tip;

      if (elImg && img && elImg.getAttribute('src') !== img) {
        elImg.style.opacity = '0.3';
        setTimeout(() => {
          elImg.src = img;
          elImg.style.opacity = '1';
        }, 120);
      }

      // Update mobile ribbon chips active state
      const ribbonChips = document.querySelectorAll('.mobile-waypoint-chip');
      ribbonChips.forEach(chip => {
        if (chip.dataset.id === pin.dataset.id) {
          chip.classList.add('active');
          chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
          chip.classList.remove('active');
        }
      });
    }

    // Bind click & hover on each pin
    pins.forEach(pin => {
      pin.addEventListener('mouseenter', () => {
        activateMonument(pin);
      });

      pin.addEventListener('click', (e) => {
        activateMonument(pin);
      });
    });

    // Bind click on mobile ribbon chips
    const ribbon = document.getElementById('mobileWaypointsRibbon');
    if (ribbon) {
      ribbon.addEventListener('click', (e) => {
        const chip = e.target.closest('.mobile-waypoint-chip');
        if (!chip) return;
        const targetPin = pins.find(p => p.dataset.id === chip.dataset.id);
        if (targetPin) {
          activateMonument(targetPin);
        }
      });
    }

    // Set Agra / Taj Mahal active initially
    const agraPin = pins.find(p => p.dataset.id === 'agra') || pins[0];
    if (agraPin) {
      activateMonument(agraPin);
    }

    // Hook "Include in Route Blueprint" action
    if (btnAdd) {
      btnAdd.addEventListener('click', (e) => {
        if (activePin) {
          const card = activePin.querySelector('.floating-monument-card');
          const name = card ? card.dataset.name : 'Selected Sanctuary';
          
          // Flash button feedback
          const originalText = btnAdd.innerHTML;
          btnAdd.innerHTML = `<span>Included ${name} in Blueprint</span>`;
          btnAdd.style.background = '#22c55e';

          setTimeout(() => {
            btnAdd.innerHTML = originalText;
            btnAdd.style.background = '';
          }, 1800);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTransitMap);
  } else {
    initTransitMap();
  }
})();

