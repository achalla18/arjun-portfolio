# Arjun Challa — Portfolio

A single-page personal portfolio: Vite + React + TypeScript, plain CSS, Leaflet for the interactive map, and hand-built SVG for every other diagram. It builds to a static `dist/` folder and deploys to GitHub Pages. There is no backend.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build at http://localhost:4173
```

Requires Node 20.19+ (CI uses Node 22).

## Deploying to GitHub Pages

1. Push this project to a GitHub repository.
2. On GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
   The workflow won't publish until you do this.
3. Push to `main`. `.github/workflows/deploy.yml` will then:
   install with `npm ci` (from the lockfile) → build → upload `dist/` as a Pages artifact → deploy it with `actions/deploy-pages`.
   It uses the built-in `GITHUB_TOKEN` with `pages: write` and `id-token: write`, so no personal access token is needed.
   You can also start it by hand from the **Actions** tab (*Run workflow*).

The workflow does not create a `CNAME` file and never touches your custom-domain settings.

### Base path

Vite has to know the URL path the site is served from. The workflow works it out:

| Where the site lives | Base path |
| --- | --- |
| Repository named `achalla18.github.io` → `https://achalla18.github.io/` | `/` (automatic) |
| Any other repository, e.g. `portfolio` → `https://achalla18.github.io/portfolio/` | `/portfolio/` (automatic) |
| A custom domain on a project repo | set it yourself (below) |

To override it, add a repository variable: **Settings → Secrets and variables → Actions → Variables → New variable**, with name `BASE_PATH` and value `/` (for a custom domain) or `/some-path/`.

To test a subpath build locally:

```bash
BASE_PATH=portfolio npm run build && BASE_PATH=portfolio npm run preview
# then open http://localhost:4173/portfolio/
```

(Leading and trailing slashes are optional. Leave them off in Git Bash on Windows, which otherwise rewrites `/portfolio/` into a Windows file path.)

All assets are imported through Vite or resolved with `withBase()` (`src/data/profile.ts`), so nothing is hard-coded to `/`.

## Editing content

All text lives in plain YAML files in `content/`; you never need to touch the code. **See [EDITING.md](EDITING.md)** for a step-by-step guide.

| File | What it holds |
| --- | --- |
| `content/profile.yml` | Name, headline, intro, links, section headings |
| `content/experience.yml` | Roles under **Now** and **Past** |
| `content/projects.yml` | Map projects (with their map places) and A Few of My Experiments |

`content-plugin.ts` reads these at build time and checks them; a mistake stops the build with a message naming the file and entry.

## The map

- `src/components/maps/MapExplorer.tsx` holds the section: a geographic / algorithm mode switch, the project panel.
- The hero illustration (`HeroMap.tsx`) is a decorative schematic, not a real map.
- `LeafletMap.tsx` is **lazy-loaded** as its own chunk once the section is near the viewport. It uses standard OpenStreetMap tiles, restyled with a CSS filter, with OSM attribution shown. Zoom is capped at 12. There is no prefetching and no API key.
- If tiles fail, markers stay on a coordinate grid with a notice. If the map code can't load at all, a tile-free schematic (`MapFallback.tsx`) takes its place.
- `AlgorithmView.tsx` runs a small spatial pattern matching demo (quadtree → pruning → backtracking join) on **synthetic** points in the browser (`src/lib/spmDemo.ts`). It is labeled as a teaching demo, not SPMBench output.

## Project structure

```
content/           the site's text (YAML); edit here
src/
  data/            loads /content and defines its types
  components/      sections, nav, hero, reusable detail dialog
  components/maps/ hero illustration, map explorer, Leaflet map, fallback, algorithm view
  components/visuals/ glyphs + styles for the algorithm view
  lib/             seeded geometry helpers, quadtree, SPM demo
  styles/          design tokens + layout
public/            favicon (put resume.pdf here)
.github/workflows/ GitHub Pages deployment
```
