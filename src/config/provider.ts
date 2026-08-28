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

/** 默认适配器（测试/SSR 场景不崩；生产各端 configureCore 覆盖） */
const defaultAdapters: CoreAdapters = {
  storage: {
    get: (k) => (typeof localStorage !== 'undefined' ? localStorage.getItem(k) : null),
    set: (k, v) => typeof localStorage !== 'undefined' && localStorage.setItem(k, v),
    remove: (k) => typeof localStorage !== 'undefined' && localStorage.removeItem(k),
  },
  notifier: {
    success: () => {},
    error: (m) => typeof console !== 'undefined' && console.error(m),
  },
  navigation: {
    to: () => {},
    replace: () => {},
  },
};

let adapters: CoreAdapters | null = null;

/** 各端启动时调用一次：注入端口实现（覆盖默认） */
export function configureCore(impl: CoreAdapters): void {
  adapters = { ...defaultAdapters, ...impl };
}

/** 核心层内部获取适配器（未配置时用默认） */
export function getAdapters(): CoreAdapters {
  return adapters ?? defaultAdapters;
}

/** 获取 HTTP 传输：优先注入的 api 端口，缺省裸 fetch */
export function requestApi<T>(
  path: string,
  init?: RequestInit & { asBlob?: boolean },
): Promise<T> {
  const { api } = getAdapters();
  if (api) return api.request<T>(path, init as RequestInit & { asBlob?: boolean });
  return fetch(path, init).then(async (res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return ((init?.asBlob ? res.blob() : res.json()) as Promise<T>);
  });
}
