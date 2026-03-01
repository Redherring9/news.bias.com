/**
 * site/js/search.js — In-memory title/summary/source search
 *
 * Writes to BIAS.state.query (defined in filter.js) and calls
 * BIAS.applyFilters() so tag and search filters compose correctly.
 *
 * Each .card carries data-search="title summary source" set by the builder.
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("search-input");
    if (!input) return;

    input.addEventListener("input", function () {
      if (window.BIAS) {
        BIAS.state.query = input.value.trim();
        BIAS.applyFilters();
      }
    });

    // Clear search on Escape
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        input.value = "";
        if (window.BIAS) {
          BIAS.state.query = "";
          BIAS.applyFilters();
        }
      }
    });
  });
})();
