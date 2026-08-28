/**
 * 工作台装配 hooks（菜单/能力裁剪 · 对应后端 framework 的能力目录哲学）.
 *
 * 职责边界（2026-09）：本 hook 是「能力目录裁剪器」（CapabilityDef → 按 edition.capabilities
 * 过滤），供商业/客户版菜单渲染用。端壳侧「行业 × 角色 × 客户 tab 注入」的完整装配
 * 在各端 config（mobile: src/config/workbench.ts getWorkbench），两者分层不同、不重复。
 */
import { useMemo } from 'react';

export interface WorkbenchItem {
  key: string;
  label: string;
  path: string;
}

export interface WorkbenchOptions {
  /** 行业/客户 Edition 声明的能力 id（如 legal/cases） */
  capabilities?: string[];
  /** 全部可用菜单（由各端注入/import） */
  items: WorkbenchItem[];
}

/** 按 capabilities 裁剪菜单：缺省全量（开源通用），商业/客户 Edition 裁剪（纯函数，便于单测） */
export function filterWorkbenchItems(items: WorkbenchItem[], capabilities?: string[]): WorkbenchItem[] {
  if (!capabilities || capabilities.length === 0) return items;
  return items.filter((i) => capabilities.some((c) => c.startsWith(i.key) || i.key.startsWith(c)));
}

/** 工作台装配 hooks（菜单/能力裁剪 · 对应后端 framework 的能力目录哲学） */
export function useWorkbench({ capabilities, items }: WorkbenchOptions) {
  return useMemo(() => filterWorkbenchItems(items, capabilities), [capabilities, items]);
}
