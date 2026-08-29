/**
 * 评审 API（智法云枢 · 办案产物评审闭环）.
 *
 * @see @lieshoucloud/contract-types/business/legal
 */
import { requestApi } from '../../config/provider';
import type {
  LegalReview,
  ReviewDecisionRequest,
  ReviewRequest,
} from '@lieshoucloud/contract-types/business/legal';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/legal/cases/{caseId}/reviews — 案件评审列表 */
export async function listCaseReviews(caseId: number): Promise<LegalReview[]> {
  return requestApi<LegalReview[]>(`/api/legal/cases/${caseId}/reviews`);
}

/** GET /api/legal/reviews — 全部评审（分页） */
export async function listReviews(): Promise<LegalReview[]> {
  return requestApi<LegalReview[]>('/api/legal/reviews');
}

/** GET /api/legal/reviews/mine — 我待审/我参与的 */
export async function listMyReviews(): Promise<LegalReview[]> {
  return requestApi<LegalReview[]>('/api/legal/reviews/mine');
}

/** POST /api/legal/reviews — 发起评审 */
export async function createReview(body: ReviewRequest): Promise<LegalReview> {
  return requestApi<LegalReview>('/api/legal/reviews', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** POST /api/legal/reviews/{id}/decide — 评审裁决（APPROVED/REJECTED） */
export async function decideReview(id: number, body: ReviewDecisionRequest): Promise<LegalReview> {
  return requestApi<LegalReview>(`/api/legal/reviews/${id}/decide`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}
