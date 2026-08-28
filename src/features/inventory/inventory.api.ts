/**
 * 进销存 API（对应后端 inventory-service · 走注入的传输端口）.
 *
 * 从 admin-web services/inventory.ts 上收（业务逻辑唯一源）。
 */
import { requestApi } from '../../config/provider';
import type { ImportResult } from '../crm/crm.api';
import type {
  CreateProductRequest,
  Product,
  StockChangeRequest,
  StockMovement,
  StockMovementType,
  UpdateProductRequest,
} from '@lieshoucloud/contract-types/business/inventory';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/products — 租户内商品列表（可选 keyword） */
export async function listProducts(keyword?: string): Promise<Product[]> {
  const qs = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';
  return requestApi<Product[]>(`/api/products${qs}`);
}

/** GET /api/products/count */
export async function countProducts(): Promise<number> {
  return requestApi<number>('/api/products/count');
}

/** GET /api/products/{id} */
export async function getProduct(id: number): Promise<Product> {
  return requestApi<Product>(`/api/products/${id}`);
}

/** POST /api/products */
export async function createProduct(body: CreateProductRequest): Promise<Product> {
  return requestApi<Product>('/api/products', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** PUT /api/products/{id} */
export async function updateProduct(id: number, body: UpdateProductRequest): Promise<Product> {
  return requestApi<Product>(`/api/products/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** DELETE /api/products/{id} */
export async function deleteProduct(id: number): Promise<void> {
  return requestApi<void>(`/api/products/${id}`, { method: 'DELETE' });
}

/** POST /api/products/{id}/stock-in — 入库（库存 +） */
export async function stockIn(id: number, body: StockChangeRequest): Promise<Product> {
  return requestApi<Product>(`/api/products/${id}/stock-in`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** POST /api/products/{id}/stock-out — 出库（库存 -） */
export async function stockOut(id: number, body: StockChangeRequest): Promise<Product> {
  return requestApi<Product>(`/api/products/${id}/stock-out`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** GET /api/products/{id}/movements — 某商品出入库流水 */
export async function listMovements(
  id: number,
  type?: StockMovementType,
): Promise<StockMovement[]> {
  const qs = type ? `?type=${type}` : '';
  return requestApi<StockMovement[]>(`/api/products/${id}/movements${qs}`);
}

/** POST /api/products/import — CSV 批量导入（multipart） */
export async function importProducts(file: File): Promise<ImportResult> {
  const form = new FormData();
  form.append('file', file);
  return requestApi<ImportResult>('/api/products/import', {
    method: 'POST',
    body: form,
  });
}
