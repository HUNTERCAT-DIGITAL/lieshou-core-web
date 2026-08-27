/**
 * lieshou-core-web · 猎手云前端核心层（开源 · 业务逻辑唯一源）
 *
 * 类比 lieshou-framework：业务逻辑（状态/流程/规则）只在此维护，
 * 4 端（admin-web/desktop/mobile/mini-program）薄壳装配（注入端口 + 调 hooks）。
 */
export { configureCore, getAdapters, requestApi } from './config/provider';
export { useAuth } from './features/auth/useAuth';
export { useAuthStore } from './features/auth/auth.store';
export { useWorkbench } from './features/workbench/useWorkbench';
export { useApproval } from './features/approval/useApproval';

import type { CoreAdapters as _CoreAdapters } from './config/provider';
import type { StoragePort as _StoragePort } from './ports/storage.port';
import type { NotifierPort as _NotifierPort } from './ports/notifier.port';
import type { NavigationPort as _NavigationPort } from './ports/navigation.port';
import type { ApiPort as _ApiPort } from './ports/api.port';
import type { Session as _Session } from './features/auth/auth.store';
import type { WorkbenchItem as _WorkbenchItem, WorkbenchOptions as _WorkbenchOptions } from './features/workbench/useWorkbench';
import type { ApprovalAction as _ApprovalAction, ApprovalStatus as _ApprovalStatus } from './features/approval/useApproval';

export type CoreAdapters = _CoreAdapters;
export type StoragePort = _StoragePort;
export type NotifierPort = _NotifierPort;
export type NavigationPort = _NavigationPort;
export type ApiPort = _ApiPort;
export type Session = _Session;
export type WorkbenchItem = _WorkbenchItem;
export type WorkbenchOptions = _WorkbenchOptions;
export type ApprovalAction = _ApprovalAction;
export type ApprovalStatus = _ApprovalStatus;
