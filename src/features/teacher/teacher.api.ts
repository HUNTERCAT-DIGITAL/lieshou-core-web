/**
 * 师资档案 API（对应后端 edu-service · 走注入的传输端口）.
 *
 * 从 admin-web services/teacher.ts 上收（P0 推广 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * zhiye 教育行业版（智野 B2B2C 供应侧 · 师资档案）：后端强制 X-Tenant-Id（来自 JWT），
 * 跨租户访问返回 404。
 */
import { requestApi } from '../../config/provider';
import type {
  CreateTeacherRequest,
  Teacher,
  TeacherStatus,
  UpdateTeacherRequest,
} from '@lieshoucloud/contract-types/business/teacher';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/teachers — 租户内师资列表（可选 keyword / status 过滤；后端未分页） */
export async function listTeachers(keyword?: string, status?: TeacherStatus): Promise<Teacher[]> {
  const params: string[] = [];
  if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
  if (status) params.push(`status=${status}`);
  const qs = params.length > 0 ? `?${params.join('&')}` : '';
  return requestApi<Teacher[]>(`/api/teachers${qs}`);
}

/** GET /api/teachers/count — 租户内未删师资数 */
export async function countTeachers(): Promise<number> {
  return requestApi<number>('/api/teachers/count');
}

/** GET /api/teachers/{id} */
export async function getTeacher(id: number): Promise<Teacher> {
  return requestApi<Teacher>(`/api/teachers/${id}`);
}

/** POST /api/teachers — 创建（tenant 强制取请求租户；idCard 只写不读） */
export async function createTeacher(body: CreateTeacherRequest): Promise<Teacher> {
  return requestApi<Teacher>('/api/teachers', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/teachers/{id} */
export async function updateTeacher(id: number, body: UpdateTeacherRequest): Promise<Teacher> {
  return requestApi<Teacher>(`/api/teachers/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/teachers/{id} — 软删（后端置 is_deleted=true） */
export async function deleteTeacher(id: number): Promise<void> {
  return requestApi<void>(`/api/teachers/${id}`, { method: 'DELETE' });
}
