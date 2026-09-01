/**
 * User API（对应后端 user-service · 走注入的传输端口）.
 *
 * 从 admin-web services/user.ts 上收（P0 推广 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * Phase 7 · 用户管理 CRUD。
 * @see .ai/decisions/0021-flyway-schema.md
 */
import { requestApi } from '../../config/provider';
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from '@lieshoucloud/contract-types/business/user';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/users — 全量列表（后端暂未分页） */
export async function listUsers(): Promise<User[]> {
  return requestApi<User[]>('/api/users');
}

/** GET /api/users/count */
export async function countUsers(): Promise<number> {
  return requestApi<number>('/api/users/count');
}

/** GET /api/users/{id} */
export async function getUser(id: number): Promise<User> {
  return requestApi<User>(`/api/users/${id}`);
}

/** POST /api/users */
export async function createUser(body: CreateUserRequest): Promise<User> {
  return requestApi<User>('/api/users', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/users/{id} */
export async function updateUser(id: number, body: UpdateUserRequest): Promise<User> {
  return requestApi<User>(`/api/users/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 上传用户头像（multipart file → 后端存储 → 更新 avatarUrl）.
 * 2026-09 头像功能：走注入传输端口（同 createUser 模式）。
 */
export async function updateUserAvatar(id: number, file: File): Promise<User> {
  const fd = new FormData();
  fd.append('file', file);
  return requestApi<User>(`/api/users/${id}/avatar`, {
    method: 'POST',
    body: fd,
  });
}

/** 清除用户头像（avatarUrl 置空） */
export async function removeUserAvatar(id: number): Promise<User> {
  return requestApi<User>(`/api/users/${id}/avatar`, { method: 'DELETE' });
}

/** DELETE /api/users/{id} */
export async function deleteUser(id: number): Promise<void> {
  return requestApi<void>(`/api/users/${id}`, { method: 'DELETE' });
}

/** PUT /api/users/me/password — 自助修改密码（校验原密码，framework 业务源） */
export async function changeMyPassword(oldPassword: string, newPassword: string): Promise<void> {
  return requestApi<void>('/api/users/me/password', {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({ oldPassword, newPassword }),
  });
}
