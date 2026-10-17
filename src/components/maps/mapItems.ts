import { projectsByTier } from '../../data/projects';
import type { GeoContext } from '../../data/types';

/** One map marker = one geographic context of one map project. */
export interface MapItem extends GeoContext {
  projectId: string;
  key: string;
}

export const explorerProjects = projectsByTier('map');

export const mapItems: MapItem[] = explorerProjects.flatMap((p) =>
  (p.geographicContext ?? []).map((g) => ({ ...g, projectId: p.id, key: `${p.id}:${g.id}` })),
);

/** The project whose research is shown in the algorithm view (algorithmView: true in projects.yml), if any. */
export const ALGORITHM_PROJECT_ID = explorerProjects.find((p) => p.algorithmView)?.id ?? null;
