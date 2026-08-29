/**
 * 分工授权 API（智法云枢 · 五角色协同 · 阶段级动态分工）.
 *
 * @see @lieshoucloud/contract-types/business/legal
 */
import { requestApi } from '../../config/provider';
import type {
  AssignmentRequest,
  CaseAssignment,
} from '@lieshoucloud/contract-types/business/legal';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/legal/cases/{caseId}/assignments — 案件分工 */
export async function listAssignments(caseId: number): Promise<CaseAssignment[]> {
  return requestApi<CaseAssignment[]>(`/api/legal/cases/${caseId}/assignments`);
}

/** POST /api/legal/cases/{caseId}/assignments — 新建分工 */
export async function createAssignment(
  caseId: number,
  body: AssignmentRequest,
): Promise<CaseAssignment> {
  return requestApi<CaseAssignment>(`/api/legal/cases/${caseId}/assignments`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/assignments/{id} — 更新分工（执行/复核流转） */
export async function updateAssignment(
  id: number,
  body: AssignmentRequest,
): Promise<CaseAssignment> {
  return requestApi<CaseAssignment>(`/api/legal/assignments/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** GET /api/legal/assignments/mine — 我的分工（待办/在办） */
export async function listMyAssignments(): Promise<CaseAssignment[]> {
  return requestApi<CaseAssignment[]>('/api/legal/assignments/mine');
}
