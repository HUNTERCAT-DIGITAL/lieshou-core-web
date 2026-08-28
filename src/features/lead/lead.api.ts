/**
 * CRM 线索 API（对应后端 crm-service · 走注入的传输端口）.
 *
 * 从 admin-web services/lead.ts 上收（业务逻辑唯一源）。
 * 与 crm（客户）同构：后端强制 X-Tenant-Id，跨租户 404。
 */
import { requestApi } from '../../config/provider';
import type { ImportResult } from '../crm/crm.api';
import type {
  FollowUpRequest,
  Lead,
  LeadFollowUp,
  LeadRequest,
  LeadStatus,
} from '@lieshoucloud/contract-types/business/lead';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/leads — 租户内线索列表；owner=-1 线索池(未认领) 0 全部 >0 指定认领人 */
export async function listLeads(
  keyword?: string,
  status?: LeadStatus,
  owner: number = 0,
): Promise<Lead[]> {
  const params: string[] = [];
  if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
  if (status) params.push(`status=${status}`);
  if (owner !== 0) params.push(`owner=${owner}`);
  const qs = params.length > 0 ? `?${params.join('&')}` : '';
  return requestApi<Lead[]>(`/api/leads${qs}`);
}

/** GET /api/leads/{id} */
export async function getLead(id: number): Promise<Lead> {
  return requestApi<Lead>(`/api/leads/${id}`);
}

/** POST /api/leads — 创建（进池，ownerId 为空） */
export async function createLead(body: LeadRequest): Promise<Lead> {
  return requestApi<Lead>('/api/leads', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/leads/{id} */
export async function updateLead(id: number, body: LeadRequest): Promise<Lead> {
  return requestApi<Lead>(`/api/leads/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/leads/{id} */
export async function deleteLead(id: number): Promise<{ deleted: boolean }> {
  return requestApi<{ deleted: boolean }>(`/api/leads/${id}`, { method: 'DELETE' });
}

/** POST /api/leads/{id}/assign — 认领（当前用户） */
export async function assignLead(id: number): Promise<Lead> {
  return requestApi<Lead>(`/api/leads/${id}/assign`, { method: 'POST' });
}

/** POST /api/leads/{id}/release — 释放回池 */
export async function releaseLead(id: number): Promise<Lead> {
  return requestApi<Lead>(`/api/leads/${id}/release`, { method: 'POST' });
}

/** POST /api/leads/{id}/convert — 转化（创建客户并关联） */
export async function convertLead(id: number): Promise<Lead> {
  return requestApi<Lead>(`/api/leads/${id}/convert`, { method: 'POST' });
}

/** GET /api/leads/{id}/follow-ups — 跟进时间线 */
export async function listFollowUps(leadId: number): Promise<LeadFollowUp[]> {
  return requestApi<LeadFollowUp[]>(`/api/leads/${leadId}/follow-ups`);
}

/** POST /api/leads/{id}/follow-ups — 添加跟进 */
export async function addFollowUp(leadId: number, body: FollowUpRequest): Promise<LeadFollowUp> {
  return requestApi<LeadFollowUp>(`/api/leads/${leadId}/follow-ups`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** POST /api/leads/import — CSV 批量导入（进线索池，来源默认 IMPORT） */
export async function importLeads(file: File): Promise<ImportResult> {
  const form = new FormData();
  form.append('file', file);
  return requestApi<ImportResult>('/api/leads/import', {
    method: 'POST',
    body: form,
  });
}
