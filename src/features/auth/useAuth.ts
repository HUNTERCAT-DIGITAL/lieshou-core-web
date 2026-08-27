/** 认证 hooks（核心层单点 · 4 端复用） */
import { useCallback } from 'react';
import { getAdapters } from '../../config/provider';
import { login as loginApi, type LoginParams } from './auth.api';
import { useAuthStore } from './auth.store';

export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const setSession = useAuthStore((s) => s.setSession);
  const clear = useAuthStore((s) => s.clear);

  const login = useCallback(
    async (params: LoginParams) => {
      const { navigation, notifier } = getAdapters();
      try {
        const token = await loginApi(params);
        setSession({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          userId: token.userId,
          username: token.username ?? null,
          tenantCode: token.tenantCode ?? null,
          tenantName: token.tenantName ?? null,
        });
        notifier.success(`欢迎，${token.username}`);
        navigation.replace('/');
      } catch (e) {
        notifier.error(e instanceof Error ? e.message : '登录失败');
      }
    },
    [setSession],
  );

  const logout = useCallback(() => {
    const { storage, navigation } = getAdapters();
    storage.remove('access_token');
    storage.remove('refresh_token');
    clear();
    navigation.replace('/login');
  }, [clear]);

  return { session, login, logout, isAuthenticated: Boolean(session.accessToken) };
}
