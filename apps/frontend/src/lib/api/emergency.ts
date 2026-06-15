import { apiGet } from '../api-client';
import type { EmergencyDrug } from '../../types';

export function fetchEmergencyDrugs(query?: string): Promise<EmergencyDrug[]> {
  const params = query ? `?q=${encodeURIComponent(query)}` : '';
  return apiGet<EmergencyDrug[]>(`/api/emergency-drugs${params}`);
}

export function fetchEmergencyDrugById(id: string): Promise<EmergencyDrug> {
  return apiGet<EmergencyDrug>(`/api/emergency-drugs/${id}`);
}
