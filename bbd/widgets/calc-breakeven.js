/* CALC-05 · BREAKEVEN DIALS — "Where the structure pays for itself" (spec §4)
   Q: How wrong can the return assumption be?
   Hero: "The wrapper wins above {be1}% gross. Financing adds above {be2}%.
          Your assumption of {g}% sits {×} past breakeven." */
(function (root) {
  "use strict";
  var UI = root.BBDUI, E = root.BBDEngine, F = root.BBDFormat, M = root.BBDMotifs, CO = root.BBDCompliance;
  (root.BBDWidgets = root.BBDWidgets || {})["calc-05"] = function (host) {
    var s = UI.shell({
      id: "calc-breakeven", num: "05", kicker: "Breakeven Dials · Where it pays for itself",
      title: 'The real question isn’t 14%. <em>It’s 2.45%.</em>',
      question: "How wrong can the return assumption be before the structure stops earning its keep?"
    });

    s.panel.appendChild(UI.control({ key: "gross", label: "Your gross assumption", min: 2, max: 30, step: 1, scale: function (v) { return v / 100; }, unscale: function (v) { return Math.round(v * 100); }, fmt: function (v) { return F.pct(v); }, note: "Working assumption — replace with your own." }));
    s.panel.appendChild(UI.control({ key: "loanRate", label: "Loan rate", min: 4, max: 12, step: 0.25, scale: function (v) { return v / 100; }, unscale: function (v) { return v * 100; }, fmt: function (v) { return F.pct(v); } }));
    s.panel.appendChild(UI.control({ key: "wrapperFee", label: "Wrapper fee", min: 0.4, max: 2.5, step: 0.1, scale: function (v) { return v / 100; }, unscale: function (v) { return v * 100; }, fmt: function (v) { return F.pct(v); } }));
    s.panel.appendChild(UI.control({ key: "tax", label: "All-in realization rate", min: 20, max: 55, step: 1, scale: function (v) { return v / 100; }, unscale: function (v) { return Math.round(v * 100); }, fmt: function (v) { return F.pct(v); } }));

    var dials = UI.el("div", "bbd-dials"); s.figure.appendChild(dials);

    function compute() {
      var st = UI.get(), C = UI.constants();
      var be1 = E.breakevenWrapper(C), be2 = E.breakevenLeverage(C);
      var past = st.gross / be2;
      s.hero.innerHTML =
        'The wrapper wins above <span class="n">' + F.pct(be1) + '</span> gross. ' +
        'Financing adds above <span class="n">' + F.pct(be2) + '</span>. ' +
        'Your assumption of <span class="n">' + F.pct(st.gross) + '</span> sits ' +
        '<span class="n">' + F.mult(past) + '</span> past the financing breakeven.';
      dials.innerHTML = "";
      dials.appendChild(dialBlock("Wrapper breakeven", be1, st.gross, 0, 0.10));
      dials.appendChild(dialBlock("Leverage breakeven", be2, st.gross, 0, 0.30));
    }
    function dialBlock(label, be, g, min, max) {
      var wrap = UI.el("div", "bbd-dial");
      wrap.appendChild(M.dial({ min: min, max: max, breakeven: be, value: g }));
      wrap.appendChild(UI.el("span", "bbd-readout__num tone-gold", F.pct(be)));
      wrap.appendChild(UI.el("span", "bbd-readout__label", label));
      return wrap;
    }
    UI.subscribe(compute); compute();
    CO.mount(s.root, s.hero);
    host.appendChild(s.root);
    UI.onReveal(s.root);
  };
})(typeof self !== "undefined" ? self : this);
