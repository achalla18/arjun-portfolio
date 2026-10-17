import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapItems, type MapItem } from './mapItems';

/**
 * Leaflet map, loaded lazily (this module is a separate chunk).
 * Tiles: standard OpenStreetMap tiles, restyled to slate with a CSS filter.
 * No keys, no prefetching; zoom is capped to keep tile use light.
 */

interface Props {
  selectedId: string;
  onSelect: (projectId: string) => void;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fitPadding = (): L.PointExpression => (window.innerWidth < 560 ? [16, 16] : [40, 40]);

function boundsFor(items: MapItem[]): L.LatLngBounds {
  const b = L.latLngBounds([]);
  for (const it of items) {
    if (it.extent) b.extend(L.latLngBounds(it.extent));
    else b.extend([it.lat, it.lng]);
  }
  return b;
}

export default function LeafletMap({ selectedId, onSelect }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markers = useRef(new Map<string, { item: MapItem; marker: L.Marker; rect?: L.Rectangle }>());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [tilesFailed, setTilesFailed] = useState(false);
  const firstSelection = useRef(true);

  // Create the map once.
  useEffect(() => {
    if (!el.current || mapRef.current) return;
    const map = L.map(el.current, {
      zoomControl: false,
      minZoom: 1,
      maxZoom: 12,
      scrollWheelZoom: false,
      worldCopyJump: true,
      maxBounds: [
        [-75, -200],
        [85, 200],
      ],
    });
    mapRef.current = map;
    firstSelection.current = true;
    // Set the view first: Leaflet defers creating marker elements until the map has one.
    map.fitBounds(boundsFor(mapItems), { padding: fitPadding() });
    L.control.zoom({ position: 'topright' }).addTo(map);
    map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>');

    // Only zoom with the wheel after the visitor has engaged with the map.
    map.on('click focus', () => map.scrollWheelZoom.enable());
    map.on('mouseout blur', () => map.scrollWheelZoom.disable());

    let loaded = 0;
    let errors = 0;
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 12,
      className: 'osm-tiles',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    });
    tiles.on('tileload', () => {
      loaded++;
      setTilesFailed(false);
    });
    tiles.on('tileerror', () => {
      errors++;
      if (errors >= 4 && loaded === 0) setTilesFailed(true);
    });
    tiles.addTo(map);
    const timeout = window.setTimeout(() => {
      if (loaded === 0) setTilesFailed(true);
    }, 8000);

    for (const item of mapItems) {
      const rect = item.extent
        ? L.rectangle(item.extent, { className: 'pm-extent', interactive: false, weight: 1, fill: true }).addTo(map)
        : undefined;
      const icon = L.divIcon({
        className: 'pm',
        html: `<span class="pm-ring"></span><span class="pm-dot"></span><span class="pm-label">${item.label}</span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const marker = L.marker([item.lat, item.lng], { icon, keyboard: true, title: item.label, riseOnHover: true })
        .on('click', () => onSelectRef.current(item.projectId))
        .addTo(map);
      // Make keyboard activation explicit (Enter / Space on a focused marker).
      marker.getElement()?.setAttribute('role', 'button');
      marker.getElement()?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectRef.current(item.projectId);
        }
      });
      markers.current.set(item.key, { item, marker, rect });
    }

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el.current);

    return () => {
      window.clearTimeout(timeout);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      markers.current.clear();
    };
  }, []);

  // React to selection: highlight + fly.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const sel: MapItem[] = [];
    markers.current.forEach(({ item, marker, rect }) => {
      const on = item.projectId === selectedId;
      const node = marker.getElement();
      node?.classList.toggle('is-selected', on);
      node?.setAttribute('aria-pressed', String(on));
      marker.setZIndexOffset(on ? 1000 : 0);
      rect?.getElement()?.classList.toggle('is-selected', on);
      if (on) sel.push(item);
    });
    // Keep the all-locations overview on first render; fly on later selections.
    if (!sel.length || firstSelection.current) {
      firstSelection.current = false;
      return;
    }
    const b = boundsFor(sel);
    const maxZoom = Math.min(...sel.map((s) => s.zoom));
    map.flyToBounds(b, { padding: [56, 56], maxZoom, animate: !reducedMotion(), duration: 1.1 });
  }, [selectedId]);

  return (
    <div className="lmap-wrap">
      <div ref={el} className="lmap" aria-label="Interactive map of project locations" role="region" />
      <button
        type="button"
        className="lmap-reset"
        onClick={() => mapRef.current?.flyToBounds(boundsFor(mapItems), { padding: fitPadding(), animate: !reducedMotion() })}
      >
        All locations
      </button>
      {tilesFailed && (
        <p className="lmap-notice" role="status">
          Basemap tiles couldn’t load. Project locations are shown on a coordinate grid.
        </p>
      )}
    </div>
  );
}
