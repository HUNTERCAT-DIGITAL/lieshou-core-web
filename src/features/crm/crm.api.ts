/**
 * CRM 客户 API（对应后端 crm-service · 走注入的传输端口）.
 *
 * 从 admin-web services/crm.ts 上收（P0 推广 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * 首个租户内业务模块（ADR-0025）：后端强制 X-Tenant-Id（来自 JWT），跨租户访问返回 404。
 */
import { requestApi } from '../../config/provider';
import type {
  CreateCustomerRequest,
  Customer,
  CustomerStatus,
  UpdateCustomerRequest,
} from '@lieshoucloud/contract-types/business/customer';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: { row: number; message: string }[];
}

/** GET /api/customers — 租户内客户列表（可选 keyword / status 过滤；后端未分页） */
export async function listCustomers(
  keyword?: string,
  status?: CustomerStatus,
): Promise<Customer[]> {
  const params: string[] = [];
  if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
  if (status) params.push(`status=${status}`);
  const qs = params.length > 0 ? `?${params.join('&')}` : '';
  return requestApi<Customer[]>(`/api/customers${qs}`);
}

/** GET /api/customers/count — 租户内未删客户数 */
export async function countCustomers(): Promise<number> {
  return requestApi<number>('/api/customers/count');
}

/** GET /api/customers/{id} */
export async function getCustomer(id: number): Promise<Customer> {
  return requestApi<Customer>(`/api/customers/${id}`);
}

/** POST /api/customers — 创建（tenant 强制取请求租户） */
export async function createCustomer(body: CreateCustomerRequest): Promise<Customer> {
  return requestApi<Customer>('/api/customers', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/customers/{id} */
export async function updateCustomer(id: number, body: UpdateCustomerRequest): Promise<Customer> {
  return requestApi<Customer>(`/api/customers/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/customers/{id} — 软删（后端置 is_deleted=true） */
export async function deleteCustomer(id: number): Promise<void> {
  return requestApi<void>(`/api/customers/${id}`, { method: 'DELETE' });
}

/** POST /api/customers/import — CSV 批量导入（multipart，FormData 原样透传） */
export async function importCustomers(file: File): Promise<ImportResult> {
  const form = new FormData();
  form.append('file', file);
  return requestApi<ImportResult>('/api/customers/import', {
    method: 'POST',
    body: form,
  });
}
