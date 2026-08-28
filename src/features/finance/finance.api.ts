/**
 * 财务记账 API（对应后端 finance-service · 走注入的传输端口）.
 *
 * 从 admin-web services/finance.ts 上收（业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 */
import { requestApi } from '../../config/provider';
import type {
  CreateLedgerRequest,
  LedgerEntry,
  LedgerSummary,
  LedgerType,
  MonthlySummary,
  UpdateLedgerRequest,
} from '@lieshoucloud/contract-types/business/finance';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/ledger — 租户内流水（可选 type/category/from/to 过滤） */
export async function listLedger(params?: {
  type?: LedgerType;
  category?: string;
  from?: string;
  to?: string;
}): Promise<LedgerEntry[]> {
  const qs = new URLSearchParams();
  if (params?.type) qs.set('type', params.type);
  if (params?.category) qs.set('category', params.category);
  if (params?.from) qs.set('from', params.from);
  if (params?.to) qs.set('to', params.to);
  const s = qs.toString();
  return requestApi<LedgerEntry[]>(`/api/ledger${s ? `?${s}` : ''}`);
}

/** GET /api/ledger/summary — 收支汇总（可选日期区间） */
export async function getLedgerSummary(params?: {
  from?: string;
  to?: string;
}): Promise<LedgerSummary> {
  const qs = new URLSearchParams();
  if (params?.from) qs.set('from', params.from);
  if (params?.to) qs.set('to', params.to);
  const s = qs.toString();
  return requestApi<LedgerSummary>(`/api/ledger/summary${s ? `?${s}` : ''}`);
}

/** GET /api/ledger/summary/monthly — 月度收支（默认最近 6 个月） */
export async function getMonthlySummary(months = 6): Promise<MonthlySummary[]> {
  return requestApi<MonthlySummary[]>(`/api/ledger/summary/monthly?months=${months}`);
}

/** GET /api/ledger/{id} */
export async function getLedger(id: number): Promise<LedgerEntry> {
  return requestApi<LedgerEntry>(`/api/ledger/${id}`);
}

/** POST /api/ledger */
export async function createLedger(body: CreateLedgerRequest): Promise<LedgerEntry> {
  return requestApi<LedgerEntry>('/api/ledger', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/ledger/{id} */
export async function updateLedger(id: number, body: UpdateLedgerRequest): Promise<LedgerEntry> {
  return requestApi<LedgerEntry>(`/api/ledger/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/ledger/{id} */
export async function deleteLedger(id: number): Promise<void> {
  return requestApi<void>(`/api/ledger/${id}`, { method: 'DELETE' });
}
