# PERSONALITY 开发说明

当前仓库采用 pnpm workspace + Turborepo + TypeScript 的 Monorepo 结构。

## 目录

```text
personality/
├─ apps/
│  ├─ web/            # React + Vite Web
│  ├─ extension/      # Manifest V3 浏览器插件
│  ├─ server/         # Hono API Server
│  └─ cli/            # Node.js CLI
├─ packages/
│  ├─ shared/         # 公共类型、常量
│  ├─ api-client/     # 多端统一 API Client
│  └─ config/         # 共享 TypeScript 配置（非 workspace package）
├─ doc/
├─ pnpm-workspace.yaml
└─ turbo.json
```

## 环境要求

- Node.js >= 20.19
- pnpm 10

## 安装

```bash
pnpm install
```

## 启动

全部启动：

```bash
pnpm dev
```

默认端口：

- Web: `http://localhost:5173`
- Extension dev page: `http://localhost:5174`
- Server: `http://localhost:3001`

单独启动：

```bash
pnpm --filter @personality/server dev
pnpm --filter @personality/web dev
pnpm --filter @personality/extension dev
pnpm --filter @personality/cli dev -- doctor
```

## 浏览器插件

```bash
pnpm --filter @personality/extension build
```

在 Chrome / Edge 扩展管理页开启开发者模式，然后加载：

```text
apps/extension/dist
```

当前开发 Manifest 仅授权访问：

```text
http://localhost:3001/*
```

接生产 API 时需要同步调整 `manifest.json` 的 `host_permissions`。

## CLI

Phase 0 当前只提供工程连通性命令：

```bash
pnpm --filter @personality/cli dev -- doctor
```

后续再实现：

```text
personality login
personality add
personality ask
personality today
personality records
```

## 环境变量

参考 `env.example`：

```text
PORT=3001
PERSONALITY_API_BASE_URL=http://localhost:3001
VITE_API_BASE_URL=http://localhost:3001
VITE_WEB_URL=http://localhost:5173
```

## 工程检查

```bash
pnpm typecheck
pnpm build
pnpm lint
pnpm format:check
```

## 当前阶段

目前实现范围为 Phase 0：Monorepo 工程骨架。数据库、鉴权、Record API、Mastra Agent 属于后续阶段。
