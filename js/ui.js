/* ============================================================
   India Unscripted — Shared UI, Header, Footer & Telemetry
   ============================================================ */

(function () {
  const header = document.getElementById("siteHeader");
  const footer = document.getElementById("siteFooter");
  const page = document.body.dataset.page || "";

  const link = (href, label, id) =>
    `<a href="${href}" class="${page === id ? "active" : ""}">${label}</a>`;

  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="telemetry-bar" style="background:#08090c; border-bottom:1px solid rgba(255,255,255,0.08); padding:5px 0; font-family:'Space Mono',monospace; font-size:0.75rem; color:#7d796e;">
        <div class="wrap" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#22c55e; box-shadow:0 0 8px #22c55e;"></span>
            <span>DISPATCH: <b id="uiIstClock" style="color:#f8f6f0; font-weight:400;">--:-- IST</b></span>
            <span style="opacity:0.4;">|</span>
            <span>LOCAL LIAISONS: <b>DELHI · UDAIPUR · KOCHI · LEH</b></span>
          </div>
          <div style="display:flex; align-items:center; gap:14px;">
            <a href="index.html#scrolly" style="color:#c5a059; text-decoration:none;">The Six Chapters &darr;</a>
          </div>
        </div>
      </div>
      <div class="wrap" style="padding-top:12px; padding-bottom:12px;">
        <nav class="nav" style="display:flex; justify-content:space-between; align-items:center;">
          <a class="brand" href="index.html" style="display:flex; align-items:center; gap:14px; text-decoration:none;">
            <img src="assets/logo.svg" alt="India Unscripted Astrolabe" width="36" height="36" style="filter: drop-shadow(0 0 10px rgba(197,160,89,0.45));">
            <div style="font-family:'Cinzel',serif; font-size:1.15rem; color:#f8f6f0; font-weight:700; letter-spacing:0.08em; display:flex; flex-direction:column; line-height:1.1;">
              INDIA <em style="font-style:normal; color:#c5a059;">UNSCRIPTED</em>
              <span style="font-family:'Space Mono',monospace; font-size:0.6rem; color:#c5a059; letter-spacing:0.18em; text-transform:uppercase;">Curated Expeditions</span>
            </div>
          </a>
          <div class="nav-links" style="display:flex; align-items:center; gap:20px;">
            ${link("index.html", "Experience", "home")}
            ${link("explore.html", "Explore", "explore")}
            ${link("plan.html", "Plan Route", "plan")}
            ${link("book.html", "Reserve", "book")}
            ${link("contact.html", "Concierge", "contact")}
            <button id="soundscapeToggle" class="btn-soundscape" style="background:transparent; border:1px solid rgba(197,160,89,0.35); color:#c5a059; padding:6px 12px; border-radius:3px; font-family:'Space Mono',monospace; font-size:0.75rem; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">
              <span style="display:inline-flex; gap:2px; height:10px; align-items:flex-end;">
                <span style="width:2px; height:6px; background:#c5a059;"></span>
                <span style="width:2px; height:10px; background:#c5a059;"></span>
                <span style="width:2px; height:4px; background:#c5a059;"></span>
              </span>
              <span>Audio Drone</span>
            </button>
            <a class="nav-cta" href="plan.html" style="background:#c5a059; color:#08090c; font-weight:700; padding:8px 18px; border-radius:3px; text-decoration:none; display:inline-flex; align-items:center; gap:6px; letter-spacing:0.04em;">
              Route Wizard <span class="badge" id="tripBadge" style="background:#08090c; color:#c5a059; padding:1px 6px; border-radius:2px; font-size:0.75rem;">0</span>
            </a>
          </div>

          <!-- Mobile Hamburger Toggle -->
          <button class="mobile-nav-toggle" id="mobileNavToggle" aria-label="Toggle navigation menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
        </nav>
      </div>`;

    // Inject shared mobile drawer if absent on secondary page
    if (!document.getElementById("mobileDrawer")) {
      const drawer = document.createElement("div");
      drawer.className = "mobile-drawer-overlay";
      drawer.id = "mobileDrawer";
      drawer.innerHTML = `
        <div class="mobile-drawer-inner">
          <div class="mobile-drawer-header">
            <div class="brand-title">
              INDIA UNSCRIPTED
              <span class="sub">Curated Subcontinent Expeditions</span>
            </div>
            <button class="mobile-drawer-close" id="mobileDrawerClose" aria-label="Close navigation menu">&times;</button>
          </div>
          <nav class="mobile-drawer-nav">
            <a class="mobile-nav-link" href="index.html">The Experience</a>
            <a class="mobile-nav-link" href="explore.html">All 43 Sanctuaries</a>
            <a class="mobile-nav-link" href="index.html#scrolly">The Six Chapters</a>
            <a class="mobile-nav-link" href="index.html#transitMap">Subcontinent Transit Web</a>
            <a class="mobile-nav-link" href="index.html#blueprint">Route Architect</a>
            <a class="mobile-nav-link" href="plan.html">Curate Route (Wizard)</a>
            <a class="mobile-nav-link" href="book.html">Reserve Expedition</a>
            <a class="mobile-nav-link" href="contact.html">Direct Concierge</a>
          </nav>
          <div class="mobile-drawer-actions">
            <a href="plan.html" class="btn btn-primary mobile-cta-btn" style="text-align:center;">Launch Route Wizard &rarr;</a>
            <a href="book.html" class="btn btn-ghost mobile-reserve-btn" style="text-align:center;">Reserve Allocation</a>
          </div>
          <div class="mobile-drawer-telemetry">
            <span>On-Ground Dispatch: <b>Active</b> · 43 Curated Sanctuaries</span>
            <span>Resident Liaisons in Delhi · Udaipur · Kochi · Leh</span>
          </div>
        </div>`;
      document.body.appendChild(drawer);

      // Attach mobile drawer event listeners if not already attached
      const togBtn = document.getElementById("mobileNavToggle");
      const clsBtn = document.getElementById("mobileDrawerClose");
      if (togBtn && clsBtn) {
        togBtn.addEventListener("click", () => {
          drawer.classList.add("active");
          document.body.style.overflow = "hidden";
        });
        clsBtn.addEventListener("click", () => {
          drawer.classList.remove("active");
          document.body.style.overflow = "";
        });
        drawer.addEventListener("click", (e) => {
          if (e.target === drawer) {
            drawer.classList.remove("active");
            document.body.style.overflow = "";
          }
        });
      }
    }

    // Live clock in shared header
    const clockEl = document.getElementById("uiIstClock");
    if (clockEl) {
      const update = () => {
        const now = new Date();
        const ist = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (330 * 60000));
        clockEl.textContent = `${String(ist.getHours()).padStart(2, '0')}:${String(ist.getMinutes()).padStart(2, '0')} IST`;
      };
      update();
      setInterval(update, 1000);
    }
  }

  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand" href="index.html" style="display:inline-flex; align-items:center; gap:12px; text-decoration:none;">
              <img src="assets/logo.svg" alt="Astrolabe Brandmark" width="32" height="32" style="filter: drop-shadow(0 0 8px rgba(212,175,55,0.4));">
              <span style="font-family:'Cinzel',serif; font-size:1.1rem; color:#f8f6f0; font-weight:700; letter-spacing:0.06em;">India <em style="font-style:normal; color:#d4af37;">Unscripted</em></span>
            </a>
            <p style="margin-top:12px; color:#a8a29e; font-size:0.9rem; line-height:1.6;">Real India, unvarnished and extraordinary — curated by resident specialists for travelers who seek transcendence beyond the postcard.</p>
          </div>
          <div>
            <h3>Discover</h3>
            <a href="explore.html?region=north">North India</a>
            <a href="explore.html?region=south">South India</a>
            <a href="explore.html?region=west">West India</a>
            <a href="explore.html?region=northeast">The Northeast</a>
          </div>
          <div>
            <h3>Plan</h3>
            <a href="plan.html">Personalize a trip</a>
            <a href="book.html">Book &amp; pay deposit</a>
            <a href="explore.html?interest=wildlife">Wildlife circuits</a>
            <a href="explore.html?interest=spiritual">Spiritual circuits</a>
          </div>
          <div>
            <h3>Company</h3>
            <a href="index.html#scrolly">The 6 Chapters</a>
            <a href="index.html#how">How it works</a>
            <a href="contact.html">Contact us</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} India Unscripted · Bespoke Subcontinent Expeditions · Delhi · Kochi · Leh · London · New York</span>
          <span>Private Residences · Reserved First-Class Rail · 24/7 Diplomatic Chauffeurs</span>
        </div>
      </div>`;
  }

  if (window.IU && window.IU.updateBadge) {
    IU.updateBadge();
  }
})();
