/** API 传输端口：各端注入 HTTP 客户端（contract-api createApiClient / 端级封装） */
export interface ApiPort {
  request<T>(path: string, init?: RequestInit): Promise<T>;
}
