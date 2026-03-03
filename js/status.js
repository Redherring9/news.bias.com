// status.js — Live relative-time countdown for the status bar.
// Reads ISO 8601 datetime attributes from <time> elements and
// updates their text every 30 seconds. No dependencies.

(function () {
  var INTERVAL_MS = 30000;

  function relativeTime(isoStr, isFuture) {
    var then = new Date(isoStr);
    if (isNaN(then)) return isoStr;
    var now = new Date();
    var diffMs = isFuture ? then - now : now - then;
    var diffS  = Math.round(diffMs / 1000);

    if (!isFuture) {
      if (diffS < 60)  return "just now";
      if (diffS < 3600) {
        var m = Math.floor(diffS / 60);
        return m + " min ago";
      }
      var h = Math.floor(diffS / 3600);
      var m = Math.floor((diffS % 3600) / 60);
      return h + "h " + (m > 0 ? m + "m " : "") + "ago";
    } else {
      if (diffS <= 0) return "overdue";
      if (diffS < 60) return "in " + diffS + "s";
      if (diffS < 3600) {
        var m = Math.floor(diffS / 60);
        return "in " + m + "m";
      }
      var h = Math.floor(diffS / 3600);
      var m = Math.floor((diffS % 3600) / 60);
      return "in " + h + "h" + (m > 0 ? " " + m + "m" : "");
    }
  }

  function update() {
    var last = document.getElementById("status-last-update");
    var next = document.getElementById("status-next-update");
    if (last) last.textContent = relativeTime(last.getAttribute("datetime"), false);
    if (next) next.textContent = relativeTime(next.getAttribute("datetime"), true);
  }

  document.addEventListener("DOMContentLoaded", function () {
    update();
    setInterval(update, INTERVAL_MS);
  });
})();
