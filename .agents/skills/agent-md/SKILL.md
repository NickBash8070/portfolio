---
name: agent-md
description: Project skill for the Portfolio website in the `Portfolio` folder. Use when continuing work on the landing page, legal pages, brief flow, case pages, or the shared visual system in `index.html`, `styles.css`, `script.js`, `brief/`, `case-live/`, `contacts/`, `privacy/`, `terms/`, and `personal-data-consent/`. Use when Codex needs to recover the current state of the site, preserve the established premium/editorial direction, verify the page in a browser, or adjust typography and font pairing without breaking Cyrillic support.
---

# Agent Md

Continue this portfolio as an existing design system, not as a blank-slate redesign. Recover the current visual state first, then make changes that keep the site premium, calm, and editorial.

## Quick Start

1. Start in the project root and inspect `index.html`, `styles.css`, and `script.js` before changing anything.
2. Treat `brief/`, `case-live/`, `contacts/`, `privacy/`, `terms/`, and `personal-data-consent/` as live parts of one portfolio ecosystem, not unrelated pages.
3. Use `.agents/` as a checkpoint archive: screenshots in that folder reflect earlier visual passes and help determine what changed or regressed.
4. Verify the page in a browser after meaningful visual edits. Check both the first screen and at least one lower section.
5. If the task is mainly visual polish or layout refinement, combine this skill with `frontend-design` and `high-end-visual-design`. If the task is a UI audit, also combine it with `web-design-guidelines`.

## Project Map

- `index.html`: main landing page structure
- `styles.css`: main design language, layout, motion, type scale, responsive behavior
- `script.js`: reveal states, menu behavior, case filtering, footer reveal, time block
- `brief/`: brief flow pages
- `case-live/`: case-study demo pages
- `legal.css` plus legal folders: legal page system
- `.agents/`: screenshots and visual checkpoints from earlier iterations

## Working Mode

Treat this site as an editorial business portfolio with a premium freelance tone.

- Preserve the current calm green-black palette unless the task explicitly asks for a new direction.
- Prefer stronger hierarchy, cleaner spacing, and better contrast over adding more decorative effects.
- Fix readability or structure regressions before introducing new motion or texture.
- Keep changes intentional. Do not drift toward generic SaaS styling or template-like layouts.
- Reuse existing classes and variables when possible instead of scattering one-off overrides.

## Typography

Read [references/fonts.md](./references/fonts.md) before changing fonts, type scale, or text density.

Default typography rules for this project:

- Use `Cormorant Garamond` for display/editorial headings and key premium accents.
- Use `Manrope` for body copy, navigation, controls, pricing, labels, and utility text.
- Keep Cyrillic support mandatory for any replacement.
- Avoid adding a third font unless the user explicitly asks for a typography experiment.
- Keep buttons and navigation in the sans family even when large headings use a serif.

## Visual QA Checklist

After visual edits, check these areas:

- hero contrast and first-screen readability
- sticky/fixed header behavior on load and after scroll
- reveal animations and whether content stays visible without timing glitches
- case filter buttons in the work section
- package cards and CTA readability
- brief block, footer reveal, and legal links
- mobile menu and small-screen spacing
- legal/brief/case pages if shared styles or font imports were touched

## Change Priorities

Prioritize changes in this order:

1. Broken visibility, contrast, spacing, or interaction regressions
2. Typography and hierarchy fixes
3. Layout cleanup across desktop and mobile
4. Motion and polish improvements
5. New sections or aesthetic experiments

## Notes

- If the site looks visually empty in browser review, inspect contrast, opacity, reveal states, and oversized section heights before assuming content is missing.
- If typography changes affect the whole site, verify the main page plus at least one inner page that imports the same fonts.
- Keep the result feeling authored and premium, not busy.
