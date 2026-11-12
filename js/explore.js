/* ============================================================
   India Unscripted — Explore page
   Grid, filters, destination modal, trip bar
   ============================================================ */

(function () {
  const grid = document.getElementById("destGrid");
  if (!grid) return;

  const state = {
    q: "",
    regions: new Set(),
    interests: new Set(),
  };

  /* preset filters from the URL (?region=north&interest=wildlife) */
  const params = new URLSearchParams(location.search);
  if (params.get("region")) state.regions.add(params.get("region"));
  if (params.get("interest")) state.interests.add(params.get("interest"));
  if (params.get("q")) state.q = params.get("q");

  /* ---------- chips ---------- */
  const regionChips = document.getElementById("regionChips");
  const interestChips = document.getElementById("interestChips");

  REGIONS.forEach((r) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (state.regions.has(r.id) ? " active" : "");
    b.dataset.region = r.id;
    b.textContent = r.name;
    b.onclick = () => {
      state.regions.has(r.id) ? state.regions.delete(r.id) : state.regions.add(r.id);
      b.classList.toggle("active");
      render();
    };
    regionChips.appendChild(b);
  });

  INTERESTS.forEach((i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (state.interests.has(i.id) ? " active" : "");
    b.dataset.interest = i.id;
    b.textContent = i.label;
    b.onclick = () => {
      state.interests.has(i.id) ? state.interests.delete(i.id) : state.interests.add(i.id);
      b.classList.toggle("active");
      render();
    };
    interestChips.appendChild(b);
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.q = e.target.value.trim().toLowerCase();
    render();
  });

  document.getElementById("clearFilters").onclick = () => {
    state.q = "";
    state.regions.clear();
    state.interests.clear();
    document.getElementById("searchInput").value = "";
    document.querySelectorAll("#regionChips .chip, #interestChips .chip").forEach((c) => c.classList.remove("active"));
    render();
  };

  /* ---------- filtering ---------- */
  function visible(d) {
    if (state.regions.size && !state.regions.has(d.region)) return false;
    if (state.interests.size && !d.interests.some((t) => state.interests.has(t))) return false;
    if (state.q) {
      const hay = (d.name + " " + d.state + " " + d.tagline + " " + d.blurb + " " + d.highlights.join(" ")).toLowerCase();
      if (!hay.includes(state.q)) return false;
    }
    return true;
  }

  /* ---------- photographic destination registry ---------- */
  function getDestImage(d) {
    const map = {
      ayodhya: "assets/generated/ayodhya_ram_mandir.png",
      mathura: "assets/generated/mathura_vrindavan.png",
      kedarnath: "assets/generated/kedarnath_temple.png",
      badrinath: "assets/generated/badrinath_temple.png",
      tirupati: "assets/generated/tirupati_balaji.png",
      somnath: "assets/generated/somnath_temple.png",
      puri: "assets/generated/puri_jagannath.png",
      ujjain: "assets/generated/ujjain_mahakaleshwar.png",
      amritsar: "assets/generated/golden_temple_amritsar.png",
      madurai: "assets/generated/meenakshi_temple.png",
      varanasi: "assets/generated/varanasi_dawn_1.png",
      delhi: "assets/generated/delhi_redfort.png",
      agra: "assets/generated/agra_taj.png",
      jaipur: "assets/generated/flow_car_parked_near_hawa_mahal.png",
      udaipur: "assets/generated/flow_lake_palace_illuminated_at_twi.png",
      jaisalmer: "assets/generated/jaisalmer_desert.png",
      varanasi: "assets/generated/varanasi_dawn_1.png",
      rishikesh: "assets/generated/flow_lakshman_jhula_bridge_over_gan.png",
      amritsar: "assets/generated/flow_golden_temple_gleaming_at_nigh.png",
      ladakh: "assets/generated/ladakh_monastery.png",
      mumbai: "assets/generated/flow_marine_drive_traffic_curving_a.png",
      goa: "assets/generated/goa_coast.png",
      hampi: "assets/generated/hampi_ruins.png",
      munnar: "assets/generated/railway_chai.png",
      backwaters: "assets/generated/kerala_houseboat.png",
      madurai: "assets/generated/flow_meenakshi_temple_gopuram_archi.png",
      darjeeling: "assets/generated/flow_steam_train_chugging_around_lo.png",
      kaziranga: "assets/generated/flow_rhinoceros_grazing_in_morning_.png",
      shillong: "assets/generated/flow_living_root_bridge_over_river.png",
      andaman: "assets/generated/flow_radhanagar_beach_on_havelock_i.png",
      kashmir: "assets/generated/ladakh_monastery.png",
      himachal: "assets/generated/railway_chai.png",
      khajuraho: "assets/generated/hampi_ruins.png",
      bandhavgarh: "assets/generated/flow_rhinoceros_grazing_in_morning_.png",
      ellora: "assets/generated/hampi_ruins.png",
      kutch: "assets/generated/jaisalmer_desert.png",
      coorg: "assets/generated/railway_chai.png",
      mysuru: "assets/generated/flow_illuminated_palace_on_dark_wat.png",
      kochi: "assets/generated/flow_empty_beach_with_fishing_boat.png",
      varkala: "assets/generated/flow_empty_beach_with_coconut_palms.png",
      pondicherry: "assets/generated/flow_empty_beach_with_coconut_palms.png",
      chennai: "assets/generated/flow_meenakshi_temple_gopuram_archi.png",
      kolkata: "assets/generated/flow_ambassador_car_parked_near_fac.png",
      puri: "assets/generated/puri_jagannath.png",
      sundarbans: "assets/generated/flow_rhinoceros_grazing_in_morning_.png",
      majuli: "assets/generated/flow_root_bridge_over_river.png",
      gangtok: "assets/generated/flow_steam_train_chugging_around_lo.png"
    };
    return map[d.id] || "assets/generated/agra_taj.png";
  }

  /* ---------- card render ---------- */
  function cardHTML(d) {
    const added = IU.hasPick(d.id);
    const tags = d.interests.slice(0, 3)
      .map((t) => `<span class="tag">${IU.esc(IU.interestLabel(t))}</span>`).join("");
    const imgUrl = getDestImage(d);
    return `
      <article class="dest-card" data-open="${d.id}" tabindex="0">
        <div class="dest-art" style="background: linear-gradient(180deg, rgba(8,9,12,0.15) 30%, rgba(8,9,12,0.85) 100%), url('${imgUrl}') center / cover no-repeat;">
          <span class="dest-region">${IU.regionName(d.region)}</span>
        </div>
        <div class="dest-body">
          <h3>${IU.esc(d.name)}</h3>
          <p class="dest-state">${IU.esc(d.state)}</p>
          <p class="dest-blurb">${IU.esc(d.tagline)}</p>
          <div class="tag-row">${tags}</div>
          <div class="dest-meta">
            <span>Optimal: ${IU.esc(d.bestTime)}</span>
            <span>${IU.costTag(d.cost)}</span>
          </div>
          <button class="btn-add ${added ? "added" : ""}" data-add="${d.id}">
            ${added ? "In Your Route" : "+ Include in Route"}
          </button>
        </div>
      </article>`;
  }

  function render() {
    const list = DESTINATIONS.filter(visible);
    const countEl = document.getElementById("resultCount");
    if (countEl) countEl.textContent = list.length + " of " + DESTINATIONS.length + " destinations";
    grid.innerHTML = list.length
      ? list.map(cardHTML).join("")
      : `<div class="empty-box" style="grid-column:1/-1; text-align:center; padding:60px 20px;">
           <div style="margin-bottom:16px;"><img src="assets/logo.svg" alt="Astrolabe" width="48" height="48" style="opacity:0.6; filter: drop-shadow(0 0 10px rgba(212,175,55,0.3));"></div>
           <h3 style="font-family:var(--font-serif); color:#fff; font-size:1.6rem; margin-bottom:8px;">No Destinations Match This Filter</h3>
           <p style="color:var(--text-secondary); max-width:450px; margin:0 auto;">Try clearing a filter tag — India is vast, bespoke routes can be charted anywhere.</p>
         </div>`;
  }

  /* ---------- modal ---------- */
  const overlay = document.getElementById("destModal");
  const modalBox = overlay ? overlay.querySelector(".modal") : null;

  function openModal(d) {
    const added = IU.hasPick(d.id);
    const imgUrl = getDestImage(d);
    modalBox.innerHTML = `
      <div class="modal-art" style="background: linear-gradient(180deg, rgba(8,9,12,0.2) 20%, rgba(8,9,12,0.92) 100%), url('${imgUrl}') center / cover no-repeat; min-height: 220px; position:relative; border-radius: 4px 4px 0 0; padding: 20px;">
        <span class="dest-region">${IU.regionName(d.region)}</span>
        <button class="modal-close" data-close aria-label="Close">
          <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" focusable="false">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <p class="dest-state">${IU.esc(d.state)} · ${IU.regionName(d.region)}</p>
        <h2>${IU.esc(d.name)}</h2>
        <p class="blurb">${IU.esc(d.blurb)}</p>
        <ul class="hl-list">${d.highlights.map((h) => `<li>${IU.esc(h)}</li>`).join("")}</ul>
        <div class="modal-meta">
          <span class="meta-pill">Optimal: ${IU.esc(d.bestTime)}</span>
          <span class="meta-pill">${d.nights[1]} Nights Ideal</span>
          <span class="meta-pill">${IU.costTag(d.cost)} Typical Tier</span>
        </div>
        <div class="tag-row">${d.interests.map((t) => `<span class="tag">${IU.esc(IU.interestLabel(t))}</span>`).join("")}</div>
        <div class="modal-actions" style="margin-top:20px">
          <button class="btn btn-primary" data-toggle="${d.id}">
            ${added ? "Remove from Route" : "+ Include in Route"}
          </button>
          <a class="btn btn-ghost" href="plan.html">Curate Route Dossier</a>
        </div>
      </div>`;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest("[data-close]")) closeModal();
    const tog = e.target.closest("[data-toggle]");
    if (tog) {
      const d = IU.destById(tog.dataset.toggle);
      const addedNow = IU.togglePick(d.id);
      tog.textContent = addedNow ? "Remove from Route" : "+ Include in Route";
      IU.toast(addedNow ? d.name + " added to your route" : d.name + " removed from route");
      render();
      updateTripBar();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- grid events: click + keyboard ---------- */
  grid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest("[data-open]");
    if (card) { e.preventDefault(); openModal(IU.destById(card.dataset.open)); }
  });

  grid.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      const d = IU.destById(addBtn.dataset.add);
      const addedNow = IU.togglePick(d.id);
      IU.toast(addedNow ? d.name + " added to your trip" : d.name + " removed");
      render();
      updateTripBar();
      return;
    }
    const card = e.target.closest("[data-open]");
    if (card) openModal(IU.destById(card.dataset.open));
  });

  /* ---------- floating trip bar ---------- */
  const tripBar = document.getElementById("tripBar");
  function updateTripBar() {
    const n = IU.picks().length;
    tripBar.querySelector(".count").textContent = n;
    tripBar.classList.toggle("show", n > 0);
  }

  render();
  updateTripBar();
})();
