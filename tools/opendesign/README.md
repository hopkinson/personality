# OpenDesign MCP bridge

This folder lets the Personality monorepo talk to the local OpenDesign stdio MCP server without routing through Codex.

## Local setup

1. In OpenDesign, open **Settings → MCP server** and copy the generated JSON configuration.
2. Save it at the repository root as `.opendesign.mcp.local.json`.
3. Run:

```bash
pnpm od:test
```

The local config file is git-ignored because it contains machine-specific absolute paths.

## Commands

```bash
pnpm od:test
pnpm od:tools
pnpm od:call -- get_artifact "{}"
pnpm od:call -- search_files '{"query":"dashboard"}'
```

`od:test` connects over stdio and verifies the read tools expected from OpenDesign: `search_files`, `get_file`, and `get_artifact`.

## Windows + CodexPro / WSL

CodexPro may execute repository commands with Linux Node under WSL. The client automatically converts only the Windows executable path (for example `D:\...\Open Design.exe`) to its `/mnt/d/...` form. OpenDesign arguments and environment values remain Windows-formatted because they are consumed by the Windows OpenDesign process.
