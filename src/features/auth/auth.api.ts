/** 认证 API（经注入的传输端口 · 契约来自 contract-types） */
import { requestApi } from '../../config/provider';
import type { CurrentUser, LoginRequest, TokenResponse } from '@lieshoucloud/contract-types/business/auth';

/** 登录 */
export async function login(req: LoginRequest): Promise<TokenResponse> {
  return requestApi<TokenResponse>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
}

/** 刷新 token */
export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  return requestApi<TokenResponse>('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
}

/** 当前用户（401 由传输层拦截自动 refresh） */
export async function fetchCurrentUser(): Promise<CurrentUser> {
  return requestApi<CurrentUser>('/api/auth/me');
}

/** 切换租户 */
export async function switchTenant(refreshToken: string, tenantCode: string): Promise<TokenResponse> {
  return requestApi<TokenResponse>('/api/auth/switch-tenant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken, tenantCode }),
  });
}
