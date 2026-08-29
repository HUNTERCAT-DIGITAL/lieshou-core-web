/**
 * 律师工作台 API（智法云枢 · 今日作战台/最近办理）.
 *
 * @see @lieshoucloud/contract-types/business/legal
 */
import { requestApi } from '../../config/provider';
import type { RecentWorkItem, WorkbenchSummary } from '@lieshoucloud/contract-types/business/legal';

/** GET /api/legal/workbench/summary — 工作台统计（在办/高关注/律时/待确认/文书） */
export async function getWorkbenchSummary(): Promise<WorkbenchSummary> {
  return requestApi<WorkbenchSummary>('/api/legal/workbench/summary');
}

/** GET /api/legal/workbench/recent — 最近办理案件 */
export async function getWorkbenchRecent(): Promise<RecentWorkItem[]> {
  return requestApi<RecentWorkItem[]>('/api/legal/workbench/recent');
}
