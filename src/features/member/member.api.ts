/**
 * 会员 API（对应后端 crm-service · 走注入的传输端口）.
 *
 * 从 admin-web services/member.ts 上收（P0 推广 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * V5 补齐（ADR-0025）：后端强制 X-Tenant-Id（来自 JWT），跨租户访问返回 404；会员号租户内唯一。
 */
import { requestApi } from '../../config/provider';
import type {
  CreateMemberRequest,
  Member,
  MemberLevel,
  MemberStatus,
  UpdateMemberRequest,
} from '@lieshoucloud/contract-types/business/member';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/members — 租户内会员列表（可选 customerId / level / status / keyword 过滤） */
export async function listMembers(
  customerId?: number,
  level?: MemberLevel,
  status?: MemberStatus,
  keyword?: string,
): Promise<Member[]> {
  const params: string[] = [];
  if (customerId) params.push(`customerId=${customerId}`);
  if (level) params.push(`level=${level}`);
  if (status) params.push(`status=${status}`);
  if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
  const qs = params.length > 0 ? `?${params.join('&')}` : '';
  return requestApi<Member[]>(`/api/members${qs}`);
}

/** GET /api/members/count — 租户内未删会员总数 */
export async function countMembers(): Promise<number> {
  return requestApi<number>('/api/members/count');
}

/** GET /api/members/{id} */
export async function getMember(id: number): Promise<Member> {
  return requestApi<Member>(`/api/members/${id}`);
}

/** POST /api/members — 创建（tenant 强制取请求租户） */
export async function createMember(body: CreateMemberRequest): Promise<Member> {
  return requestApi<Member>('/api/members', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/members/{id} */
export async function updateMember(id: number, body: UpdateMemberRequest): Promise<Member> {
  return requestApi<Member>(`/api/members/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/members/{id} — 软删 */
export async function deleteMember(id: number): Promise<void> {
  return requestApi<void>(`/api/members/${id}`, { method: 'DELETE' });
}
