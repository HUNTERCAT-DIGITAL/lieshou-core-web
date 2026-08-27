/** 认证 API（经 contract-api 传输层 · 契约来自 contract-types） */
import type { TokenResponse } from '@lieshoucloud/contract-types';
import { getAdapters } from '../../config/provider';

export interface LoginParams {
  tenantCode: string;
  username: string;
  password: string;
}

/** 登录：调后端认证端点（HTTP 传输由 contract-api 提供，此处仅定义业务流程） */
export async function login(params: LoginParams): Promise<TokenResponse> {
  const { storage } = getAdapters();
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`登录失败 HTTP ${res.status}`);
  const token = (await res.json()) as TokenResponse;
  storage.set('access_token', token.accessToken);
  storage.set('refresh_token', token.refreshToken);
  return token;
}
