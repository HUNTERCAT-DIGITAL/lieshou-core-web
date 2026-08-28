/**
 * 联系人 API（对应后端 crm-service · 走注入的传输端口）.
 *
 * 从 admin-web services/contact.ts 上收（P0 推广 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * V5 补齐（ADR-0025）：后端强制 X-Tenant-Id（来自 JWT），跨租户访问返回 404。
 */
import { requestApi } from '../../config/provider';
import type {
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
} from '@lieshoucloud/contract-types/business/contact';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/contacts — 租户内联系人列表（可选 customerId / keyword 过滤） */
export async function listContacts(
  customerId?: number,
  keyword?: string,
): Promise<Contact[]> {
  const params: string[] = [];
  if (customerId) params.push(`customerId=${customerId}`);
  if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
  const qs = params.length > 0 ? `?${params.join('&')}` : '';
  return requestApi<Contact[]>(`/api/contacts${qs}`);
}

/** GET /api/contacts/count — 租户内未删联系人总数 */
export async function countContacts(): Promise<number> {
  return requestApi<number>('/api/contacts/count');
}

/** GET /api/contacts/{id} */
export async function getContact(id: number): Promise<Contact> {
  return requestApi<Contact>(`/api/contacts/${id}`);
}

/** POST /api/contacts — 创建（tenant 强制取请求租户） */
export async function createContact(body: CreateContactRequest): Promise<Contact> {
  return requestApi<Contact>('/api/contacts', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/contacts/{id} */
export async function updateContact(id: number, body: UpdateContactRequest): Promise<Contact> {
  return requestApi<Contact>(`/api/contacts/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/contacts/{id} — 软删 */
export async function deleteContact(id: number): Promise<void> {
  return requestApi<void>(`/api/contacts/${id}`, { method: 'DELETE' });
}
