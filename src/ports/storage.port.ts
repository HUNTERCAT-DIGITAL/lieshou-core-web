/** 存储端口：会话持久化（各端注入——localStorage / AsyncStorage / Taro Storage） */
export interface StoragePort {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}
