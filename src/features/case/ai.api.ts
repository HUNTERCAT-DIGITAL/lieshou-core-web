/**
 * AI 会话 API（智法云枢 · 办案助手:案件秘书/计时数字化/合规/检索）.
 *
 * @see @lieshoucloud/contract-types/business/legal
 */
import { requestApi } from '../../config/provider';
import type {
  AiSession,
  AiSessionLayerRequest,
  AiSessionRequest,
  AiSuggestion,
  AiSuggestionHandleRequest,
  AiSuggestionRequest,
} from '@lieshoucloud/contract-types/business/legal';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** POST /api/legal/ai/sessions — 新建 AI 会话 */
export async function createAiSession(body: AiSessionRequest): Promise<AiSession> {
  return requestApi<AiSession>('/api/legal/ai/sessions', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** GET /api/legal/ai/sessions/mine — 我的会话 */
export async function listMyAiSessions(): Promise<AiSession[]> {
  return requestApi<AiSession[]>('/api/legal/ai/sessions/mine');
}

/** GET /api/legal/ai/cases/{caseId}/sessions — 案件会话 */
export async function listCaseAiSessions(caseId: number): Promise<AiSession[]> {
  return requestApi<AiSession[]>(`/api/legal/ai/cases/${caseId}/sessions`);
}

/** POST /api/legal/ai/sessions/{id}/layer — 会话升级（草稿→入卷→…） */
export async function advanceAiSessionLayer(
  id: number,
  body: AiSessionLayerRequest,
): Promise<AiSession> {
  return requestApi<AiSession>(`/api/legal/ai/sessions/${id}/layer`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** POST /api/legal/ai/sessions/{id}/suggestions — 生成建议 */
export async function createAiSuggestion(
  sessionId: number,
  body: AiSuggestionRequest,
): Promise<AiSuggestion> {
  return requestApi<AiSuggestion>(`/api/legal/ai/sessions/${sessionId}/suggestions`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** GET /api/legal/ai/sessions/{id}/suggestions — 会话建议列表 */
export async function listAiSuggestions(sessionId: number): Promise<AiSuggestion[]> {
  return requestApi<AiSuggestion[]>(`/api/legal/ai/sessions/${sessionId}/suggestions`);
}

/** POST /api/legal/ai/suggestions/{id}/handle — 处理建议（采纳/修改/拒绝） */
export async function handleAiSuggestion(
  id: number,
  body: AiSuggestionHandleRequest,
): Promise<AiSuggestion> {
  return requestApi<AiSuggestion>(`/api/legal/ai/suggestions/${id}/handle`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}
