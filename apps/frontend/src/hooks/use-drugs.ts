import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDrugs, fetchDrugById, createDrug, updateDrug, deleteDrug } from '../lib/api/drugs';
import type { CreateDrugPayload, UpdateDrugPayload } from '../lib/api/drugs';

export const drugKeys = {
  all: ['drugs'] as const,
  list: (query?: string) => [...drugKeys.all, 'list', query] as const,
  detail: (id: string) => [...drugKeys.all, 'detail', id] as const,
};

export function useSearchDrugs(query?: string) {
  return useQuery({
    queryKey: drugKeys.list(query),
    queryFn: () => fetchDrugs(query),
  });
}

export function useDrugById(id: string | null) {
  return useQuery({
    queryKey: drugKeys.detail(id!),
    queryFn: () => fetchDrugById(id!),
    enabled: !!id,
  });
}

export function useCreateDrug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDrugPayload) => createDrug(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: drugKeys.all });
    },
  });
}

export function useUpdateDrug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDrugPayload }) =>
      updateDrug(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: drugKeys.all });
      queryClient.invalidateQueries({ queryKey: drugKeys.detail(variables.id) });
    },
  });
}

export function useDeleteDrug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDrug(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: drugKeys.all });
    },
  });
}
