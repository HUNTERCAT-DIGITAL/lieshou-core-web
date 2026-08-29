/**
 * 跨端响应式共享类型与纯函数（2026-08 自 @lieshoucloud/hooks 迁入 · core-web 唯一源）.
 *
 * 断点约定：
 *   - <768px      → phone（手机：底部 Tab、单列内容）
 *   - >=768px     → tablet（平板：内容自适应、多栏布局）
 */

export type Breakpoint = "phone" | "tablet";

/** 平板阈值：与常见 iPad / Android 平板竖屏宽度对齐（iPad mini 768 / iPad 810+） */
export const TABLET_MIN_WIDTH = 768;

/** 平板内容区最大宽度（大屏不铺满，居中卡片式；超宽屏舒适阅读宽度） */
export const TABLET_CONTENT_MAX_WIDTH = 960;

export interface ResponsiveInfo {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isTablet: boolean;
  isPhone: boolean;
  /** 平板内容区宽度（手机 = 全宽） */
  contentWidth: number;
  /** 平板内容区居中 padding */
  contentPadding: number;
}

/** 由宽高计算响应式信息（纯函数 · 三端共用 · 便于单测） */
export function computeResponsive(width: number, height: number): ResponsiveInfo {
  const isTablet = width >= TABLET_MIN_WIDTH;
  const breakpoint: Breakpoint = isTablet ? "tablet" : "phone";
  return {
    width,
    height,
    breakpoint,
    isTablet,
    isPhone: !isTablet,
    contentWidth: isTablet ? Math.min(width, TABLET_CONTENT_MAX_WIDTH) : width,
    contentPadding: isTablet
      ? Math.max(12, Math.round((width - Math.min(width, TABLET_CONTENT_MAX_WIDTH)) / 2))
      : 0,
  };
}
