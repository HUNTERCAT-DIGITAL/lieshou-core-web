/**
 * lieshou-core-web · 猎手云前端核心层（开源 · 业务逻辑唯一源）
 *
 * 类比 lieshou-framework：业务逻辑（状态/流程/规则）只在此维护，
 * 4 端（admin-web/desktop/mobile/mini-program）薄壳装配（注入端口 + 调 hooks）。
 *
 * 使用：
 *   import { configureCore, useAuth, useWorkbench, useApproval } from '@lieshoucloud/core-web';
 *   configureCore({ storage, notifier, navigation });   // 各端启动时注入端口
 */
export { configureCore, getAdapters } from './config/provider';
export type { CoreAdapters } from './config/provider';
export type { StoragePort } from './ports/storage.port';
export type { NotifierPort } from './ports/notifier.port';
export type { NavigationPort } from './ports/navigation.port';

export { useAuth } from './features/auth/useAuth';
export type { LoginParams } from './features/auth/auth.api';
export { useAuthStore, type Session } from './features/auth/auth.store';
export { useWorkbench, type WorkbenchItem, type WorkbenchOptions } from './features/workbench/useWorkbench';
export { useApproval, type ApprovalAction, type ApprovalStatus } from './features/approval/useApproval';
