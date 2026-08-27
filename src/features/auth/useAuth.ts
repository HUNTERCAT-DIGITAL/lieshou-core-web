/** 认证 hooks（核心层单点 · 4 端复用） */
import { useCallback } from 'react';
import { getAdapters } from '../../config/provider';
import { useAuthStore } from './auth.store';

export interface UseAuth {
  isAuthenticated: boolean;
  user: typeof useAuthStore extends infer _ ? import('@lieshoucloud/contract-types/business/auth').CurrentUser | null : never;
  accessToken: string | null;
  login: (username: string, password: string, tenantCode?: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<import('@lieshoucloud/contract-types/business/auth').CurrentUser>;
  switchTenant: (tenantCode: string) => Promise<void>;
}

export function useAuth(): UseAuth {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const switchTenant = useAuthStore((s) => s.switchTenant);

  const handleLogout = useCallback(() => {
    const { navigation } = getAdapters();
    logout();
    navigation.replace('/login');
  }, [logout]);

  return { isAuthenticated, user, accessToken, login, logout: handleLogout, fetchMe, switchTenant };
}
