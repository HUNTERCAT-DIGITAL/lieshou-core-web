# lieshou-core-web · 猎手云前端核心层

> 前端业务逻辑唯一源（开源 · 类比 `lieshou-framework`）：认证 / 工作台 / 审批通用 hooks + zustand 状态。
> **4 端（admin-web/desktop/mobile/mini-program）薄壳装配**——业务逻辑只在此维护，各端注入端口 + 调 hooks。

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-strict-blue" alt="TS strict"/>
  <img src="https://img.shields.io/badge/zustand-4.5-green" alt="zustand"/>
  <img src="https://img.shields.io/badge/License-Apache--2.0-brightgreen" alt="Apache-2.0"/>
</p>

## 设计哲学（对应 lieshou-framework）

```
lieshou-framework（后端业务唯一源）   →  lieshou-core-web（前端业务唯一源）
  端口 UserAuthPort/UserQueryPort    →  StoragePort/NotifierPort/NavigationPort（各端注入）
  Service（业务逻辑）                →  features/* hooks + zustand store
  各服务薄壳装配（Feign/本地 Adapter）→  4 端 configureCore + 调 hooks
```

## 目录

```
src/
├── index.ts                  # 入口（导出全部能力）
├── config/provider.ts        # 端口注入（configureCore）
├── ports/                    # 端口定义（存储/通知/导航）
└── features/
    ├── auth/                 # 认证（useAuth + zustand 会话）
    ├── workbench/            # 工作台装配（菜单按 capabilities 裁剪）
    └── approval/             # 审批流程（对应 framework-approval 状态机）
```

## 使用（各端薄壳装配）

```ts
// 各端启动时注入端口（1 次）
import { configureCore } from '@lieshoucloud/core-web';
configureCore({
  storage: { get: (k) => localStorage.getItem(k), set: ..., remove: ... },
  notifier: { success: (m) => message.success(m), error: (m) => message.error(m) },
  navigation: { to: (p) => router.push(p), replace: (p) => router.replace(p) },
});

// 页面调 hooks（业务逻辑单点）
const { session, login, logout } = useAuth();
const menus = useWorkbench({ capabilities: edition.capabilities, items: ALL_MENUS });
```

## 依赖

- `@lieshoucloud/contract-api`（传输层）· `@lieshoucloud/contract-types`（契约）· `zustand`
- 跨包引用一律 `workspace:*`；经 `open/core-web` submodule 挂载

## License

Apache-2.0
