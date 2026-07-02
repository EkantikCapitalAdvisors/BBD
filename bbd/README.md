# BBD Calculator Suite

Falsifiability instruments (not sales tools) for `bbd.ekantikcapital.com`, built to
the *BBD Calculator Suite + Landing Visual System — Build Spec*. Assumption-in →
arithmetic-out: the prospect supplies the assumptions, the engine supplies the math.

**Status: DRAFT.** All constants are placeholders pending §9 sign-off and
securities/insurance-counsel review. Every output is DRAFT-watermarked.

## One source of truth

```
bbd-constants.json → bbd-engine.js → {format, motifs, compliance} → widgets
```

Zero hardcoded dollar figures or percentages in markup — change a constant and every
widget, chart, and sentence updates. The engine is pure (zero DOM, zero fetch,
deterministic arithmetic only; interest treated non-deductible per §264).

## Verify

```bash
node bbd/bbd-engine.test.js     # 10 golden vectors (§6) — 45/45 assertions green
```

Deploy blocks on any vector failure (§6/§9).

## Preview

Serve over HTTP (the widgets read `bbd-constants.json` via fetch, which browsers
block on `file://`):

```bash
cd bbd && python3 -m http.server 8137     # → http://localhost:8137/calculators.html
```

## Built in this pass (5 public calculators, per §10)

| ID | Widget | Motif |
|----|--------|-------|
| CALC-01 | Tax-Drag · "The Leak Meter" | escalator |
| CALC-02 | Cost of Waiting · "The Wedge" | diverging curves + red loss bracket |
| CALC-03 | Leverage Ladder · "Three Rungs" | bar ladder |
| CALC-05 | Breakeven Dials | two gauges |
| CALC-06 | The Curve · net-to-heirs | signature compound curve |

Visual system: the **accelerator.ekantikcapital.com** foundation (navy-950 canvas,
disciplined gold, Playfair Display / DM Sans / DM Mono). Numbers render in DM Mono —
"mono = computed, never asserted."

## Deferred / open

- **CALC-04** (full simulator + kill-switch banner) — walked live on the readiness
  call per §10; not built here.
- **Wiring into `index.html`** — the suite is a standalone page (`calculators.html`)
  pending review; not yet embedded in the landing page.
- Additional §7.1 page motifs that belong to non-calculator sections (guardrail
  track, spread bars, Buy▸Borrow▸Die chevrons, engines→chassis strip).
- §9 sign-off items in the build spec §10 (canonical figures, counsel language,
  carrier-quote fee).
- Chip count is 5 (one per public widget); the §9 "≥6" target assumes CALC-04 present.
