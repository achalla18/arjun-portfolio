# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: admissions reviewers for the **Horowitz Andreessen Academy**, whose application requires a personal portfolio website. They are assessing whether the applicant is "already in motion": agency (work started without being assigned) and proof of work (tangible things that can be examined). They skim many portfolios, so in about a minute they should come away with two things:

1. **Arjun builds real things.** Working software and systems, not coursework.
2. **Arjun does serious spatial research.** Real research roles on geospatial problems (UMD Hanan Samet Lab, Yale Humanitarian Research Lab, NC State, a Palantir Valley Forge grant).

Secondary (unconfirmed, not a design driver): other programs, labs, or recruiters the link may be shared with later.

## Product Purpose

A single-page personal portfolio for Arjun Challa, a high school student, researcher, and builder, and founder of Geovaro Intelligence. It tells the story of who he is and what he has built, so a reviewer quickly understands his trajectory and can inspect the work. Success is a reviewer who remembers him as a builder doing real spatial research and can click through to evidence.

## Positioning

A student whose work sits at a specific intersection: computation applied to the physical world. Satellite flood mapping in South Sudan, road-flood risk in Maryland and Raleigh, and spatial pattern-matching algorithms, plus a body of independently built software. The map-centered presentation exists because the work itself is spatial.

## Operating Context

- Reviewed in a desktop browser alongside an application; also viewable on phones.
- Reviewers reward agency, proof of work, ambition grounded in a specific pursuit, curiosity that changed the work, persistence with judgment, collaboration, and authentic communication.
- The Academy permits AI help for brainstorming but asks applicants to write their own story in their own words. Interviews may probe any claim.

## Capabilities and Constraints

- Static site: Vite + React + TypeScript, plain CSS, Leaflet; deployed to GitHub Pages via GitHub Actions. No backend, accounts, or paid services.
- Content lives in `src/data/` (profile, projects, experience); popups for every entry, no separate pages.
- The owner prefers a minimal, story-level presentation over deep technical write-ups (decided 2026-10-14). Note: the Academy's guidance favors *inspectable* evidence (repos, demos, screenshots, figures) and a clear "what I personally did" — keep content short, but make proof one click away.
- Label each project's real status: idea, prototype, evaluated research, in development, or deployed.
- **Framing:** the owner wants confident, assertive framing and no timid hedging. Facts, numbers, roles, and affiliations still come only from the résumé or the owner; never invent results, users, awards, or ownership. Distinguish personal contribution from a group's result.
- Contact links in the hero: LinkedIn and email (GitHub appears on individual projects). Undecided: whether to publish the résumé PDF and real screenshots or figures.

## Brand Commitments

- Name: Arjun Challa. Headline: "Building Intelligence for the Physical World."
- Intro: "Founder of Geovaro Intelligence. I build systems to understand, predict, and solve complex real-world problems."
- Geovaro is prominent but secondary to Arjun's own identity; this is a personal portfolio, not a company site.
- Voice: grounded and direct; no "passionate innovator"-style phrasing.

## Evidence on Hand

- Résumé: `Downloads/LOR Arjun Challa Resume (1).pdf` (source of truth for facts and numbers).
- Public repos (verified) shown on the site: KalView, webml-resume, agri-impact. MedMind, Simple Proctor, and Hi-Lite were removed from the site by the owner (2026-10-14); don't re-add them unasked. SPM research code exists publicly (`spm-benchmark-algo`) but is intentionally not linked yet.
- KalView demo: https://kal-view.vercel.app/ — as of 2026-10-14 it loads but shows "API key required" map tiles and no data; don't call it live until fixed.
- Absent, never fabricate: screenshots or figures from the Yale, UMD, NC State, or Palantir work; publications; users or customers; awards beyond the Valley Forge grant.

## Product Principles

1. **Proof over adjectives.** Every claim points to something a reviewer can inspect or a number from the record.
2. **Show agency.** Make clear what Arjun started, decided, and built himself, especially inside collaborations.
3. **Story in a minute.** Short entries that add up to one trajectory; depth stays one click away.
4. **Confident, not invented.** Assertive framing, true facts.
5. **His voice.** Copy should read like Arjun wrote it; he should revise generated prose into his own words before submitting.
