/* CALC-06 · THE CURVE — net-to-heirs, interactive (spec §4, the leitmotif)
   Q: What is the shape of the whole thing?
   Hero: "Five premiums, one curve, no interruptions: ≈ {netHeirs} to heirs at
          year {M} — after the loan clears under §101(a)." */
(function (root) {
  "use strict";
  var UI = root.BBDUI, E = root.BBDEngine, F = root.BBDFormat, M = root.BBDMotifs, CO = root.BBDCompliance;
  (root.BBDWidgets = root.BBDWidgets || {})["calc-06"] = function (host) {
    var s = UI.shell({
      id: "calc-curve", num: "06", kicker: "The Curve · Net to heirs",
      title: 'Five premiums. One curve. <em>No interruptions.</em>',
      question: "What is the shape of the whole thing — end to end?"
    });

    s.panel.appendChild(UI.control({ key: "mortality", label: "Mortality year", min: 20, max: 40, step: 1, fmt: function (v) { return "year " + v; }, note: "Illustrative timing only." }));
    var out = UI.el("div", "bbd-readout"); s.panel.appendChild(out);

    var C0 = root.BBD_CONSTANTS, tp = C0.engine.two_phase;
    // growth of $1 invested at start of year `k`, compounded to end of year `Y`
    function grow(k, Y) {
      var v = 1;
      for (var y = k; y <= Y; y++) v *= (1 + (y <= tp.n1 ? tp.r1 : tp.r2));
      return v;
    }
    function policyValue(Y) {
      var prem = C0.premium.annual, v = 0;
      for (var k = 1; k <= C0.premium.years && k <= Y; k++) v += prem * grow(k, Y);
      return v;
    }

    function compute() {
      var st = UI.get(), Mo = st.mortality;
      var loan = E.loanBalance(C0.premium.years);            // 4.0M, cleared at mortality
      var netHeirs = policyValue(Mo) - loan;
      s.hero.innerHTML =
        'Five premiums, one curve, no interruptions: ≈ <span class="n">' + F.money(netHeirs) +
        '</span> to heirs at year <span class="n">' + Mo + '</span> — after the loan clears under §101(a).';
      out.innerHTML = "";
      addNum(out, F.money(policyValue(Mo)), "Policy value @ mortality", "gold");
      addNum(out, F.money(loan), "Loan cleared", "data");
      addNum(out, F.money(netHeirs), "Net to heirs", "gold");
      var series = [];
      for (var y = 1; y <= Mo; y++) series.push({ x: y, y: policyValue(y) });
      UI.swap(s.figure, M.curve(series, {
        w: 560, h: 280, phaseX: tp.n1, loanY: loan,
        dots: [{ x: 5 }, { x: 10 }, { x: Mo, accent: true }]
      }));
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
