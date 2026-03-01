/**
 * site/js/filter.js — Tag filtering + shared filter state
 *
 * Exposes window.BIAS.state and window.BIAS.applyFilters() so search.js
 * can participate in the same filtering pass (cards must pass BOTH tag
 * and search query to be visible).
 *
 * URL param: ?tag=wildlife  — pre-selects a tag on page load.
 * Clicking a pill toggles the filter and updates the URL without reload.
 */

(function () {
  "use strict";

  // Shared state — search.js writes state.query, this file writes state.tag
  window.BIAS = window.BIAS || {};
  BIAS.state = { tag: "", query: "" };

  BIAS.applyFilters = function () {
    const cards = document.querySelectorAll(".card");
    let visible = 0;

    cards.forEach(function (card) {
      const cardTags = (card.dataset.tags || "").split(",").filter(Boolean);
      const tagOk = !BIAS.state.tag || cardTags.includes(BIAS.state.tag);

      const q = BIAS.state.query.toLowerCase();
      const searchOk = !q || (card.dataset.search || "").toLowerCase().includes(q);

      const show = tagOk && searchOk;
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    });

    // Update result count label
    const counter = document.getElementById("result-count");
    if (counter) {
      if (BIAS.state.tag || BIAS.state.query) {
        counter.textContent =
          visible + " result" + (visible !== 1 ? "s" : "");
      } else {
        counter.textContent = "";
      }
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    // Read initial tag from URL
    const params = new URLSearchParams(window.location.search);
    BIAS.state.tag = params.get("tag") || "";

    // Highlight active pill
    function syncPills() {
      document.querySelectorAll(".tag-pill").forEach(function (pill) {
        pill.classList.toggle("active", pill.dataset.tag === BIAS.state.tag);
      });
    }

    // Wire up pill clicks
    document.querySelectorAll(".tag-pill").forEach(function (pill) {
      pill.addEventListener("click", function (e) {
        e.preventDefault();
        const clicked = pill.dataset.tag;
        // Clicking the active tag clears the filter
        BIAS.state.tag = clicked === BIAS.state.tag ? "" : clicked;

        // Update URL without reload
        const url = new URL(window.location.href);
        if (BIAS.state.tag) {
          url.searchParams.set("tag", BIAS.state.tag);
        } else {
          url.searchParams.delete("tag");
        }
        window.history.pushState({}, "", url.toString());

        syncPills();
        BIAS.applyFilters();
      });
    });

    // Handle browser back/forward
    window.addEventListener("popstate", function () {
      const p = new URLSearchParams(window.location.search);
      BIAS.state.tag = p.get("tag") || "";
      syncPills();
      BIAS.applyFilters();
    });

    syncPills();
    BIAS.applyFilters();
  });
})();
