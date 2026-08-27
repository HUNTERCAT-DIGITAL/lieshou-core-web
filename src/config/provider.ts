/** 端口注入配置（类比 framework 端口-适配器：核心层定义端口，各端薄壳装配） */
import type { StoragePort } from '../ports/storage.port';
import type { NotifierPort } from '../ports/notifier.port';
import type { NavigationPort } from '../ports/navigation.port';
import type { ApiPort } from '../ports/api.port';

export interface CoreAdapters {
  storage: StoragePort;
  notifier: NotifierPort;
  navigation: NavigationPort;
  /** HTTP 传输（缺省裸 fetch；各端可注入 contract-api 客户端以获得 token/refresh 拦截） */
  api?: ApiPort;
}

let adapters: CoreAdapters | null = null;

/** 各端启动时调用一次：注入端口实现 */
export function configureCore(impl: CoreAdapters): void {
  adapters = impl;
}

/** 核心层内部获取适配器（未配置时抛错，强制各端装配） */
export function getAdapters(): CoreAdapters {
  if (!adapters) throw new Error('core-web 未配置：请先调用 configureCore()');
  return adapters;
}

/** 获取 HTTP 传输：优先注入的 api 端口，缺省裸 fetch */
export function requestApi<T>(path: string, init?: RequestInit): Promise<T> {
  const { api } = getAdapters();
  if (api) return api.request<T>(path, init);
  return fetch(path, init).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
  });
}
