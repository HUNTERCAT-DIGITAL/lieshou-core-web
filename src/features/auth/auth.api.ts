/** 认证 API（经注入的传输端口 · 契约来自 contract-types） */
import { requestApi } from '../../config/provider';
import { AuthError } from '@lieshoucloud/contract-api';
import type { CurrentUser, LoginRequest, TokenResponse } from '@lieshoucloud/contract-types/business/auth';

/** 登录 */
export async function login(req: LoginRequest): Promise<TokenResponse> {
  try {
    // skipAuth401: 登录 401 = 密码错误,不走会话过期拦截(由各端 ApiPort 透传到 contract-api)
    return await requestApi<TokenResponse>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      // @ts-expect-error core-web 不直接依赖 contract-api 的 RequestInit 扩展,由各端 ApiPort 透传
      skipAuth401: true,
    });
  } catch (e) {
    if (e instanceof AuthError) throw e;
    throw new AuthError('INVALID_CREDENTIALS', e instanceof Error ? e.message : String(e));
  }
}

/** 刷新 token */
export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  try {
    return await requestApi<TokenResponse>('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch (e) {
    if (e instanceof AuthError) throw e;
    throw new AuthError('INVALID_REFRESH_TOKEN', e instanceof Error ? e.message : String(e));
  }
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
