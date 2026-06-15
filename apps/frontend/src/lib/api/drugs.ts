import { apiGet, apiPost, apiPut, apiDelete } from '../api-client';
import type { DrugData } from '../../types';

// ---- Request types ----

export type CreateDrugPayload = Omit<DrugData, 'id' | 'preparations'> & {
  preparations?: Omit<DrugData['preparations'][number], 'id'>[];
};

export type UpdateDrugPayload = Partial<CreateDrugPayload>;

// ---- API functions ----

export function fetchDrugs(query?: string): Promise<DrugData[]> {
  const params = query ? `?q=${encodeURIComponent(query)}` : '';
  return apiGet<DrugData[]>(`/api/drugs${params}`);
}

export function fetchDrugById(id: string): Promise<DrugData> {
  return apiGet<DrugData>(`/api/drugs/${id}`);
}

export function createDrug(data: CreateDrugPayload): Promise<DrugData> {
  return apiPost<DrugData>('/api/drugs', data);
}

export function updateDrug(id: string, data: UpdateDrugPayload): Promise<DrugData> {
  return apiPut<DrugData>(`/api/drugs/${id}`, data);
}

export function deleteDrug(id: string): Promise<void> {
  return apiDelete(`/api/drugs/${id}`);
}
