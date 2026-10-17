import { useMemo, useState } from 'react';
import { Shuffle } from 'lucide-react';
import { buildSpmDemo, QUERY } from '../../lib/spmDemo';
import { Glyph, QueryGraph } from '../visuals/SpmGlyphs';
import '../visuals/visuals.css';

/**
 * Interactive spatial-pattern-matching walkthrough on synthetic points.
 * The pruning and join are actually computed in the browser (src/lib/spmDemo.ts);
 * the counts describe this toy dataset only, not benchmark results.
 */

const W = 720;
const H = 430;
const N = 240;

const steps = [
  {
    key: 'index',
    label: '1 · Index',
    text: 'Objects are inserted into a quadtree. Each cell splits once it holds too many points, so dense areas get finer partitions.',
  },
  {
    key: 'prune',
    label: '2 · Prune',
    text: 'Candidate pruning: an object stays only if it has a compatible neighbor within distance for every query edge it belongs to. Many objects drop out here.',
  },
  {
    key: 'join',
    label: '3 · Join',
    text: 'Backtracking join: build matches one query node at a time from the survivors, checking every distance constraint along the way.',
  },
] as const;

type StepKey = (typeof steps)[number]['key'];

export default function AlgorithmView() {
  const [seed, setSeed] = useState(1818);
  const [step, setStep] = useState<StepKey>('index');
  const demo = useMemo(() => buildSpmDemo(W, H, N, seed, 6), [seed]);
  const byId = useMemo(() => new Map(demo.objects.map((o) => [o.id, o])), [demo]);
  const inMatch = useMemo(() => new Set(demo.matches.flat()), [demo]);
  const current = steps.find((s) => s.key === step)!;

  const cls = (id: number) => {
    if (step === 'index') return '';
    if (step === 'prune') return demo.candidates.has(id) ? 'is-cand' : 'is-out';
    return inMatch.has(id) ? 'is-match' : demo.candidates.has(id) ? 'is-cand' : 'is-out';
  };

  return (
    <div className="algo">
      <div className="algo-stage visual-frame">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Algorithm view, step ${current.label}: ${current.text}`}>
          <g className="v-cells" style={{ opacity: step === 'index' ? 1 : 0.45 }}>
            {demo.cells.map((c, i) => (
              <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h} />
            ))}
          </g>
          <g className="v-pts algo-pts">
            {demo.objects.map((o) => (
              <Glyph key={o.id} kw={o.kw} x={o.p[0]} y={o.p[1]} r={2.6} className={cls(o.id)} />
            ))}
          </g>
          {step === 'join' && (
            <g className="v-match">
              {demo.matches.map(([a, b, c], i) => {
                const [pa, pb, pc] = [byId.get(a)!.p, byId.get(b)!.p, byId.get(c)!.p];
                return <path key={i} d={`M${pa[0]},${pa[1]} L${pb[0]},${pb[1]} L${pc[0]},${pc[1]}`} />;
              })}
            </g>
          )}
          <QueryGraph x={W - 140} y={42} />
        </svg>
      </div>

      <div className="algo-controls">
        <div className="seg" role="group" aria-label="Algorithm step">
          {steps.map((s) => (
            <button key={s.key} type="button" aria-pressed={step === s.key} onClick={() => setStep(s.key)}>
              {s.label}
            </button>
          ))}
        </div>
        <button type="button" className="algo-shuffle" onClick={() => setSeed((s) => s + 1)}>
          <Shuffle size={14} aria-hidden="true" /> New random data
        </button>
      </div>

      <p className="algo-text" aria-live="polite">
        {current.text}
      </p>

      <dl className="algo-stats">
        <div>
          <dt>objects</dt>
          <dd>{demo.objects.length}</dd>
        </div>
        <div>
          <dt>quadtree cells</dt>
          <dd>{demo.cells.length}</dd>
        </div>
        <div>
          <dt>after pruning</dt>
          <dd>{step === 'index' ? '—' : demo.candidates.size}</dd>
        </div>
        <div>
          <dt>matches</dt>
          <dd>{step === 'join' ? `${demo.matches.length}${demo.matches.length >= 24 ? '+' : ''}` : '—'}</dd>
        </div>
      </dl>
      <p className="caption">
        Synthetic points, computed live in your browser. Query: A–B ≤ {QUERY.AB}, B–C ≤ {QUERY.BC}, A–C ≤ {QUERY.AC} units. A teaching
        demo, not SPMBench output.
      </p>
    </div>
  );
}
