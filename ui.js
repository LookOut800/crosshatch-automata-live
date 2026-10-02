import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/dist/lil-gui.esm.min.js';
import * as tome from 'https://esm.sh/chromotome@1.19.0';
import custom_palettes from './custom-palettes.js';

// Sets a native browser tooltip (shown on hover) on a controller, for the
// less self-explanatory controls. Returns the controller so it can be
// chained the same way .name()/.onChange() are.
const tip = (controller, text) => {
  controller.domElement.title = text;
  return controller;
};

export default function (options, run, randomize_rules, export_png, export_svg) {
  let ctrls = {
    randomize: randomize_and_run,
    export_png,
    export_svg,
  };

  const gui = new GUI({ width: 400 });

  let layout_folder = gui.addFolder('Layout');
  layout_folder.add(options, 'grid_size_x', 4, 50, 2).name('Pattern width (cells)').onChange(run);
  layout_folder.add(options, 'grid_size_y', 4, 50, 2).name('Pattern height (cells)').onChange(run);
  tip(
    layout_folder.add(options, 'grid_init_x', 0, 20, 1).name('Pan x (cells)').onChange(run),
    'Shifts which part of the generated pattern is shown, without changing the rules — like panning a camera across it.'
  );
  tip(
    layout_folder.add(options, 'grid_init_y', 0, 20, 1).name('Pan y (cells)').onChange(run),
    'Shifts which part of the generated pattern is shown, without changing the rules — like panning a camera across it.'
  );
  tip(
    layout_folder.add(options, 'repeats_x', 1, 10, 1).name('Tile columns').onChange(run),
    'How many times the pattern repeats side-by-side.'
  );
  tip(
    layout_folder.add(options, 'repeats_y', 1, 10, 1).name('Tile rows').onChange(run),
    'How many times the pattern repeats top-to-bottom.'
  );
  layout_folder.add(options, 'segment_padding', 0, 10, 2).name('Gap between tiles (px)').onChange(run);
  layout_folder.open();

  let symm_folder = gui.addFolder('Symmetry');
  tip(
    symm_folder.add(options, 'horizontal_reflection').name('Mirror alternating columns').onChange(run),
    'Every other column of tiles is flipped left-right, so the pattern reads as a continuous weave instead of visibly repeating.'
  );
  tip(
    symm_folder.add(options, 'vertical_reflection').name('Mirror alternating rows').onChange(run),
    'Every other row of tiles is flipped top-to-bottom.'
  );
  tip(
    symm_folder.add(options, 'initial_horizontal_reflection').name('Start columns flipped').onChange(run),
    'Flips which columns count as "alternating" — swaps which tiles are mirrored.'
  );
  tip(
    symm_folder.add(options, 'initial_vertical_reflection').name('Start rows flipped').onChange(run),
    'Flips which rows count as "alternating" — swaps which tiles are mirrored.'
  );
  symm_folder.open();

  let rules_folder = gui.addFolder('Pattern Rules');
  tip(
    rules_folder.add(options, 'top_down').name('Generate row-by-row').onChange(run),
    'Alternate generation mode: builds the pattern one row at a time from a seed at the top, instead of spreading out from a corner.'
  );
  const rule_tip =
    'A number from 0–255 that acts as this line type\'s "DNA" — it deterministically decides, cell by cell, whether that line is drawn based on its neighbors. Small changes can produce very different patterns.';
  tip(rules_folder.add(options, 'rule_h').name('Horizontal line rule').onChange(run), rule_tip);
  tip(rules_folder.add(options, 'rule_v').name('Vertical line rule').onChange(run), rule_tip);
  tip(rules_folder.add(options, 'rule_d').name('Diagonal ↘ line rule').onChange(run), rule_tip);
  tip(rules_folder.add(options, 'rule_a').name('Diagonal ↗ line rule').onChange(run), rule_tip);
  tip(
    rules_folder.add(ctrls, 'randomize').name('Randomize all 4 rules'),
    'Rerolls all four rule numbers at once for a completely different pattern.'
  );
  rules_folder.open();

  let seed_folder = gui.addFolder('Seed');
  tip(
    seed_folder
      .add(options, 'init_state', { Empty: 'empty', Random: 'random', 'Single corner mark': 'corner_cross' })
      .name('Starting point')
      .onChange(run),
    'What the pattern grows from: nothing, a random scatter, or a single mark in one corner.'
  );
  seed_folder.open();

  let color_folder = gui.addFolder('Colors');
  const palette_names = [...Object.keys(custom_palettes), ...tome.getNames()];
  color_folder.add(options, 'palette_name', palette_names).name('Color palette').onChange(run);
  color_folder.add(options, 'display_stroke').name('Show line outlines').onChange(run);
  color_folder.add(options, 'display_fill').name('Show color fill').onChange(run);
  color_folder.open();

  let export_folder = gui.addFolder('Export');
  tip(
    export_folder.add(options, 'export_scale', ['1x', '2x', '4x']).name('PNG resolution'),
    'Higher values export a larger, sharper PNG (useful for print) — the on-screen pattern looks the same either way.'
  );
  export_folder.add(options, 'watermark').name('Add watermark');
  tip(
    export_folder.add(options, 'watermark_name').name('Watermark name'),
    'Optional — leave blank to just stamp the project name and date.'
  );
  export_folder.add(ctrls, 'export_png').name('Export PNG');
  export_folder.add(ctrls, 'export_svg').name('Export SVG (vector)');
  export_folder.open();

  function randomize_and_run() {
    randomize_rules();
    gui.updateDisplay();
    run();
  }
}
