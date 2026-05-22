import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Category {
  label: string;
  pct: number; // percentage 0-100
  color: string;
}

const categories: Category[] = [
  { label: 'Social & Family', pct: 22, color: '#d4a574' },
  { label: 'Game', pct: 22, color: '#c47f5a' },
  { label: 'Study', pct: 26, color: '#8b6914' },
  { label: 'Music', pct: 13, color: '#d4b840' },
  { label: 'Coding', pct: 2, color: '#6b7b8d' },
  { label: 'Thinking', pct: 15, color: '#8a9a6b' },
];

const W = 800;
const H = 520;
const COLS = 120;
const CELL_W = W / COLS;
const ROWS = Math.round(H / CELL_W);
const CELL_H = H / ROWS;
const TOTAL_CELLS = ROWS * COLS;

interface Region {
  path: string;
  centroid: { x: number; y: number };
}

function computeRegions(): Region[] {
  const grid = new Int16Array(TOTAL_CELLS).fill(-1);

  // Target cell count per category
  const targets = categories.map((c) => Math.round((c.pct / 100) * TOTAL_CELLS));
  // Fix rounding so sum matches TOTAL_CELLS
  const diff = TOTAL_CELLS - targets.reduce((a, b) => a + b, 0);
  targets[2] += diff; // adjust largest category (Study)

  // Seed positions — one per category, spread across the frame
  const seeds = [
    { col: Math.round(COLS * 0.22), row: Math.round(ROWS * 0.22) },  // Social & Family
    { col: Math.round(COLS * 0.72), row: Math.round(ROWS * 0.25) },  // Game
    { col: Math.round(COLS * 0.45), row: Math.round(ROWS * 0.50) },  // Study
    { col: Math.round(COLS * 0.72), row: Math.round(ROWS * 0.72) },  // Music
    { col: Math.round(COLS * 0.18), row: Math.round(ROWS * 0.78) },  // Coding
    { col: Math.round(COLS * 0.55), row: Math.round(ROWS * 0.65) },  // Thinking
  ];

  const idx = (r: number, c: number) => r * COLS + c;
  const inBounds = (r: number, c: number) => r >= 0 && r < ROWS && c >= 0 && c < COLS;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  // Place seeds
  const frontiers: [number, number][][] = categories.map(() => []);
  const counts = new Array(categories.length).fill(0);

  for (let i = 0; i < seeds.length; i++) {
    const { col, row } = seeds[i];
    grid[idx(row, col)] = i;
    counts[i] = 1;
    // Add neighbors to frontier
    for (const [dr, dc] of dirs) {
      const nr = row + dr, nc = col + dc;
      if (inBounds(nr, nc) && grid[idx(nr, nc)] === -1) {
        grid[idx(nr, nc)] = -2; // mark as in-frontier
        frontiers[i].push([nr, nc]);
      }
    }
  }

  // Region growing with shuffled expansion for organic boundaries
  const active = new Set(categories.map((_, i) => i));

  while (active.size > 0) {
    // Pick a random active category weighted by remaining need
    const candidates = [...active].filter((c) => counts[c] < targets[c]);
    if (candidates.length === 0) break;

    const c = candidates[Math.floor(Math.random() * candidates.length)];

    if (frontiers[c].length === 0) {
      active.delete(c);
      continue;
    }

    // Pick a random frontier cell
    const fi = Math.floor(Math.random() * frontiers[c].length);
    const [fr, fc] = frontiers[c][fi];
    frontiers[c].splice(fi, 1);

    if (grid[idx(fr, fc)] !== -2) continue; // already claimed

    grid[idx(fr, fc)] = c;
    counts[c]++;

    // Add new neighbors to frontier
    for (const [dr, dc] of dirs) {
      const nr = fr + dr, nc = fc + dc;
      if (inBounds(nr, nc) && grid[idx(nr, nc)] === -1) {
        grid[idx(nr, nc)] = -2;
        frontiers[c].push([nr, nc]);
      }
    }

    if (counts[c] >= targets[c]) {
      active.delete(c);
    }
  }

  // Build merged rect paths + centroids per category
  return categories.map((_, c) => {
    let d = '';
    let sx = 0, sy = 0, n = 0;
    for (let row = 0; row < ROWS; row++) {
      let col = 0;
      while (col < COLS) {
        if (grid[idx(row, col)] !== c) { col++; continue; }
        let end = col;
        while (end < COLS && grid[idx(row, end)] === c) end++;
        const x = col * CELL_W;
        const y = row * CELL_H;
        const w = (end - col) * CELL_W;
        d += `M${x},${y}h${w}v${CELL_H}h${-w}z`;
        sx += x + w / 2; sy += y + CELL_H / 2; n++;
        col = end;
      }
    }
    return { path: d, centroid: { x: n ? sx / n : 0, y: n ? sy / n : 0 } };
  });
}

export default function LifeTimeChart() {
  const regions = useMemo(() => computeRegions(), []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          生命时间图
        </motion.h2>
        <p className="text-center text-gray-400 dark:text-gray-500 mb-12">
          每天24小时的时间分配
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-border-dark"
        >
          <div className="relative w-full mx-auto" style={{ aspectRatio: `${W}/${H}` }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
              <defs>
                <clipPath id="frame">
                  <rect x="0" y="0" width={W} height={H} rx="8" />
                </clipPath>

                <filter id="goo" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="
                      1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 22 -9
                    "
                    result="crisp"
                  />
                  <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="3" result="noise" />
                  <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
                  <feComponentTransfer in="gray" result="dim">
                    <feFuncA type="linear" slope="0.06" />
                  </feComponentTransfer>
                  <feBlend in="crisp" in2="dim" mode="multiply" />
                </filter>
              </defs>

              <rect x="0" y="0" width={W} height={H} rx="8" fill="#f5ede3" />

              <g clipPath="url(#frame)" filter="url(#goo)">
                {regions.map((region, i) =>
                  region.path ? (
                    <motion.path
                      key={i}
                      d={region.path}
                      fill={categories[i].color}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    />
                  ) : null,
                )}
              </g>

              <g clipPath="url(#frame)">
                {regions.map((region, i) => {
                  if (!region.path) return null;
                  const { x, y } = region.centroid;
                  return (
                    <text
                      key={categories[i].label}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fillOpacity="0.9"
                      fontSize="16"
                      fontWeight="600"
                      style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)', letterSpacing: '0.02em' }}
                    >
                      {categories[i].label}
                    </text>
                  );
                })}
              </g>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
