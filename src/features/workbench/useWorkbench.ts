/** 工作台装配 hooks（菜单/能力裁剪 · 对应后端 framework 的能力目录哲学） */
import { useMemo } from 'react';

export interface WorkbenchItem {
  key: string;
  label: string;
  path: string;
}

interface WorkbenchOptions {
  /** 行业/客户 Edition 声明的能力 id（如 legal/cases） */
  capabilities?: string[];
  /** 全部可用菜单（由各端注入/import） */
  items: WorkbenchItem[];
}

/** 按 capabilities 裁剪菜单：缺省全量（开源通用），商业/客户 Edition 裁剪 */
export function useWorkbench({ capabilities, items }: WorkbenchOptions) {
  return useMemo(() => {
    if (!capabilities || capabilities.length === 0) return items;
    return items.filter((i) => capabilities.some((c) => c.startsWith(i.key) || i.key.startsWith(c)));
  }, [capabilities, items]);
}
