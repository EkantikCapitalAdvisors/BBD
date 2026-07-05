/* CALC-03 · THE LEVERAGE LADDER — "Three Rungs" (spec §4)
   Q: Same dollars out of pocket — what does each layer of structure add?
   Hero: "Identical {oop} out of pocket: {A} taxable → {rung2} structured →
          {B} structured + financed. The structure adds {Δ1}; the leverage
          adds {Δ2} more — after {interest} of interest." */
(function (root) {
  "use strict";
  var UI = root.BBDUI, E = root.BBDEngine, F = root.BBDFormat, M = root.BBDMotifs, CO = root.BBDCompliance;
  (root.BBDWidgets = root.BBDWidgets || {})["calc-03"] = function (host) {
    var s = UI.shell({
      id: "calc-ladder", num: "03", kicker: "Leverage Ladder · Three Rungs",
      title: 'Two decisions, <em>separated.</em>',
      question: "On identical out-of-pocket dollars, what does each layer of structure earn?"
    });

    s.panel.appendChild(UI.control({ key: "gross", label: "Gross return", min: 2, max: 30, step: 1, scale: function (v) { return v / 100; }, unscale: function (v) { return Math.round(v * 100); }, fmt: function (v) { return F.pct(v); }, note: "Working assumption — replace with your own." }));
    s.panel.appendChild(UI.control({ key: "horizon", label: "Horizon (years)", min: 5, max: 30, step: 1, fmt: function (v) { return v + " yrs"; } }));
    s.panel.appendChild(UI.control({ key: "loanRate", label: "Loan rate", min: 4, max: 12, step: 0.25, scale: function (v) { return v / 100; }, unscale: function (v) { return v * 100; }, fmt: function (v) { return F.pct(v); } }));
    s.panel.appendChild(UI.control({ key: "ltv", label: "LTV financed", min: 0, max: 90, step: 5, scale: function (v) { return v / 100; }, unscale: function (v) { return Math.round(v * 100); }, fmt: function (v) { return F.pct(v); } }));

    var out = UI.el("div", "bbd-readout"); s.panel.appendChild(out);

    function compute() {
      var st = UI.get(), C = UI.constants();
      var r = E.compareAllIn(st.gross, st.horizon, C);
      s.hero.innerHTML =
        'Identical <span class="n">' + F.money(r.oopTotal) + '</span> out of pocket: ' +
        '<span class="n">' + F.money(r.A) + '</span> taxable → ' +
        '<span class="n">' + F.money(r.rung2) + '</span> structured → ' +
        '<span class="n">' + F.money(r.B) + '</span> structured + financed. ' +
        'The structure adds <span class="n">' + F.money(r.structurePremium) + '</span>; ' +
        'the leverage adds <span class="n">' + F.money(r.leveragePremium) + '</span> more — after ' +
        '<span class="n">' + F.money(r.interestPaid) + '</span> of interest.';
      out.innerHTML = "";
      addNum(out, F.money(r.structurePremium), "Structure premium (Δ1)", "gold");
      addNum(out, F.money(r.leveragePremium), "Leverage premium (Δ2)", "gold");
      addNum(out, F.mult(r.multiple), "B ÷ A");
      UI.swap(s.figure, M.ladder([
        { label: "Taxable (A)", value: r.A, valueText: F.money(r.A) },
        { label: "Structured (B unlevered)", value: r.rung2, tone: "structure", valueText: F.money(r.rung2) },
        { label: "Structured + financed (B)", value: r.B, tone: "leverage", valueText: F.money(r.B) }
      ], { w: 560, h: 240 }));
    }
    UI.subscribe(compute); compute();
    CO.mount(s.root, s.hero);
    host.appendChild(s.root);
    UI.onReveal(s.root);
  };
  function addNum(host, val, label, tone) {
    var b = UI.el("div");
    b.appendChild(UI.el("span", "bbd-readout__num" + (tone ? " tone-" + tone : ""), val));
    b.appendChild(UI.el("span", "bbd-readout__label", label));
    host.appendChild(b);
  }
})(typeof self !== "undefined" ? self : this);
