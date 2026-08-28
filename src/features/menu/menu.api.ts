/**
 * 菜单数据驱动 API（对应后端 user-service · 走注入的传输端口）.
 *
 * 从 admin-web services/menu.ts 上收（业务逻辑唯一源）。
 * GET /api/users/me/menus —— 当前用户菜单树（默认清单 ⊕ 租户覆盖 ⊕ 权限过滤，后端裁决）。
 */
import { requestApi } from '../../config/provider';
import type { MenuNode } from '@lieshoucloud/contract-types/business/menu';

/** GET /api/users/me/menus — 当前用户菜单树 */
export async function fetchUserMenus(): Promise<MenuNode[]> {
  const data = await requestApi<MenuNode[]>('/api/users/me/menus');
  return Array.isArray(data) ? data : [];
}
