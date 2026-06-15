import { useQuery } from '@tanstack/react-query';
import { fetchEmergencyDrugs, fetchEmergencyDrugById } from '../lib/api/emergency';

export const emergencyDrugKeys = {
  all: ['emergency-drugs'] as const,
  list: (query?: string) => [...emergencyDrugKeys.all, 'list', query] as const,
  detail: (id: string) => [...emergencyDrugKeys.all, 'detail', id] as const,
};

export function useEmergencyDrugs(query?: string) {
  return useQuery({
    queryKey: emergencyDrugKeys.list(query),
    queryFn: () => fetchEmergencyDrugs(query),
  });
}

export function useEmergencyDrugById(id: string | null) {
  return useQuery({
    queryKey: emergencyDrugKeys.detail(id!),
    queryFn: () => fetchEmergencyDrugById(id!),
    enabled: !!id,
  });
}
