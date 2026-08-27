/** 认证会话状态（zustand · 平台无关 · 经 storage 端口持久化） */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAdapters } from '../../config/provider';
import type { CurrentUser, TenantOption, TokenResponse } from '@lieshoucloud/contract-types/business/auth';
import { fetchCurrentUser, login as loginApi, refreshTokens, switchTenant as switchTenantApi } from './auth.api';

export interface Session {
  accessToken: string | null;
  refreshToken: string | null;
  user: CurrentUser | null;
  isAuthenticated: boolean;
  availableTenants: TenantOption[];
}

interface AuthState extends Session {
  login: (username: string, password: string, tenantCode?: string) => Promise<void>;
  refresh: () => Promise<void>;
  fetchMe: () => Promise<CurrentUser>;
  logout: () => void;
  setSession: (token: TokenResponse) => void;
  switchTenant: (tenantCode: string) => Promise<void>;
}

function toUser(token: TokenResponse): CurrentUser {
  return {
    userId: token.userId,
    username: token.username,
    roles: ['USER'],
    tenantCode: token.tenantCode,
    tenantName: token.tenantName,
    tenantEdition: token.tenantEdition,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      availableTenants: [],

      login: async (username, password, tenantCode) => {
        const token = await loginApi({ username, password, tenantCode });
        set({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          user: toUser(token),
          isAuthenticated: true,
          availableTenants: token.availableTenants ?? [],
        });
        get()
          .fetchMe()
          .catch(() => {
            /* 异步拿真实 roles */
          });
      },

      refresh: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');
        const token = await refreshTokens(refreshToken);
        set({ accessToken: token.accessToken, refreshToken: token.refreshToken });
      },

      fetchMe: async () => {
        const me = await fetchCurrentUser();
        set({ user: me });
        return me;
      },

      setSession: (token) => {
        set({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          user: toUser(token),
          isAuthenticated: true,
          availableTenants: token.availableTenants ?? [],
        });
        get()
          .fetchMe()
          .catch(() => {});
      },

      logout: () => {
        const { storage } = getAdapters();
        storage.remove('access_token');
        storage.remove('refresh_token');
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          availableTenants: [],
        });
      },

      switchTenant: async (tenantCode) => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');
        const token = await switchTenantApi(refreshToken, tenantCode);
        set({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          availableTenants: token.availableTenants ?? [],
        });
      },
    }),
    {
      name: 'lieshoucloud:auth',
      storage: {
        getItem: (name) => {
          const v = getAdapters().storage.get(name);
          return v ? (JSON.parse(v) as never) : null;
        },
        setItem: (name, value) => getAdapters().storage.set(name, JSON.stringify(value)),
        removeItem: (name) => getAdapters().storage.remove(name),
      },
    },
  ),
);
