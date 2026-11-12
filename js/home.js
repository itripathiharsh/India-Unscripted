/* ============================================================
   India Unscripted — Home page
   Featured destinations with interest tabs
   ============================================================ */

(function () {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;

  const TABS = [
    { id: "all", label: "All Sanctuaries" },
    { id: "culture", label: "Culture & Heritage" },
    { id: "spiritual", label: "Spiritual Traditions" },
    { id: "adventure", label: "Active Expeditions" },
    { id: "wildlife", label: "Wildlife & Safaris" },
    { id: "beach", label: "Coastal Retreats" },
    { id: "food", label: "Culinary Arts" },
  ];

  const tabBar = document.getElementById("featureTabs");
  let active = "all";

  tabBar.innerHTML = TABS.map(
    (t) => `<button type="button" class="editorial-tab ${t.id === "all" ? "active" : ""}" data-tab="${t.id}">${t.label}</button>`
  ).join("");

  function list() {
    if (active === "all") {
      return ["agra", "varanasi", "ladakh", "backwaters", "goa", "kaziranga", "jaipur", "hampi"]
        .map((id) => IU.destById(id))
        .filter(Boolean);
    }
    return DESTINATIONS.filter((d) => d.interests.includes(active)).slice(0, 8);
  }

  function render() {
    grid.innerHTML = list()
      .map((d) => {
        const added = IU.hasPick(d.id);
        return `
        <article class="dest-card" data-open="${d.id}">
          <div class="dest-art art-${d.region}">
            <span class="dest-region">${IU.regionName(d.region)}</span>
          </div>
          <div class="dest-body">
            <h3>${IU.esc(d.name)}</h3>
            <p class="dest-state">${IU.esc(d.state)}</p>
            <p class="dest-blurb">${IU.esc(d.tagline)}</p>
            <button class="btn-add ${added ? "added" : ""}" data-add="${d.id}">
              ${added ? "In Custom Route" : "+ Include in Route"}
            </button>
          </div>
        </article>`;
      })
      .join("");
  }

  tabBar.addEventListener("click", (e) => {
    const b = e.target.closest("[data-tab]");
    if (!b) return;
    active = b.dataset.tab;
    tabBar.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === b));
    render();
  });

  grid.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (!addBtn) return;
    const d = IU.destById(addBtn.dataset.add);
    IU.togglePick(d.id);
    IU.toast(IU.hasPick(d.id) ? d.name + " added to your trip" : d.name + " removed");
    render();
  });

  render();
})();
