/**
 * 关口 API（智法云枢 · 案件节点关口把关）.
 *
 * @see @lieshoucloud/contract-types/business/legal
 */
import { requestApi } from '../../config/provider';
import type { Gate } from '@lieshoucloud/contract-types/business/legal';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/legal/cases/{caseId}/gates — 案件关口列表 */
export async function listGates(caseId: number): Promise<Gate[]> {
  return requestApi<Gate[]>(`/api/legal/cases/${caseId}/gates`);
}

/** GET /api/legal/cases/{caseId}/gates/summary */
export async function getGateSummary(caseId: number): Promise<GateSummary> {
  return requestApi<GateSummary>(`/api/legal/cases/${caseId}/gates/summary`);
}

/** PUT /api/legal/gates/{id} — 更新关口状态/备注 */
export async function updateGate(id: number, body: GateRequest): Promise<Gate> {
  return requestApi<Gate>(`/api/legal/gates/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** 关口更新请求（契约扩充） */
export interface GateRequest {
  status: Gate['status'];
  note?: string;
}

/** 关口汇总（契约扩充） */
export interface GateSummary {
  total: number;
  completed: number;
  pending: number;
  failed: number;
}
