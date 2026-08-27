/**
 * lieshou-core-web · 猎手云前端核心层（开源 · 业务逻辑唯一源）
 *
 * 类比 lieshou-framework：业务逻辑（状态/流程/规则）只在此维护，
 * 4 端（admin-web/desktop/mobile/mini-program）薄壳装配（注入端口 + 调 hooks）。
 *
 * 注：使用 export *（无 type-only 语法）以兼容 Taro 4 的 babel-preset-taro。
 */
export * from './config/provider';
export * from './ports/storage.port';
export * from './ports/notifier.port';
export * from './ports/navigation.port';
export * from './ports/api.port';
export * from './features/auth/auth.api';
export * from './features/auth/useAuth';
export * from './features/auth/auth.store';
export * from './features/workbench/useWorkbench';
export * from './features/approval/useApproval';
