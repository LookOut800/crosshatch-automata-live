// Rebuilds the same triangle geometry draw() renders to canvas, but as
// absolute-coordinate SVG polygons instead of a p5 transform stack — SVG
// has no equivalent to push()/translate()/scale(), so each repeat/mirror
// segment's reflection has to be folded into the point math directly.
// Keep this in sync with index.js's draw_pattern/draw_segment/fill_cell.
export default function build_svg(grid, options, palette, cell_dim, canvas_width, canvas_height, padding, watermark_text) {
  const x0 = options.grid_init_x;
  const y0 = options.grid_init_y;
  const x1 = x0 + options.grid_size_x;
  const y1 = y0 + options.grid_size_y;

  const segment_width = (x1 - x0) * cell_dim;
  const segment_height = (y1 - y0) * cell_dim;

  const polys = [];

  if (options.display_fill) {
    for (let i = 0; i < options.repeats_y; i++) {
      const v_reflect =
        options.vertical_reflection && i % 2 === (options.initial_vertical_reflection ? 0 : 1);
      const seg_y = padding + i * (segment_height + options.segment_padding);

      for (let j = 0; j < options.repeats_x; j++) {
        const h_reflect =
          options.horizontal_reflection &&
          j % 2 === (options.initial_horizontal_reflection ? 0 : 1);
        const seg_x = padding + j * (segment_width + options.segment_padding);

        for (let gi = 0; gi < y1 - y0; gi++) {
          for (let gj = 0; gj < x1 - x0; gj++) {
            const cell = grid[gi + y0][gj + x0];
            add_cell_triangles(polys, palette, cell, gj * cell_dim, gi * cell_dim, cell_dim, seg_x, seg_y, segment_width, segment_height, h_reflect, v_reflect);
          }
        }
      }
    }
  }

  let watermark_svg = '';
  if (watermark_text) {
    watermark_svg = `<text x="${canvas_width - padding}" y="${canvas_height - padding + 34}" text-anchor="end" font-family="monospace" font-size="13" fill="${palette.stroke || '#000000'}" opacity="0.55">${escape_xml(watermark_text)}</text>`;
  }

  const bg = palette.background || '#dedede';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas_width}" height="${canvas_height}" viewBox="0 0 ${canvas_width} ${canvas_height}">
<rect width="${canvas_width}" height="${canvas_height}" fill="${bg}"/>
${polys.join('\n')}
${watermark_svg}
</svg>
`;
}

const add_cell_triangles = (polys, palette, cell, cx, cy, cell_dim, seg_x, seg_y, segment_width, segment_height, h_reflect, v_reflect) => {
  const quadrants = [
    [cell.north_color, [0, 0], [cell_dim, 0], [cell_dim / 2, cell_dim / 2]],
    [cell.east_color, [cell_dim, 0], [cell_dim, cell_dim], [cell_dim / 2, cell_dim / 2]],
    [cell.south_color, [cell_dim, cell_dim], [0, cell_dim], [cell_dim / 2, cell_dim / 2]],
    [cell.west_color, [0, cell_dim], [0, 0], [cell_dim / 2, cell_dim / 2]],
  ];

  quadrants.forEach(([color_index, ...pts]) => {
    const abs_points = pts
      .map(([vx, vy]) => {
        let px = vx + cx;
        let py = vy + cy;
        if (h_reflect) px = segment_width - px;
        if (v_reflect) py = segment_height - py;
        return `${round(seg_x + px)},${round(seg_y + py)}`;
      })
      .join(' ');
    polys.push(`<polygon points="${abs_points}" fill="${palette.colors[color_index]}"/>`);
  });
};

const round = (n) => Math.round(n * 100) / 100;

const escape_xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
