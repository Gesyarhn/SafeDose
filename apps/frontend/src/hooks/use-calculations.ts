import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  saveCalculation,
  fetchCalculationHistory,
  fetchCalculationById,
  deleteCalculation,
} from '../lib/api/calculations';
import type { SaveCalculationPayload } from '../lib/api/calculations';

export const calculationKeys = {
  all: ['calculations'] as const,
  history: (limit?: number, offset?: number) =>
    [...calculationKeys.all, 'history', limit, offset] as const,
  detail: (id: string) => [...calculationKeys.all, 'detail', id] as const,
};

export function useCalculationHistory(limit: number = 20, offset: number = 0) {
  return useQuery({
    queryKey: calculationKeys.history(limit, offset),
    queryFn: () => fetchCalculationHistory(limit, offset),
  });
}

export function useCalculationById(id: string | null) {
  return useQuery({
    queryKey: calculationKeys.detail(id!),
    queryFn: () => fetchCalculationById(id!),
    enabled: !!id,
  });
}

export function useSaveCalculation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SaveCalculationPayload) => saveCalculation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calculationKeys.all });
    },
  });
}

export function useDeleteCalculation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCalculation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calculationKeys.all });
    },
  });
}
