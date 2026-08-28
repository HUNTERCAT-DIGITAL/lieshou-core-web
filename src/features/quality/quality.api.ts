/**
 * 质检追溯 API（对应后端 inventory-service · 走注入的传输端口）.
 *
 * 从 admin-web services/quality.ts 上收（P0 推广 · 业务逻辑唯一源）：
 * 全路径带 /api 前缀（与 contract-api 契约一致），由各端 ApiPort 桥接归一。
 * ADR-0037：批次 + 质检 + 商品追溯链路。
 */
import { requestApi } from '../../config/provider';
import type {
  Batch,
  BatchDetail,
  CreateBatchRequest,
  CreateInspectionRequest,
  InspectionDetail,
  InspectionResult,
  InspectionType,
  ProductTrace,
  QualityInspection,
} from '@lieshoucloud/contract-types/business/quality';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** GET /api/batches — 批次列表（可选 productId / keyword） */
export async function listBatches(productId?: number, keyword?: string): Promise<Batch[]> {
  const params = new URLSearchParams();
  if (productId) params.set('productId', String(productId));
  if (keyword) params.set('keyword', keyword);
  const qs = params.toString();
  return requestApi<Batch[]>(`/api/batches${qs ? `?${qs}` : ''}`);
}

/** GET /api/batches/count */
export async function countBatches(): Promise<number> {
  return requestApi<number>('/api/batches/count');
}

/** POST /api/batches — 创建批次（追溯维度，不叠加库存） */
export async function createBatch(body: CreateBatchRequest): Promise<Batch> {
  return requestApi<Batch>('/api/batches', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** GET /api/batches/{id} — 批次详情（含质检 + 流水追溯链路） */
export async function getBatchDetail(id: number): Promise<BatchDetail> {
  return requestApi<BatchDetail>(`/api/batches/${id}`);
}

/** GET /api/inspections — 质检列表（可选 productId / type / result） */
export async function listInspections(params?: {
  productId?: number;
  type?: InspectionType;
  result?: InspectionResult;
}): Promise<QualityInspection[]> {
  const search = new URLSearchParams();
  if (params?.productId) search.set('productId', String(params.productId));
  if (params?.type) search.set('type', params.type);
  if (params?.result) search.set('result', params.result);
  const qs = search.toString();
  return requestApi<QualityInspection[]>(`/api/inspections${qs ? `?${qs}` : ''}`);
}

/** GET /api/inspections/count */
export async function countInspections(): Promise<number> {
  return requestApi<number>('/api/inspections/count');
}

/** POST /api/inspections — 创建质检记录 */
export async function createInspection(
  body: CreateInspectionRequest,
): Promise<QualityInspection> {
  return requestApi<QualityInspection>('/api/inspections', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}

/** GET /api/inspections/{id} — 质检详情（含商品名 + 批次号） */
export async function getInspection(id: number): Promise<InspectionDetail> {
  return requestApi<InspectionDetail>(`/api/inspections/${id}`);
}

/** GET /api/products/{id}/trace — 商品追溯（批次 + 质检 + 流水） */
export async function getProductTrace(id: number): Promise<ProductTrace> {
  return requestApi<ProductTrace>(`/api/products/${id}/trace`);
}
