# Portfolio Typography

Use this reference when changing fonts, hierarchy, or text density in the Portfolio site.

## Current Base Pair

- Display / editorial headings: `Cormorant Garamond`
- Body / UI / navigation / labels: `Manrope`

This pair is already wired into the main page and supporting pages through Google Fonts imports. Keep it as the default unless the user explicitly asks for a new direction.

## Rules

- Preserve Cyrillic support. Do not introduce a font that breaks Russian text.
- Keep a two-family system by default: one display serif and one clean sans.
- Use the serif for H1/H2-style statements, premium accents, or editorial emphasis.
- Use the sans for paragraphs, buttons, navigation, cards, prices, legal copy, and form UI.
- Avoid reducing contrast by relying on ultra-thin weights over textured or dark backgrounds.
- If the hero already has a complex background, improve size, line-height, spacing, or contrast before swapping the font family.

## Do Not Use

- `Inter`
- `Roboto`
- `Arial`
- `Helvetica`
- `Open Sans`

These push the site toward a generic product look and weaken the editorial character.

## Safe Replacement Paths

Only replace the base pair when the user explicitly asks for a typography refresh.

### Keep the same mood

- `Cormorant Garamond` + `Manrope`
- `Literata` + `Manrope`
- `Prata` + `Manrope`

### Make the UI cleaner but still premium

- `Cormorant Garamond` + `Onest`
- `Cormorant Garamond` + `Plus Jakarta Sans`

Before using any replacement, confirm that Cyrillic glyphs and required weights are available.

## Practical Checks

After typography edits, verify:

- hero headline is readable on first load
- nav and CTA text remain crisp at small sizes
- prices and card headings still scan quickly
- legal pages do not become too dense
- mobile line breaks feel intentional rather than cramped
