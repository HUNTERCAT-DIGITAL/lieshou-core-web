/**
 * 客户价值 API（智法云枢 · 客户经营/价值记录）.
 *
 * @see @lieshoucloud/contract-types/business/legal
 */
import { requestApi } from '../../config/provider';
import type {
  ClientRequest,
  ClientSuccessSummary,
  ClientValueRecord,
  ClientValueType,
  LegalClient,
} from '@lieshoucloud/contract-types/business/legal';

/** 价值记录请求（契约未单列,本地定义:valueType 取值见契约 ClientValueType） */
export interface ClientValueRequest {
  valueType: ClientValueType;
  description: string;
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/legal/clients — 客户列表 */
export async function listLegalClients(): Promise<LegalClient[]> {
  return requestApi<LegalClient[]>('/api/legal/clients');
}

/** GET /api/legal/clients/summary */
export async function getClientSummary(): Promise<ClientSuccessSummary> {
  return requestApi<ClientSuccessSummary>('/api/legal/clients/summary');
}

/** GET /api/legal/clients/{id} */
export async function getLegalClient(id: number): Promise<LegalClient> {
  return requestApi<LegalClient>(`/api/legal/clients/${id}`);
}

/** POST /api/legal/clients */
export async function createLegalClient(body: ClientRequest): Promise<LegalClient> {
  return requestApi<LegalClient>('/api/legal/clients', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/clients/{id} */
export async function updateLegalClient(id: number, body: ClientRequest): Promise<LegalClient> {
  return requestApi<LegalClient>(`/api/legal/clients/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/legal/clients/{id} */
export async function deleteLegalClient(id: number): Promise<void> {
  return requestApi<void>(`/api/legal/clients/${id}`, { method: 'DELETE' });
}

/** GET /api/legal/clients/{id}/values — 客户价值记录 */
export async function listClientValues(id: number): Promise<ClientValueRecord[]> {
  return requestApi<ClientValueRecord[]>(`/api/legal/clients/${id}/values`);
}

/** POST /api/legal/clients/{id}/values — 记录价值点 */
export async function addClientValue(id: number, body: ClientValueRequest): Promise<ClientValueRecord> {
  return requestApi<ClientValueRecord>(`/api/legal/clients/${id}/values`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/client-values/{id}/confirm — 确认价值记录 */
export async function confirmClientValue(id: number): Promise<ClientValueRecord> {
  return requestApi<ClientValueRecord>(`/api/legal/client-values/${id}/confirm`, { method: 'PUT' });
}
