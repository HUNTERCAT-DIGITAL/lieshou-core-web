/**
 * Role API（对应后端 user-service · 走注入的传输端口）.
 *
 * 从 admin-web services/role.ts 上收（P0 推广 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * Phase 8 · RBAC（ADR-0024）：写操作需 PLATFORM_ADMIN，读操作平台/租户管理员可。
 */
import { requestApi } from '../../config/provider';
import type {
  CreateRoleRequest,
  Role,
  UpdateRoleRequest,
} from '@lieshoucloud/contract-types/business/role';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/roles — 角色列表 */
export async function listRoles(): Promise<Role[]> {
  return requestApi<Role[]>('/api/roles');
}

/** POST /api/roles — 创建自定义角色 */
export async function createRole(body: CreateRoleRequest): Promise<Role> {
  return requestApi<Role>('/api/roles', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/roles/{id} — 更新（系统角色只读） */
export async function updateRole(id: number, body: UpdateRoleRequest): Promise<Role> {
  return requestApi<Role>(`/api/roles/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/roles/{id} — 删除（系统角色不可删） */
export async function deleteRole(id: number): Promise<void> {
  return requestApi<void>(`/api/roles/${id}`, { method: 'DELETE' });
}
