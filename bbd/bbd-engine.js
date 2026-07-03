/* ============================================================
   BBD ENGINE — bbd-engine.js
   Pure functions. Zero DOM. Zero fetch. Deterministic arithmetic only.
   Every figure on the page renders from these functions reading
   bbd-constants.json (the single source of truth). No stochastic
   modelling anywhere — this is a legal position, not a technical one.

   Interest is treated NON-deductible (§264-conservative).

   Usage:
     Node    → const E = require('./bbd-engine.js');  E.compareAllIn(0.14, 20)
     Browser → <script src="bbd-constants-loader.js"> sets window.BBD_CONSTANTS,
               then window.BBDEngine.compareAllIn(0.14, 20)
   Any function accepts an optional trailing constants object `C`; it
   defaults to the loaded constants so widgets never pass it explicitly.
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) {
    // Node: load the canonical constants file.
    module.exports = factory(require("./bbd-constants.json"));
  } else {
    // Browser: expect window.BBD_CONSTANTS to be present.
    root.BBDEngine = factory(root.BBD_CONSTANTS);
  }
})(typeof self !== "undefined" ? self : this, function (DEFAULTS) {
  "use strict";

  // ---- helpers -------------------------------------------------
  function _c(C) { return C || DEFAULTS; }

  /** Future value of a single present sum. fv = pv·(1+r)^n */
  function fv(pv, r, n) { return pv * Math.pow(1 + r, n); }

  /**
   * Future value of a cash-flow schedule to horizon H.
   * Cash flow cf[i] occurs at the START of year (i+1), so it compounds
   * for (H − i) years: Σ cf_i·(1+r)^(H−i).   (i is 0-based)
   */
  function fvSchedule(cfs, r, H) {
    var total = 0;
    for (var i = 0; i < cfs.length; i++) {
      total += cfs[i] * Math.pow(1 + r, H - i);
    }
    return total;
  }

  // ---- per-year growth after frictions -------------------------
  /** Net annual growth after annual realization (taxable account). */
  function netTaxable(g, C) { return g * (1 - _c(C).tax.st_all_in); }
  /** Net annual growth after the insurance-wrapper fee (no tax drag). */
  function netWrapper(g, C) { return g - _c(C).wrapper.fee_annual; }

  /** Two-phase deterministic compounding: pv·(1+r1)^n1·(1+r2)^n2. */
  function twoPhase(pv, C) {
    var tp = _c(C).engine.two_phase;
    return pv * Math.pow(1 + tp.r1, tp.n1) * Math.pow(1 + tp.r2, tp.n2);
  }

  /** Two-phase geometric blended CAGR over the full (n1+n2) horizon. */
  function twoPhaseBlend(C) {
    var tp = _c(C).engine.two_phase;
    return Math.pow(
      Math.pow(1 + tp.r1, tp.n1) * Math.pow(1 + tp.r2, tp.n2),
      1 / (tp.n1 + tp.n2)
    ) - 1;
  }

  // ---- financing ----------------------------------------------
  /** Outstanding loan balance after year k (interest-only, grows yrs 1..years). */
  function loanBalance(k, C) {
    var c = _c(C);
    return c.loan.ltv_financed * c.premium.annual * Math.min(k, c.premium.years);
  }

  /** The premium schedule: `years` payments of `annual`, at start of each year. */
  function premiumVector(C) {
    var c = _c(C), v = [];
    for (var k = 1; k <= c.premium.years; k++) v.push(c.premium.annual);
    return v;
  }

  /**
   * Out-of-pocket vector across horizon H (what the client actually funds).
   *   yr 1..years : (1−ltv)·prem  +  ltv·prem·orig  +  loanBalance(k)·rate
   *   yr years+1..H:                                   loanBalance(years)·rate
   * loanBalance() already caps at `years`, so interest = loanBalance(k)·rate
   * for every year.
   */
  function oopVector(H, C) {
    var c = _c(C), v = [];
    var equity = (1 - c.loan.ltv_financed) * c.premium.annual;
    var orig = c.loan.ltv_financed * c.premium.annual * c.loan.origination;
    for (var k = 1; k <= H; k++) {
      var interest = loanBalance(k, C) * c.loan.rate;
      var upfront = k <= c.premium.years ? equity + orig : 0;
      v.push(upfront + interest);
    }
    return v;
  }

  function sum(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; }

  // ---- CALC-03 · leverage ladder (equalized out-of-pocket) -----
  /**
   * Three rungs on identical out-of-pocket dollars:
   *   A     = taxable account
   *   rung2 = wrapper, unlevered   (structure premium = rung2 − A)
   *   B     = wrapper, financed, loan netted at year `years` (leverage premium = B − rung2)
   */
  function compareAllIn(g, H, C) {
    var c = _c(C);
    var oop = oopVector(H, C);
    var A = fvSchedule(oop, netTaxable(g, C), H);
    var rung2 = fvSchedule(oop, netWrapper(g, C), H);
    var B = fvSchedule(premiumVector(C), netWrapper(g, C), H) - loanBalance(c.premium.years, C);
    return {
      A: A, rung2: rung2, B: B,
      structurePremium: rung2 - A,
      leveragePremium: B - rung2,
      interestPaid: sum(oop) - c.premium.years * ((1 - c.loan.ltv_financed) * c.premium.annual + c.loan.ltv_financed * c.premium.annual * c.loan.origination),
      oopTotal: sum(oop),
      multiple: B / A
    };
  }

  // ---- CALC-01 · tax drag --------------------------------------
  /**
   * Drag share of created wealth: (B − A) / (B − principal).
   * mode "lump"     → single $1 unit deployed at year 1 (principal = 1)
   * mode "schedule" → the premium schedule (principal = Σ premiums)
   */
  function dragShare(g, H, mode, C) {
    var A, B, principal;
    if (mode === "schedule") {
      var prem = premiumVector(C);
      A = fvSchedule(prem, netTaxable(g, C), H);
      B = fvSchedule(prem, netWrapper(g, C), H);
      principal = sum(prem);
    } else {
      A = fv(1, netTaxable(g, C), H);
      B = fv(1, netWrapper(g, C), H);
      principal = 1;
    }
    return {
      A: A, B: B, principal: principal,
      gap: B - A,
      multiple: B / A,
      share: (B - A) / (B - principal)
    };
  }

  // ---- CALC-02 · cost of waiting -------------------------------
  function waitingCost(cagr, H, delayMo) {
    var today = fv(1, cagr, H);
    var delayed = fv(1, cagr, H - delayMo / 12);
    return {
      today: today,
      delayed: delayed,
      lostPerUnit: today - delayed,       // lost multiple per $1 (×$1M for per-$1M)
      lostPct: 1 - delayed / today,
      delayPct: (delayMo / 12) / H
    };
  }

  // ---- CALC-05 · breakeven dials -------------------------------
  /** Wrapper pays for itself above this gross return: fee / tax. */
  function breakevenWrapper(C) { var c = _c(C); return c.wrapper.fee_annual / c.tax.st_all_in; }
  /** Financing adds above this gross return: loan rate + wrapper fee. */
  function breakevenLeverage(C) { var c = _c(C); return c.loan.rate + c.wrapper.fee_annual; }

  // ---- CALC-04 & CALC-06 · full path (shared source of truth) --
  /** Engine's GROSS return for year y: flat gross, or the two-phase schedule. */
  function engineRate(y, gross, twoPhase, tp) {
    return twoPhase ? (y <= tp.n1 ? tp.r1 : tp.r2) : gross;
  }

  /**
   * Year-by-year deterministic simulation to horizon H (= mortality year).
   * Policy value grows at engine return NET of the wrapper fee; premiums
   * enter at the start of each funding year. Interest-only financing on the
   * financed portion. opts:
   *   { twoPhase:bool, stressYear:int, stressPct:number }   // stressPct e.g. -0.20
   * Returns per-year rows plus net-to-heirs (loan cleared, §101(a)), the
   * taxable A-equivalent, and the kill condition (spec §4 CALC-04).
   *
   * Identity that ties this to the golden vectors: a flat-gross run with no
   * stress reproduces compareAllIn — rows[H-1].aEquiv === A, netHeirs === B.
   */
  function simulate(gross, H, opts, C) {
    opts = opts || {};
    var c = _c(C), tp = c.engine.two_phase;
    var prem = c.premium.annual, yrs = c.premium.years;
    var fee = c.wrapper.fee_annual, rate = c.loan.rate;
    var oop = oopVector(H, C);
    var rows = [], pv = 0, cumOop = 0;
    for (var k = 1; k <= H; k++) {
      var base = engineRate(k, gross, opts.twoPhase, tp);
      var net = base - fee;
      var premThis = k <= yrs ? prem : 0;
      var shock = opts.stressYear === k ? (opts.stressPct || 0) : 0; // value drawdown
      pv = (pv + premThis) * (1 + net) * (1 + shock);
      var loan = loanBalance(k, C);
      cumOop += oop[k - 1];
      rows.push({
        year: k,
        policyValue: pv,
        loan: loan,
        ltv: pv > 0 ? loan / pv : 0,
        carry: loan * rate,
        cumOop: cumOop,
        aEquiv: fvSchedule(oop.slice(0, k), netTaxable(gross, C), k),
        spread: net - rate
      });
    }
    var last = rows[H - 1];
    var buffer = c.guardrails.stop_borrow_buffer;
    var yield_ = (opts.twoPhase ? tp.r2 : gross) - fee; // ongoing (conservative) net engine yield
    return {
      rows: rows,
      netHeirs: last.policyValue - last.loan,   // §101(a): loan cleared at mortality
      A: last.aEquiv,
      B: last.policyValue - last.loan,
      kill: {
        buffer: buffer,
        killGross: buffer + rate + fee,          // gross at which spread hits the cushion
        currentSpread: yield_ - rate,
        stopBorrow: (yield_ - rate) < buffer,    // spread < cushion → stop borrowing
        freezeDrawdown: c.guardrails.freeze_drawdown,
        ltvHard: c.guardrails.ltv_hard,
        ltvBreached: last.ltv >= c.guardrails.ltv_hard
      }
    };
  }

  return {
    _constants: DEFAULTS,
    fv: fv,
    fvSchedule: fvSchedule,
    netTaxable: netTaxable,
    netWrapper: netWrapper,
    twoPhase: twoPhase,
    twoPhaseBlend: twoPhaseBlend,
    loanBalance: loanBalance,
    premiumVector: premiumVector,
    oopVector: oopVector,
    compareAllIn: compareAllIn,
    dragShare: dragShare,
    waitingCost: waitingCost,
    breakevenWrapper: breakevenWrapper,
    breakevenLeverage: breakevenLeverage,
    engineRate: engineRate,
    simulate: simulate
  };
});
