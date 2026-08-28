/**
 * 审计日志 API（对应后端 user-service · 走注入的传输端口）.
 *
 * 从 admin-web services/audit.ts 上收（P0 推广 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * append-only 只读端点；租户作用域由 gateway 注入的 X-Tenant-Id 决定。
 * @see .ai/decisions/0030-audit-log.md
 */
import { requestApi } from '../../config/provider';
import type { AuditAction, AuditLog } from '@lieshoucloud/contract-types/business/audit';

export interface AuditQuery {
  action?: AuditAction;
  resourceType?: string;
  limit?: number;
}

/** GET /api/audit-logs — 审计列表（新→旧） */
export async function listAuditLogs(query: AuditQuery = {}): Promise<AuditLog[]> {
  const params = new URLSearchParams();
  if (query.action) params.set('action', query.action);
  if (query.resourceType) params.set('resourceType', query.resourceType);
  if (query.limit) params.set('limit', String(query.limit));
  const qs = params.toString();
  return requestApi<AuditLog[]>(`/api/audit-logs${qs ? `?${qs}` : ''}`);
}

/** GET /api/audit-logs/count */
export async function countAuditLogs(): Promise<number> {
  return requestApi<number>('/api/audit-logs/count');
}
