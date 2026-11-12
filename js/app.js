/* ============================================================
   India Unscripted — shared app logic (trip store, helpers)
   ============================================================ */

const STORE_KEY = "iu_trip_v1";

const IU = {
  read() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (e) {
      return {};
    }
  },
  save(data) {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  },
  trip() {
    const t = IU.read();
    if (!Array.isArray(t.picks)) t.picks = [];
    return t;
  },
  picks() {
    return IU.trip().picks;
  },
  hasPick(id) {
    return IU.picks().includes(id);
  },
  togglePick(id) {
    const t = IU.trip();
    const i = t.picks.indexOf(id);
    if (i >= 0) t.picks.splice(i, 1);
    else t.picks.push(id);
    IU.save(t);
    IU.updateBadge();
    return i < 0; // true if it was added
  },
  updateBadge() {
    const el = document.getElementById("tripBadge");
    if (!el) return;
    const n = IU.picks().length;
    el.textContent = n;
  },
  destById(id) {
    return DESTINATIONS.find((d) => d.id === id) || null;
  },
  regionName(r) {
    const reg = REGIONS.find((x) => x.id === r);
    return reg ? reg.name : r;
  },
  regionEmoji(r) { return ""; },
  interestLabel(id) {
    const i = INTERESTS.find((x) => x.id === id);
    return i ? i.label : id;
  },
  interestEmoji(id) { return ""; },
  money(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  },
  esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  },
  costTag(cost) {
    return "₹".repeat(cost) + "·".repeat(3 - cost);
  },
  toast(msg) {
    document.querySelectorAll(".toast").forEach((t) => t.remove());
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add("hide"), 2100);
    setTimeout(() => el.remove(), 2600);
  },
};

/* ---------- cost estimate (shared by plan & book) ----------
   Returns rough per-person land costs (hotels + cars/trains),
   excluding international flights. */
function estimateTrip(placeIds, nightsById, budgetTier, travelers) {
  const tier = BUDGET_TIERS[budgetTier] || BUDGET_TIERS.comfort;
  let perPerson = 0;
  let totalNights = 0;
  const places = placeIds.map((id) => IU.destById(id)).filter(Boolean);
  places.forEach((d) => {
    const n = (nightsById && nightsById[d.id]) || d.nights[1];
    totalNights += n;
    perPerson += n * tier.base * (COST_FACTOR[d.cost] || 1);
  });
  perPerson += Math.max(0, places.length - 1) * 55; // intercity hops
  const group = perPerson * (travelers || 1);
  return {
    perPerson,
    group,
    low: perPerson * 0.85,
    high: perPerson * 1.15,
    nights: totalNights,
    places: places.length,
  };
}

/* ---------- date helpers ---------- */
function parseDate(s) {
  const d = new Date(s + "T00:00:00");
  return isNaN(d) ? null : d;
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function fmtDate(date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function fmtRange(startStr, nights) {
  const s = parseDate(startStr);
  if (!s) return "";
  return fmtDate(s) + " → " + fmtDate(addDays(s, nights));
}
function todayStr() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

/* populate country selects immediately (app.js loads before page scripts) */
document.querySelectorAll("select#fCountry").forEach((sel) => {
  if (![...sel.options].some((o) => o.value === "United States")) {
    COUNTRIES.forEach((c) => {
      const o = document.createElement("option");
      o.value = c;
      o.textContent = c;
      sel.appendChild(o);
    });
  }
});
