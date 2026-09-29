# Crosshatch Automata (live)

A woven crosshatch pattern generator: a 2D cellular automaton where each
grid cell has four possible line segments (horizontal, vertical, and both
diagonals), each turned on or off by an 8-bit rule function applied to its
neighbors — the same core idea as a 1D elementary cellular automaton
(Wolfram's rule 30, etc.), extended to 2D and split across four independent
rules. Cell color is split into four triangular quadrants and propagated
using the same rule logic, so the color weave and the line weave are
coupled. A live control panel exposes the full parameter space: layout,
symmetry/mirroring, the four rule numbers, initial seed state, and color
palette (via [chromotome](https://github.com/bruno-ol/chromotome)).

Press **P** to save the current canvas as a PNG, named after its four rule
numbers.

## Origin

This is an active continuation of
[crosshatch-automata](https://github.com/LookOut800/crosshatch-automata)
(2021), which is archived as-is. This repo started as a copy of that
project's code, then moved off its original toolchain (rollup build,
pinned p5.js 0.7.3, `dat.gui`) onto plain static files:

- No build step — everything runs as native ES modules directly in the
  browser (`<script type="module">`).
- `p5.js` loaded at a current version from cdnjs.
- [`lil-gui`](https://github.com/georgealways/lil-gui) in place of the
  unmaintained `dat.gui`.
- `chromotome` loaded from esm.sh rather than bundled.

## Running locally

No install, no build — just serve the directory:

```
python3 -m http.server
```
