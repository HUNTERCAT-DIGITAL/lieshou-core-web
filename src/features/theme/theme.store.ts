/**
 * 主题模式 store（暗色主题 · 业务逻辑唯一源）.
 *
 * 自 admin-web stores/theme.ts 上收（Phase 9 · UI.md §2.1 留口落地）。
 * - 'light' | 'dark' | 'system' 三种偏好
 * - 持久化到 storage（key 'lieshoucloud:theme',与 admin 历史 key 一致,平滑迁移）
 * - 系统偏好监听由 useThemeMode 负责（matchMedia change）
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeStoreState {
  mode: ThemeMode;
  /** 当前生效的主题（解析系统偏好后） */
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  /** 由 useThemeMode hook 调用，更新系统偏好解析结果 */
  setResolved: (resolved: ResolvedTheme) => void;
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set) => ({
      mode: 'system',
      resolved: 'light',
      setMode: (mode) => set({ mode }),
      setResolved: (resolved) => set({ resolved }),
    }),
    {
      name: 'lieshoucloud:theme',
      partialize: (s) => ({ mode: s.mode }),
    },
  ),
);
