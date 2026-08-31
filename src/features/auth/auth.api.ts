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
    // 网络/传输层错误（ApiError 等）：透传原样，不伪装成「密码错误」——
    // INVALID_CREDENTIALS 只应由后端明确的 401 凭据错误产生（避免掩盖 CORS/网络问题）
    throw e;
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

// ============================================================
// 验证码 / 注册 / 重置密码 / 可信身份 OAuth（Phase 8 · 从 admin-web services/auth.ts 上收）
// ============================================================

export type CodeChannel = 'SMS' | 'EMAIL';
export type CodePurpose = 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD' | 'ACTIVATE';

/** POST /api/auth/send-code */
export async function sendCode(
  channel: CodeChannel,
  target: string,
  purpose: CodePurpose,
): Promise<void> {
  return requestApi<void>('/api/auth/send-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel, target, purpose }),
  });
}

/** POST /api/auth/login/code - 验证码登录 */
export async function loginWithCode(
  tenantCode: string | undefined,
  channel: CodeChannel,
  target: string,
  code: string,
): Promise<TokenResponse> {
  return requestApi<TokenResponse>('/api/auth/login/code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantCode, channel, target, code }),
    // @ts-expect-error core-web 不直接依赖 contract-api 的 RequestInit 扩展,由各端 ApiPort 透传
    skipAuth401: true,
  });
}

/** POST /api/auth/register - 注册（注册即登录）；code 可选（后端验证码可选 · 开放注册）；inviteCode 可选（自动入租户） */
export async function register(req: {
  tenantCode?: string;
  username: string;
  displayName: string;
  password: string;
  channel: CodeChannel;
  target: string;
  code?: string;
  inviteCode?: string;
}): Promise<TokenResponse> {
  return requestApi<TokenResponse>('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
    // @ts-expect-error 同上
    skipAuth401: true,
  });
}

/** POST /api/auth/reset-password - 忘记密码 */
/** POST /api/auth/activate - 首次登录激活(管理员建用户未设密码 · 2026-08)
 *  登录后(token 即身份)直接设置密码,无需再次验证码;带 Authorization */
export async function activate(password: string): Promise<TokenResponse> {
  return requestApi<TokenResponse>('/api/auth/activate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
}

export async function resetPassword(
  channel: CodeChannel,
  target: string,
  code: string,
  newPassword: string,
): Promise<void> {
  return requestApi<void>('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel, target, code, newPassword }),
  });
}

// ---------- 可信身份登录（OAuth 演示通道） ----------

export interface OAuthProvider {
  provider: string;
  name: string;
  hint: string;
  permissions: string[];
}

export interface OAuthAuthorizeResult {
  code: string;
  state: string;
  expiresInSeconds: number;
  memberUsername: string;
  tenantCode: string;
  memberStatus: string;
}

/** OAuth token 响应 = TokenResponse + 可信身份字段 */
export interface OAuthTokenResult extends TokenResponse {
  provider: string;
  memberStatus: string;
  sessionAt: string;
}

export interface SecureSession {
  provider: string;
  username: string;
  tenantCode: string;
  roles: string[];
  at: string;
  memberStatus: string;
}

/** GET /api/auth/oauth/providers - 可信身份通道注册表 */
export async function oauthProviders(): Promise<OAuthProvider[]> {
  return requestApi<OAuthProvider[]>('/api/auth/oauth/providers');
}

/** POST /api/auth/oauth/authorize - 可信身份通道授权（一次性授权码） */
export async function oauthAuthorize(
  provider: string,
  memberUsername: string,
  tenantCode?: string,
): Promise<OAuthAuthorizeResult> {
  return requestApi<OAuthAuthorizeResult>('/api/auth/oauth/authorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, memberUsername, tenantCode }),
  });
}

/** POST /api/auth/oauth/token - 用授权码换 token（可信身份会话） */
export async function oauthToken(
  code: string,
  tenantCode?: string,
): Promise<OAuthTokenResult> {
  return requestApi<OAuthTokenResult>('/api/auth/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, tenantCode }),
  });
}
