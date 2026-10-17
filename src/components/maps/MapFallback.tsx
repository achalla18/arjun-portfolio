import { mapItems } from './mapItems';

/**
 * Tile-free schematic map: shown while the Leaflet chunk loads, or if it fails.
 * Simple equirectangular placement of the same project locations on a grid.
 */

const LON0 = -95;
const LON1 = 45;
const LAT0 = -5;
const LAT1 = 50;
const W = 700;
const H = (W * (LAT1 - LAT0)) / (LON1 - LON0);

const px = (lng: number) => ((lng - LON0) / (LON1 - LON0)) * W;
const py = (lat: number) => ((LAT1 - lat) / (LAT1 - LAT0)) * H;

// Several US contexts sit close together; spread their labels vertically.
const labelOffset: Record<string, number> = { maryland: -16, umd: 0, dc: 16, raleigh: 32 };

interface Props {
  selectedId: string;
  onSelect: (projectId: string) => void;
  message?: string;
}

export default function MapFallback({ selectedId, onSelect, message }: Props) {
  return (
    <div className="lmap-wrap lmap-fallback">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="group" aria-label="Schematic map of project locations">
        <g className="fb-grid">
          {Array.from({ length: 15 }, (_, i) => {
            const x = px(LON0 + i * 10);
            return <line key={`v${i}`} x1={x} y1="0" x2={x} y2={H} />;
          })}
          {Array.from({ length: 6 }, (_, i) => {
            const y = py(LAT1 - i * 10);
            return <line key={`h${i}`} x1="0" y1={y} x2={W} y2={y} />;
          })}
          <line className="eq" x1="0" y1={py(0)} x2={W} y2={py(0)} />
          <text x="6" y={py(0) - 5}>0°</text>
          <text x="6" y={py(40) - 5}>40°N</text>
        </g>
        {mapItems.map((it) => {
          const on = it.projectId === selectedId;
          const x = px(it.lng);
          const y = py(it.lat);
          const dy = labelOffset[it.id] ?? 0;
          return (
            <g
              key={it.key}
              className={`fb-pt${on ? ' is-selected' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={it.label}
              onClick={() => onSelect(it.projectId)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(it.projectId);
                }
              }}
            >
              <circle cx={x} cy={y} r="11" className="hit" />
              <circle cx={x} cy={y} r="4" />
              <text x={x + 12} y={y + 4 + dy}>{it.label}</text>
            </g>
          );
        })}
      </svg>
      {message && (
        <p className="lmap-notice" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
