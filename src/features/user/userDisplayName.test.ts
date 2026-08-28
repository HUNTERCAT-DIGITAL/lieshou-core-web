/**
 * userDisplayName 纯函数单测（自 mobile services/users.test.ts 迁移）.
 */
import { describe, expect, it } from 'vitest';
import type { User } from '@lieshoucloud/contract-types/business/user';

import { userDisplayName } from './userDisplayName';

/** 构造完整 User（避免测试对象缺必填字段） */
const u = (over: Partial<User> = {}): User => ({
  id: 1,
  tenantId: 1,
  username: 'u',
  displayName: '',
  status: 'ACTIVE',
  roles: [],
  createdAt: '2026-01-01T00:00:00Z',
  ...over,
});

describe('userDisplayName（展示名优先 displayName）', () => {
  it('displayName 非空 → 优先展示', () => {
    expect(userDisplayName(u({ username: 'admin', displayName: '平台管理员' }))).toBe('平台管理员');
  });

  it('displayName 空串 → 回落 username', () => {
    expect(userDisplayName(u({ username: 'sales', displayName: '' }))).toBe('sales');
  });

  it('displayName 缺省字段场景 → username 兜底', () => {
    expect(userDisplayName(u({ username: 'ops' }))).toBe('ops');
  });
});
