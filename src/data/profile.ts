import content from 'virtual:content';

/** Personal details and links — edit them in content/profile.yml. */
export const profile = content.profile;

/** Resolve a /public file path against Vite's base URL (works under a repo subpath). */
export function withBase(path: string): string {
  if (/^(https?:|mailto:)/.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
