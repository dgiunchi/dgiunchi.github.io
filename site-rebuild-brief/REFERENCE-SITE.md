# Massimiliano Di Luca reference assessment

Inspected 13 September 2026. Reference: https://massimilianodiluca.info/.

## Verified mechanics

- The deployed homepage HTML declares `Wowchemy 5.2.0 for Hugo` in its generator metadata. The footer credits Wowchemy. This identifies the deployed theme, not a required framework for Daniele's rebuild.
- Selected publication rows contain local Hugo-processed `featured_*.jpg` thumbnails, authors, dates, venues, and links to individual paper pages.
- `__dimensions_badge_embed__` spans use DOI identifiers, `small_circle`, a hover legend and hidden zero counts. The script is served by `https://badge.dimensions.ai/badge.js`.
- `altmetric-embed` elements use DOI identifiers and donut badges, with the provider embed script. These are online attention indicators, not citation counts.
- Selected and recent publications are distinct homepage sections. Their presence does not establish unattended discovery of new papers.
- Public repositories under https://github.com/maxdiluca were inspected. Candidate older Academic repositories were not confidently matched to the active deployment. The `starter-academic3` workflow named Updater (WIP) reads the Wowchemy blog feed into a README; it is not evidence of a scholarly publication import. The active site's automatic new-paper import mechanism remains unverified.

## Section-by-section adaptation

| Reference area | Daniele adaptation and status |
| --- | --- |
| Biography, interests, education | Preview retains Birmingham role and astronomy, computer science, optics and quantum information background. |
| Research leadership and infrastructure | Include only verified Daniele roles; do not copy Di Luca's leadership claims. |
| Research topics and keywords | Preview theme links activate matching publication filters. Full implementation should derive accurate counts from its canonical bibliography. |
| Projects and resources | Preview includes DreamCodeVR, PaintBranch, STREAMSPACE and the quantum holography thesis. |
| Selected publications | Preview has five static records, three authentic project/paper thumbnails, citation text with copy controls, and Dimensions embeds for four verified DOIs. Two records use typographic tiles because no verified local figure was selected. |
| Recent publications and publication archive | Production requirement: automatically derive these from the complete canonical dataset. Preview remains a selection and links to ORCID. |
| Individual publication pages | Required for production, with verified resources, related versions and BibTeX. Preview links to publishers/repositories instead. |
| Media and impact | Omit until Daniele-specific evidence is available. Do not generate impact claims from citation numbers. |
| Opportunities | Do not relabel 2025 recruitment announcements as open. Current openings need verified dates/status. |
| Teaching and supervision | Preview leads with owner-confirmed current teaching of Intelligent Interactive Systems and Visualization at the University of Birmingham (confirmed 13 September 2026), followed by dated selected UCL teaching and past student projects, with links to the legacy archives. |
| Experience | Preview adds UCL Research Associate history, the Microsoft internship and Max Planck research visit, preserving known date precision. |
| Funding | Preview includes the documented Marie Curie doctoral support. OpenLab and Network+ internal funding details remain pending the requested Outlook verification. No private emails or guessed award details have been inserted. |
| Awards | Preserve only independently verified Daniele awards during migration; no reference-owner awards copied. |
| Contact | Birmingham professional email and scholarly profile links retained. |

## What is automatic in the preview

Dimensions loads citation metrics on page visits when the provider returns them. During the local check, DreamCodeVR returned and visibly rendered 59 citations. This is a transient observed result, not a hardcoded number or a Google Scholar count. The three other DOI badges did not display a count; missing values are not represented as zero. The Campfire entry retains its verified repository link without an unverified DOI badge.

The publication list itself is static HTML. There is no publication importer, production build, scheduled refresh, or new-paper deployment job yet. Astro + TypeScript remains the proposed implementation, with daily ORCID/DBLP discovery and Crossref enrichment. A theme switch alone would not provide this automation.

New papers must be able to appear without an image. Preserve owner-selected images as overrides; attempt automatic imagery only from permitted and correctly associated sources. Do not assume Google Scholar provides the illustrated cards.

## Local verification

- Desktop 1440px and phone 390px inspected; no horizontal overflow.
- All local images loaded after triggering lazy loading.
- Search, empty state, topic navigation, citation copying and expanded phone navigation passed.
- Live Dimensions response and visible DreamCodeVR badge checked.
- No JavaScript page errors in the interaction check.
- Blocking Dimensions and disabling JavaScript both preserve all five bibliography entries.
- Reduced motion starts paused; dark mode at 390px and the 320px layout have no horizontal overflow.
- Browser integration still cannot initialize because of the existing Windows sandbox setup failure; verification used an isolated headless Edge session for this public local preview.

## Primary references

- [Reference homepage](https://massimilianodiluca.info/)
- [Reference publication archive](https://massimilianodiluca.info/publication/)
- [Example individual publication](https://massimilianodiluca.info/publication/bhatia-2025-text/)
- [Dimensions embed documentation and individual research use](https://badge.dimensions.ai/)
- [Altmetric badges](https://www.altmetric.com/solutions/altmetric-badges/)
- [Google Scholar profile updates](https://scholar.google.com/intl/en/scholar/citations.html)
- [Daniele's institutional biography](https://www.birmingham.ac.uk/staff/profiles/computer-science/academic-staff/giunchi-daniele)
- [Daniele's legacy content](https://dgiunchi.github.io/)
