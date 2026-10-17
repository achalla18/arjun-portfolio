import { useId } from 'react';
import { contourRings, meander, type Pt } from '../../lib/geometry';

/**
 * Hero cartographic illustration — a quiet schematic plate:
 * contour lines, one river, and four labeled points for the areas of work.
 * Schematic, not to scale; decorative only.
 */

const W = 640;
const H = 600;

const hills = [...contourRings(180, 200, 8, 18, 3, 12, 0.82), ...contourRings(470, 400, 7, 20, 8, 14, 0.9)];
const river = meander([-20, 330], [660, 520], 21, 34, 11);

const nodes: { p: Pt; label: string }[] = [
  { p: [212, 228], label: 'Spatial queries' },
  { p: [418, 300], label: 'Satellite flood mapping' },
  { p: [140, 432], label: 'Road flood risk' },
  { p: [500, 170], label: 'Urban routing' },
];

/** `fill` crops the plate to cover its box (for full-bleed layouts) instead of fitting inside it. */
export default function HeroMap({ fill = false }: { fill?: boolean }) {
  // Unique ids so several plates can coexist on one page (SVG ids are document-global).
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const fadeId = `hm-fade-${uid}`;
  const maskId = `hm-mask-${uid}`;
  return (
    <svg
      className="hero-map"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={fill ? 'xMidYMid slice' : 'xMidYMid meet'}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={fadeId} cx="50%" cy="48%" r="55%">
          <stop offset="45%" stopColor="#fff" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <mask id={maskId}>
          <rect width={W} height={H} fill={`url(#${fadeId})`} />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        <g className="hm-grid">
          {Array.from({ length: 5 }, (_, i) => <line key={`v${i}`} x1={i * 160} y1="0" x2={i * 160} y2={H} />)}
          {Array.from({ length: 5 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 150} x2={W} y2={i * 150} />)}
        </g>
        <g className="hm-contour">
          {hills.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <path className="hm-river" d={river} />
      </g>

      {nodes.map((n) => (
        <g key={n.label} className="hm-node" transform={`translate(${n.p[0]} ${n.p[1]})`}>
          <circle className="dot" r="3" />
          <text x="10" y="4">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
