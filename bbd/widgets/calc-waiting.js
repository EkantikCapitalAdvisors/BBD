/* CALC-02 · COST OF WAITING — "The Wedge" (spec §4)
   Q: What does a 24-month delay cost a 30-year plan?
   Hero: "{delayPct}% of the time removes {lostPct}% of the terminal estate —
          you lose the last years, not the first." */
(function (root) {
  "use strict";
  var UI = root.BBDUI, E = root.BBDEngine, F = root.BBDFormat, M = root.BBDMotifs, CO = root.BBDCompliance;
  (root.BBDWidgets = root.BBDWidgets || {})["calc-02"] = function (host) {
    var s = UI.shell({
      id: "calc-waiting", num: "02", kicker: "Cost of Waiting · The Wedge",
      title: 'You don’t lose the <em>first</em> years. You lose the last.',
      question: "What does a two-year delay remove from a thirty-year plan?"
    });

    s.panel.appendChild(UI.control({ key: "waitCagr", label: "Assumed CAGR", min: 4, max: 20, step: 1, scale: function (v) { return v / 100; }, unscale: function (v) { return Math.round(v * 100); }, fmt: function (v) { return F.pct(v); }, note: "Working assumption — replace with your own." }));
    s.panel.appendChild(UI.control({ key: "waitHorizon", label: "Horizon (years)", min: 10, max: 40, step: 1, fmt: function (v) { return v + " yrs"; } }));
    s.panel.appendChild(UI.control({ key: "delayMo", label: "Delay before starting", min: 6, max: 60, step: 6, fmt: function (v) { return v + " mo"; } }));

    var out = UI.el("div", "bbd-readout"); s.panel.appendChild(out);

    function compute() {
      var st = UI.get();
      var w = E.waitingCost(st.waitCagr, st.waitHorizon, st.delayMo);
      var delayYrs = Math.round(st.delayMo / 12);
      s.hero.innerHTML =
        '<span class="n">' + F.pct(w.delayPct) + '</span> of the time removes ' +
        '<span class="n n--loss">' + F.pct(w.lostPct) + '</span> of the terminal estate — ' +
        'you lose the last <span class="n">' + delayYrs + '</span> years, not the first <span class="n">' + delayYrs + '</span>.';
      out.innerHTML = "";
      addNum(out, F.mult(w.today), "On time");
      addNum(out, F.mult(w.delayed), "Delayed", "loss");
      addNum(out, F.money(w.lostPerUnit * 1e6), "Lost per $1M", "loss");
      // wedge motif: solid (on time) vs dashed (delayed), red terminal bracket
      var solid = [], delayed = [], delayY = st.delayMo / 12;
      for (var y = 0; y <= st.waitHorizon; y++) {
        solid.push({ x: y, y: E.fv(1, st.waitCagr, y) });
        delayed.push({ x: y, y: E.fv(1, st.waitCagr, Math.max(0, y - delayY)) });
      }
      UI.swap(s.figure, M.wedge(solid, delayed, { w: 560, h: 260 }));
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
