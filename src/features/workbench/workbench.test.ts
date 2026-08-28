/** workbench 能力裁剪（纯函数 · 锁行为：缺省全量 / 前缀裁剪） */
import { describe, expect, it } from 'vitest';
import { filterWorkbenchItems, type WorkbenchItem } from './useWorkbench';

const items: WorkbenchItem[] = [
  { key: 'dashboard', label: '工作台', path: '/dashboard' },
  { key: 'legal/cases', label: '案件管理', path: '/legal/cases' },
  { key: 'legal/contracts', label: '合同管理', path: '/legal/contracts' },
  { key: 'iot/devices', label: '设备管理', path: '/iot/devices' },
  { key: 'approval', label: '审批', path: '/approval' },
];

describe('filterWorkbenchItems', () => {
  it('缺省（无 capabilities）= 全量', () => {
    expect(filterWorkbenchItems(items)).toEqual(items);
    expect(filterWorkbenchItems(items, undefined)).toEqual(items);
  });

  it('空 capabilities = 全量', () => {
    expect(filterWorkbenchItems(items, [])).toEqual(items);
  });

  it('按前缀裁剪（capability 是菜单 key 的前缀）', () => {
    expect(filterWorkbenchItems(items, ['legal'])).toEqual([items[1], items[2]]);
  });

  it('capability 与 key 双向前缀匹配（全等 capability）', () => {
    expect(filterWorkbenchItems(items, ['legal/cases'])).toEqual([items[1]]);
  });

  it('多 capability 取并集', () => {
    expect(filterWorkbenchItems(items, ['legal', 'iot/devices'])).toEqual([items[1], items[2], items[3]]);
  });

  it('不匹配的 capability 返回空数组', () => {
    expect(filterWorkbenchItems(items, ['edu/classes'])).toEqual([]);
  });
});
