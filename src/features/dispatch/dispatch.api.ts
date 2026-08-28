/**
 * 师资派遣 API（对应后端 edu-service · 走注入的传输端口）.
 *
 * 从 admin-web services/dispatch.ts 上收（P0 推广 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * zhiye 教育行业版（智野 B2B2C 供应侧 · 师资派遣排期）：后端强制 X-Tenant-Id（来自 JWT），
 * 跨租户访问返回 404；创建时做产能校验（时段重叠 409 / 周课时超 weekly_cap 409）。
 */
import { requestApi } from '../../config/provider';
import type {
  CreateDispatchRequest,
  DispatchRecord,
  DispatchStatus,
} from '@lieshoucloud/contract-types/business/dispatch';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/dispatches — 租户内派遣单列表（可选 keyword / status / teacherId 过滤；后端未分页） */
export async function listDispatches(
  keyword?: string,
  status?: DispatchStatus,
  teacherId?: number,
): Promise<DispatchRecord[]> {
  const params: string[] = [];
  if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
  if (status) params.push(`status=${status}`);
  if (teacherId) params.push(`teacherId=${teacherId}`);
  const qs = params.length > 0 ? `?${params.join('&')}` : '';
  return requestApi<DispatchRecord[]>(`/api/dispatches${qs}`);
}

/** GET /api/dispatches/count — 租户内未删派遣单数 */
export async function countDispatches(): Promise<number> {
  return requestApi<number>('/api/dispatches/count');
}

/** GET /api/dispatches/{id} */
export async function getDispatch(id: number): Promise<DispatchRecord> {
  return requestApi<DispatchRecord>(`/api/dispatches/${id}`);
}

/** POST /api/dispatches — 创建（创建即派遣生效；产能校验失败返回 409） */
export async function createDispatch(body: CreateDispatchRequest): Promise<DispatchRecord> {
  return requestApi<DispatchRecord>('/api/dispatches', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** POST /api/dispatches/{id}/complete — 完成（教师无其他进行中派遣时释放回可用） */
export async function completeDispatch(id: number): Promise<DispatchRecord> {
  return requestApi<DispatchRecord>(`/api/dispatches/${id}/complete`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({}),
  });
}

/** POST /api/dispatches/{id}/cancel — 取消（教师无其他进行中派遣时释放回可用） */
export async function cancelDispatch(id: number): Promise<DispatchRecord> {
  return requestApi<DispatchRecord>(`/api/dispatches/${id}/cancel`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({}),
  });
}

/** DELETE /api/dispatches/{id} — 软删（仅终态 COMPLETED / CANCELLED） */
export async function deleteDispatch(id: number): Promise<void> {
  return requestApi<void>(`/api/dispatches/${id}`, { method: 'DELETE' });
}
