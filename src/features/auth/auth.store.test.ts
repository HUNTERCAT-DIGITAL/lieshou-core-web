/**
 * auth store 行为测试：
 * - login 后同步 fetchMe（真实 roles 覆盖占位，而非静默丢弃）
 * - logout 清空 persist 持久化（key 'lieshoucloud:auth'），刷新后会话不复活
 * - switchTenant 后刷新新租户下的用户信息
 *
 * 注意：persist 的 storage 包装在运行时调 getAdapters()，configureCore 每次更新即生效，
 * 因此不需要 vi.resetModules（resetModules 会产生第二个 provider 模块实例，配置丢失）。
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { configureCore } from '../../config/provider';
import { useAuthStore } from './auth.store';
import type { CurrentUser, TokenResponse } from '@lieshoucloud/contract-types/business/auth';

vi.mock('./auth.api', () => ({
  login: vi.fn(),
  refreshTokens: vi.fn(),
  fetchCurrentUser: vi.fn(),
  switchTenant: vi.fn(),
}));

import {
  fetchCurrentUser,
  login as loginApi,
  refreshTokens as refreshTokensApi,
  switchTenant as switchTenantApi,
} from './auth.api';

function createMemoryStorage() {
  const map = new Map<string, string>();
  return {
    get: vi.fn((k: string) => map.get(k) ?? null),
    set: vi.fn((k: string, v: string) => void map.set(k, v)),
    remove: vi.fn((k: string) => void map.delete(k)),
    _map: map,
  };
}

const token: TokenResponse = {
  accessToken: 'at-1',
  refreshToken: 'rt-1',
  expiresIn: 3600,
  tokenType: 'Bearer',
  userId: 1,
  username: 'alice',
  tenantCode: 't1',
  tenantName: '租户一',
  tenantEdition: 'GENERIC',
  availableTenants: [{ tenantId: 1, tenantCode: 't1', tenantName: '租户一' }],
};

const realUser: CurrentUser = {
  userId: 1,
  tenantCode: 't1',
  tenantName: '租户一',
  username: 'alice',
  roles: ['ADMIN', 'approval:approve'],
};

let storage: ReturnType<typeof createMemoryStorage>;

beforeEach(() => {
  vi.clearAllMocks();
  storage = createMemoryStorage();
  configureCore({
    storage,
    notifier: { success: vi.fn(), error: vi.fn() },
    navigation: { to: vi.fn(), replace: vi.fn() },
  });
  // 重置 store 状态，避免测试间污染
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
    availableTenants: [],
  });
});

describe('login', () => {
  it('登录成功后同步 fetchMe，user.roles 为真实角色（而非占位 USER）', async () => {
    vi.mocked(loginApi).mockResolvedValue(token);
    vi.mocked(fetchCurrentUser).mockResolvedValue(realUser);

    await useAuthStore.getState().login('alice', 'pw');

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.roles).toEqual(['ADMIN', 'approval:approve']);
    expect(fetchCurrentUser).toHaveBeenCalledTimes(1);
  });

  it('fetchMe 失败不阻断登录：user 保留占位，isAuthenticated 仍为 true', async () => {
    vi.mocked(loginApi).mockResolvedValue(token);
    vi.mocked(fetchCurrentUser).mockRejectedValue(new Error('me 500'));

    await expect(useAuthStore.getState().login('alice', 'pw')).resolves.toBeUndefined();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.roles).toEqual(['USER']);
  });
});

describe('logout', () => {
  it('清空 persist 持久化 key（lieshoucloud:auth），而非不存在的 access_token/refresh_token', async () => {
    vi.mocked(loginApi).mockResolvedValue(token);
    vi.mocked(fetchCurrentUser).mockResolvedValue(realUser);
    await useAuthStore.getState().login('alice', 'pw');

    // 登录后 persist 已写入（key: lieshoucloud:auth）
    expect(storage.get('lieshoucloud:auth')).not.toBeNull();

    useAuthStore.getState().logout();

    // persist key 被正确清除
    expect(storage.remove).toHaveBeenCalledWith('lieshoucloud:auth');
    expect(storage.get('lieshoucloud:auth')).toBeNull();
    // 会话状态全部复位
    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(false);
    expect(s.accessToken).toBeNull();
    expect(s.user).toBeNull();
  });
});

describe('switchTenant', () => {
  it('切换租户后同步刷新新租户下的用户信息（tenantCode/roles）', async () => {
    vi.mocked(loginApi).mockResolvedValue(token);
    vi.mocked(fetchCurrentUser).mockResolvedValueOnce(realUser); // 登录时
    await useAuthStore.getState().login('alice', 'pw');

    const t2Token: TokenResponse = {
      ...token,
      accessToken: 'at-2',
      tenantCode: 't2',
      tenantName: '租户二',
      availableTenants: [
        { tenantId: 1, tenantCode: 't1', tenantName: '租户一' },
        { tenantId: 2, tenantCode: 't2', tenantName: '租户二' },
      ],
    };
    const t2User: CurrentUser = { ...realUser, tenantCode: 't2', tenantName: '租户二', roles: ['USER'] };
    vi.mocked(switchTenantApi).mockResolvedValue(t2Token);
    vi.mocked(fetchCurrentUser).mockResolvedValueOnce(t2User); // 切换后刷新

    await useAuthStore.getState().switchTenant('t2');

    const s = useAuthStore.getState();
    expect(s.accessToken).toBe('at-2');
    expect(s.user?.tenantCode).toBe('t2');
    expect(s.user?.tenantName).toBe('租户二');
    expect(s.user?.roles).toEqual(['USER']);
    expect(fetchCurrentUser).toHaveBeenCalledTimes(2);
  });
});

describe('refresh', () => {
  it('刷新成功：更新 accessToken/refreshToken', async () => {
    useAuthStore.setState({
      accessToken: 'at-old',
      refreshToken: 'rt-1',
      user: realUser,
      isAuthenticated: true,
      availableTenants: [],
    });
    vi.mocked(refreshTokensApi).mockResolvedValue({ ...token, accessToken: 'at-new', refreshToken: 'rt-new' });

    await useAuthStore.getState().refresh();

    const s = useAuthStore.getState();
    expect(s.accessToken).toBe('at-new');
    expect(s.refreshToken).toBe('rt-new');
    expect(refreshTokensApi).toHaveBeenCalledWith('rt-1');
  });

  it('无 refreshToken → 抛 AuthError，不调接口', async () => {
    useAuthStore.setState({ accessToken: 'at', refreshToken: null, isAuthenticated: true });

    await expect(useAuthStore.getState().refresh()).rejects.toThrow('not logged in');
    expect(refreshTokensApi).not.toHaveBeenCalled();
  });

  it('刷新失败（refresh token 失效）→ 抛错且不清会话（由调用方决定登出）', async () => {
    useAuthStore.setState({ accessToken: 'at', refreshToken: 'rt-dead', isAuthenticated: true });
    vi.mocked(refreshTokensApi).mockRejectedValue(new Error('INVALID_REFRESH_TOKEN'));

    await expect(useAuthStore.getState().refresh()).rejects.toThrow('INVALID_REFRESH_TOKEN');
    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(true);
    expect(s.accessToken).toBe('at');
  });
});

describe('会话持久化恢复（rehydrate）', () => {
  it('端口注入后显式 rehydrate：从 storage 恢复 isAuthenticated/accessToken/user', async () => {
    // 模拟已持久化的会话（zustand persist 格式：{ state, version }）
    const persisted = JSON.stringify({
      state: {
        accessToken: 'at-restored',
        refreshToken: 'rt-restored',
        user: realUser,
        isAuthenticated: true,
        availableTenants: token.availableTenants,
      },
      version: 0,
    });
    storage._map.set('lieshoucloud:auth', persisted);

    useAuthStore.persist.rehydrate();

    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(true);
    expect(s.accessToken).toBe('at-restored');
    expect(s.refreshToken).toBe('rt-restored');
    expect(s.user?.username).toBe('alice');
  });

  it('无持久化数据 → rehydrate 后保持未登录', () => {
    useAuthStore.persist.rehydrate();
    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(false);
    expect(s.accessToken).toBeNull();
  });
});
