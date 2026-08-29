/**
 * 日程 API（智法云枢 · 案件节点/评审/会见/团队会议）.
 *
 * @see @lieshoucloud/contract-types/business/legal
 */
import { requestApi } from '../../config/provider';
import type {
  MatterCalendarSummary,
  MatterSchedule,
  ScheduleRequest,
} from '@lieshoucloud/contract-types/business/legal';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/legal/schedules — 日程列表 */
export async function listSchedules(): Promise<MatterSchedule[]> {
  return requestApi<MatterSchedule[]>('/api/legal/schedules');
}

/** GET /api/legal/schedules/summary */
export async function getScheduleSummary(): Promise<MatterCalendarSummary> {
  return requestApi<MatterCalendarSummary>('/api/legal/schedules/summary');
}

/** GET /api/legal/schedules/{id} */
export async function getSchedule(id: number): Promise<MatterSchedule> {
  return requestApi<MatterSchedule>(`/api/legal/schedules/${id}`);
}

/** POST /api/legal/schedules */
export async function createSchedule(body: ScheduleRequest): Promise<MatterSchedule> {
  return requestApi<MatterSchedule>('/api/legal/schedules', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/schedules/{id} */
export async function updateSchedule(
  id: number,
  body: ScheduleRequest,
): Promise<MatterSchedule> {
  return requestApi<MatterSchedule>(`/api/legal/schedules/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/legal/schedules/{id}/confirm — 确认日程 */
export async function confirmSchedule(id: number): Promise<MatterSchedule> {
  return requestApi<MatterSchedule>(`/api/legal/schedules/${id}/confirm`, { method: 'PUT' });
}

/** DELETE /api/legal/schedules/{id} */
export async function deleteSchedule(id: number): Promise<void> {
  return requestApi<void>(`/api/legal/schedules/${id}`, { method: 'DELETE' });
}
