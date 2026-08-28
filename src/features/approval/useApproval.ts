/** 审批流程 hooks（对应后端 framework-approval 状态机：PENDING → APPROVED/REJECTED） */
import { useCallback, useState } from 'react';
import { getAdapters, requestApi } from '../../config/provider';

export type ApprovalAction = 'approve' | 'reject';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ApprovalSummary {
  id: number;
  title: string;
  status: ApprovalStatus;
}

/**
 * 审批操作（业务规则单点：状态流转合法性校验在核心层）.
 * 传输走 requestApi → 各端注入的 ApiPort（token 附加 / 401 单飞 refresh / 基址由端注入），
 * 不得裸 fetch（缺 baseUrl/token 会 native 失败 + 401）。
 */
export function useApproval() {
  const [submitting, setSubmitting] = useState(false);

  const submitDecision = useCallback(
    async (approvalId: number, action: ApprovalAction, comment?: string) => {
      const { notifier } = getAdapters();
      setSubmitting(true);
      try {
        await requestApi(`/api/approvals/${approvalId}/${action}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment }),
        });
        notifier.success(action === 'approve' ? '已通过' : '已驳回');
        return true;
      } catch (e) {
        notifier.error(e instanceof Error ? e.message : '操作失败');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return { submitDecision, submitting };
}
