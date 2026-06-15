import { apiGet, apiPost, apiDelete } from '../api-client';

// ---- Types ----

export interface SaveCalculationPayload {
  mode: 'standard' | 'igd';
  patientAge: number;
  patientWeight: number;
  patientGender?: string | null;
  patientConditions?: string[];
  drugId?: string | null;
  emergencyDrugId?: string | null;
  drugNameSnapshot: string;
  preparationId?: string | null;
  indication?: string | null;
  doseMgPerKg: number;
  frequency?: number | null;
  durationDays?: number | null;
  dosePerAdminMg: number;
  dosePerAdminMl?: number | null;
  totalDailyDoseMg: number;
  supplyEstimate?: string | null;
}

export interface CalculationRecord extends SaveCalculationPayload {
  id: string;
  userId: string;
  createdAt: string;
}

export interface PaginatedHistory {
  items: CalculationRecord[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ---- API functions ----

export function saveCalculation(data: SaveCalculationPayload): Promise<CalculationRecord> {
  return apiPost<CalculationRecord>('/api/calculations', data);
}

export function fetchCalculationHistory(
  limit: number = 20,
  offset: number = 0
): Promise<PaginatedHistory> {
  return apiGet<PaginatedHistory>(`/api/calculations?limit=${limit}&offset=${offset}`);
}

export function fetchCalculationById(id: string): Promise<CalculationRecord> {
  return apiGet<CalculationRecord>(`/api/calculations/${id}`);
}

export function deleteCalculation(id: string): Promise<void> {
  return apiDelete(`/api/calculations/${id}`);
}
