# Editing your site

Everything on the site comes from three text files in the `content/` folder:

| To change… | Open |
| --- | --- |
| Your name, headline, intro, links, section headings | `content/profile.yml` |
| Now and Past roles | `content/experience.yml` |
| Map projects and A Few of My Experiments | `content/projects.yml` |

Each file starts with a short list of the fields it accepts.

## See your changes

1. In a terminal in this folder, run `npm run dev` once and open http://localhost:5173/.
2. Edit a file in `content/` and save. The page reloads with your change.
3. When you're happy, commit and push to `main`. GitHub Pages rebuilds the live site in a couple of minutes.

You can also edit on github.com: open a file in `content/`, click the pencil icon, change it, and commit. The site redeploys on its own.

## The rules of the format (YAML)

```yaml
title: Mapping Floods From Space          # field: value
overview: >-                              # long text: write >- then indent the lines below it
  Radar sees through clouds, which makes it
  one of the few consistent ways to watch flooding.
tech: [Python, Google Earth Engine]       # a short list on one line
highlights:                               # a longer list: one "- " per item
  - value: ~69%
    text: Pooled accuracy across 10 states.
```

- **Indentation matters.** Use spaces, never tabs, and line up fields under the same entry.
- **Each entry in a list starts with `- `.** The fields after it are indented to line up with the first one.
- **Order on the page = order in the file.** Move an entry up or down to reorder it.
- **To hide a link**, leave it empty: `x:`
- **Quotes:** if a value contains `: ` or starts with a special character like `#`, `@`, `[` or `*`, wrap it in quotes: `note: 'Result: still in review'`. Write a year on its own in quotes too: `dates: '2027'`.
- `#` starts a comment, which never shows on the site.

## Common tasks

**Add a role.** Copy an existing entry in `experience.yml` (from its `- ` line to the line before the next `- `), paste it where you want it, and change the text. Under `now:` it shows in Now; under `past:` it shows in Past.

**Move a role from Now to Past.** Cut the entry from under `now:` and paste it under `past:`.

**Add an experiment.** Copy an entry under `experiments:` in `projects.yml` and edit it.

**Add a map project.** Copy an entry under `map:`. Each project needs at least one place:

```yaml
    places:
      - label: Baltimore, MD
        meaning: What this point represents (for example, the study area).
        lat: 39.29        # find coordinates by right-clicking a spot in Google Maps
        lng: -76.61
        zoom: 10          # 4 = continent, 7 = state, 11 = city
```

Add `extent: [[south, west], [north, east]]` to draw a dashed box around an area.

**Add your résumé.** Put the PDF in the `public/` folder (say `public/resume.pdf`), then in `profile.yml` set `resume: resume.pdf`. A Résumé link appears in the hero.

## If something goes wrong

If a file has a mistake, the page (or the build) shows a message like:

```
content/experience.yml → now → entry 1: "role" is required.
```

It names the file and the entry. Fix that line and save. If the message says the file "could not be read", look for a tab, a broken indent, or a value with `: ` in it that needs quotes.
