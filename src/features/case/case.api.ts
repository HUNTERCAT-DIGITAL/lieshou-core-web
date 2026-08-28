/**
 * 案件 API（对应后端 legal 域 · 智法云枢 · 走注入的传输端口）.
 *
 * 从 desktop services/case.ts 上收（业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * 律所特色：案件八阶段流（只前进）/ 计时 / 费用 / 文书。
 * @see @lieshoucloud/contract-types/business/legal
 */
import { requestApi } from '../../config/provider';
import {
  CASE_STAGE_FLOW,
  stageIndex,
  type CaseStage,
  type CaseEvent,
  type CaseEventRequest,
  type CreateCaseRequest,
  type DocumentRequest,
  type Expense,
  type ExpenseRequest,
  type ExpenseSummary,
  type LegalCase,
  type LegalDocument,
  type LegalPage,
  type TimeEntry,
  type TimeEntryRequest,
  type TimeEntrySummary,
  type UpdateCaseRequest,
} from '@lieshoucloud/contract-types/business/legal';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** 案件分页响应（后端返回 { items, total, page, size }） */
export interface CasePage {
  items: LegalCase[];
  total: number;
  page: number;
  size: number;
}

export interface CaseQuery {
  keyword?: string;
  stage?: string;
  status?: string;
  priority?: string;
  page?: number;
  size?: number;
}

/** GET /api/legal/cases — 案件列表（分页 + 筛选） */
export async function listCases(q: CaseQuery = {}): Promise<CasePage> {
  const params: string[] = [];
  if (q.keyword) params.push(`keyword=${encodeURIComponent(q.keyword)}`);
  if (q.stage) params.push(`stage=${encodeURIComponent(q.stage)}`);
  if (q.status) params.push(`status=${encodeURIComponent(q.status)}`);
  if (q.priority) params.push(`priority=${encodeURIComponent(q.priority)}`);
  params.push(`page=${q.page ?? 0}`);
  params.push(`size=${q.size ?? 20}`);
  return requestApi<CasePage>(`/api/legal/cases?${params.join('&')}`);
}

/** GET /api/legal/cases/{id} */
export async function getCase(id: number): Promise<LegalCase> {
  return requestApi<LegalCase>(`/api/legal/cases/${id}`);
}

/** POST /api/legal/cases — 新建案件 */
export async function createCase(body: CreateCaseRequest): Promise<LegalCase> {
  return requestApi<LegalCase>('/api/legal/cases', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/cases/{id} — 编辑案件（status/stage 仅允许前进） */
export async function updateCase(id: number, body: UpdateCaseRequest): Promise<LegalCase> {
  return requestApi<LegalCase>(`/api/legal/cases/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/legal/cases/{id} */
export async function deleteCase(id: number): Promise<void> {
  return requestApi<void>(`/api/legal/cases/${id}`, { method: 'DELETE' });
}

/**
 * 八阶段只前进 · 计算推进后的 stage/stageProgress（纯函数，可单测）。
 * 规则：
 *  - progress < 100 → 标记当前阶段完成（stageProgress = 100）
 *  - progress = 100 且非最后阶段 → 进入下一阶段（stage 前进，进度归 0）
 *  - 已是最后阶段且 100 → 返回 null（不可再推进）
 */
export function advanceStage(
  stage: CaseStage,
  progress: number,
): { stage: CaseStage; stageProgress: number } | null {
  const idx = stageIndex(stage);
  if (idx < 0) return null;
  if (progress < 100) return { stage, stageProgress: 100 };
  const next = CASE_STAGE_FLOW[idx + 1];
  if (!next) return null;
  return { stage: next.key, stageProgress: 0 };
}

/** GET /api/legal/cases/{caseId}/events — 案件时间线事件 */
export async function listCaseEvents(caseId: number): Promise<CaseEvent[]> {
  return requestApi<CaseEvent[]>(`/api/legal/cases/${caseId}/events`);
}

/** POST /api/legal/cases/{caseId}/events — 新增时间线事件 */
export async function addCaseEvent(caseId: number, body: CaseEventRequest): Promise<CaseEvent> {
  return requestApi<CaseEvent>(`/api/legal/cases/${caseId}/events`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/cases/{caseId}/events/{eventId} — 编辑事件(类型/时间/标题/详情) */
export async function updateCaseEvent(
  caseId: number,
  eventId: number,
  body: CaseEventRequest,
): Promise<CaseEvent> {
  return requestApi<CaseEvent>(`/api/legal/cases/${caseId}/events/${eventId}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/legal/cases/{caseId}/events/{eventId} — 删除事件(软删) */
export async function deleteCaseEvent(caseId: number, eventId: number): Promise<void> {
  return requestApi<void>(`/api/legal/cases/${caseId}/events/${eventId}`, { method: 'DELETE' });
}

// ============================================================
// 律所特色:计时 / 费用 / 文书
// ============================================================

/** GET /api/legal/cases/{caseId}/time-entries — 案件计时列表 */
export async function listTimeEntries(caseId: number): Promise<LegalPage<TimeEntry>> {
  return requestApi<LegalPage<TimeEntry>>(`/api/legal/cases/${caseId}/time-entries`);
}

/** GET /api/legal/cases/{caseId}/time-entries/summary — 案件计时汇总(小时/金额/待确认) */
export async function getTimeSummary(caseId: number): Promise<TimeEntrySummary> {
  return requestApi<TimeEntrySummary>(`/api/legal/cases/${caseId}/time-entries/summary`);
}

/** POST /api/legal/cases/{caseId}/time-entries — 登记计时 */
export async function createTimeEntry(caseId: number, body: TimeEntryRequest): Promise<TimeEntry> {
  return requestApi<TimeEntry>(`/api/legal/cases/${caseId}/time-entries`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/time-entries/{id}/confirm — 确认计时(PENDING → CONFIRMED,幂等;记录确认人/时间) */
export async function confirmTimeEntry(id: number): Promise<TimeEntry> {
  return requestApi<TimeEntry>(`/api/legal/time-entries/${id}/confirm`, { method: 'PUT' });
}

/** PUT /api/legal/time-entries/{id} — 编辑计时(工时/费率/律师/日期,金额服务端重算) */
export async function updateTimeEntry(id: number, body: TimeEntryRequest): Promise<TimeEntry> {
  return requestApi<TimeEntry>(`/api/legal/time-entries/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/legal/time-entries/{id} — 删除计时(软删) */
export async function deleteTimeEntry(id: number): Promise<void> {
  return requestApi<void>(`/api/legal/time-entries/${id}`, { method: 'DELETE' });
}

/** GET /api/legal/cases/{caseId}/expenses — 案件费用列表 */
export async function listExpenses(caseId: number): Promise<LegalPage<Expense>> {
  return requestApi<LegalPage<Expense>>(`/api/legal/cases/${caseId}/expenses`);
}

/** GET /api/legal/cases/{caseId}/expenses/summary — 案件费用汇总 */
export async function getExpenseSummary(caseId: number): Promise<ExpenseSummary> {
  return requestApi<ExpenseSummary>(`/api/legal/cases/${caseId}/expenses/summary`);
}

/** POST /api/legal/cases/{caseId}/expenses — 登记费用 */
export async function createExpense(caseId: number, body: ExpenseRequest): Promise<Expense> {
  return requestApi<Expense>(`/api/legal/cases/${caseId}/expenses`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/expenses/{id} — 编辑费用(类型/说明/金额/日期) */
export async function updateExpense(id: number, body: ExpenseRequest): Promise<Expense> {
  return requestApi<Expense>(`/api/legal/expenses/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/legal/expenses/{id} — 删除费用(软删) */
export async function deleteExpense(id: number): Promise<void> {
  return requestApi<void>(`/api/legal/expenses/${id}`, { method: 'DELETE' });
}

/** GET /api/legal/cases/{caseId}/documents — 案件卷宗文书列表 */
export async function listDocuments(caseId: number): Promise<LegalPage<LegalDocument>> {
  return requestApi<LegalPage<LegalDocument>>(`/api/legal/cases/${caseId}/documents`);
}

/** POST /api/legal/cases/{caseId}/documents — 登记文书(标题必填;正文/附件URL/类型/日期可选) */
export async function createDocument(caseId: number, body: DocumentRequest): Promise<LegalDocument> {
  return requestApi<LegalDocument>(`/api/legal/cases/${caseId}/documents`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/documents/{id} — 编辑文书 */
export async function updateDocument(id: number, body: DocumentRequest): Promise<LegalDocument> {
  return requestApi<LegalDocument>(`/api/legal/documents/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/legal/documents/{id} — 删除文书(软删) */
export async function deleteDocument(id: number): Promise<void> {
  return requestApi<void>(`/api/legal/documents/${id}`, { method: 'DELETE' });
}
