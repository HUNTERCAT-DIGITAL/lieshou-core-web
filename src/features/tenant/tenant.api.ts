/**
 * Tenant API（对应后端 user-service · 走注入的传输端口）.
 *
 * 从 admin-web services/tenant.ts 上收（P0 推广 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * Phase 8 · 租户管理（开通/停用/列表）运营视角 + 邀请码（ADR-0023 Phase 2）。
 * @see .ai/decisions/0022-multitenant-schema.md
 */
import { requestApi } from '../../config/provider';
import type {
  CreateInviteRequest,
  CreateTenantRequest,
  RegisterTenantRequest,
  RegisterTenantResult,
  Tenant,
  TenantInvite,
  UpdateTenantRequest,
} from '@lieshoucloud/contract-types/business/tenant';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/tenants — 全量列表 */
export async function listTenants(): Promise<Tenant[]> {
  return requestApi<Tenant[]>('/api/tenants');
}

/** POST /api/tenants/register — 租户自助开通（公开端点，无鉴权 · issue #24） */
export async function registerTenant(body: RegisterTenantRequest): Promise<RegisterTenantResult> {
  return requestApi<RegisterTenantResult>('/api/tenants/register', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** GET /api/tenants/{id} */
export async function getTenant(id: number): Promise<Tenant> {
  return requestApi<Tenant>(`/api/tenants/${id}`);
}

/** POST /api/tenants — 开通租户 */
export async function createTenant(body: CreateTenantRequest): Promise<Tenant> {
  return requestApi<Tenant>('/api/tenants', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/tenants/{id} — 更新（改名 / 启停） */
export async function updateTenant(id: number, body: UpdateTenantRequest): Promise<Tenant> {
  return requestApi<Tenant>(`/api/tenants/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/tenants/{id} — 删除（仅无用户时） */
export async function deleteTenant(id: number): Promise<void> {
  return requestApi<void>(`/api/tenants/${id}`, { method: 'DELETE' });
}

// ============================================================
// 邀请码（ADR-0023 Phase 2）
// ============================================================

/** POST /api/tenants/{tenantId}/invites — 生成邀请码 */
export async function createInvite(
  tenantId: number,
  body: CreateInviteRequest,
): Promise<TenantInvite> {
  return requestApi<TenantInvite>(`/api/tenants/${tenantId}/invites`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** GET /api/tenants/{tenantId}/invites — 列表 */
export async function listInvites(tenantId: number): Promise<TenantInvite[]> {
  return requestApi<TenantInvite[]>(`/api/tenants/${tenantId}/invites`);
}

/** POST /api/tenants/{tenantId}/invites/{id}/revoke — 撤销 */
export async function revokeInvite(tenantId: number, id: number): Promise<void> {
  return requestApi<void>(`/api/tenants/${tenantId}/invites/${id}/revoke`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({}),
  });
}
