/* ============================================================
   BBD COMPLIANCE — compliance.js  (inviolable, spec §8)
   No widget renders without it. Injects the persistent chip and the
   adjacent disclosure block, and stamps the DRAFT watermark that
   stays until §9 sign-off. Educational / publisher frame; 506(b)
   posture — results are open, never gated behind email capture.
   ============================================================ */
(function (root, factory) {
  "use strict";
  root.BBDCompliance = factory(root);
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";

  // §9 sign-off flag. While false, every output carries a DRAFT watermark.
  var SIGNED_OFF = false;

  var DISCLOSURE = [
    "Assumptions are your inputs; results are arithmetic, not advice.",
    "Hypothetical and illustrative — not a projection, forecast, or expectation. Past performance is not indicative of future results.",
    "Not tax or legal advice; independent counsel required. Interest is assumed non-deductible (§264).",
    "PPLI requires non-MEC design, insurable interest, and §817(h) diversification. Surrender is not mortality — deferral reverses as ordinary income if surrendered.",
    "Financing terms, carrier pricing, and taxes vary per case. Investing involves risk, including loss of principal."
  ];

  /** The persistent chip — equal prominence to the hero figure (§8.1). */
  function chip() {
    var c = document.createElement("span");
    c.className = "bbd-chip";
    c.setAttribute("role", "note");
    c.textContent = "HYPOTHETICAL · ILLUSTRATIVE · NOT A PROJECTION";
    return c;
  }

  /** The disclosure block, rendered adjacent to (not below-the-fold from) the widget. */
  function disclosure() {
    var d = document.createElement("div");
    d.className = "bbd-disclosure";
    var ul = document.createElement("ul");
    DISCLOSURE.forEach(function (t) {
      var li = document.createElement("li"); li.textContent = t; ul.appendChild(li);
    });
    d.appendChild(ul);
    return d;
  }

  /**
   * Mount compliance furniture onto a widget root. Called by every
   * widget; a widget that forgets to call this simply has no chip,
   * which the §9 grep test ( ≥1 HYPOTHETICAL per widget ) will catch.
   */
  function mount(widgetEl, heroEl) {
    if (heroEl && heroEl.parentNode) heroEl.parentNode.insertBefore(chip(), heroEl.nextSibling);
    else widgetEl.insertBefore(chip(), widgetEl.firstChild);
    widgetEl.appendChild(disclosure());
    if (!SIGNED_OFF) widgetEl.classList.add("is-draft");
  }

  return { mount: mount, chip: chip, disclosure: disclosure, SIGNED_OFF: SIGNED_OFF, DISCLOSURE: DISCLOSURE };
});
