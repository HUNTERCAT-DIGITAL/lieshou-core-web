/**
 * 当前用户所属组织 hook（P-2 组织树组件上平台 · 数据隔离）.
 *
 * 子公司员工 → orgId 非空（页面默认按本公司过滤）；总部员工 → null（集团视图）。
 * 模块级缓存：登录后首次获取，避免各页面重复请求。
 */
import { useEffect, useState } from 'react';
import { getMyOrg } from './org.api';
import type { UserOrgInfo } from '@lieshoucloud/contract-types/business/org';

// 模块级缓存：登录后首次获取，避免各页面重复请求
let cached: UserOrgInfo | null | undefined;

export interface MyOrgInfo {
  orgId: number | null;
  orgName: string | null;
  loading: boolean;
}

export function useMyOrg(): MyOrgInfo {
  const [info, setInfo] = useState<UserOrgInfo | null>(cached ?? null);
  const [loading, setLoading] = useState(cached === undefined);

  useEffect(() => {
    if (cached !== undefined) return;
    getMyOrg()
      .then((d) => {
        cached = d;
        setInfo(d);
      })
      .catch(() => {
        cached = { userId: null, orgId: null, orgName: null };
        setInfo(cached);
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    orgId: info?.orgId ?? null,
    orgName: info?.orgName ?? null,
    loading,
  };
}
