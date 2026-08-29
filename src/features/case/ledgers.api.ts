/**
 * 台账 API（智法云枢 · 案件事实/证据/策略/任务 分型记录）.
 *
 * @see @lieshoucloud/contract-types/business/legal
 */
import { requestApi } from '../../config/provider';
import type {
  LedgerEntry,
  LedgerRequest,
  LedgerType,
} from '@lieshoucloud/contract-types/business/legal';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/legal/cases/{caseId}/ledgers/{type} — 分型台账 */
export async function listLegalLedgers(caseId: number, type: LedgerType): Promise<LedgerEntry[]> {
  return requestApi<LedgerEntry[]>(`/api/legal/cases/${caseId}/ledgers/${type}`);
}

/** POST /api/legal/cases/{caseId}/ledgers/{type} */
export async function createLegalLedger(
  caseId: number,
  type: LedgerType,
  body: LedgerRequest,
): Promise<LedgerEntry> {
  return requestApi<LedgerEntry>(`/api/legal/cases/${caseId}/ledgers/${type}`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/ledgers/{id} */
export async function updateLegalLedger(id: number, body: LedgerRequest): Promise<LedgerEntry> {
  return requestApi<LedgerEntry>(`/api/legal/ledgers/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/legal/ledgers/{id} */
export async function deleteLegalLedger(id: number): Promise<void> {
  return requestApi<void>(`/api/legal/ledgers/${id}`, { method: 'DELETE' });
}

/** GET /api/legal/cases/{caseId}/ledgers/coverage — 台账覆盖度 */
export async function getLegalLedgerCoverage(caseId: number): Promise<LedgerCoverage> {
  return requestApi<LedgerCoverage>(`/api/legal/cases/${caseId}/ledgers/coverage`);
}

/** 台账覆盖度（契约扩充） */
export interface LedgerCoverage {
  total: number;
  byType: Record<LedgerType, number>;
}
