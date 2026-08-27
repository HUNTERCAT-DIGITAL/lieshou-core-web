/**
 * lieshou-core-web · 猎手云前端核心层（开源 · 业务逻辑唯一源）
 *
 * 类比 lieshou-framework：业务逻辑（状态/流程/规则）只在此维护，
 * 4 端（admin-web/desktop/mobile/mini-program）薄壳装配（注入端口 + 调 hooks）。
 */
export { configureCore, getAdapters, requestApi } from './config/provider';
export type { CoreAdapters } from './config/provider';
export type { StoragePort } from './ports/storage.port';
export type { NotifierPort } from './ports/notifier.port';
export type { NavigationPort } from './ports/navigation.port';
export type { ApiPort } from './ports/api.port';

export { useAuth } from './features/auth/useAuth';
export { useAuthStore } from './features/auth/auth.store';
export type { Session } from './features/auth/auth.store';
export { useWorkbench, type WorkbenchItem, type WorkbenchOptions } from './features/workbench/useWorkbench';
export { useApproval, type ApprovalAction, type ApprovalStatus } from './features/approval/useApproval';
