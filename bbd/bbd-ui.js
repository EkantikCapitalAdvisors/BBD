/* ============================================================
   BBD UI — bbd-ui.js
   Shared assumption store (the "one input drawer", spec §4) + small
   DOM helpers. Every widget reads the same live assumptions; move a
   slider and every widget, chart, and sentence recomputes (§0.1).

   No engine math lives here. This layer only:
     • holds the current assumptions and notifies subscribers,
     • builds a constants object the pure engine can consume,
     • provides labelled input controls and a count-up reveal helper.
   ============================================================ */
(function (root, factory) {
  "use strict";
  root.BBDUI = factory(root);
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";

  var C0 = root.BBD_CONSTANTS;
  var F = root.BBDFormat;

  // ---- live assumptions (defaults sourced from the constants) ----
  var state = {
    gross: C0.engine.gross_default,          // CALC-01/03
    horizon: C0.horizons.default,            // CALC-01/03
    tax: C0.tax.st_all_in,                   // CALC-01
    wrapperFee: C0.wrapper.fee_annual,       // all
    loanRate: C0.loan.rate,                  // CALC-03/05
    ltv: C0.loan.ltv_financed,               // CALC-03
    origination: C0.loan.origination,        // CALC-03
    mode: "schedule",                        // CALC-01 : lump | schedule
    waitCagr: 0.12,                          // CALC-02
    waitHorizon: C0.horizons.curve,          // CALC-02
    delayMo: C0.horizons.waiting_delay_months, // CALC-02
    mortality: C0.horizons.curve             // CALC-06 (20–40)
  };

  var subs = [];
  function subscribe(fn) { subs.push(fn); return fn; }
  function notify() { for (var i = 0; i < subs.length; i++) subs[i](state); }
  function set(key, val) { state[key] = val; notify(); }
  function get() { return state; }

  /** Build a constants object for the pure engine from live assumptions. */
  function constants() {
    return {
      _status: C0._status,
      tax: { st_all_in: state.tax },
      wrapper: { fee_annual: state.wrapperFee },
      loan: { rate: state.loanRate, ltv_financed: state.ltv, origination: state.origination },
      engine: C0.engine,
      premium: C0.premium,
      horizons: C0.horizons,
      guardrails: C0.guardrails
    };
  }

  // ---- DOM helpers ---------------------------------------------
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /**
   * A labelled range control bound to a state key.
   * opts: { key, label, min, max, step, fmt(v)->string, scale(1) } .
   * `scale` converts the raw slider integer to the stored value
   * (e.g. percent slider 14 -> 0.14). Defaults to identity.
   */
  function control(opts) {
    var scale = opts.scale || function (v) { return v; };
    var unscale = opts.unscale || function (v) { return v; };
    var wrap = el("label", "bbd-ctrl");
    var head = el("span", "bbd-ctrl__head");
    var name = el("span", "bbd-ctrl__label", opts.label);
    var val = el("span", "bbd-ctrl__val");
    head.appendChild(name); head.appendChild(val);
    var input = el("input", "bbd-ctrl__range");
    input.type = "range";
    input.min = opts.min; input.max = opts.max; input.step = opts.step || 1;
    input.value = unscale(state[opts.key]);
    var note = opts.note ? el("span", "bbd-ctrl__note", opts.note) : null;
    function render() { val.textContent = opts.fmt(state[opts.key]); }
    input.addEventListener("input", function () {
      set(opts.key, scale(parseFloat(input.value)));
    });
    subscribe(function () { if (parseFloat(input.value) !== unscale(state[opts.key])) input.value = unscale(state[opts.key]); render(); });
    render();
    wrap.appendChild(head); wrap.appendChild(input);
    if (note) wrap.appendChild(note);
    return wrap;
  }

  /** A two-state segmented toggle bound to a state key. */
  function toggle(opts) {
    var wrap = el("div", "bbd-toggle");
    opts.options.forEach(function (o) {
      var b = el("button", "bbd-toggle__btn", o.label);
      b.type = "button";
      function sync() { b.setAttribute("aria-pressed", String(state[opts.key] === o.value)); }
      b.addEventListener("click", function () { set(opts.key, o.value); });
      subscribe(sync); sync();
      wrap.appendChild(b);
    });
    return wrap;
  }

  var reduceMotion = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Count-up a number node on first reveal (400ms, spec §7.2). */
  function countUp(node, to, fmt) {
    if (reduceMotion) { node.textContent = fmt(to); return; }
    var from = 0, t0 = null, dur = 400;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      node.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /** Reveal-once observer: adds .is-in and runs cb the first time visible. */
  function onReveal(node, cb) {
    if (reduceMotion || !("IntersectionObserver" in root)) { node.classList.add("is-in"); cb && cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { node.classList.add("is-in"); cb && cb(); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    io.observe(node);
  }

  /** Standard widget shell: kicker · question · hero line · figure|panel grid. */
  function shell(o) {
    var root = el("section", "bbd-widget"); root.id = o.id || "";
    var wrap = el("div", "bbd-wrap");
    var kick = el("span", "bbd-kicker", '<span class="bbd-kicker__num">' + o.num + "</span> · " + o.kicker);
    var h2 = el("h2", "bbd-h2", o.title);
    var q = el("p", "bbd-question", o.question);
    var hero = el("p", "bbd-hero");
    var grid = el("div", "bbd-grid");
    var figure = el("div", "bbd-figure");
    var panel = el("div", "bbd-panel");
    grid.appendChild(figure); grid.appendChild(panel);
    [kick, h2, q, hero, grid].forEach(function (n) { wrap.appendChild(n); });
    root.appendChild(wrap);
    return { root: root, wrap: wrap, hero: hero, figure: figure, panel: panel };
  }

  /** Replace a figure's motif in place (used on every recompute). */
  function swap(host, node) { host.innerHTML = ""; if (node) host.appendChild(node); }

  return {
    subscribe: subscribe, notify: notify, set: set, get: get,
    constants: constants, el: el, control: control, toggle: toggle,
    countUp: countUp, onReveal: onReveal, reduceMotion: reduceMotion,
    shell: shell, swap: swap
  };
});
