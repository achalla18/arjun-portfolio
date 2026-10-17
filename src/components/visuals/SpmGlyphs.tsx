import type { Kw } from '../../lib/spmDemo';

/** Keyword glyphs — shape (not just colour) distinguishes A / B / C. */
export function Glyph({ kw, x, y, r = 3, className }: { kw: Kw; x: number; y: number; r?: number; className?: string }) {
  if (kw === 'A') return <circle className={className} cx={x} cy={y} r={r} />;
  if (kw === 'B') return <rect className={className} x={x - r * 0.9} y={y - r * 0.9} width={r * 1.8} height={r * 1.8} />;
  const h = r * 1.15;
  return <path className={className} d={`M${x},${y - h} L${x + h},${y + h * 0.8} L${x - h},${y + h * 0.8}Z`} />;
}

/** The query graph A–B–C with distance constraints. */
export function QueryGraph({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const n = { A: [0, 46], B: [52, 0], C: [104, 46] } as const;
  return (
    <g className="v-query" transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-18" y="-30" width="140" height="102" rx="4" className="v-query-bg" />
      <text x="-8" y="-14" className="v-query-title">query graph</text>
      <line x1={n.A[0]} y1={n.A[1]} x2={n.B[0]} y2={n.B[1]} />
      <line x1={n.B[0]} y1={n.B[1]} x2={n.C[0]} y2={n.C[1]} />
      <line x1={n.A[0]} y1={n.A[1]} x2={n.C[0]} y2={n.C[1]} strokeDasharray="3 3" />
      {(Object.keys(n) as Kw[]).map((k) => (
        <g key={k}>
          <Glyph kw={k} x={n[k][0]} y={n[k][1]} r={6} className="v-query-node" />
          <text x={n[k][0]} y={n[k][1] + 20} textAnchor="middle">
            {k}
          </text>
        </g>
      ))}
    </g>
  );
}
