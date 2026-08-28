/**
 * 主题 store + resolveTheme 解析逻辑测试（自 admin-web hooks/useThemeMode.test.ts 迁移）.
 *
 * 迁移改进:resolveTheme 已在共享层导出,直接测真实实现（无需页面内复刻）。
 */
import { afterEach, describe, expect, it } from 'vitest';

import { useThemeStore } from './theme.store';
import type { ThemeMode } from './theme.store';
import { resolveTheme } from './useThemeMode';

describe('theme store', () => {
  afterEach(() => {
    localStorage.clear();
    useThemeStore.setState({ mode: 'system', resolved: 'light' });
  });

  it('默认 mode 是 system', () => {
    expect(useThemeStore.getState().mode).toBe('system');
  });

  it('setMode 写入 store', () => {
    useThemeStore.getState().setMode('dark');
    expect(useThemeStore.getState().mode).toBe('dark');
  });
});

describe('resolveTheme（mode + 系统偏好合并）', () => {
  it('mode=light → 永远 light（忽略系统）', () => {
    expect(resolveTheme('light', false)).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
  });

  it('mode=dark → 永远 dark（忽略系统）', () => {
    expect(resolveTheme('dark', false)).toBe('dark');
    expect(resolveTheme('dark', true)).toBe('dark');
  });

  it('mode=system → 跟随系统', () => {
    expect(resolveTheme('system', false)).toBe('light');
    expect(resolveTheme('system', true)).toBe('dark');
  });
});
