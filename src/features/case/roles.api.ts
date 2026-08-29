/**
 * 案件席位 API（智法云枢 · 五角色协同 · 5 席 × 每案）.
 *
 * @see @lieshoucloud/contract-types/business/legal
 */
import { requestApi } from '../../config/provider';
import type { CaseRole, CaseRoleRequest } from '@lieshoucloud/contract-types/business/legal';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/legal/cases/{caseId}/roles — 案件席位列表 */
export async function listCaseRoles(caseId: number): Promise<CaseRole[]> {
  return requestApi<CaseRole[]>(`/api/legal/cases/${caseId}/roles`);
}

/** PUT /api/legal/cases/{caseId}/roles — 全量更新席位（换人 = revoke + grant） */
export async function updateCaseRoles(caseId: number, body: CaseRoleRequest[]): Promise<CaseRole[]> {
  return requestApi<CaseRole[]>(`/api/legal/cases/${caseId}/roles`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}
