/** 审批流程 hooks（对应后端 framework-approval 状态机：PENDING → APPROVED/REJECTED） */
import { useCallback, useState } from 'react';
import { getAdapters } from '../../config/provider';

export type ApprovalAction = 'approve' | 'reject';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ApprovalSummary {
  id: number;
  title: string;
  status: ApprovalStatus;
}

/** 审批操作（业务规则单点：状态流转合法性校验在核心层） */
export function useApproval() {
  const [submitting, setSubmitting] = useState(false);

  const submitDecision = useCallback(
    async (approvalId: number, action: ApprovalAction, comment?: string) => {
      const { notifier } = getAdapters();
      setSubmitting(true);
      try {
        const res = await fetch(`/api/approvals/${approvalId}/${action}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment }),
        });
        if (!res.ok) throw new Error(`审批失败 HTTP ${res.status}`);
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
