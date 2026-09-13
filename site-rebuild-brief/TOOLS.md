# Tools for the website rebuild

Checked on 13 September 2026. This inventory records the current development setup; it does not claim the website or daily publication pipeline has been implemented.

## Configured and available

| Capability | Selection | Verified state | Intended use |
| --- | --- | --- | --- |
| Astro documentation | Official Astro Docs MCP | Added to project `.codex/config.toml`; Codex recognises it; initialisation, tool discovery, and a real search passed | Current Astro APIs, content collections, static generation and deployment |
| GitHub | Existing connected GitHub integration | Repository metadata request for `dgiunchi/dgiunchi.github.io` succeeded; default branch is `main` | Repository inspection, review, and workflow diagnosis |
| Browser inspection | Installed Browser / Chrome skills and runtime | Available in this session; no browser interaction was needed for this briefing task | Local preview, responsive inspection, keyboard checks, screenshots |
| CLI-Anything | Existing personal Codex skill | Entry point and list specification read; no application harness distributions or executables found in the active Python/PATH inventory | Discover, build, refine or validate a harness when an asset needs a real application |
| Terminal tools | Python, Node.js, npm, Git and GitHub CLI | Executables found; Python helper executed successfully | Local code, data scripts, dependencies and tests |
| Scholarly sources | Direct ORCID, DBLP, Crossref and optional institutional APIs | Source strategy researched; production adapters are not implemented | Unattended publication imports independent of the desktop assistant |

Application-provided GitHub and browser tools need not appear in `codex mcp list`; that command lists locally configured MCP servers. The GitHub integration was exercised directly. Do not create a second account connection just because the inventories differ.

## Astro MCP connection

The project uses the official endpoint through native Streamable HTTP:

```toml
[mcp_servers.astro_docs]
url = "https://mcp.docs.astro.build/mcp"
enabled = true
enabled_tools = ["search_astro_docs"]
startup_timeout_sec = 30
tool_timeout_sec = 60
```

The endpoint comes from [Astro's AI tooling documentation](https://docs.astro.build/en/guides/build-with-ai/). Project configuration and HTTP transport are documented in [OpenAI's MCP guide](https://learn.chatgpt.com/docs/extend/mcp?surface=cli). Project configuration applies in trusted projects. This setup did not change trust or global permission settings.

Reproduce the read-only checks from the repository root:

```powershell
codex mcp get astro_docs
python tools/check_astro_mcp.py --search
```

The first command verifies that Codex loads the configuration. The Python helper independently initialises the connection, enumerates tools, and calls `search_astro_docs` using the discovered schema. It sends only a generic public documentation query. A passing protocol check does not mean the running task has refreshed its tool catalog; use a fresh session if the new tool is not exposed yet.

The check returned server `Astro Docs server` version `1.0.0`, protocol `2025-03-26`, and a successful search on 13 September 2026. See [tool-verification.json](tool-verification.json). No API key was required by the tested endpoint. The helper uses Python's standard library.

## CLI-Anything selection

The [official CLI-Anything repository](https://github.com/HKUDS/CLI-Anything) provides a Codex skill and application harness workflows. Its builder skill is already installed here and was not reinstalled. Application harnesses are a separate layer and require the real application backend for rendering or export.

| Possible deliverable | Candidate | Decision |
| --- | --- | --- |
| Rendered spatial or optical illustration | Blender harness | Use if the design needs an original scene; preserve editable sources and verify the render |
| Editable vector diagram | Inkscape harness | Use for application-level editing; simple web SVG can be authored directly |
| Research demonstration clip | A supported video-editor harness | Use when a source clip and concrete edit are part of the task |
| Downloadable CV or document | LibreOffice harness | Consider when a document is requested and existing document tools do not fit |
| Publication imports | Direct APIs and project scripts | GUI harnesses add no benefit to bibliography discovery |

No GUI application or harness was installed just to prepare this brief. When needed, read the installed CLI-Anything skill's full methodology and matching mode, verify the upstream harness and backend, use an isolated environment, and record the tested version. Do not require desktop applications in the daily publication job.

## Other MCPs researched

- [GitHub's official MCP server](https://github.com/github/github-mcp-server) is an option for an environment without the existing connector. This environment already has working repository access, so a second GitHub MCP was not configured.
- [Microsoft Playwright MCP](https://github.com/microsoft/playwright-mcp) supports browser automation. The supplied browser integration covers interactive inspection here. Follow its installed skill first; add another controller only for a demonstrated gap. CI browser tests can run without an assistant MCP.
- Additional design, document, or hosting connectors should serve a concrete implementation need. No extra account, paid plan, or third-party scholarly MCP was connected in this setup.

Agent tool access is separate from production automation. The future unattended process must fetch source APIs, persist data, validate, build, and deploy without a running Codex session. Its scheduler needs verified inactivity behaviour, authentication, and missed-run detection.

## Project instructions and validation

[AGENTS.md](../AGENTS.md) provides project conventions. [SKILLS.md](../SKILLS.md) indexes the three project skills in `.agents/skills/`, the repository discovery location described by [OpenAI's skills documentation](https://learn.chatgpt.com/docs/build-skills).

All three skill files passed the installed Skill Creator `quick_validate.py` check. Their instructions distinguish current capabilities from planned implementation, keep source ingestion independent of design tooling, and preserve the user's active task scope.
