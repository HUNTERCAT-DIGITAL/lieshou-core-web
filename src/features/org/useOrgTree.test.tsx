/**
 * useOrgTree 行为测试（P-2 组织树组件上平台）：
 * - 经注入的 ApiPort 走统一 requestApi（非裸 fetch）
 * - 组织列表 + 人员统计并行加载，成功后派生子公司/部门
 * - create / disable / update 分别通知 notifier
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { configureCore } from '../../config/provider';
import { useOrgTree } from './useOrgTree';
import type { ApiPort } from '../../ports/api.port';
import type { NotifierPort } from '../../ports/notifier.port';

let requestMock: ReturnType<typeof vi.fn>;
let notifier: {
  success: ReturnType<typeof vi.fn<NotifierPort['success']>>;
  error: ReturnType<typeof vi.fn<NotifierPort['error']>>;
};

/** 按路径分发的 mock：orgs 列表 / 人员统计 / 变更接口 */
function orgRequestMock() {
  return vi.fn((path: string, init?: RequestInit) => {
    if (path.startsWith('/api/orgs') && !init?.method) return Promise.resolve(ORGS);
    if (path.startsWith('/api/employees/stats')) return Promise.resolve(STAFF);
    if (path.startsWith('/api/orgs') && init?.method === 'DELETE') return Promise.resolve({ ok: true });
    return Promise.resolve({});
  });
}

const ORGS = [
  { id: 1, code: 'zhiye', name: '智野教育', type: 'COMPANY', city: '深圳', status: 'ACTIVE' },
  { id: 2, code: 'xingzheng', name: '行政部', type: 'DEPARTMENT', parentId: 1, status: 'ACTIVE' },
];
const STAFF = [{ orgId: 1, total: 3, probation: 1, active: 2, transferred: 0, resigned: 0 }];

beforeEach(() => {
  requestMock = orgRequestMock();
  notifier = { success: vi.fn<NotifierPort['success']>(), error: vi.fn<NotifierPort['error']>() };
  configureCore({
    storage: { get: () => null, set: () => {}, remove: () => {} },
    notifier,
    navigation: { to: vi.fn(), replace: vi.fn() },
    api: { request: requestMock as unknown as ApiPort['request'] },
  });
});

describe('useOrgTree', () => {
  it('并行加载组织与人员统计，派生子公司/部门', async () => {
    const { result } = renderHook(() => useOrgTree());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.orgs).toHaveLength(2);
    expect(result.current.companies).toHaveLength(1);
    expect(result.current.companies[0].name).toBe('智野教育');
    expect(result.current.departments).toHaveLength(1);
    expect(result.current.departments[0].parentId).toBe(1);
    expect(result.current.staff).toEqual(STAFF);
  });

  it('create: 走 POST /api/orgs，成功通知并 reload', async () => {
    const { result } = renderHook(() => useOrgTree());

    await act(async () => {
      await result.current.create({ code: 'newco', name: '新公司', type: 'COMPANY' });
    });

    const calls = requestMock.mock.calls;
    const createCall = calls.find(([p, init]) => p === '/api/orgs' && init?.method === 'POST');
    expect(createCall).toBeDefined();
    const [, init] = createCall as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toMatchObject({ code: 'newco', name: '新公司', type: 'COMPANY' });
    expect(notifier.success).toHaveBeenCalledWith('子公司已创建');
  });

  it('disable: 走 DELETE /api/orgs/{id}，成功通知', async () => {
    const { result } = renderHook(() => useOrgTree());

    await act(async () => {
      await result.current.disable(ORGS[0]);
    });

    const call = requestMock.mock.calls.find(([p, init]) => p === '/api/orgs/1' && init?.method === 'DELETE');
    expect(call).toBeDefined();
    expect(notifier.success).toHaveBeenCalledWith('「智野教育」已停用');
  });

  it('update: 走 PUT /api/orgs/{id}，成功通知', async () => {
    const { result } = renderHook(() => useOrgTree());

    await act(async () => {
      await result.current.update(1, { code: 'zhiye', name: '智野教育(改名)', type: 'COMPANY' });
    });

    const call = requestMock.mock.calls.find(([p, init]) => p === '/api/orgs/1' && init?.method === 'PUT');
    expect(call).toBeDefined();
    const [, init] = call as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toMatchObject({ name: '智野教育(改名)' });
    expect(notifier.success).toHaveBeenCalledWith('档案已更新');
  });

  it('加载失败 → notifier.error（不裸奔）', async () => {
    requestMock.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useOrgTree());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(notifier.error).toHaveBeenCalledWith(expect.stringContaining('boom'));
  });
});
