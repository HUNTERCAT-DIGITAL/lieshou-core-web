/** 认证会话状态（zustand · 平台无关 · 经 storage 端口持久化） */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAdapters } from '../../config/provider';
import type { CurrentUser, TenantOption, TokenResponse } from '@lieshoucloud/contract-types/business/auth';
import { AuthError } from '@lieshoucloud/contract-api';
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
    // token 不含 roles/permissions：此处仅为登录瞬时占位，真实角色由 login/setSession 后的 fetchMe 同步覆盖
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
        // 同步拉取真实 roles/permissions（token 不含角色信息）
        await get()
          .fetchMe()
          .catch((e) => {
            // 登录已成功，不阻断；保留占位 user，告警便于排查
            console.warn('[core-web] fetchMe after login failed:', e);
          });
      },

      refresh: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) throw new AuthError('NO_REFRESH_TOKEN', 'not logged in');
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
        // 同上：同步覆盖占位 roles
        get()
          .fetchMe()
          .catch((e) => console.warn('[core-web] fetchMe after setSession failed:', e));
      },

      logout: () => {
        // 先复位内存状态（会触发 persist 写盘），最后再清持久化——确保 clearStorage 之后无后续 set 写回，
        // storage 中不残留任何会话数据。旧实现误删不存在的 'access_token'/'refresh_token'，
        // 刷新页面 persist rehydrate 后会话复活。
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          availableTenants: [],
        });
        useAuthStore.persist.clearStorage();
      },

      switchTenant: async (tenantCode) => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) throw new AuthError('NO_REFRESH_TOKEN', 'not logged in');
        const token = await switchTenantApi(refreshToken, tenantCode);
        set({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          availableTenants: token.availableTenants ?? [],
        });
        // 切换租户后同步拉取新租户下的用户信息（tenantCode/tenantName/roles 可能变化）
        await get()
          .fetchMe()
          .catch((e) => console.warn('[core-web] fetchMe after switchTenant failed:', e));
      },
    }),
    {
      name: 'lieshoucloud:auth',
      // 各端在 configureCore 注入 storage 端口后显式 rehydrate（见各端入口：
      // admin-web/desktop main.tsx、mobile _layout.tsx、mini-program app.tsx）。
      // 原因：store 在 core-web 模块加载时创建，早于各端 configureCore ——
      // 若默认同步 rehydrate，会落到 defaultAdapters（localStorage），
      // RN 端（无 localStorage）将读不到任何持久化会话。
      skipHydration: true,
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
