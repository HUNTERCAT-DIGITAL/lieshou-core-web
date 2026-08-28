/**
 * 进销存库存预警逻辑单测（自 admin-web pages/Inventory/stockLevel.test.ts 迁移）.
 *
 * stockLevel 是业务规则纯函数,直接验证三段判定:
 * - OUT:≤ 0
 * - LOW:1..lowThreshold
 * - OK:> lowThreshold
 */
import { describe, expect, it } from 'vitest';

import { LOW_STOCK_THRESHOLD, stockLevel } from './inventory';

describe('stockLevel（低库存预警阈值）', () => {
  it('stock ≤ 0 → OUT（缺货）', () => {
    expect(stockLevel(0)).toBe('OUT');
    expect(stockLevel(-3)).toBe('OUT');
  });

  it('1..5 → LOW（低库存）', () => {
    expect(stockLevel(1)).toBe('LOW');
    expect(stockLevel(5)).toBe('LOW');
  });

  it('> 5 → OK', () => {
    expect(stockLevel(6)).toBe('OK');
    expect(stockLevel(100)).toBe('OK');
  });

  it('阈值参数化:自定义 lowThreshold', () => {
    expect(stockLevel(10, 10)).toBe('LOW');
    expect(stockLevel(11, 10)).toBe('OK');
  });

  it('LOW_STOCK_THRESHOLD 常量导出', () => {
    expect(LOW_STOCK_THRESHOLD).toBe(5);
  });
});
