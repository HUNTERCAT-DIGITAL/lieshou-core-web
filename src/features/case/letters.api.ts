/**
 * 函件 API（智法云枢 · 对应后端 legal ContactLetterController）.
 *
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * @see @lieshoucloud/contract-types/business/legal
 */
import { requestApi } from '../../config/provider';
import type {
  ContactLetter,
  LetterRequest,
  LetterSummary,
} from '@lieshoucloud/contract-types/business/legal';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/legal/cases/{caseId}/letters — 案件函件列表 */
export async function listLegalLetters(caseId: number): Promise<ContactLetter[]> {
  return requestApi<ContactLetter[]>(`/api/legal/cases/${caseId}/letters`);
}

/** GET /api/legal/cases/{caseId}/letters/summary */
export async function getLegalLetterSummary(caseId: number): Promise<LetterSummary> {
  return requestApi<LetterSummary>(`/api/legal/cases/${caseId}/letters/summary`);
}

/** POST /api/legal/cases/{caseId}/letters — 新建函件 */
export async function createLegalLetter(caseId: number, body: LetterRequest): Promise<ContactLetter> {
  return requestApi<ContactLetter>(`/api/legal/cases/${caseId}/letters`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/letters/{id} */
export async function updateLegalLetter(id: number, body: LetterRequest): Promise<ContactLetter> {
  return requestApi<ContactLetter>(`/api/legal/letters/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/letters/{id}/confirm — 函件确认（送达/归档） */
export async function confirmLetter(id: number): Promise<ContactLetter> {
  return requestApi<ContactLetter>(`/api/legal/letters/${id}/confirm`, { method: 'PUT' });
}

/** DELETE /api/legal/letters/{id} */
export async function deleteLegalLetter(id: number): Promise<void> {
  return requestApi<void>(`/api/legal/letters/${id}`, { method: 'DELETE' });
}
