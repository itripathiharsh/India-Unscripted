/* ============================================================
   India Unscripted — Booking page
   Trip summary, extras, traveler details, price & confirmation
   ============================================================ */

(function () {
  const layout = document.getElementById("bookLayout");
  if (!layout) return;

  const t = IU.trip();
  let places = t.picks.map((id) => IU.destById(id)).filter(Boolean).sort((a, b) => a.route - b.route);
  if (t.nights) places = places.filter((d) => t.nights[d.id]); // only places the itinerary kept
  const emptyState = document.getElementById("emptyState");

  if (!places.length) {
    layout.style.display = "none";
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  const answers = t.profile || {};
  const budget = answers.budget || "comfort";
  const travelers = answers.travelers || 2;
  const nightsMap = t.nights || {};
  places.forEach((d) => { if (!nightsMap[d.id]) nightsMap[d.id] = d.nights[1]; });

  /* prefill details from saved profile */
  if (answers.name) fName.value = answers.name;
  if (answers.email) fEmail.value = answers.email;
  if (answers.country && fCountry.querySelector(`option[value="${answers.country}"]`)) fCountry.value = answers.country;

  /* ---------- trip summary panel ---------- */
  const totalNights = places.reduce((s, d) => s + nightsMap[d.id], 0);
  document.getElementById("tripSummary").innerHTML =
    places
      .map((d, idx) => {
        const n = nightsMap[d.id];
        return `
        <div class="summary-row">
          <div class="summary-code">${String(idx + 1).padStart(2, '0')}</div>
          <div>
            <div class="s-name">${IU.esc(d.name)}</div>
            <div class="s-sub">${IU.esc(d.state)} · ${IU.esc(d.bestTime)} optimal season</div>
          </div>
          <div class="s-right"><b>${n} night${n > 1 ? "s" : ""}</b></div>
        </div>`;
      })
      .join("") +
    `<div class="summary-row">
       <div class="summary-code">CAL</div>
       <div>
         <div class="s-name">${answers.startDate ? fmtRange(answers.startDate, totalNights) : "Dates to be confirmed with architect"}</div>
         <div class="s-sub">${answers.startDate ? "Reservation team confirms palace holds within 24 hours" : "Your Senior Expedition Architect refines arrival window"}</div>
       </div>
     </div>
     <div class="summary-row">
       <div class="summary-code">GRP</div>
       <div>
         <div class="s-name">${travelers} guest${travelers > 1 ? "s" : ""}</div>
         <div class="s-sub">${BUDGET_TIERS[budget].label} · ${answers.pace ? PACE_LABEL(answers.pace) : "Balanced"} tempo</div>
       </div>
     </div>
     <div class="trip-note">No funds are charged at this stage. After submission, a Senior Expedition Architect confirms room allocations and dispatches a verified reservation quotation and secure payment link within 24 hours.</div>`;

  function PACE_LABEL(p) {
    return { relaxed: "Relaxed", balanced: "Balanced", packed: "Packed" }[p] || "Balanced";
  }

  /* ---------- extras ---------- */
  const extrasGrid = document.getElementById("extrasGrid");
  let chosenExtras = new Set();
  extrasGrid.innerHTML = EXTRAS.map(
    (x) => `
    <label class="extra-card" for="x-${x.id}">
      <input type="checkbox" id="x-${x.id}" data-extra="${x.id}">
      <span class="x-bullet">✦</span>
      <span>
        <h3>${IU.esc(x.name)}</h3>
        <p>${IU.esc(x.desc)}</p>
      </span>
      <span class="x-price">${IU.money(x.price)}</span>
    </label>`
  ).join("");
  extrasGrid.addEventListener("change", () => {
    chosenExtras = new Set([...extrasGrid.querySelectorAll("input:checked")].map((i) => i.dataset.extra));
    extrasGrid.querySelectorAll(".extra-card").forEach((c) => {
      c.classList.toggle("selected", c.querySelector("input").checked);
    });
    renderPrice();
  });

  /* ---------- price panel ---------- */
  const base = estimateTrip(t.picks, nightsMap, budget, travelers);
  function renderPrice() {
    const extrasList = [...chosenExtras].map((id) => EXTRAS.find((x) => x.id === id));
    const extrasSum = extrasList.reduce((s, x) => s + x.price, 0);
    const total = base.group + extrasSum;
    const deposit = Math.round(total * 0.2);
    document.getElementById("priceRows").innerHTML = `
      <div class="p-row"><span>Land allocation · ${travelers} × ${IU.money(base.perPerson)}</span><b>${IU.money(base.group)}</b></div>
      ${extrasList.map((x) => `<div class="p-row"><span>${IU.esc(x.name)}</span><b>${IU.money(x.price)}</b></div>`).join("")}
      <div class="p-row total"><span>Total Expedition Investment</span><b>${IU.money(total)}</b></div>
      <div class="p-row deposit"><span>Initial 20% Reservation Deposit</span><b>${IU.money(deposit)}</b></div>`;
    document.getElementById("priceNote").textContent =
      "Estimate per " + travelers + " traveler" + (travelers > 1 ? "s" : "") +
      ", land-only. Final quote after availability check. Free changes for 72 hours after.";
  }
  renderPrice();

  /* ---------- validation & submit ---------- */
  function setError(fieldId, show) {
    const field = document.getElementById(fieldId).closest(".field");
    if (field) field.classList.toggle("invalid", show);
    return !show;
  }
  function validate() {
    let ok = true;
    ok = setError("fName", fName.value.trim().length < 2) && ok;
    ok = setError("fEmail", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fEmail.value.trim())) && ok;
    ok = setError("fPhone", fPhone.value.replace(/\D/g, "").length < 7) && ok;
    ok = setError("fCountry", !fCountry.value) && ok;
    if (!termsCheck.checked) {
      ok = false;
      IU.toast("Please accept the terms to continue");
    }
    return ok;
  }

  document.getElementById("confirmBtn").onclick = () => {
    if (!validate()) { IU.toast("Please fix the highlighted fields"); return; }
    const extrasList = [...chosenExtras].map((id) => EXTRAS.find((x) => x.id === id));
    const total = base.group + extrasList.reduce((s, x) => s + x.price, 0);
    const booking = {
      ref: "IU-" + Date.now().toString(36).toUpperCase().slice(-4) + "-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      traveler: {
        name: fName.value.trim(),
        email: fEmail.value.trim(),
        phone: fPhone.value.trim(),
        country: fCountry.value,
      },
      trip: {
        places: places.map((d) => ({ id: d.id, name: d.name, emoji: d.emoji, state: d.state, nights: nightsMap[d.id] })),
        totalNights,
        startDate: answers.startDate || "",
        travelers,
        budget: BUDGET_TIERS[budget].label,
        pace: PACE_LABEL(answers.pace || "balanced"),
        interests: answers.interests || [],
        custom: t.custom || {},
        itineraryNights: nightsMap,
      },
      extras: extrasList,
      notes: {
        arrival: fArrival.value.trim(),
        dietary: fDietary.value,
        mobility: fMobility.value.trim(),
        requests: fRequests.value.trim(),
        emergency: fEmergency.value.trim(),
      },
      totals: {
        perPerson: base.perPerson,
        group: base.group,
        extras: extrasList.reduce((s, x) => s + x.price, 0),
        total,
        deposit: Math.round(total * 0.2),
      },
    };
    const all = JSON.parse(localStorage.getItem("iu_bookings_v1") || "[]");
    all.unshift(booking);
    localStorage.setItem("iu_bookings_v1", JSON.stringify(all.slice(0, 20)));

    /* send the request to the team via Netlify Forms (form "booking-request" in book.html) */
    const fields = {
      "form-name": "booking-request",
      "bot-field": "",
      name: booking.traveler.name,
      email: booking.traveler.email,
      phone: booking.traveler.phone,
      country: booking.traveler.country,
      ref: booking.ref,
      places: booking.trip.places.map((p) => p.name + " (" + p.nights + "n)").join(", "),
      dates: booking.trip.startDate ? fmtRange(booking.trip.startDate, totalNights) : "To be confirmed",
      travelers: String(travelers),
      style: booking.trip.budget + " stays · " + booking.trip.pace + " pace",
      interests: (booking.trip.interests || []).map(IU.interestLabel).join(", "),
      extras: extrasList.map((x) => x.name).join(", ") || "None",
      estimate: IU.money(total),
      deposit: IU.money(booking.totals.deposit),
      arrival: booking.notes.arrival,
      dietary: booking.notes.dietary,
      mobility: booking.notes.mobility,
      emergency: booking.notes.emergency,
      requests: booking.notes.requests,
    };
    const btn = document.getElementById("confirmBtn");
    btn.disabled = true;
    btn.textContent = "Sending your request…";
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(fields).toString(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        location.href = "confirmation.html?ref=" + encodeURIComponent(booking.ref);
      })
      .catch(() => {
        btn.disabled = false;
        btn.textContent = "Reserve Expedition Allocation →";
        IU.toast("We couldn't send your request — please check your connection and try again");
      });
  };
})();
