/**
 * 审批 API（对应后端 approval-service · 走注入的传输端口）.
 *
 * 从 admin-web services/approval.ts 上收（P0 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一，
 * 避免 /api/api 双前缀（见 0d0fdeb 路径归一）。
 */
import { requestApi } from '../../config/provider';
import type {
  ApprovalCounts,
  ApprovalRequest,
  ApprovalStatus,
  ApprovalType,
  CreateApprovalRequest,
  DecideRequest,
} from '@lieshoucloud/contract-types/business/approval';

/** GET /api/approvals — 租户内列表（role: mine=我发起的 / inbox=待我审批 / all=全部） */
export async function listApprovals(params?: {
  role?: 'mine' | 'inbox' | 'all';
  status?: ApprovalStatus;
  type?: ApprovalType;
}): Promise<ApprovalRequest[]> {
  const qs = new URLSearchParams();
  if (params?.role) qs.set('role', params.role);
  if (params?.status) qs.set('status', params.status);
  if (params?.type) qs.set('type', params.type);
  const s = qs.toString();
  return requestApi<ApprovalRequest[]>(`/api/approvals${s ? `?${s}` : ''}`);
}

/** GET /api/approvals/counts — 待办计数（inbox=待我审批 / mine=我发起待处理） */
export async function getApprovalCounts(): Promise<ApprovalCounts> {
  return requestApi<ApprovalCounts>('/api/approvals/counts');
}

/** GET /api/approvals/{id} */
export async function getApproval(id: number): Promise<ApprovalRequest> {
  return requestApi<ApprovalRequest>(`/api/approvals/${id}`);
}

/** POST /api/approvals — 发起审批 */
export async function createApproval(body: CreateApprovalRequest): Promise<ApprovalRequest> {
  return requestApi<ApprovalRequest>('/api/approvals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** POST /api/approvals/{id}/approve — 通过（仅审批人） */
export async function approveApproval(id: number, body?: DecideRequest): Promise<ApprovalRequest> {
  return requestApi<ApprovalRequest>(`/api/approvals/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
}

/** POST /api/approvals/{id}/reject — 驳回（仅审批人，comment 必填） */
export async function rejectApproval(id: number, comment: string): Promise<ApprovalRequest> {
  return requestApi<ApprovalRequest>(`/api/approvals/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment }),
  });
}

/** POST /api/approvals/{id}/cancel — 撤销（仅发起人） */
export async function cancelApproval(id: number, comment?: string): Promise<ApprovalRequest> {
  return requestApi<ApprovalRequest>(`/api/approvals/${id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment ? { comment } : {}),
  });
}
