---
name: giunchi-site-design
description: Design, implement, or review Daniele Giunchi's academic website, including research narrative, legacy content migration, responsive layouts, and accessibility. Use for this site's UI and content work, not for publication import logic alone.
---

# Design and migrate the academic site

Resolve paths from the repository root. Read `site-rebuild-brief/REBUILD-PROMPT.md` for the active product brief and inspect the actual implementation before editing. Use this skill to perform the requested design work; do not expand a prompt-writing task into implementation.

## Identity and content

Start with Daniele's current institutional profile and the old site's historical content. Verify current appointments and contact details. Present XR, HCI, AI, multimodal interaction, collaborative environments, and graphics as the main research story. Give astronomy and quantum optics a clear place in the education narrative and visual language without suggesting they are the focus of every current project.

Inventory active legacy content, local downloads, paper images, and section anchors before migration. Commented-out placeholders are not automatically published content. Preserve valid assets and dates; resolve `TODO` links or omit unavailable buttons. Keep dated teaching and supervision records distinguishable from current opportunities. Record unresolved factual conflicts for the owner instead of filling gaps with invented facts.

Use the source links and verified identity anchors in the brief. Do not infer impact, publication acceptance, recruitment eligibility, or awards from a title or image. Credit and link sourced research material appropriately.

## Design decisions

Use `site-rebuild-brief/portrait.png` as the supplied portrait. Preserve the original and its pixel texture. Prefer off-white, charcoal, and restrained blue/teal accents derived from the portrait; evaluate contrast rather than assuming palette colours are accessible.

Give the homepage a clear opening composition: name, verified role, a short research statement, portrait, research/publication links, and contact. Choose typography and spacing before adding decorative effects. Research examples should explain the question, contribution, and supporting publication in plain language. Distinguish curated selected work from automatically selected recent publications.

A small spatial or optical motif may support the research identity. Use native SVG/CSS for simple vector visuals. Use image generation for requested new raster illustration or edits in accordance with the available image skill; preserve academic evidence. Use CLI-Anything only when a concrete asset needs a real application backend, following `giunchi-site-tooling`.

Build semantic HTML with readable content at mobile widths and without JavaScript. Add progressive filters and theme controls only where useful. Preserve focus visibility, meaningful link names, reduced motion, touch targets, and informative image alternatives. Avoid auto-playing media and decorative elements covering text.

## Verification

Use the connected browser and its installed skill for interactive inspection. Inspect the local preview at a narrow phone width and a desktop width, including long publication titles and author lists. Verify keyboard navigation, focus after filtering, no-results states, image loading, and old anchor/download URLs. Automated accessibility checks supplement visual and keyboard inspection.

Report what changed, which content was migrated, what was actually verified, and any unresolved source conflicts. A successful build does not by itself establish visual quality. Update migration documentation when URLs or content structure change.
