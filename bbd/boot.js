/* BBD suite boot loader (page wiring only — not part of the engine).
   Fetches the constants (the ENGINE never fetches; this is page wiring),
   then loads modules in dependency order and mounts the public
   calculators in the spec §5 narrative order:
   Leak Meter → Wedge → Ladder → Breakeven → Curve → Simulator.

   Set window.BBD_BASE to the path prefix of the /bbd assets when embedding
   in another page (e.g. "bbd/"). Defaults to "" for the standalone page. */
(function () {
  "use strict";
  var base = window.BBD_BASE || "";
  var files = [
    "bbd-format.js",
    "bbd-engine.js",
    "bbd-ui.js",
    "gfx/motifs.js",
    "compliance.js",
    "widgets/calc-tax-drag.js",
    "widgets/calc-waiting.js",
    "widgets/calc-ladder.js",
    "widgets/calc-breakeven.js",
    "widgets/calc-curve.js",
    "widgets/calc-simulator.js"
  ];

  fetch(base + "bbd-constants.json")
    .then(function (r) { return r.json(); })
    .then(function (C) { window.BBD_CONSTANTS = C; loadSeq(0); })
    .catch(function (e) { console.error("BBD: could not load constants", e); });

  function loadSeq(i) {
    if (i >= files.length) return mount();
    var sc = document.createElement("script");
    sc.src = base + files[i];
    sc.onload = function () { loadSeq(i + 1); };
    sc.onerror = function () { console.error("BBD: failed to load", sc.src); };
    document.body.appendChild(sc);
  }
  function mount() {
    var host = document.getElementById("bbd-calcs");
    if (!host) return console.error("BBD: no #bbd-calcs mount point");
    ["calc-01", "calc-02", "calc-03", "calc-05", "calc-06", "calc-04"].forEach(function (id) {
      try { window.BBDWidgets[id](host); }
      catch (e) { console.error("BBD: widget", id, "failed", e); }
    });
  }
})();
