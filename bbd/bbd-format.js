/* ============================================================
   BBD FORMAT — bbd-format.js
   Display discipline (build spec §0.5): max 3 significant figures.
   False precision is a compliance + credibility defect, so every
   engine-emitted number passes through here before it hits the DOM.
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.BBDFormat = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /** Round to 3 significant figures. */
  function sig3(x) {
    if (!isFinite(x) || x === 0) return 0;
    var d = Math.ceil(Math.log10(Math.abs(x)));
    var f = Math.pow(10, 3 - d);
    return Math.round(x * f) / f;
  }

  /** Money at ≤3 sig figs: $41.8M, $508K, $6.44M. */
  function money(x) {
    var s = x < 0 ? "-" : "";
    var a = Math.abs(x);
    if (a >= 1e6) return s + "$" + trim(sig3(a / 1e6)) + "M";
    if (a >= 1e3) return s + "$" + trim(sig3(a / 1e3)) + "K";
    return s + "$" + trim(sig3(a));
  }

  /** A multiple: 3.69×, 2.46×. */
  function mult(x) { return trim(sig3(x)) + "×"; }

  /** A percentage from a fraction at 3 sig figs (§0.5): pct(0.02451) -> "2.45%". */
  function pct(x, dp) {
    var v = x * 100;
    return (dp === undefined ? trim(sig3(v)) : v.toFixed(dp)) + "%";
  }

  /** A percentage already in percent units: pctRaw(7.5) -> "7.5%". */
  function pctRaw(v, dp) { return (dp === undefined ? trim(sig3(v)) : v.toFixed(dp)) + "%"; }

  /** Trim trailing zeros from a sig-3 number for clean display. */
  function trim(x) {
    var s = String(x);
    if (s.indexOf(".") === -1) return s;
    return s.replace(/\.?0+$/, "");
  }

  return { sig3: sig3, money: money, mult: mult, pct: pct, pctRaw: pctRaw, trim: trim };
});
