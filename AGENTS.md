# PERSONALITY Agent Rules

## 1. Documentation source of truth

PERSONALITY uses two local workspaces with different responsibilities:

- Code repository: `D:\fork\personality`
- Obsidian Vault: `D:\obsidian\personality`

Obsidian is the source of truth for product knowledge and project decisions.

The Git repository is the source of truth for implementation.

Do not maintain duplicate requirement, architecture, ADR, product-design, or task-planning documents in both places.

## 2. What belongs in Obsidian

Write or update Obsidian for:

- Product requirements and version scope
- User scenarios and product decisions
- Architecture and data-flow decisions
- ADRs and technology-selection decisions
- UI / UX / OpenDesign discussion notes
- Epic, milestone, backlog, and planning state
- Unconfirmed ideas and discussion notes

Current Obsidian structure:

```text
D:\obsidian\personality
├── 00-项目首页.md
├── 01-需求/
├── 02-产品设计/
├── 03-架构/
├── 04-技术决策/
├── 05-设计/
├── 06-任务/
└── 99-Inbox/
```

When a note does not yet have a clear category, put it in `99-Inbox` instead of inventing a new structure immediately.

## 3. What belongs in the Git repository

Keep documents in the repository when they are tightly coupled to implementation, such as:

- README and contributor instructions
- Local-development commands
- Environment-variable documentation
- API usage that must track code exactly
- Build, test, release, deployment, and operations documentation
- Generated code-facing schemas or implementation references

Do not add new product requirement documents under `doc/` unless explicitly requested.

## 4. Required workflow before implementation

When a coding task depends on product intent, architecture, a prior decision, or task scope:

1. Read the relevant Obsidian note first.
2. Treat the current Obsidian content as authoritative unless the user explicitly changes the decision in the conversation.
3. Implement in `D:\fork\personality`.
4. If implementation changes the agreed requirement, architecture, ADR, or task state, update the corresponding Obsidian note in the same workflow.

Examples:

- Requirement change → update `01-需求`
- Product behavior change → update `02-产品设计`
- Architecture change → update `03-架构`
- Technology choice / tradeoff → update `04-技术决策`
- Design decision → update `05-设计`
- Milestone / backlog / completion state → update `06-任务`

## 5. Synchronization rules

Synchronization means keeping knowledge and implementation consistent; it does not mean copying the same Markdown file between Git and Obsidian.

After meaningful implementation work, check whether any of the following changed:

- Accepted behavior or scope
- Public product flow
- Data model or system boundaries
- External dependency or technology choice
- Multi-client architecture
- Delivery phase, Epic, or backlog status

If yes, update Obsidian.

If no product or architectural knowledge changed, do not create unnecessary documentation updates.

## 6. Decision recording

For meaningful technical decisions, create or update an ADR under `04-技术决策`.

Preferred naming:

```text
ADR-001-决策名称.md
```

An ADR should normally record:

- Context
- Decision
- Alternatives considered
- Why this option was chosen
- Consequences / tradeoffs
- Status

Do not create an ADR for trivial implementation details.

## 7. Authoritative V1 docs

The V1 product documentation lives only in Obsidian. Do not recreate a duplicate requirement document under `doc/`.

The authoritative V1 documents are:

```text
D:\obsidian\personality\01-需求\V1-需求.md
D:\obsidian\personality\03-架构\V1-整体架构.md
D:\obsidian\personality\04-技术决策\
D:\obsidian\personality\06-任务\V1-开发计划.md
```

## 8. User-facing shorthand

Interpret requests such as the following as permission to work across both configured workspaces when needed:

- “看 Obsidian 里的需求继续做”
- “同步到 Obsidian”
- “记录这个决定”
- “把任务状态更新一下”
- “检查文档有没有过期”

When the user makes a new confirmed product or technical decision during a discussion, prefer recording it in the correct Obsidian note rather than leaving it only in chat.
