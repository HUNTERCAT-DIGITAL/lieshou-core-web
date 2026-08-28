/**
 * 用户展示名工具（纯函数 · 四端共用）.
 *
 * 自 mobile services/users.ts 上收（业务逻辑唯一源）：
 * 审批流 / 工作台选人场景统一展示 displayName，缺省回落 username。
 */
import type { User } from '@lieshoucloud/contract-types/business/user';

/** 展示名：displayName 优先，空串/缺省回落 username */
export function userDisplayName(u: User): string {
  return u.displayName || u.username;
}
