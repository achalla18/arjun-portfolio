/*
 * Shapes of the site content. The content itself lives in /content/*.yml;
 * content-plugin.ts reads and checks it and fills these in.
 */

export interface GeoContext {
  id: string;
  /** Short map label. */
  label: string;
  /** What the location actually represents — shown in the map panel. */
  meaning: string;
  lat: number;
  lng: number;
  /** Optional approximate extent drawn as a dashed box ([south, west], [north, east]). */
  extent?: [[number, number], [number, number]];
  /** Zoom used when the map flies to this context. */
  zoom: number;
}

/** A headline number or fact. `value` is optional. */
export interface Highlight {
  value?: string;
  text: string;
}

export interface Project {
  id: string;
  /** 'map' projects appear in the map explorer; 'built' ones in the experiments list. */
  tier: 'map' | 'built';
  /** Display number for map projects, e.g. "01". */
  number?: string;
  title: string;
  subtitle?: string;
  role?: string;
  institution?: string;
  dates: string;
  /** "In development" is shown in place of the dates. */
  status?: string;
  /** One sentence used in lists and the map panel. */
  previewDescription: string;
  /** Two or three sentences for the popup. */
  overview: string;
  highlights: Highlight[];
  /** Short caveat about what the numbers do and don't mean. */
  note?: string;
  technologies: string[];
  geographicContext?: GeoContext[];
  /** This project is the one shown in the explorer's Algorithm view. */
  algorithmView: boolean;
  githubUrl?: string;
  demoUrl?: string;
  paperUrl?: string;
}

export interface Experience {
  id: string;
  organization: string;
  unit?: string;
  role: string;
  dates: string;
  /** true for entries under "now" in experience.yml. */
  current: boolean;
  /** Two or three sentences for the popup. */
  summary: string;
  highlights: Highlight[];
  note?: string;
}

export interface Profile {
  name: string;
  headline: string;
  intro: string;
  description: string;
  links: {
    email: string;
    linkedin: string | null;
    github: string | null;
    x: string | null;
    resume: string | null;
  };
  sections: {
    now: string;
    explore: string;
    exploreSubtitle: string | null;
    past: string;
    experiments: string;
    footerNote: string | null;
  };
}

export interface SiteContent {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
}
