/* CALC-04 · FULL BBD SIMULATOR (master — the slide-15 tool, spec §4)
   Q: Show me everything, including how it fails.
   Hero: "At your assumptions: {B} vs {A}. This plan stops borrowing the
          moment net engine yield − debt cost < {buffer} — here is that
          input, on screen, before you sign anything."
   Key beat: the simulator shows its own kill switch. */
(function (root) {
  "use strict";
  var UI = root.BBDUI, E = root.BBDEngine, F = root.BBDFormat, M = root.BBDMotifs, CO = root.BBDCompliance;
  var C0 = root.BBD_CONSTANTS;
  (root.BBDWidgets = root.BBDWidgets || {})["calc-04"] = function (host) {
    var root_ = UI.el("section", "bbd-widget"); root_.id = "calc-simulator";
    var wrap = UI.el("div", "bbd-wrap");
    wrap.appendChild(UI.el("span", "bbd-kicker", '<span class="bbd-kicker__num">04</span> · Full Simulator · The Kill Switch'));
    wrap.appendChild(UI.el("h2", "bbd-h2", 'Everything — <em>including how it fails.</em>'));
    wrap.appendChild(UI.el("p", "bbd-question", "The whole plan, year by year, with the guardrails that fire when the math turns against it."));
    var hero = UI.el("p", "bbd-hero"); wrap.appendChild(hero);

    var kill = UI.el("div", "bbd-kill"); wrap.appendChild(kill);

    var grid = UI.el("div", "bbd-grid");
    var figure = UI.el("div", "bbd-figure");
    var panel = UI.el("div", "bbd-panel");
    grid.appendChild(figure); grid.appendChild(panel);
    wrap.appendChild(grid);

    // --- controls (shared drawer + simulator-only stress row) ---
    panel.appendChild(UI.toggle({ key: "simTwoPhase", options: [
      { value: false, label: "Flat gross" }, { value: true, label: "Two-phase 15→10" }
    ] }));
    panel.appendChild(UI.control({ key: "gross", label: "Engine gross (if flat)", min: 2, max: 30, step: 1, scale: function (v) { return v / 100; }, unscale: function (v) { return Math.round(v * 100); }, fmt: function (v) { return F.pct(v); }, note: "Stress it: how low can the engine go?" }));
    panel.appendChild(UI.control({ key: "mortality", label: "Mortality year", min: 20, max: 40, step: 1, fmt: function (v) { return "year " + v; } }));
    panel.appendChild(UI.control({ key: "loanRate", label: "Loan rate (rises to…)", min: 4, max: 12, step: 0.25, scale: function (v) { return v / 100; }, unscale: function (v) { return v * 100; }, fmt: function (v) { return F.pct(v); } }));
    panel.appendChild(UI.control({ key: "ltv", label: "LTV financed", min: 0, max: 90, step: 5, scale: function (v) { return v / 100; }, unscale: function (v) { return Math.round(v * 100); }, fmt: function (v) { return F.pct(v); } }));
    panel.appendChild(UI.control({ key: "stressYear", label: "Stress drawdown — year", min: 0, max: 40, step: 1, fmt: function (v) { return v ? "year " + v : "off"; }, note: "0 = no shock." }));
    panel.appendChild(UI.control({ key: "stressPct", label: "Stress drawdown — size", min: -40, max: 0, step: 5, scale: function (v) { return v / 100; }, unscale: function (v) { return Math.round(v * 100); }, fmt: function (v) { return F.pct(v); } }));

    var readout = UI.el("div", "bbd-readout"); figure.appendChild(readout);
    var track = UI.el("div"); figure.appendChild(track);
    var tableWrap = UI.el("div", "bbd-simtable-wrap"); wrap.appendChild(tableWrap);

    function compute() {
      var st = UI.get(), C = UI.constants(), g = C0.guardrails;
      var opts = { twoPhase: st.simTwoPhase, stressYear: st.stressYear || 0, stressPct: st.stressPct };
      var sim = E.simulate(st.gross, st.mortality, opts, C);
      var last = sim.rows[st.mortality - 1];
      var k = sim.kill;

      hero.innerHTML =
        'At your assumptions: <span class="n">' + F.money(sim.B) + '</span> vs <span class="n">' + F.money(sim.A) + '</span>. ' +
        'This plan stops borrowing the moment net engine yield − debt cost < ' +
        '<span class="n">' + F.pct(k.buffer) + '</span> — here is that input, on screen, before you sign anything.';

      // kill-condition banner (shows its own kill switch)
      var fired = k.stopBorrow || k.ltvBreached;
      kill.className = "bbd-kill" + (fired ? " is-fired" : "");
      kill.innerHTML =
        '<div class="bbd-kill__title">' + (fired ? "◆ Guardrails fired" : "◆ Guardrails armed") + '</div>' +
        '<div class="bbd-kill__body">Stop-borrow triggers when net engine yield − debt cost &lt; <span class="n">' + F.pct(k.buffer) +
        '</span>. At your inputs the spread is <span class="n">' + F.pct(k.currentSpread) + '</span>' +
        ' — the threshold is engine gross ≤ <span class="n">' + F.pct(k.killGross) + '</span>. ' +
        'Freeze on drawdown ≤ <span class="n">' + F.pct(k.freezeDrawdown) + '</span>; hard LTV cap <span class="n">' + F.pct(k.ltvHard) + '</span>' +
        (k.ltvBreached ? ' — <strong>breached at year ' + firstBreach(sim.rows, k.ltvHard) + '</strong>' : '') + '.</div>';

      readout.innerHTML = "";
      addNum(readout, F.money(sim.B), "Net to heirs (B)", "gold");
      addNum(readout, F.money(sim.A), "Taxable equiv (A)");
      addNum(readout, F.pct(last.ltv), "Final LTV", last.ltv >= k.ltvHard ? "loss" : "data");

      UI.swap(track, M.guardrail({ ltv: last.ltv, target: g.ltv_target, hard: g.ltv_hard, w: 560 }));

      // year-by-year table
      var rows = sim.rows.map(function (r) {
        var over = r.ltv >= k.ltvHard;                 // LTV above the operating cap
        var fund = r.year <= C0.premium.years;
        var shock = st.stressYear > 0 && r.year === st.stressYear;
        return '<tr class="' + (fund ? "is-fund " : "") + (shock ? "is-shock" : "") + '">' +
          '<td>' + r.year + (fund ? " •" : "") + '</td>' +
          '<td>' + F.money(r.policyValue) + '</td>' +
          '<td>' + F.money(r.loan) + '</td>' +
          '<td class="' + (over ? "is-over" : "") + '">' + F.pct(r.ltv) + '</td>' +
          '<td>' + F.money(r.carry) + '</td>' +
          '<td>' + F.money(r.cumOop) + '</td>' +
          '<td>' + F.money(r.aEquiv) + '</td></tr>';
      }).join("");
      tableWrap.innerHTML =
        '<table class="bbd-simtable"><thead><tr>' +
        '<th>Year</th><th>Policy value</th><th>Loan</th><th>LTV</th><th>Carry</th><th>Cum. OOP</th><th>A-equiv</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>';
    }
    function firstBreach(rows, hard) { for (var i = 0; i < rows.length; i++) if (rows[i].ltv >= hard) return rows[i].year; return "—"; }

    UI.subscribe(compute); compute();
    root_.appendChild(wrap);
    CO.mount(root_, hero);
    host.appendChild(root_);
    UI.onReveal(root_);
  };
  function addNum(host, val, label, tone) {
    var b = UI.el("div");
    b.appendChild(UI.el("span", "bbd-readout__num" + (tone ? " tone-" + tone : ""), val));
    b.appendChild(UI.el("span", "bbd-readout__label", label));
    host.appendChild(b);
  }
})(typeof self !== "undefined" ? self : this);
