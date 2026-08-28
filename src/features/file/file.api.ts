/**
 * 文件 API（对应后端 core.file · 走注入的传输端口）.
 *
 * 从 admin-web services/file.ts 上收（业务逻辑唯一源）。
 * - 上传返回文件元数据（FileEntity），certAttach 等业务字段存 fileId
 * - 下载/预览：GET /api/files/{id}/content 强制鉴权 → asBlob（自动带 Authorization），
 *   拿到 Blob 后由调用方生成 objectURL 预览/下载
 */
import { requestApi } from '../../config/provider';

/** FileEntity（与 core.file FileEntity 对齐） */
export interface FileMeta {
  id: number;
  tenantId: number;
  originalName: string;
  contentType?: string | null;
  size: number;
  createdAt: string;
}

/**
 * 上传文件（multipart · ≤20MB · 字段名 file）。
 * @returns 文件元数据（含 id）
 */
export async function uploadFile(file: File): Promise<FileMeta> {
  const form = new FormData();
  form.append('file', file);
  return requestApi<FileMeta>('/api/files', {
    method: 'POST',
    body: form,
  });
}

/** 文件下载/预览地址（inline；跨域走 gateway /api/files/{id}/content） */
export function fileContentUrl(id: number): string {
  return `/api/files/${id}/content`;
}

/** 通过 id 查询文件元数据（租户内） */
export async function getFileMeta(id: number): Promise<FileMeta> {
  return requestApi<FileMeta>(`/api/files/${id}`);
}

/**
 * 下载/预览文件内容（强制鉴权 · 自动带 Authorization）。
 * @returns Blob（调用方 `URL.createObjectURL(blob)` 后预览或触发下载）
 */
export async function fetchFileContent(id: number): Promise<Blob> {
  return requestApi<Blob>(`/api/files/${id}/content`, { asBlob: true });
}
