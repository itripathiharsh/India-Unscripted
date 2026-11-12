/* ============================================================
   India Unscripted — Plan page
   5-step personalization wizard + itinerary generator
   ============================================================ */

(function () {
  const shell = document.getElementById("wizardShell");
  if (!shell) return;

  const PACE = {
    relaxed: { perDay: 2, label: "Relaxed" },
    balanced: { perDay: 3, label: "Balanced" },
    packed: { perDay: 4, label: "Packed" },
  };
  const TIMES = ["08:30", "11:30", "15:00", "18:30"];

  let step = 1;
  const panels = [1, 2, 3, 4, 5].map((n) => document.getElementById("panel" + n));
  const nextBtn = document.getElementById("nextBtn");
  const backBtn = document.getElementById("backBtn");

  /* ---------- prefill from store ---------- */
  const saved = IU.trip();
  if (saved.profile) {
    const p = saved.profile;
    if (p.name) fName.value = p.name;
    if (p.email) fEmail.value = p.email;
    if (p.country) fCountry.value = p.country;
    if (p.travelers) fTravelers.value = p.travelers;
    if (p.startDate) fDate.value = p.startDate;
    if (p.nights) fNights.value = p.nights;
  }

  /* ---------- step 1: validation ---------- */
  function setError(fieldId, show) {
    const field = document.getElementById(fieldId).closest(".field");
    if (field) field.classList.toggle("invalid", show);
    return !show;
  }
  function validateStep1() {
    let ok = true;
    const name = fName.value.trim();
    ok = setError("fName", name.length < 2) && ok;
    const email = fEmail.value.trim();
    ok = setError("fEmail", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) && ok;
    ok = setError("fCountry", !fCountry.value) && ok;
    const trav = parseInt(fTravelers.value, 10);
    ok = setError("fTravelers", !(trav >= 1 && trav <= 30)) && ok;
    const nts = parseInt(fNights.value, 10);
    ok = setError("fNights", !(nts >= 3 && nts <= 90)) && ok;
    if (fDate.value) {
      ok = setError("fDate", parseDate(fDate.value) < parseDate(todayStr())) && ok;
    }
    return ok;
  }
  function validateStep3() {
    if (IU.picks().length < 2) {
      IU.toast("Pick at least 2 places to build a route");
      return false;
    }
    return true;
  }

  /* ---------- step 2: interests ---------- */
  const interestChips = document.getElementById("interestChips");
  INTERESTS.forEach((i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip-lg";
    b.dataset.interest = i.id;
    b.textContent = i.label;
    b.onclick = () => b.classList.toggle("active");
    interestChips.appendChild(b);
  });
  function selectedInterests() {
    return [...interestChips.querySelectorAll(".chip-lg.active")].map((b) => b.dataset.interest);
  }

  /* ---------- step 3: places ---------- */
  function getPlanDestImage(d) {
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
      rishikesh: "assets/generated/flow_lakshman_jhula_bridge_over_gan.png",
      ladakh: "assets/generated/ladakh_monastery.png",
      mumbai: "assets/generated/flow_marine_drive_traffic_curving_a.png",
      goa: "assets/generated/goa_coast.png",
      hampi: "assets/generated/hampi_ruins.png",
      munnar: "assets/generated/railway_chai.png",
      backwaters: "assets/generated/kerala_houseboat.png",
      darjeeling: "assets/generated/flow_steam_train_chugging_around_lo.png",
      shillong: "assets/generated/flow_living_root_bridge_over_river.png"
    };
    return map[d.id] || "assets/generated/agra_taj.png";
  }

  const placesGrid = document.getElementById("placesGrid");
  function recommended() {
    const ints = selectedInterests();
    if (!ints.length) return DESTINATIONS;
    return [...DESTINATIONS]
      .map((d) => ({ d, score: d.interests.filter((t) => ints.includes(t)).length }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.d);
  }
  function renderPlaces() {
    const recs = recommended();
    const picks = new Set(IU.picks());
    const list = (recs.length ? recs : DESTINATIONS).slice(0, 18);
    document.getElementById("placesCount").textContent =
      IU.picks().length + " selected · showing " + list.length + " curated matches for your themes";
    placesGrid.innerHTML = list
      .map((d) => {
        const added = picks.has(d.id);
        const imgUrl = getPlanDestImage(d);
        return `
        <article class="dest-card" data-open="${d.id}">
          <div class="dest-art" style="background: linear-gradient(180deg, rgba(8,9,12,0.15) 30%, rgba(8,9,12,0.85) 100%), url('${imgUrl}') center / cover no-repeat;">
            <span class="dest-region">${IU.regionName(d.region)}</span>
          </div>
          <div class="dest-body">
            <h3>${IU.esc(d.name)}</h3>
            <p class="dest-state">${IU.esc(d.state)}</p>
            <p class="dest-blurb">${IU.esc(d.tagline)}</p>
            <button class="btn-add ${added ? "added" : ""}" data-add="${d.id}">
              ${added ? "Selected Sanctuary" : "+ Include Sanctuary"}
            </button>
          </div>
        </article>`;
      })
      .join("");
  }
  placesGrid.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      const d = IU.destById(addBtn.dataset.add);
      IU.togglePick(d.id);
      IU.toast(IU.hasPick(d.id) ? d.name + " selected" : d.name + " removed");
      renderPlaces();
      return;
    }
  });
  document.getElementById("clearPicks").onclick = () => {
    const t = IU.trip();
    t.picks = [];
    IU.save(t);
    renderPlaces();
    IU.updateBadge();
  };
  document.getElementById("addRecommended").onclick = () => {
    const t = IU.trip();
    recommended().slice(0, 8).forEach((d) => {
      if (!t.picks.includes(d.id)) t.picks.push(d.id);
    });
    IU.save(t);
    IU.updateBadge();
    renderPlaces();
    IU.toast("Added your top 8 matches");
  };

  /* ---------- step 4: pace & budget (option cards) ---------- */
  document.querySelectorAll(".option-card input").forEach((inp) => {
    inp.addEventListener("change", () => syncOptionCards());
  });
  function syncOptionCards() {
    document.querySelectorAll(".option-card").forEach((card) => {
      card.classList.toggle("selected", card.querySelector("input").checked);
    });
  }
  syncOptionCards();

  /* ---------- wizard navigation ---------- */
  function showStep(n) {
    step = n;
    panels.forEach((p, i) => p.classList.toggle("active", i === n - 1));
    document.querySelectorAll(".step-dot").forEach((dot) => {
      const d = +dot.dataset.step;
      dot.classList.toggle("active", d === n);
      dot.classList.toggle("done", d < n);
    });
    backBtn.style.visibility = n === 1 ? "hidden" : "visible";
    nextBtn.textContent = n === 5 ? "See my itinerary →" : "Continue →";
    if (n === 3) renderPlaces();
    if (n === 5) renderReview();
    shell.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  backBtn.onclick = () => showStep(Math.max(1, step - 1));
  nextBtn.onclick = () => {
    if (step === 1 && !validateStep1()) { IU.toast("Please fix the highlighted fields"); return; }
    if (step === 3 && !validateStep3()) return;
    if (step === 5) { generate(); return; }
    showStep(step + 1);
  };
  document.querySelectorAll(".step-dot").forEach((dot) => {
    dot.style.cursor = "pointer";
    dot.onclick = () => {
      const n = +dot.dataset.step;
      if (n < step || (n === 1)) showStep(n);
      else if (n === step + 1 && (step !== 1 ? true : validateStep1()) && (step !== 3 ? true : validateStep3())) showStep(n);
    };
  });

  /* ---------- step 5: review ---------- */
  function renderReview() {
    const picks = IU.picks().map((id) => IU.destById(id)).filter(Boolean);
    const ints = selectedInterests();
    const pace = document.querySelector('input[name="pace"]:checked').value;
    const budget = document.querySelector('input[name="budget"]:checked').value;
    const nights = parseInt(fNights.value, 10) || 14;
    document.getElementById("reviewSummary").innerHTML = `
      <ul class="hl-list">
        <li><b>${IU.esc(fName.value.trim() || "Lead Guest")}</b> from ${IU.esc(fCountry.value || "International")} · ${fTravelers.value || 1} guest(s)</li>
        <li><span class="dossier-lbl">Schedule:</span> ${fDate.value ? fmtRange(fDate.value, nights) : "Flexible dates"} · ${nights} Nights</li>
        <li><span class="dossier-lbl">Tempo &amp; Tier:</span> ${PACE[pace].label} Tempo · ${BUDGET_TIERS[budget].label}</li>
        <li><span class="dossier-lbl">Expedition Themes:</span> ${ints.length ? ints.map((i) => IU.interestLabel(i)).join(", ") : "All Subcontinent Horizons"}</li>
        <li><span class="dossier-lbl">Curated Sanctuaries:</span> ${picks.map((d) => IU.esc(d.name)).join(" &rarr; ") || "None selected"}</li>
      </ul>`;
  }

  /* ---------- itinerary generation ---------- */
  /* Fit places into the target number of nights.
     Returns { alloc, kept } — places that couldn't fit at their minimum stay are dropped
     from the end of the route (they can be re-added or the trip extended). */
  function allocateNights(places, target) {
    const minSum = (arr) => arr.reduce((s, d) => s + d.nights[0], 0);
    const kept = [...places];
    while (kept.length > 2 && minSum(kept) > target) kept.pop();

    const alloc = {};
    const idealSum = kept.reduce((s, d) => s + d.nights[1], 0);
    if (idealSum <= target) {
      kept.forEach((d) => (alloc[d.id] = d.nights[1]));
      let left = target - idealSum;
      let guard = 0;
      while (left > 0 && kept.length && guard < 200) {
        alloc[kept[guard % kept.length].id]++;
        left--; guard++;
      }
    } else {
      const scale = target / idealSum;
      let used = 0;
      kept.forEach((d) => {
        alloc[d.id] = Math.max(d.nights[0], Math.round(d.nights[1] * scale));
        used += alloc[d.id];
      });
      let i = 0;
      let guard = 0;
      while (used > target && guard < 500) {
        const p = kept[i % kept.length];
        if (alloc[p.id] > p.nights[0]) { alloc[p.id]--; used--; }
        i++; guard++;
      }
    }
    return { alloc, kept };
  }

  function collectAnswers() {
    return {
      name: fName.value.trim(),
      email: fEmail.value.trim(),
      country: fCountry.value,
      travelers: parseInt(fTravelers.value, 10) || 1,
      startDate: fDate.value || "",
      nights: parseInt(fNights.value, 10) || 14,
      interests: selectedInterests(),
      pace: document.querySelector('input[name="pace"]:checked').value,
      budget: document.querySelector('input[name="budget"]:checked').value,
    };
  }

  function generate() {
    const answers = collectAnswers();
    const t = IU.trip();
    t.profile = answers;
    IU.save(t);

    const picked = IU.picks().map((id) => IU.destById(id)).filter(Boolean).sort((a, b) => a.route - b.route);
    const { alloc, kept } = allocateNights(picked, answers.nights);
    const places = kept;
    const dropped = picked.filter((p) => !alloc[p.id]);
    t.nights = alloc;
    IU.save(t);

    const perDay = PACE[answers.pace].perDay;
    const est = estimateTrip(places.map((p) => p.id), alloc, answers.budget, answers.travelers);

    /* header */
    document.getElementById("resTitle").textContent = answers.name
      ? answers.name.split(" ")[0] + "'s India itinerary"
      : "Your India itinerary";
    document.getElementById("resMeta").textContent =
      (fDate.value ? fmtRange(fDate.value, est.nights) + " · " : "") +
      est.nights + " nights · " + places.length + " places · " + answers.travelers + " traveler" + (answers.travelers > 1 ? "s" : "");

    const reasons = [];
    if (answers.interests.length) {
      reasons.push("Built around your love of " + answers.interests.slice(0, 3).map((i) => IU.interestLabel(i).toLowerCase()).join(", ") + ".");
    } else {
      reasons.push("A greatest-hits route across India's classic regions.");
    }
    reasons.push("Ordered to travel one smooth loop — " + places.map((p) => p.name.split(" ")[0]).join(" → ") + " — so you never backtrack.");
    reasons.push(PACE[answers.pace].label + " pace: about " + perDay + " planned experiences a day, with room to breathe.");
    reasons.push(BUDGET_TIERS[answers.budget].label + "-tier stays and cars, in local family-run places.");
    if (dropped.length) {
      reasons.push(
        "To fit " + answers.nights + " nights we left out " +
        dropped.map((d) => d.name.split(" ")[0]).join(", ") +
        " — add nights or ask your designer to squeeze them in."
      );
    }
    document.getElementById("resReasons").innerHTML = reasons.map((r) => `<li>${IU.esc(r)}</li>`).join("");

    document.getElementById("resPlaces").innerHTML = places
      .map((d) => `<span class="place-chip">${IU.esc(d.name)} <span class="n">${alloc[d.id]}n</span></span>`)
      .join("");

    /* itinerary days */
    const days = buildDays(places, alloc, perDay);
    renderItinerary(days, answers);

    /* estimate sidebar */
    renderEstimate(est, answers, alloc);

    /* reveal */
    shell.style.display = "none";
    const res = document.getElementById("resultsSection");
    res.style.display = "block";
    res.scrollIntoView({ behavior: "smooth" });
  }

  function buildDays(places, alloc, perDay) {
    const days = [];
    let dayNum = 1;
    places.forEach((d, pi) => {
      const n = alloc[d.id];
      const pool = [...d.highlights];
      const last = pi === places.length - 1;
      for (let i = 0; i < n; i++) {
        const blocks = [];
        if (i === 0) {
          blocks.push({ time: "Morning", label: "Arrive in " + d.name + " — private check-in, fresh regional tea, heritage orientation walk" });
          for (let k = 0; k < perDay - 1 && pool.length; k++) blocks.push({ time: TIMES[k + 1] || "Evening", label: pool.shift() });
        } else if (i === n - 1 && !last) {
          const nxt = places[pi + 1];
          for (let k = 0; k < perDay - 1 && pool.length; k++) blocks.push({ time: TIMES[k], label: pool.shift() });
          blocks.push({ time: "Evening", label: "Transfer onward to " + nxt.name + " via private reserved first-class rail or dedicated chauffeur" });
        } else if (i === n - 1 && last) {
          for (let k = 0; k < perDay - 1 && pool.length; k++) blocks.push({ time: TIMES[k], label: pool.shift() });
          blocks.push({ time: "Evening", label: "Private farewell dinner and preparation for departure" });
        } else {
          for (let k = 0; k < perDay && pool.length; k++) blocks.push({ time: TIMES[k], label: pool.shift() });
          while (blocks.length < perDay) blocks.push({ time: "Free", label: FALLBACK_ACTIVITIES[blocks.length % FALLBACK_ACTIVITIES.length] });
        }
        days.push({ day: dayNum++, place: d, blocks });
      }
    });
    return days;
  }

  function renderItinerary(days, answers) {
    const box = document.getElementById("itinerary");
    const t = IU.trip();
    t.custom = t.custom || {};
    let d0 = answers.startDate ? parseDate(answers.startDate) : null;

    box.innerHTML = days
      .map((dy) => {
        const customs = t.custom[dy.place.id] || [];
        const myCustom = customs.filter((c) => c.day === dy.day);
        const dateStr = d0 ? fmtDate(addDays(d0, dy.day - 1)) : "";
        return `
        <div class="it-day" data-place="${dy.place.id}">
          <div class="it-day-head">
            <div class="it-day-num">D${dy.day}</div>
            <div>
              <h3>Day ${dy.day}${dateStr ? " · " + dateStr : ""}</h3>
            </div>
            <span class="place-tag">${IU.esc(dy.place.name)}</span>
          </div>
          <div class="it-blocks">
            ${dy.blocks.map((b) => `<div class="it-block"><span class="time">${IU.esc(b.time)}</span><span class="txt">${IU.esc(b.label)}</span></div>`).join("")}
            ${myCustom
              .map(
                (c) =>
                  `<div class="it-block custom"><span class="time">Custom</span><span class="txt">${IU.esc(c.text)}</span><button class="rm-btn" data-rm="${dy.place.id}|${c.id}" title="Remove" aria-label="Remove activity"><svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true" focusable="false"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg></button></div>`
              )
              .join("")}
          </div>
          <div class="add-activity">
            <input type="text" placeholder="+ Add a custom excursion to Day ${dy.day}…" data-add-input="${dy.place.id}|${dy.day}">
          </div>
        </div>`;
      })
      .join("");
  }

  /* custom activity add / remove */
  document.getElementById("itinerary").addEventListener("click", (e) => {
    const rm = e.target.closest("[data-rm]");
    if (rm) {
      const [pid, cid] = rm.dataset.rm.split("|");
      const t = IU.trip();
      t.custom[pid] = (t.custom[pid] || []).filter((c) => String(c.id) !== cid);
      IU.save(t);
      regenerateCurrent();
    }
  });
  document.getElementById("itinerary").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const inp = e.target.closest("[data-add-input]");
    if (!inp || !inp.value.trim()) return;
    e.preventDefault();
    const [pid, day] = inp.dataset.addInput.split("|");
    const t = IU.trip();
    t.custom = t.custom || {};
    t.custom[pid] = t.custom[pid] || [];
    t.custom[pid].push({ id: Date.now(), day: +day, text: inp.value.trim() });
    IU.save(t);
    IU.toast("Added to your itinerary");
    regenerateCurrent();
  });

  function regenerateCurrent() {
    const t = IU.trip();
    const a = t.profile;
    const alloc = t.nights || {};
    const places = Object.keys(alloc).map((id) => IU.destById(id)).filter(Boolean).sort((x, y) => x.route - y.route);
    const days = buildDays(places, alloc, PACE[a.pace].perDay);
    renderItinerary(days, a);
  }

  function renderEstimate(est, answers, alloc) {
    const side = document.getElementById("estimateSide");
    const stays = est.perPerson * 0.55;
    const food = est.perPerson * 0.25;
    const moving = est.perPerson * 0.2;
    side.innerHTML = `
      <h3>Investment Breakdown</h3>
      <p class="est-note">Land-only private expedition (heritage palace suites, private chauffeur, reserved rail, senior liaisons).</p>
      <div class="est-big">${IU.money(est.low)} – ${IU.money(est.high)} <small>per guest</small></div>
      <div style="margin-top:18px">
        <div class="est-row"><span>Heritage Stays · ${est.nights} nights</span><b>${IU.money(stays)}</b></div>
        <div class="est-row"><span>Gastronomy &amp; Culinary Access</span><b>${IU.money(food)}</b></div>
        <div class="est-row"><span>Chauffeurs, Reserved Rail &amp; Liaisons</span><b>${IU.money(moving)}</b></div>
        <div class="est-row"><span>Total Party Investment</span><b>${IU.money(est.group)}</b></div>
      </div>
      <a class="btn btn-primary" href="book.html">Reserve Expedition &rarr;</a>
      <div class="link-row">
        <a href="#" id="editAnswers">&larr; Adjust Specifications</a> ·
        <a href="#" id="printPlan">Print Dossier</a>
      </div>`;
    document.getElementById("editAnswers").onclick = (e) => {
      e.preventDefault();
      document.getElementById("resultsSection").style.display = "none";
      shell.style.display = "block";
      showStep(5);
    };
    document.getElementById("printPlan").onclick = (e) => {
      e.preventDefault();
      window.print();
    };
  }

  /* deep-link: plan.html?go=1 auto-starts at step 2 if profile saved */
  showStep(1);
})();
