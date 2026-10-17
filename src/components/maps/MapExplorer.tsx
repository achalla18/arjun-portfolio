import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Globe2, Network } from 'lucide-react';
import { profile } from '../../data/profile';
import { projectById } from '../../data/projects';
import { useDetail } from '../DetailContext';
import MapFallback from './MapFallback';
import { ALGORITHM_PROJECT_ID, explorerProjects, mapItems } from './mapItems';
import './MapExplorer.css';

const LeafletMap = lazy(() => import('./LeafletMap'));
/** Loaded only when the visitor opens the Algorithm view. */
const AlgorithmView = lazy(() => import('./AlgorithmView'));

/** If the map chunk fails to load or throws, keep the section usable. */
class MapBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Mount the heavy map only when the section approaches the viewport. */
function useNearViewport<T extends Element>() {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near || !ref.current) return;
    if (!('IntersectionObserver' in window)) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near]);
  return [ref, near] as const;
}

type Mode = 'geo' | 'algo';

export default function MapExplorer() {
  const { openDetail } = useDetail();
  const [selectedId, setSelectedId] = useState(explorerProjects[0].id);
  const [mode, setMode] = useState<Mode>('geo');
  const [stageRef, near] = useNearViewport<HTMLDivElement>();
  const selected = projectById(selectedId)!;
  const contexts = mapItems.filter((m) => m.projectId === selectedId);

  const select = (id: string) => {
    setSelectedId(id);
    // Selecting a place on the map always means geographic mode.
    if (id !== ALGORITHM_PROJECT_ID && mode === 'algo') setMode('geo');
  };

  return (
    <section id="explore" className="section explorer" aria-labelledby="explore-title">
      <div className="container container--wide">
        <div className="section-head explorer-head">
          <div className="explorer-titles">
            <div>
              <h2 id="explore-title" className="section-title">
                {profile.sections.explore}
              </h2>
              {profile.sections.exploreSubtitle && <p className="section-sub">{profile.sections.exploreSubtitle}</p>}
            </div>
            {ALGORITHM_PROJECT_ID && (
              <div className="seg seg--mode" role="group" aria-label="Explorer view">
                <button type="button" aria-pressed={mode === 'geo'} onClick={() => setMode('geo')}>
                  <Globe2 size={15} aria-hidden="true" /> Geographic
                </button>
                <button
                  type="button"
                  aria-pressed={mode === 'algo'}
                  onClick={() => {
                    setMode('algo');
                    if (ALGORITHM_PROJECT_ID) setSelectedId(ALGORITHM_PROJECT_ID);
                  }}
                >
                  <Network size={15} aria-hidden="true" /> Algorithm
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="explorer-grid">
          <div className="explorer-stage" ref={stageRef}>
            {mode === 'geo' ? (
              <MapBoundary
                fallback={
                  <MapFallback selectedId={selectedId} onSelect={select} message="The interactive map couldn’t load. Showing a schematic instead." />
                }
              >
                {near ? (
                  <Suspense fallback={<MapFallback selectedId={selectedId} onSelect={select} />}>
                    <LeafletMap selectedId={selectedId} onSelect={select} />
                  </Suspense>
                ) : (
                  <MapFallback selectedId={selectedId} onSelect={select} />
                )}
              </MapBoundary>
            ) : (
              <Suspense fallback={null}>
                <AlgorithmView />
              </Suspense>
            )}
            {mode === 'geo' && selectedId === ALGORITHM_PROJECT_ID && (
              <div className="stage-hint">
                <p>This research isn’t tied to one place.</p>
                <button type="button" className="link-btn" onClick={() => setMode('algo')}>
                  See how it works in the Algorithm view
                </button>
              </div>
            )}
          </div>

          <aside className="explorer-panel" aria-label="Project information">
            <ol className="ex-list">
              {explorerProjects.map((p) => (
                <li key={p.id}>
                  <button type="button" className="ex-item" aria-pressed={p.id === selectedId} onClick={() => select(p.id)}>
                    <span className="ex-num">{p.number}</span>
                    <span className="ex-title">{p.title}</span>
                    <span className="ex-where">
                      {p.id === ALGORITHM_PROJECT_ID ? 'Algorithm view' : (p.geographicContext ?? []).map((g) => g.label).join(' · ')}
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="ex-detail" aria-live="polite">
              <p className="ex-preview">{selected.previewDescription}</p>
              {mode === 'geo' &&
                contexts.map((c) => (
                  <p key={c.key} className="ex-context">
                    {c.meaning}
                  </p>
                ))}
              <button type="button" className="link-btn ex-open" onClick={() => openDetail({ kind: 'project', id: selected.id })}>
                Read the project <ArrowUpRight size={14} aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
