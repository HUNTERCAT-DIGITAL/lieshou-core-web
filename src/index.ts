/**
 * lieshou-core-web · 猎手云前端核心层（开源 · 业务逻辑唯一源）
 *
 * 类比 lieshou-framework：业务逻辑（状态/流程/规则）只在此维护，
 * 4 端（admin-web/desktop/mobile/mini-program）薄壳装配（注入端口 + 调 hooks）。
 *
 * 注：使用 export *（无 type-only 语法）以兼容 Taro 4 的 babel-preset-taro。
 */
export * from './config/provider';
export * from './config/editions';
export * from './ports/storage.port';
export * from './ports/notifier.port';
export * from './ports/navigation.port';
export * from './ports/api.port';
export * from './hooks/responsive';
export { useResponsive } from './hooks/useResponsive';
export { useI18n } from './hooks/useI18n';
export * from './features/auth/auth.api';
export * from './features/auth/useAuth';
export * from './features/auth/auth.store';
export * from './features/workbench/useWorkbench';
export * from './features/approval/approval.api';
export * from './features/approval/useApproval';
export * from './features/contact/contact.api';
export * from './features/contract/contract.api';
export * from './features/member/member.api';
export * from './features/quality/quality.api';
export * from './features/supply/supply.api';
export * from './features/audit/audit.api';
export * from './features/role/role.api';
export * from './features/tenant/tenant.api';
export * from './features/user/user.api';
export * from './features/user/userDisplayName';
export * from './features/crm/crm.api';
export * from './features/customer-success/customerSuccess.api';
export * from './features/dispatch/dispatch.api';
export * from './features/teacher/teacher.api';
export * from './features/finance/finance.api';
export * from './features/inventory/inventory.api';
export * from './features/lead/lead.api';
export * from './features/notification/notification.api';
export * from './features/menu/menu.api';
export * from './features/file/file.api';
export * from './features/case/case.api';
export * from './features/case/letters.api';
export * from './features/case/reviews.api';
export * from './features/case/clients.api';
export * from './features/case/assignments.api';
export * from './features/case/roles.api';
export * from './features/case/gates.api';
export * from './features/case/knowledge.api';
export * from './features/case/ledgers.api';
export * from './features/case/schedules.api';
export * from './features/case/ai.api';
export * from './features/case/workbench.api';
export * from './features/inventory/inventory';
export * from './features/theme/theme.store';
export * from './features/theme/useThemeMode';
