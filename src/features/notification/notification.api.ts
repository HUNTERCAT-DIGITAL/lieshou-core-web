/**
 * 站内通知 API（对应后端 user-service · 走注入的传输端口）.
 *
 * 从 admin-web services/notification.ts 上收（业务逻辑唯一源）。
 * 接收者上下文（X-User-Id / X-Tenant-Id）由 gateway 从 JWT 注入。
 */
import { requestApi } from '../../config/provider';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export interface NotificationItem {
  id: number;
  tenantId: number;
  userId: number;
  type: string;
  title: string;
  content: string;
  bizType?: string | null;
  bizId?: number | null;
  readAt?: string | null;
  createdAt: string;
}

/** GET /api/notifications — 我的通知（未读优先，新→旧） */
export async function listNotifications(params?: {
  page?: number;
  size?: number;
}): Promise<NotificationItem[]> {
  const qs = new URLSearchParams();
  const page = params?.page ?? 0;
  const size = params?.size ?? 20;
  if (page !== null) qs.set('page', String(page));
  if (size !== null) qs.set('size', String(size));
  const s = qs.toString();
  return requestApi<NotificationItem[]>(`/api/notifications${s ? `?${s}` : ''}`);
}

/** GET /api/notifications/unread-count — 未读数 */
export async function unreadNotificationCount(): Promise<number> {
  const r = await requestApi<{ unread: number }>('/api/notifications/unread-count');
  return r.unread;
}

/** POST /api/notifications/{id}/read — 标记单条已读 */
export async function markNotificationRead(id: number): Promise<void> {
  await requestApi<void>(`/api/notifications/${id}/read`, { method: 'POST' });
}

/** POST /api/notifications/read-all — 全部已读（返回本次标记条数） */
export async function markAllNotificationsRead(): Promise<number> {
  const r = await requestApi<{ updated: number }>('/api/notifications/read-all', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({}),
  });
  return r.updated;
}
