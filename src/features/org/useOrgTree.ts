/**
 * 组织树 hook（P-2 组织树组件上平台 · 业务逻辑唯一源）.
 *
 * 封装：组织列表加载 + 子公司/部门树构建 + 创建/停用/编辑档案 + 人员统计。
 * 页面组件只做渲染；数据加载/变更/错误提示在此统一处理（notifier 走注入端口）。
 * 投资属性（equityRatio/registeredCapital/legalPerson/profile）为被投企业档案可选字段。
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAdapters } from '../../config/provider';
import {
  createOrg,
  disableOrg,
  getEmployeeStats,
  listOrgs,
  updateOrg,
} from './org.api';
import type {
  CreateOrgInput,
  Organization,
  OrgStaffStats,
  OrgType,
  UpdateOrgInput,
} from '@lieshoucloud/contract-types/business/org';

export interface OrgTreeState {
  /** 全部组织（子公司 + 部门） */
  orgs: Organization[];
  /** 人员统计（按组织分组） */
  staff: OrgStaffStats[];
  loading: boolean;
  /** 子公司（一级） */
  companies: Organization[];
  /** 部门（二级） */
  departments: Organization[];
  /** 按子公司聚合的项目数（由调用方传入 summary.byOrg） */
}

/**
 * 组织树数据 hook：加载组织 + 人员统计，暴露派生数据与 CRUD 操作。
 *
 * @param options.byOrg 可选：子公司 → 项目数聚合（Record<orgId, count>，来自项目 summary）
 */
export function useOrgTree(options?: { byOrg?: Record<string, number> }) {
  const { notifier } = getAdapters();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [staff, setStaff] = useState<OrgStaffStats[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [orgList, stats] = await Promise.all([
        listOrgs(),
        getEmployeeStats().catch(() => [] as OrgStaffStats[]),
      ]);
      setOrgs(orgList);
      setStaff(stats);
    } catch (e) {
      notifier.error(`组织数据加载失败：${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  }, [notifier]);

  useEffect(() => {
    void load();
  }, [load]);

  /** 创建组织（子公司/部门） */
  const create = useCallback(
    async (input: CreateOrgInput): Promise<boolean> => {
      try {
        await createOrg(input);
        notifier.success(input.type === 'COMPANY' ? '子公司已创建' : '部门已创建');
        void load();
        return true;
      } catch (e) {
        notifier.error(`创建失败：${e instanceof Error ? e.message : String(e)}`);
        return false;
      }
    },
    [notifier, load],
  );

  /** 停用组织 */
  const disable = useCallback(
    async (org: Organization): Promise<boolean> => {
      try {
        await disableOrg(org.id);
        notifier.success(`「${org.name}」已停用`);
        void load();
        return true;
      } catch (e) {
        notifier.error(`停用失败：${e instanceof Error ? e.message : String(e)}`);
        return false;
      }
    },
    [notifier, load],
  );

  /** 编辑档案（名称/城市/投资属性） */
  const update = useCallback(
    async (id: number, input: UpdateOrgInput): Promise<boolean> => {
      try {
        await updateOrg(id, input);
        notifier.success('档案已更新');
        void load();
        return true;
      } catch (e) {
        notifier.error(`更新失败：${e instanceof Error ? e.message : String(e)}`);
        return false;
      }
    },
    [notifier, load],
  );

  const companies = useMemo(() => orgs.filter((o) => o.type === 'COMPANY'), [orgs]);
  const departments = useMemo(() => orgs.filter((o) => o.type === 'DEPARTMENT'), [orgs]);

  return {
    orgs,
    staff,
    loading,
    companies,
    departments,
    create,
    disable,
    update,
    reload: load,
  };
}

export type { OrgType };
