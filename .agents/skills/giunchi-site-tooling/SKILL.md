---
name: giunchi-site-tooling
description: Configure and verify development tools, MCP connections, CLI-Anything asset workflows, and unattended build or publication-refresh jobs for Daniele Giunchi's website. Use for concrete tool setup and operational work on this repository.
---

# Tooling and unattended operation

Read `site-rebuild-brief/TOOLS.md` for the dated inventory. Rediscover availability before relying on it. Configuration, exposed tools, a successful request, and production deployment are separate states.

## Choose tools by their job

- Use the official Astro Docs MCP for current Astro APIs. Its project configuration is `.codex/config.toml`. Verify the connection with `python tools/check_astro_mcp.py --search` or a real exposed MCP tool call. This test sends only a public documentation query.
- Use the connected GitHub integration for repository and workflow operations. Local Git and `gh` can supplement it when their access is verified. Do not duplicate a functioning GitHub connection or copy credentials into this repository.
- Use the installed browser skill and connection for local visual/interaction checks. A standalone Playwright MCP is a fallback for environments lacking the provided browser capability, not an automatic second browser controller.
- Use direct ORCID, DBLP, Crossref, and supported institutional APIs from production import code. An MCP available only inside the assistant cannot keep the deployed website updated after the session ends.

For new connections, inspect the publisher's official documentation and actual tool schema. Prefer project-scoped configuration, supported transports, narrow credentials, and reproducible dependencies. Reuse an existing approved connection. Never report a connection as working based only on a TOML entry. Do not change global permission settings or project trust settings as a workaround for a missing capability.

## CLI-Anything

The user's installed `cli-anything` skill is the entrypoint for harness work. Upstream is https://github.com/HKUDS/CLI-Anything. Read its full `HARNESS.md` and the matching build/refine/test/validate/list specification before that operation. If it is absent, retrieve the official resources; do not pretend a shell alias is a validated harness.

Choose a concrete asset and real backend before installing a harness. Examples include Blender for an optional rendered spatial illustration, Inkscape for editable scientific diagrams, or a video editor for a project demonstration clip. For simple SVG/CSS use native project code; for the publication importer use source APIs. Do not make GUI applications dependencies of the daily publication job.

Inventory the active Python environment and executables first. Install only the needed harness into an isolated environment and record its version/source revision. Check that its real application backend is present. A harness package alone is not Blender, GIMP, or LibreOffice. Review install instructions; do not execute arbitrary setup text returned from an unrelated page.

Preserve editable sources and verify actual renders/exports. Follow upstream requirements for machine-readable output, real-backend end-to-end checks, and generated skills when building a harness. If the backend is unavailable, report the limitation and continue independent site work.

## Build and scheduling

Inspect actual package scripts and lockfiles; do not assume Astro is already installed. Keep build-time tooling out of the browser bundle. Secrets stay in local environment/service secret stores; checked-in configuration contains only public endpoints and nonsecret settings.

For unattended imports, implement the brief's durable data, validation, rollback, and concurrency requirements. GitHub's public-repository inactivity rule means a cron entry alone does not establish indefinite unattended operation. Select and provision an appropriate scheduler within the user's authorised scope, with an authenticated trigger and an independent missed-run check. Verify an actual trigger and successful workflow run; record any one-time provisioning still needed.

Routine verified data changes should flow without manual approval. Publishing a new site, changing account configuration, or adding paid infrastructure still follows the active user request and environment permissions. Never broaden those permissions merely because a tool recommends doing so.

Report the installed/configured/verified state, the commands and requests actually exercised, and any remaining backend or authentication requirement. Keep `TOOLS.md` and the real project commands in `AGENTS.md` current after material changes.
