import content from 'virtual:content';
import type { Project } from './types';

/** Projects — edit them in content/projects.yml. */
export const projects = content.projects;

export const projectById = (id: string) => projects.find((p) => p.id === id);
export const projectsByTier = (tier: Project['tier']) => projects.filter((p) => p.tier === tier);
