/**
 * web useResponsive（core-web）—— matchMedia/resize 监听.
 * 供 admin-web / desktop / mobile-web（浏览器/Tauri webview）使用，与 RN/Taro 端断点一致。
 * RN/Taro 端变体见 @lieshoucloud/ui-native（/rn、/taro 子路径）。
 */
import { useEffect, useState } from 'react';

import type { ResponsiveInfo } from './responsive';
import { computeResponsive } from './responsive';

export type { Breakpoint, ResponsiveInfo } from './responsive';
export { TABLET_MIN_WIDTH, TABLET_CONTENT_MAX_WIDTH } from './responsive';

/** 读取当前视口尺寸（浏览器 / jsdom 兼容） */
function getViewport(): { width: number; height: number } {
  return { width: window.innerWidth, height: window.innerHeight };
}

export function useResponsive(): ResponsiveInfo {
  const [size, setSize] = useState(() => getViewport());

  useEffect(() => {
    const onResize = (): void => setSize(getViewport());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return computeResponsive(size.width, size.height);
}
