/**
 * 进销存业务规则（对应后端 inventory-service · 业务逻辑唯一源）.
 *
 * 自 admin-web pages/Inventory/List.tsx 上收（纯函数,无端依赖,四端可复用）。
 * 低库存预警判定:≤0 → OUT(缺货) / 1..lowThreshold → LOW(低库存) / > lowThreshold → OK。
 */

/** 低库存预警阈值（库存 ≤ 该值视为 LOW） */
export const LOW_STOCK_THRESHOLD = 5;

/** 库存状态（Tag 色 + 列表筛选共用） */
export type StockLevel = 'OUT' | 'LOW' | 'OK';

/** 库存预警判定（业务规则单点;阈值参数化,客户 Edition 可覆盖） */
export function stockLevel(qty: number, lowThreshold: number = LOW_STOCK_THRESHOLD): StockLevel {
  if (qty <= 0) return 'OUT';
  if (qty <= lowThreshold) return 'LOW';
  return 'OK';
}
