/** Small deterministic helpers for generating SVG cartography. */

/** Mulberry32 seeded PRNG — same seed, same drawing on every load. */
export function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export type Pt = [number, number];

const f = (n: number) => Math.round(n * 10) / 10;

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
export function smoothPath(points: Pt[], closed = false): string {
  if (points.length < 2) return '';
  const pts = closed ? [points[points.length - 1], ...points, points[0], points[1]] : [points[0], ...points, points[points.length - 1]];
  let d = `M${f(pts[1][0])},${f(pts[1][1])}`;
  for (let i = 1; i < pts.length - 2; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1], pts[i], pts[i + 1], pts[i + 2]];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}

/** Concentric, gently distorted closed curves — a contour "hill". */
export function contourRings(cx: number, cy: number, levels: number, step: number, seed: number, base = 14, squash = 1): string[] {
  const rand = rng(seed);
  const harmonics = Array.from({ length: 4 }, (_, i) => ({ k: i + 2, a: 0.04 + rand() * 0.1, p: rand() * Math.PI * 2 }));
  const rings: string[] = [];
  for (let l = 0; l < levels; l++) {
    const r = base + l * step;
    const pts: Pt[] = [];
    const n = 28;
    for (let i = 0; i < n; i++) {
      const th = (i / n) * Math.PI * 2;
      let m = 1;
      for (const h of harmonics) m += h.a * Math.sin(h.k * th + h.p + l * 0.18);
      pts.push([cx + Math.cos(th) * r * m, cy + Math.sin(th) * r * m * squash]);
    }
    rings.push(smoothPath(pts, true));
  }
  return rings;
}

/** A meandering line from a to b (rivers, drainage). */
export function meander(a: Pt, b: Pt, seed: number, amp = 18, segments = 9): string {
  const rand = rng(seed);
  const pts: Pt[] = [];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const off = i === 0 || i === segments ? 0 : (rand() - 0.5) * 2 * amp;
    pts.push([a[0] + dx * t + nx * off, a[1] + dy * t + ny * off]);
  }
  return smoothPath(pts);
}

/* ---------------- Quadtree (used by the SPM visuals) ---------------- */

export interface Cell {
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
}

/** Point-region quadtree: split any cell holding more than `cap` points. Returns leaf + internal cells. */
export function quadtree(points: Pt[], x: number, y: number, w: number, h: number, cap = 4, maxDepth = 6): Cell[] {
  const out: Cell[] = [];
  const rec = (pts: Pt[], cx: number, cy: number, cw: number, ch: number, depth: number) => {
    out.push({ x: cx, y: cy, w: cw, h: ch, depth });
    if (pts.length <= cap || depth >= maxDepth) return;
    const hw = cw / 2;
    const hh = ch / 2;
    const quads: [number, number][] = [
      [cx, cy],
      [cx + hw, cy],
      [cx, cy + hh],
      [cx + hw, cy + hh],
    ];
    for (const [qx, qy] of quads) {
      rec(
        pts.filter((p) => p[0] >= qx && p[0] < qx + hw && p[1] >= qy && p[1] < qy + hh),
        qx,
        qy,
        hw,
        hh,
        depth + 1,
      );
    }
  };
  rec(points, x, y, w, h, 0);
  return out;
}

export const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
