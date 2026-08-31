/**
 * 组织架构 API（对应 project-services /api/orgs + /api/employees/stats · 走注入的传输端口）.
 *
 * 组织树组件上平台（P-2）：从 haizan 客户包 api.ts 上收，业务逻辑唯一源。
 * 全路径带 /api 前缀，由各端 ApiPort 桥接归一（见 0d0fdeb 路径归一）。
 */
import { requestApi } from '../../config/provider';
import type {
  CreateOrgInput,
  Organization,
  OrgStaffStats,
  OrgType,
  UpdateOrgInput,
  UserOrgInfo,
} from '@lieshoucloud/contract-types/business/org';

/** GET /api/orgs — 组织列表（type 可选过滤：COMPANY / DEPARTMENT） */
export async function listOrgs(type?: OrgType): Promise<Organization[]> {
  const qs = type ? `?type=${type}` : '';
  return requestApi<Organization[]>(`/api/orgs${qs}`);
}

/** POST /api/orgs — 创建组织（子公司/部门） */
export async function createOrg(body: CreateOrgInput): Promise<Organization> {
  return requestApi<Organization>('/api/orgs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** DELETE /api/orgs/{id} — 停用组织 */
export async function disableOrg(id: number): Promise<{ ok: boolean }> {
  return requestApi<{ ok: boolean }>(`/api/orgs/${id}`, { method: 'DELETE' });
}

/** PUT /api/orgs/{id} — 更新组织档案（名称/城市/投资属性） */
export async function updateOrg(id: number, body: UpdateOrgInput): Promise<Organization> {
  return requestApi<Organization>(`/api/orgs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** GET /api/employees/stats — 人员统计（按组织分组：总数/试用/在职/转出/离职） */
export async function getEmployeeStats(): Promise<OrgStaffStats[]> {
  return requestApi<OrgStaffStats[]>('/api/employees/stats');
}

/** GET /api/orgs/user-org/me — 当前用户所属组织（数据隔离：子公司员工→orgId；总部→null） */
export async function getMyOrg(): Promise<UserOrgInfo> {
  return requestApi<UserOrgInfo>('/api/orgs/user-org/me');
}
