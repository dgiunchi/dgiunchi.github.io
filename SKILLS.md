# Project skills

The executable skill entrypoints are `SKILL.md` files under `.agents/skills/`. This file is a navigation index, not a substitute for those entrypoints. These skills belong to this repository; the existing personal CLI-Anything skill is reused when relevant.

| Skill | Use for | Example request |
| --- | --- | --- |
| [giunchi-site-design](.agents/skills/giunchi-site-design/SKILL.md) | Site design, research narrative, content migration, browser QA | `Use $giunchi-site-design to implement the homepage from the rebuild brief.` |
| [giunchi-publication-sync](.agents/skills/giunchi-publication-sync/SKILL.md) | Importing and updating publications, matching records, source failures | `Use $giunchi-publication-sync to implement ORCID imports and DOI deduplication.` |
| [giunchi-site-tooling](.agents/skills/giunchi-site-tooling/SKILL.md) | MCP setup, CLI-Anything, tool checks, deployment and scheduling | `Use $giunchi-site-tooling to verify the tools and prepare unattended refresh.` |

Codex documents repository skill discovery in [Build skills](https://learn.chatgpt.com/docs/build-skills). If a running session has not refreshed its skill catalog, open a fresh session in this repository or explicitly read the linked entrypoint. The project's [AGENTS.md](AGENTS.md) provides the same routing.
