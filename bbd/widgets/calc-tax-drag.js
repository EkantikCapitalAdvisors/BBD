/* CALC-01 · TAX-DRAG — "The Leak Meter" (spec §4)
   Q: What does annual realization cost the curve?
   Hero: "At {g}% gross, annual realization consumes {share}% of the wealth
          created over {H} years — {gap} per {basis}." */
(function (root) {
  "use strict";
  var UI = root.BBDUI, E = root.BBDEngine, F = root.BBDFormat, M = root.BBDMotifs, CO = root.BBDCompliance;
  (root.BBDWidgets = root.BBDWidgets || {})["calc-01"] = function (host) {
    var s = UI.shell({
      id: "calc-tax-drag", num: "01", kicker: "Tax Drag · The Leak Meter",
      title: 'Rate isn’t the damage. <em>Duration is.</em>',
      question: "What does taxing the curve every year actually cost over a lifetime?"
    });

    s.panel.appendChild(UI.toggle({ key: "mode", options: [
      { value: "lump", label: "$1 lump" }, { value: "schedule", label: "$1M × 5" }
    ] }));
    s.panel.appendChild(UI.control({ key: "gross", label: "Gross return (working assumption)", min: 2, max: 30, step: 1, scale: function (v) { return v / 100; }, unscale: function (v) { return Math.round(v * 100); }, fmt: function (v) { return F.pct(v); }, note: "Working assumption — replace with your own." }));
    s.panel.appendChild(UI.control({ key: "horizon", label: "Horizon (years)", min: 5, max: 30, step: 1, fmt: function (v) { return v + " yrs"; } }));
    s.panel.appendChild(UI.control({ key: "tax", label: "All-in realization rate", min: 20, max: 55, step: 1, scale: function (v) { return v / 100; }, unscale: function (v) { return Math.round(v * 100); }, fmt: function (v) { return F.pct(v); }, note: "37% top + 3.8% NIIT + your state." }));
    s.panel.appendChild(UI.control({ key: "wrapperFee", label: "Wrapper fee", min: 0.4, max: 2.5, step: 0.1, scale: function (v) { return v / 100; }, unscale: function (v) { return v * 100; }, fmt: function (v) { return F.pct(v); } }));

    var out = UI.el("div", "bbd-readout"); s.panel.appendChild(out);

    function compute() {
      var st = UI.get(), C = UI.constants();
      var d = E.dragShare(st.gross, st.horizon, st.mode, C);
      var basis = st.mode === "schedule" ? "$5M deployed" : "$1 deployed";
      var gapTxt = st.mode === "schedule" ? F.money(d.gap) : F.mult(d.gap);
      s.hero.innerHTML =
        'At <span class="n">' + F.pct(st.gross) + '</span> gross, annual realization consumes ' +
        '<span class="n n--loss">' + F.pct(d.share) + '</span> of the wealth created over ' +
        '<span class="n">' + st.horizon + '</span> years — <span class="n">' + gapTxt + '</span> per ' + basis + '.';
      out.innerHTML = "";
      addNum(out, st.mode === "schedule" ? F.money(d.A) : F.mult(d.A), "Taxable (A)");
      addNum(out, st.mode === "schedule" ? F.money(d.B) : F.mult(d.B), "Wrapper (B)", "gold");
      addNum(out, F.pct(d.share), "Growth consumed", "loss");
      // escalator: drag share vs horizon (the rising staircase)
      var pts = [];
      for (var H = 5; H <= 30; H += 5) pts.push({ x: H, y: E.dragShare(st.gross, H, st.mode, C).share });
      UI.swap(s.figure, M.escalator(pts, { w: 560, h: 240 }));
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
