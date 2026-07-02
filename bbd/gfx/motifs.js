/* ============================================================
   BBD MOTIFS — gfx/motifs.js
   Hand-generated SVG in brand tokens. One visual grammar across
   deck ↔ page ↔ calculators (spec §7.1). No chart libraries.
   The dashed line ALWAYS means "the curve you lose"; red appears
   only for breaks, hard caps, and gaps — never decoration (§7.1).

   Every generator returns an <svg> element. Colours come from CSS
   custom properties so the motif re-themes with the page.
   ============================================================ */
(function (root, factory) {
  "use strict";
  root.BBDMotifs = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";

  function svg(w, h) {
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 " + w + " " + h);
    s.setAttribute("class", "bbd-motif");
    s.setAttribute("preserveAspectRatio", "xMidYMid meet");
    s.setAttribute("role", "img");
    return s;
  }
  function node(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }
  function linScale(d0, d1, r0, r1) {
    return function (v) { return r0 + (r1 - r0) * ((v - d0) / (d1 - d0 || 1)); };
  }
  function pathD(pts) {
    return pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
  }
  function draw(el) { // mark a stroke path for scroll draw-on (CSS handles timing)
    el.classList.add("bbd-draw");
    return el;
  }

  // ---- CALC-06 · the signature compound curve -----------------
  // series: [{x, y}] ; opts: { phaseX, dots:[{x,label,accent}], loanY, w,h }
  function curve(series, opts) {
    opts = opts || {}; var w = opts.w || 640, h = opts.h || 300, pad = 34;
    var xs = series.map(function (p) { return p.x; }), ys = series.map(function (p) { return p.y; });
    var sx = linScale(Math.min.apply(0, xs), Math.max.apply(0, xs), pad, w - pad);
    var sy = linScale(0, Math.max.apply(0, ys), h - pad, pad);
    var s = svg(w, h);
    // baseline axis
    s.appendChild(node("line", { x1: pad, y1: h - pad, x2: w - pad, y2: h - pad, class: "bbd-axis" }));
    // phase divider (yr 10) — where two-phase steps down
    if (opts.phaseX != null) {
      s.appendChild(node("line", { x1: sx(opts.phaseX), y1: pad, x2: sx(opts.phaseX), y2: h - pad, class: "bbd-divider" }));
    }
    // loan line clearing at mortality
    if (opts.loanY != null) {
      s.appendChild(node("line", { x1: pad, y1: sy(opts.loanY), x2: w - pad, y2: sy(opts.loanY), class: "bbd-loan" }));
    }
    var pts = series.map(function (p) { return [sx(p.x), sy(p.y)]; });
    s.appendChild(draw(node("path", { d: pathD(pts), class: "bbd-curve" })));
    (opts.dots || []).forEach(function (d) {
      var p = series.reduce(function (a, b) { return Math.abs(b.x - d.x) < Math.abs(a.x - d.x) ? b : a; });
      s.appendChild(node("circle", { cx: sx(p.x), cy: sy(p.y), r: 5, class: "bbd-dot" + (d.accent ? " is-accent" : "") }));
    });
    return s;
  }

  // ---- CALC-02 · the wedge (cost of waiting) ------------------
  // solid = on time, dashed = delayed; red bracket = lost terminal band
  function wedge(solid, delayed, opts) {
    opts = opts || {}; var w = opts.w || 640, h = opts.h || 300, pad = 34;
    var maxY = Math.max(solid[solid.length - 1].y, delayed[delayed.length - 1].y);
    var maxX = solid[solid.length - 1].x;
    var sx = linScale(0, maxX, pad, w - pad);
    var sy = linScale(0, maxY, h - pad, pad);
    var s = svg(w, h);
    s.appendChild(node("line", { x1: pad, y1: h - pad, x2: w - pad, y2: h - pad, class: "bbd-axis" }));
    s.appendChild(draw(node("path", { d: pathD(delayed.map(function (p) { return [sx(p.x), sy(p.y)]; })), class: "bbd-curve is-lost" })));
    s.appendChild(draw(node("path", { d: pathD(solid.map(function (p) { return [sx(p.x), sy(p.y)]; })), class: "bbd-curve" })));
    // terminal loss bracket (red = the gap)
    var xE = sx(maxX);
    s.appendChild(node("line", { x1: xE, y1: sy(delayed[delayed.length - 1].y), x2: xE, y2: sy(solid[solid.length - 1].y), class: "bbd-bracket" }));
    return s;
  }

  // ---- CALC-01 · leak sparkline + escalator -------------------
  function escalator(points, opts) { // points:[{x:horizon,y:share}]
    opts = opts || {}; var w = opts.w || 320, h = opts.h || 120, pad = 22;
    var xs = points.map(function (p) { return p.x; });
    var sx = linScale(Math.min.apply(0, xs), Math.max.apply(0, xs), pad, w - pad);
    var sy = linScale(0, 1, h - pad, pad);
    var s = svg(w, h);
    s.appendChild(node("line", { x1: pad, y1: h - pad, x2: w - pad, y2: h - pad, class: "bbd-axis" }));
    s.appendChild(draw(node("path", { d: pathD(points.map(function (p) { return [sx(p.x), sy(p.y)]; })), class: "bbd-curve is-lost" })));
    var last = points[points.length - 1];
    s.appendChild(node("circle", { cx: sx(last.x), cy: sy(last.y), r: 4, class: "bbd-dot is-accent" }));
    return s;
  }

  // ---- CALC-03 · three-rung ladder ----------------------------
  // rungs:[{label,value,tone}] ; deltas rendered by the widget as text
  function ladder(rungs, opts) {
    opts = opts || {}; var w = opts.w || 640, h = opts.h || 260, pad = 8;
    var maxV = Math.max.apply(0, rungs.map(function (r) { return r.value; }));
    var barH = 46, gap = (h - rungs.length * barH) / (rungs.length + 1);
    var sw = linScale(0, maxV, 0, w - pad * 2);
    var s = svg(w, h);
    rungs.forEach(function (r, i) {
      var y = gap + i * (barH + gap);
      s.appendChild(node("rect", { x: pad, y: y, width: 1, height: barH, rx: 3, class: "bbd-bar-track" }));
      var bar = node("rect", { x: pad, y: y, width: Math.max(2, sw(r.value)), height: barH, rx: 3, class: "bbd-bar" + (r.tone ? " tone-" + r.tone : "") });
      bar.classList.add("bbd-grow");
      s.appendChild(bar);
    });
    return s;
  }

  // ---- CALC-05 · breakeven dial -------------------------------
  // gauge from gMin..gMax; needle at user gross; marker at breakeven
  function dial(opts) {
    var w = 240, h = 150, cx = w / 2, cy = h - 16, r = 96;
    var gMin = opts.min, gMax = opts.max;
    var a = linScale(gMin, gMax, Math.PI, 0); // left→right over a half circle
    function pt(val, rad) { var t = a(val); return [cx + rad * Math.cos(t), cy - rad * Math.sin(t)]; }
    var s = svg(w, h);
    // track
    s.appendChild(node("path", { d: arc(cx, cy, r, Math.PI, 0), class: "bbd-gauge-track" }));
    // "wins" zone from breakeven→max
    s.appendChild(node("path", { d: arc(cx, cy, r, a(Math.min(opts.breakeven, gMax)), 0), class: "bbd-gauge-live" }));
    // breakeven tick
    var b0 = pt(opts.breakeven, r - 12), b1 = pt(opts.breakeven, r + 4);
    s.appendChild(node("line", { x1: b0[0], y1: b0[1], x2: b1[0], y2: b1[1], class: "bbd-gauge-mark" }));
    // needle at user's gross (clamped)
    var g = Math.max(gMin, Math.min(gMax, opts.value));
    var n1 = pt(g, r - 6);
    s.appendChild(node("line", { x1: cx, y1: cy, x2: n1[0], y2: n1[1], class: "bbd-needle" }));
    s.appendChild(node("circle", { cx: cx, cy: cy, r: 5, class: "bbd-needle-hub" }));
    return s;
  }
  function arc(cx, cy, r, a0, a1) {
    var x0 = cx + r * Math.cos(a0), y0 = cy - r * Math.sin(a0);
    var x1 = cx + r * Math.cos(a1), y1 = cy - r * Math.sin(a1);
    var large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
    return "M" + x0.toFixed(1) + " " + y0.toFixed(1) + " A" + r + " " + r + " 0 " + large + " 1 " + x1.toFixed(1) + " " + y1.toFixed(1);
  }

  return { curve: curve, wedge: wedge, escalator: escalator, ladder: ladder, dial: dial };
});
