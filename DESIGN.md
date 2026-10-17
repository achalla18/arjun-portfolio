---
name: Arjun Challa — Portfolio
description: Building Intelligence for the Physical World.
colors:
  night-slate: "#0F172A"
  deep-panel: "#162033"
  raised-slate: "#1E293B"
  contour-line: "#334155"
  survey-gray: "#94A3B8"
  reading-slate: "#CBD5E1"
  chalk-white: "#F8FAFC"
  route-blue: "#7DD3FC"
typography:
  display:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 9.5vw, 6rem)"
    fontWeight: 650
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3.2vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2.4vw, 1.625rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  hairline: "2px"
  md: "6px"
  lg: "10px"
  pill: "999px"
spacing:
  sm: "8px"
  md: "18px"
  lg: "24px"
  xl: "48px"
  gutter: "clamp(20px, 5vw, 48px)"
  section: "clamp(80px, 11vw, 136px)"
components:
  text-link:
    textColor: "{colors.reading-slate}"
    typography: "{typography.body}"
    padding: "6px 0"
  text-link-hover:
    textColor: "{colors.chalk-white}"
  list-row:
    textColor: "{colors.chalk-white}"
    typography: "{typography.body}"
    padding: "18px 0"
  list-row-hover:
    backgroundColor: "{colors.deep-panel}"
    rounded: "{rounded.md}"
  segmented-control:
    backgroundColor: "{colors.deep-panel}"
    textColor: "{colors.survey-gray}"
    rounded: "{rounded.pill}"
    height: "38px"
  segmented-control-active:
    backgroundColor: "{colors.raised-slate}"
    textColor: "{colors.chalk-white}"
  map-marker:
    backgroundColor: "{colors.reading-slate}"
    size: "9px"
    rounded: "{rounded.pill}"
  map-marker-selected:
    backgroundColor: "{colors.route-blue}"
    size: "11px"
  dialog:
    backgroundColor: "{colors.night-slate}"
    textColor: "{colors.reading-slate}"
    rounded: "{rounded.lg}"
    width: "600px"
---

# Design System: Arjun Challa — Portfolio

## Overview

**Creative North Star: "The Night Atlas"**

The site reads like a dark cartographic plate: a deep slate field, faint contour lines and coordinate grids, and one highlighted route in pale sky blue. Everything that isn't the work recedes. Type and hairlines carry the structure, and the map, real or schematic, is the only place the page allows itself ornament.

Density is low and editorial. A large name, one headline, short paragraphs, then single-line lists separated by hairlines, each opening a short popup. There are no cards, no tags, and no decorative imagery. Visuals appear only where the subject is spatial: the hero's contour plate, the interactive map, and the algorithm canvas.

**Key Characteristics:**
- One dark slate field with tonal (not shadowed) layering.
- A single accent, Route Blue, reserved for map signals and interaction states.
- Geist for everything readable; IBM Plex Mono only for dates and metadata.
- Hairline dividers and generous vertical space instead of containers.
- Cartographic motifs (contours, grids, dashed extents) only on genuine map or coordinate surfaces.

## Colors

A cool, nearly monochrome slate palette with one pale-blue signal color.

### Primary
- **Route Blue** (#7DD3FC): the highlighted route on the map. Used for selected map markers and extents, the hero plate's points, matched results on the algorithm canvas, focus rings, and hover underlines. Never as a fill for large areas, text blocks, or decoration.

### Neutral
- **Night Slate** (#0F172A): the page background and the popup surface.
- **Deep Panel** (#162033): one step up. Row hover wash, the map side panel, canvas backgrounds, segmented-control track.
- **Raised Slate** (#1E293B): the active segment and the selected panel item.
- **Contour Line** (#334155): borders, dividers, link underlines at rest, and the hero's contour strokes. A softened version (55% opacity) is used for list dividers.
- **Survey Gray** (#94A3B8): secondary text such as descriptions, dates, captions, and map annotations.
- **Reading Slate** (#CBD5E1): default body text.
- **Chalk White** (#F8FAFC): the name, headings, row titles, and key figures.

### Named Rules
**The One Route Rule.** Route Blue marks the thing being looked at or acted on: a selected place, a focused control, a matched result. If it appears where nothing is selected or interactive, remove it.

**The No Gray-on-Color Rule.** Text sits only on slate neutrals. Never place Survey Gray or any text on a Route Blue fill.

## Typography

**Display Font:** Geist (with system-ui)
**Body Font:** Geist (with system-ui)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace)

**Character:** Geist gives a clean, slightly technical sans with tight tracking at large sizes; Plex Mono adds the faint feel of survey annotations for dates and metadata.

### Hierarchy
- **Display** (650, clamp(3.25rem, 9.5vw, 6rem), 0.92): the name in the hero, followed by a period. Used once per page; 6rem is the ceiling.
- **Headline** (500, clamp(1.5rem, 3.2vw, 2.25rem), 1.18): the hero tagline. Max about 18 characters per line, balanced.
- **Title** (600, clamp(1.375rem, 2.4vw, 1.625rem), 1.15): section headings and popup titles.
- **Body** (400, 1.0625rem, 1.65): paragraphs and row titles (row titles at weight 500). Prose stays under about 75 characters per line (max 36–40rem).
- **Label** (400, 0.75rem, mono): dates, popup metadata, technology lists. Sentence or natural case; no uppercase letterspaced micro-labels.

### Named Rules
**The Mono-Is-Metadata Rule.** IBM Plex Mono is only for dates, numbers, and technical metadata. Headings, labels on controls, and prose are always Geist.

**The 11px Floor Rule.** No functional or readable text below 11px, including map labels and attribution.

## Layout

A single column on a shared left edge. Every section sits in one container (max 1240px plus a fluid gutter of clamp(20px, 5vw, 48px)). Lists and prose are capped at an 860px measure, so text stays left-aligned with the hero name while the map uses the full width.

Sections are separated by large vertical space (clamp(80px, 11vw, 136px)) rather than rules or backgrounds. Each section has only a title (plus an optional one-line subtitle) and a list or paragraph block beneath it.

The hero puts the name and headline high on the left, and the intro and links low on the right (a 1.25 : 0.75 split), sitting over the map's quiet middle without covering its labels. The contour plate is enlarged behind it, bleeding off the right edge and masked so it melts into the page on its left and bottom; it drifts up, blurs, and fades as the page scrolls (scroll-driven animation, static when unsupported or under reduced motion). Below 900px the plate sits low behind the text at half strength and its labels hide. The map explorer is a 2.2 : 1 split (map : panel) that stacks at 920px. Rows collapse their date beneath the title below 640px.

## Elevation & Depth

Flat by default. Depth comes from tonal steps (Night Slate → Deep Panel → Raised Slate) and hairline borders, never from shadows on page content. The single exception is the popup, which floats over a blurred, darkened backdrop.

### Shadow Vocabulary
- **Popup lift** (`box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.7)`): the detail dialog only, over a `rgba(2, 6, 23, 0.7)` backdrop with a 3px blur.

### Named Rules
**The Flat Page Rule.** Nothing on the page itself casts a shadow. If something needs to stand out, give it a tonal step or a hairline, not elevation.

## Shapes

Restrained, slightly softened geometry. Hover washes and small controls use gentle 6px corners; large framed surfaces (the map explorer, the popup) use 10px; segmented controls and markers are fully round. Borders are always 1px. Cartographic shapes such as dashed extents, contour rings and quadtree cells use thin strokes, with dashed lines for anything approximate.

## Components

### Text links
- **Style:** Reading Slate text with a 1px Contour Line underline (via bottom border), no fill.
- **Hover / Focus:** text brightens to Chalk White and the underline turns Route Blue; 2px Route Blue focus ring.
- **Icon:** an optional 14px arrow-up-right for external links.

### List rows (Now, Past, A Few of My Experiments)
- **Style:** full-width buttons with no visible chrome. A Chalk White title (500), an optional one-line Survey Gray description, a mono date on the right, and a dim arrow.
- **Separation:** 55%-opacity Contour Line hairlines between rows.
- **Hover:** a Deep Panel wash with 6px corners that bleeds 14px past the text; the arrow turns Route Blue and nudges up-right by 2px.

### Segmented control
- **Style:** a pill track in Deep Panel with a Contour Line border; segments are 38px tall.
- **Active:** Raised Slate fill, Chalk White text, inset hairline. Used for the Geographic / Algorithm switch and the algorithm steps.

### Map explorer (signature)
- **Frame:** 10px corners, 1px Contour Line border, map and panel separated by a hairline.
- **Basemap:** OpenStreetMap tiles desaturated and tinted toward slate (grayscale, inverted, sepia + hue-rotate, ~70% opacity) over a coordinate-grid fallback.
- **Markers:** a 9px Reading Slate dot with a faint ring; selected becomes 11px Route Blue with a slow pulsing ring and a visible label. Approximate areas are dashed boxes that turn Route Blue when selected.
- **Panel items:** a mono number, a Chalk White title and a Survey Gray location; the selected item gets a Raised Slate fill and a 2px Route Blue left edge.

### Detail popup
- **Style:** a 600px Night Slate dialog with 10px corners and the popup-lift shadow. A sticky round close button sits in the top-right.
- **Content:** a mono meta line, a title, two or three sentences, mono key figures beside short text, a Survey Gray caveat line, then a technology line and text links.
- **Motion:** fades and rises 8px over 0.2s; disabled under reduced motion.

## Do's and Don'ts

### Do:
- **Do** keep every section to a title and a list or a short paragraph block.
- **Do** reserve Route Blue for selection, focus, hover, and map signals (≤ a few small marks per screen).
- **Do** use mono only for dates and numbers, at 0.75rem or larger.
- **Do** separate content with hairlines and vertical space.
- **Do** label any schematic or illustrative visual as such.

### Don't:
- **Don't** add cards, pill tags, badges, or icon tiles to lists.
- **Don't** add shadows to anything except the popup.
- **Don't** use uppercase, letterspaced micro-labels.
- **Don't** add grid or contour backgrounds to surfaces that aren't maps or coordinate canvases.
- **Don't** introduce a second accent color or gradients.
