/**
 * useApproval 行为测试：
 * - 走统一 requestApi（注入的 ApiPort → contract-api），而非裸 fetch（无 token / 401 不拦截）
 * - 成功/失败分别通知 notifier
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { configureCore } from '../../config/provider';
import { useApproval } from './useApproval';
import type { ApiPort } from '../../ports/api.port';
import type { NotifierPort } from '../../ports/notifier.port';

let requestMock: ReturnType<typeof vi.fn>;
let notifier: {
  success: ReturnType<typeof vi.fn<NotifierPort['success']>>;
  error: ReturnType<typeof vi.fn<NotifierPort['error']>>;
};

beforeEach(() => {
  requestMock = vi.fn();
  notifier = { success: vi.fn<NotifierPort['success']>(), error: vi.fn<NotifierPort['error']>() };
  configureCore({
    storage: { get: () => null, set: () => {}, remove: () => {} },
    notifier,
    navigation: { to: vi.fn(), replace: vi.fn() },
    // vitest Mock 的调用签名（Promise<unknown>）无法直接满足 ApiPort 的泛型 request，注入处 cast
    api: { request: requestMock as unknown as ApiPort['request'] },
  });
});

describe('useApproval.submitDecision', () => {
  it('经注入的 ApiPort 提交：正确 path/method/body，成功通知并返回 true', async () => {
    requestMock.mockResolvedValue({});
    const { result } = renderHook(() => useApproval());

    let ok = false;
    await act(async () => {
      ok = await result.current.submitDecision(1, 'approve', '同意');
    });

    expect(requestMock).toHaveBeenCalledTimes(1);
    const [path, init] = requestMock.mock.calls[0];
    expect(path).toBe('/api/approvals/1/approve');
    expect(init).toBeDefined();
    expect(init?.method).toBe('POST');
    expect(JSON.parse(init?.body as string)).toEqual({ comment: '同意' });
    expect(notifier.success).toHaveBeenCalledWith('已通过');
    expect(ok).toBe(true);
    expect(result.current.submitting).toBe(false);
  });

  it('失败：透传错误 message 通知，返回 false', async () => {
    requestMock.mockRejectedValue(new Error('403 无审批权限'));
    const { result } = renderHook(() => useApproval());

    let ok = true;
    await act(async () => {
      ok = await result.current.submitDecision(7, 'reject');
    });

    expect(notifier.error).toHaveBeenCalledWith('403 无审批权限');
    expect(ok).toBe(false);
    expect(result.current.submitting).toBe(false);
  });
});
