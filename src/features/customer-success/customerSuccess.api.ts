/**
 * 客户成功中心 API（对应后端 crm-service · 走注入的传输端口）.
 *
 * 从 admin-web services/customerSuccess.ts 上收（P0 推广 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * 售后闭环：联系函（/api/letters/**）+ 客户响应（/api/responses/**）+ 工作台汇总
 * （/api/customer-success/summary）。与 crm 同构：后端强制 X-Tenant-Id，跨租户 404。
 */
import { requestApi } from '../../config/provider';
import type {
  ContactLetter,
  CreateLetterRequest,
  CreateResponseRequest,
  CreateTemplateRequest,
  CustomerResponse,
  CustomerSuccessSummary,
  LetterStatus,
  LetterTemplate,
  LetterType,
  ResponseSentiment,
  ResponseStatus,
  UpdateLetterRequest,
  UpdateResponseRequest,
  UpdateTemplateRequest,
} from '@lieshoucloud/contract-types/business/customerSuccess';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// ============================================================
// 联系函
// ============================================================

/** GET /api/letters — 租户内联系函列表（可选 customerId / type / status 过滤） */
export async function listLetters(params?: {
  customerId?: number;
  type?: LetterType;
  status?: LetterStatus;
}): Promise<ContactLetter[]> {
  const qs: string[] = [];
  if (params?.customerId !== undefined) qs.push(`customerId=${params.customerId}`);
  if (params?.type) qs.push(`type=${params.type}`);
  if (params?.status) qs.push(`status=${params.status}`);
  return requestApi<ContactLetter[]>(`/api/letters${qs.length > 0 ? `?${qs.join('&')}` : ''}`);
}

/** GET /api/letters/count — 租户内未删联系函数 */
export async function countLetters(): Promise<number> {
  return requestApi<number>('/api/letters/count');
}

/** GET /api/letter-templates — 系统预置 + 租户自定义模板（含 {customer} 占位符） */
export async function getLetterTemplates(): Promise<LetterTemplate[]> {
  return requestApi<LetterTemplate[]>('/api/letter-templates');
}

/** POST /api/letter-templates — 创建租户自定义模板（templateKey 租户内唯一，冲突 409） */
export async function createTemplate(body: CreateTemplateRequest): Promise<LetterTemplate> {
  return requestApi<LetterTemplate>('/api/letter-templates', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/letter-templates/{id} — 更新租户自定义模板（系统模板 404） */
export async function updateTemplate(
  id: number,
  body: UpdateTemplateRequest,
): Promise<LetterTemplate> {
  return requestApi<LetterTemplate>(`/api/letter-templates/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/letter-templates/{id} — 软删租户自定义模板（系统模板 404） */
export async function deleteTemplate(id: number): Promise<void> {
  return requestApi<void>(`/api/letter-templates/${id}`, { method: 'DELETE' });
}

/** POST /api/letters — 创建（一律 DRAFT 草稿，发送走 /send） */
export async function createLetter(body: CreateLetterRequest): Promise<ContactLetter> {
  return requestApi<ContactLetter>('/api/letters', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/letters/{id} — 仅 DRAFT 可改（后端 409 兜底） */
export async function updateLetter(id: number, body: UpdateLetterRequest): Promise<ContactLetter> {
  return requestApi<ContactLetter>(`/api/letters/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/letters/{id} — 软删 */
export async function deleteLetter(id: number): Promise<void> {
  return requestApi<void>(`/api/letters/${id}`, { method: 'DELETE' });
}

/** POST /api/letters/{id}/send — DRAFT → SENT */
export async function sendLetter(id: number): Promise<ContactLetter> {
  return requestApi<ContactLetter>(`/api/letters/${id}/send`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({}),
  });
}

/** POST /api/letters/{id}/read — SENT → READ（客户已读） */
export async function readLetter(id: number): Promise<ContactLetter> {
  return requestApi<ContactLetter>(`/api/letters/${id}/read`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({}),
  });
}

/** POST /api/letters/{id}/complete — SENT/READ → COMPLETED */
export async function completeLetter(id: number): Promise<ContactLetter> {
  return requestApi<ContactLetter>(`/api/letters/${id}/complete`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({}),
  });
}

/** POST /api/letters/{id}/cancel — 非终态 → CANCELLED */
export async function cancelLetter(id: number): Promise<ContactLetter> {
  return requestApi<ContactLetter>(`/api/letters/${id}/cancel`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({}),
  });
}

// ============================================================
// 客户响应（响应深化）
// ============================================================

/** GET /api/responses — 租户内响应列表（可选 customerId / letterId / status / sentiment / 跟进到期 过滤） */
export async function listResponses(params?: {
  customerId?: number;
  letterId?: number;
  status?: ResponseStatus;
  sentiment?: ResponseSentiment;
  /** 仅未闭环且已逾期（followUpAt < now） */
  followUpOverdue?: boolean;
  /** 仅未闭环且今日到期（followUpAt 在今日） */
  followUpDueToday?: boolean;
}): Promise<CustomerResponse[]> {
  const qs: string[] = [];
  if (params?.customerId !== undefined) qs.push(`customerId=${params.customerId}`);
  if (params?.letterId !== undefined) qs.push(`letterId=${params.letterId}`);
  if (params?.status) qs.push(`status=${params.status}`);
  if (params?.sentiment) qs.push(`sentiment=${params.sentiment}`);
  if (params?.followUpOverdue) qs.push('followUpOverdue=true');
  if (params?.followUpDueToday) qs.push('followUpDueToday=true');
  return requestApi<CustomerResponse[]>(
    `/api/responses${qs.length > 0 ? `?${qs.join('&')}` : ''}`,
  );
}

/** GET /api/responses/count — 租户内未删响应数 */
export async function countResponses(): Promise<number> {
  return requestApi<number>('/api/responses/count');
}

/** POST /api/responses — 创建（默认 OPEN 待跟进） */
export async function createResponse(body: CreateResponseRequest): Promise<CustomerResponse> {
  return requestApi<CustomerResponse>('/api/responses', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/responses/{id} — 更新（含状态流转） */
export async function updateResponse(
  id: number,
  body: UpdateResponseRequest,
): Promise<CustomerResponse> {
  return requestApi<CustomerResponse>(`/api/responses/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** POST /api/responses/{id}/resolve — → RESOLVED 闭环 */
export async function resolveResponse(id: number): Promise<CustomerResponse> {
  return requestApi<CustomerResponse>(`/api/responses/${id}/resolve`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({}),
  });
}

/** DELETE /api/responses/{id} — 软删 */
export async function deleteResponse(id: number): Promise<void> {
  return requestApi<void>(`/api/responses/${id}`, { method: 'DELETE' });
}

// ============================================================
// 工作台汇总
// ============================================================

/** GET /api/customer-success/summary — 客户成功中心工作台卡片聚合 */
export async function getCustomerSuccessSummary(): Promise<CustomerSuccessSummary> {
  return requestApi<CustomerSuccessSummary>('/api/customer-success/summary');
}
