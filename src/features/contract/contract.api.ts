/**
 * 合同 API（对应后端 crm-service · 走注入的传输端口）.
 *
 * 从 admin-web services/contract.ts 上收（P0 推广 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * V5 补齐（ADR-0025）：后端强制 X-Tenant-Id（来自 JWT），跨租户访问返回 404；合同编号租户内唯一。
 */
import { requestApi } from '../../config/provider';
import type {
  Contract,
  ContractStatus,
  CreateContractRequest,
  UpdateContractRequest,
} from '@lieshoucloud/contract-types/business/contract';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/contracts — 租户内合同列表（可选 customerId / status / keyword 过滤） */
export async function listContracts(
  customerId?: number,
  status?: ContractStatus,
  keyword?: string,
): Promise<Contract[]> {
  const params: string[] = [];
  if (customerId) params.push(`customerId=${customerId}`);
  if (status) params.push(`status=${status}`);
  if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
  const qs = params.length > 0 ? `?${params.join('&')}` : '';
  return requestApi<Contract[]>(`/api/contracts${qs}`);
}

/** GET /api/contracts/count — 租户内未删合同总数 */
export async function countContracts(): Promise<number> {
  return requestApi<number>('/api/contracts/count');
}

/** GET /api/contracts/{id} */
export async function getContract(id: number): Promise<Contract> {
  return requestApi<Contract>(`/api/contracts/${id}`);
}

/** POST /api/contracts — 创建（tenant 强制取请求租户） */
export async function createContract(body: CreateContractRequest): Promise<Contract> {
  return requestApi<Contract>('/api/contracts', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/contracts/{id} */
export async function updateContract(id: number, body: UpdateContractRequest): Promise<Contract> {
  return requestApi<Contract>(`/api/contracts/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/contracts/{id} — 软删 */
export async function deleteContract(id: number): Promise<void> {
  return requestApi<void>(`/api/contracts/${id}`, { method: 'DELETE' });
}
