/**
 * 知识 API（智法云枢 · 知识卡 + 知识流沉淀 + 知识图谱）.
 *
 * @see @lieshoucloud/contract-types/business/legal
 */
import { requestApi } from '../../config/provider';
import type {
  KnowledgeCard,
  KnowledgeCardRequest,
  KnowledgeCardStatus,
  KnowledgeFlow,
  KnowledgeFlowAdvanceRequest,
  KnowledgeFlowRequest,
  KnowledgeSummary,
} from '@lieshoucloud/contract-types/business/legal';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// ── 知识卡 ──

/** GET /api/legal/knowledge-cards — 知识卡列表 */
export async function listKnowledgeCards(): Promise<KnowledgeCard[]> {
  return requestApi<KnowledgeCard[]>('/api/legal/knowledge-cards');
}

/** GET /api/legal/knowledge-cards/summary */
export async function getKnowledgeSummary(): Promise<KnowledgeSummary> {
  return requestApi<KnowledgeSummary>('/api/legal/knowledge-cards/summary');
}

/** GET /api/legal/knowledge-cards/recommended — 推荐（我的） */
export async function listRecommendedCards(): Promise<KnowledgeCard[]> {
  return requestApi<KnowledgeCard[]>('/api/legal/knowledge-cards/recommended');
}

/** GET /api/legal/knowledge-cards/contribution — 贡献榜 */
export async function listContribution(): Promise<KnowledgeCard[]> {
  return requestApi<KnowledgeCard[]>('/api/legal/knowledge-cards/contribution');
}

/** POST /api/legal/knowledge-cards */
export async function createKnowledgeCard(body: KnowledgeCardRequest): Promise<KnowledgeCard> {
  return requestApi<KnowledgeCard>('/api/legal/knowledge-cards', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/knowledge-cards/{id} */
export async function updateKnowledgeCard(
  id: number,
  body: KnowledgeCardRequest,
): Promise<KnowledgeCard> {
  return requestApi<KnowledgeCard>(`/api/legal/knowledge-cards/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/knowledge-cards/{id}/status — 状态流转 */
export async function updateKnowledgeCardStatus(
  id: number,
  status: KnowledgeCardStatus,
): Promise<KnowledgeCard> {
  return requestApi<KnowledgeCard>(`/api/legal/knowledge-cards/${id}/status`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({ status }),
  });
}

/** DELETE /api/legal/knowledge-cards/{id} */
export async function deleteKnowledgeCard(id: number): Promise<void> {
  return requestApi<void>(`/api/legal/knowledge-cards/${id}`, { method: 'DELETE' });
}

/** GET /api/legal/knowledge-graph/{topic} — 知识图谱 */
export async function getKnowledgeGraph(topic: string): Promise<unknown> {
  return requestApi<unknown>(`/api/legal/knowledge-graph/${encodeURIComponent(topic)}`);
}

// ── 知识流（办案经验沉淀） ──

/** GET /api/legal/cases/{caseId}/knowledge-flow — 案件知识流 */
export async function listKnowledgeFlow(caseId: number): Promise<KnowledgeFlow[]> {
  return requestApi<KnowledgeFlow[]>(`/api/legal/cases/${caseId}/knowledge-flow`);
}

/** POST /api/legal/knowledge-flow — 提交知识流条目 */
export async function createKnowledgeFlow(body: KnowledgeFlowRequest): Promise<KnowledgeFlow> {
  return requestApi<KnowledgeFlow>('/api/legal/knowledge-flow', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** POST /api/legal/knowledge-flow/{id}/advance — 流转（评审/脱敏/复用） */
export async function advanceKnowledgeFlow(
  id: number,
  body: KnowledgeFlowAdvanceRequest,
): Promise<KnowledgeFlow> {
  return requestApi<KnowledgeFlow>(`/api/legal/knowledge-flow/${id}/advance`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}
