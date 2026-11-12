/* ============================================================
   India Unscripted — Contact page
   Validates and submits the Netlify "contact" form via AJAX
   ============================================================ */

(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const panel = document.getElementById("contactPanel");

  const successHTML = (name) => `
    <div class="form-success" style="text-align:center; padding:40px 20px;">
      <div style="margin-bottom:18px;">
        <img src="assets/logo.svg" alt="India Unscripted Astrolabe" width="56" height="56" style="filter: drop-shadow(0 0 16px rgba(197,160,89,0.45));">
      </div>
      <h2>Inquiry Successfully Dispatched${name ? ", " + IU.esc(name.split(" ")[0]) : ""}</h2>
      <p style="color:var(--ink-soft);margin:12px auto 24px; max-width:440px; line-height:1.6;">Your private consultation dossier has been assigned to our Senior Expedition Architect. Expect a personal reply within 4 hours.</p>
      <a class="btn btn-ghost" href="explore.html">Explore Sanctuaries &amp; Citadels</a>
    </div>`;

  /* no-JS fallback lands back here with ?sent=1 */
  if (new URLSearchParams(location.search).get("sent")) {
    panel.innerHTML = successHTML("");
    return;
  }

  /* prefill from saved trip profile */
  const p = IU.trip().profile || {};
  if (p.name) form.elements.name.value = p.name;
  if (p.email) form.email.value = p.email;

  function setError(el, show) {
    el.closest(".field").classList.toggle("invalid", show);
    return !show;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = setError(form.elements.name, form.elements.name.value.trim().length < 2);
    ok = setError(form.email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim())) && ok;
    ok = setError(form.message, form.message.value.trim().length < 3) && ok;
    if (!ok) { IU.toast("Please fix the highlighted fields"); return; }

    const btn = document.getElementById("contactBtn");
    btn.disabled = true;
    btn.textContent = "Sending…";
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        panel.innerHTML = successHTML(form.elements.name.value.trim());
      })
      .catch(() => {
        btn.disabled = false;
        btn.textContent = "Dispatch Private Inquiry →";
        IU.toast("Couldn't send — please check your connection and try again");
      });
  });
})();
