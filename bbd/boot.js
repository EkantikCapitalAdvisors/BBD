/* BBD suite boot loader (page wiring only — not part of the engine).
   Loads modules in dependency order after window.BBD_CONSTANTS is set,
   then mounts the public calculators in the spec §5 narrative order:
   Leak Meter → Wedge → Ladder → Breakeven → Curve. */
(function () {
  "use strict";
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
  var i = 0;
  function next() {
    if (i >= files.length) return mount();
    var sc = document.createElement("script");
    sc.src = files[i++];
    sc.onload = next;
    sc.onerror = function () { console.error("BBD: failed to load", sc.src); };
    document.body.appendChild(sc);
  }
  function mount() {
    var host = document.getElementById("bbd-calcs");
    ["calc-01", "calc-02", "calc-03", "calc-05", "calc-06", "calc-04"].forEach(function (id) {
      try { window.BBDWidgets[id](host); }
      catch (e) { console.error("BBD: widget", id, "failed", e); }
    });
  }
  next();
})();
