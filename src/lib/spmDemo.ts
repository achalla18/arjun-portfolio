/**
 * A tiny, real spatial-pattern-matching demo on SYNTHETIC points.
 *
 * Query graph:  A —(≤ dAB)— B —(≤ dBC)— C,  and A —(≤ dAC)— C
 * Step 1: index points in a quadtree.
 * Step 2: star-style pruning — keep only points that have at least one
 *         compatible neighbour for every query edge they participate in.
 * Step 3: backtracking join over the surviving candidates.
 *
 * Used by the algorithm view and the SPM project visual. The numbers it
 * produces describe this toy data only — they are not benchmark results.
 */
import { dist, quadtree, rng, type Cell, type Pt } from './geometry';

export type Kw = 'A' | 'B' | 'C';
export interface Obj {
  id: number;
  p: Pt;
  kw: Kw;
}

export const QUERY = { AB: 28, BC: 32, AC: 44 };

export interface SpmDemo {
  objects: Obj[];
  cells: Cell[];
  candidates: Set<number>;
  matches: [number, number, number][];
}

export function buildSpmDemo(w: number, h: number, n: number, seed: number, cap = 4): SpmDemo {
  const rand = rng(seed);
  const kws: Kw[] = ['A', 'B', 'C'];
  // Mix of clustered + uniform points so the quadtree has visible structure.
  const centers: Pt[] = Array.from({ length: 5 }, () => [w * (0.15 + rand() * 0.7), h * (0.15 + rand() * 0.7)]);
  const objects: Obj[] = Array.from({ length: n }, (_, id) => {
    let p: Pt;
    if (rand() < 0.55) {
      const c = centers[Math.floor(rand() * centers.length)];
      p = [c[0] + (rand() - 0.5) * w * 0.22, c[1] + (rand() - 0.5) * h * 0.26];
    } else {
      p = [rand() * w, rand() * h];
    }
    p = [Math.min(w - 4, Math.max(4, p[0])), Math.min(h - 4, Math.max(4, p[1]))];
    return { id, p, kw: kws[Math.floor(rand() * 3)] };
  });

  const cells = quadtree(
    objects.map((o) => o.p),
    0,
    0,
    w,
    h,
    cap,
    5,
  );

  const by = (k: Kw) => objects.filter((o) => o.kw === k);
  const A = by('A');
  const B = by('B');
  const C = by('C');
  const near = (o: Obj, set: Obj[], d: number) => set.some((q) => dist(o.p, q.p) <= d);

  // Star pruning, iterated to a fixed point.
  let a = A, b = B, c = C;
  for (let it = 0; it < 4; it++) {
    a = a.filter((o) => near(o, b, QUERY.AB) && near(o, c, QUERY.AC));
    b = b.filter((o) => near(o, a, QUERY.AB) && near(o, c, QUERY.BC));
    c = c.filter((o) => near(o, b, QUERY.BC) && near(o, a, QUERY.AC));
  }
  const candidates = new Set([...a, ...b, ...c].map((o) => o.id));

  // Backtracking join in connected order A → B → C.
  const matches: [number, number, number][] = [];
  for (const oa of a) {
    for (const ob of b) {
      if (dist(oa.p, ob.p) > QUERY.AB) continue;
      for (const oc of c) {
        if (dist(ob.p, oc.p) <= QUERY.BC && dist(oa.p, oc.p) <= QUERY.AC) {
          matches.push([oa.id, ob.id, oc.id]);
          if (matches.length >= 24) return { objects, cells, candidates, matches };
        }
      }
    }
  }
  return { objects, cells, candidates, matches };
}
