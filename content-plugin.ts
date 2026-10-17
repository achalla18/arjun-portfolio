/**
 * Reads the YAML files in /content, checks them, and hands them to the site as
 * `virtual:content`. A mistake in a file stops the build with a message that
 * names the file and the entry, instead of a blank page.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { parse } from 'yaml';

const DIR = fileURLToPath(new URL('./content', import.meta.url));
const FILES = ['profile.yml', 'experience.yml', 'projects.yml'] as const;
const VIRTUAL = 'virtual:content';
const RESOLVED = '\0' + VIRTUAL;

type Obj = Record<string, unknown>;


class ContentError extends Error {}

function fail(file: string, where: string, msg: string): never {
  throw new ContentError(`content/${file}${where ? ` → ${where}` : ''}: ${msg}\nSee EDITING.md for the format.`);
}

/** Small reader that turns YAML values into the shapes the site expects. */
function reader(file: string, where: string, value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(file, where, 'expected a set of "field: value" lines.');
  const o = value as Obj;
  const text = (key: string, required = false): string | undefined => {
    const v = o[key];
    if (v === undefined || v === null || v === '') {
      if (required) fail(file, where, `"${key}" is required.`);
      return undefined;
    }
    if (typeof v === 'object') fail(file, where, `"${key}" should be plain text.`);
    return String(v).trim();
  };
  const num = (key: string): number => {
    const v = o[key];
    if (typeof v !== 'number' || Number.isNaN(v)) fail(file, where, `"${key}" must be a number.`);
    return v;
  };
  const list = (key: string): unknown[] => {
    const v = o[key];
    if (v === undefined || v === null) return [];
    if (!Array.isArray(v)) fail(file, where, `"${key}" must be a list (lines starting with "- ").`);
    return v;
  };
  return { o, text, num, list };
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-');

function uniqueIds() {
  const seen = new Map<string, number>();
  return (base: string) => {
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };
}

function highlights(file: string, where: string, items: unknown[]) {
  if (items.length > 3) fail(file, where, 'use at most 3 highlights.');
  return items.map((h, i) => {
    const r = reader(file, `${where} → highlight ${i + 1}`, h);
    return { value: r.text('value'), text: r.text('text', true)! };
  });
}

function load(file: (typeof FILES)[number]): unknown {
  const raw = readFileSync(resolve(DIR, file), 'utf8');
  try {
    return parse(raw);
  } catch (e) {
    fail(file, '', `could not be read. ${(e as Error).message.split('\n')[0]} (check indentation and that text containing ": " is in quotes).`);
  }
}

export function readContent() {
  /* ---------- profile ---------- */
  const p = reader('profile.yml', '', load('profile.yml'));
  const l = reader('profile.yml', 'links', p.o.links ?? {});
  const s = reader('profile.yml', 'sections', p.o.sections ?? {});
  const profile = {
    name: p.text('name', true)!,
    headline: p.text('headline', true)!,
    intro: p.text('intro', true)!,
    description: p.text('description') ?? p.text('intro', true)!,
    links: {
      email: l.text('email', true)!,
      linkedin: l.text('linkedin') ?? null,
      github: l.text('github') ?? null,
      x: l.text('x') ?? null,
      resume: l.text('resume') ?? null,
    },
    sections: {
      now: s.text('now') ?? 'Now',
      explore: s.text('explore') ?? 'Explore My Work',
      exploreSubtitle: s.text('exploreSubtitle') ?? null,
      past: s.text('past') ?? 'Past',
      experiments: s.text('experiments') ?? 'A Few of My Experiments',
      footerNote: s.text('footerNote') ?? null,
    },
  };

  /* ---------- experience ---------- */
  const e = reader('experience.yml', '', load('experience.yml'));
  const expId = uniqueIds();
  const experience = (['now', 'past'] as const).flatMap((group) =>
    e.list(group).map((item, i) => {
      const where = `${group} → entry ${i + 1}`;
      const r = reader('experience.yml', where, item);
      const organization = r.text('organization', true)!;
      return {
        id: expId(slug(organization)),
        organization,
        unit: r.text('unit'),
        role: r.text('role', true)!,
        dates: r.text('dates', true)!,
        current: group === 'now',
        summary: r.text('summary', true)!,
        highlights: highlights('experience.yml', where, r.list('highlights')),
        note: r.text('note'),
      };
    }),
  );

  /* ---------- projects ---------- */
  const pr = reader('projects.yml', '', load('projects.yml'));
  const projId = uniqueIds();
  const mapList = pr.list('map');
  if (mapList.length === 0) fail('projects.yml', 'map', 'add at least one map project.');
  const projects = (['map', 'experiments'] as const).flatMap((group) =>
    pr.list(group).map((item, i) => {
      const r = reader('projects.yml', `${group} → entry ${i + 1}`, item);
      const title = r.text('title', true)!;
      const where = `${group} → "${title}"`;
      const id = projId(slug(title));
      const placeId = uniqueIds();
      const places = r.list('places').map((pl, j) => {
        const g = reader('projects.yml', `${where} → place ${j + 1}`, pl);
        const label = g.text('label', true)!;
        const extent = g.o.extent;
        const okExtent =
          extent === undefined ||
          (Array.isArray(extent) &&
            extent.length === 2 &&
            extent.every((c) => Array.isArray(c) && c.length === 2 && c.every((n) => typeof n === 'number')));
        if (!okExtent) fail('projects.yml', `${where} → place ${j + 1}`, '"extent" must look like [[south, west], [north, east]].');
        return {
          id: placeId(slug(label)),
          label,
          meaning: g.text('meaning', true)!,
          lat: g.num('lat'),
          lng: g.num('lng'),
          zoom: g.num('zoom'),
          extent: extent as [[number, number], [number, number]] | undefined,
        };
      });
      if (group === 'map' && places.length === 0) fail('projects.yml', where, 'map projects need at least one place.');
      return {
        id,
        tier: group === 'map' ? ('map' as const) : ('built' as const),
        number: group === 'map' ? String(i + 1).padStart(2, '0') : undefined,
        title,
        subtitle: r.text('subtitle'),
        role: r.text('role'),
        institution: r.text('institution'),
        dates: r.text('dates', true)!,
        status: r.text('status'),
        previewDescription: r.text('preview', true)!,
        overview: r.text('overview', true)!,
        highlights: highlights('projects.yml', where, r.list('highlights')),
        note: r.text('note'),
        technologies: r.list('tech').map(String),
        geographicContext: group === 'map' ? places : undefined,
        algorithmView: group === 'map' && r.o.algorithmView === true,
        githubUrl: r.text('github'),
        demoUrl: r.text('demo'),
        paperUrl: r.text('paper'),
      };
    }),
  );
  if (projects.filter((x) => x.algorithmView).length > 1)
    fail('projects.yml', 'map', 'only one project can have "algorithmView: true".');

  return { profile, experience, projects };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default function contentPlugin(): Plugin {
  return {
    name: 'portfolio-content',
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : null;
    },
    load(id) {
      if (id !== RESOLVED) return null;
      for (const f of FILES) this.addWatchFile(resolve(DIR, f));
      return `export default ${JSON.stringify(readContent())};`;
    },
    handleHotUpdate({ file, server }) {
      if (resolve(file).startsWith(DIR)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
    /** Fill the page title, link-preview text, and no-JavaScript fallback from profile.yml. */
    transformIndexHtml(html) {
      const { profile } = readContent();
      const vars: Record<string, string> = {
        title: `${profile.name} — ${profile.headline.replace(/\.$/, '')}`,
        name: profile.name,
        headline: profile.headline,
        intro: profile.intro,
        description: profile.description,
        email: profile.links.email,
        linkedin: profile.links.linkedin ?? `mailto:${profile.links.email}`,
      };
      return html.replace(/\{\{(\w+)\}\}/g, (m, k: string) => (k in vars ? esc(vars[k]) : m));
    },
  };
}
