import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../lib/api/favorites';

export const favoriteKeys = {
  all: ['favorites'] as const,
  list: () => [...favoriteKeys.all, 'list'] as const,
  check: (drugId: string) => [...favoriteKeys.all, 'check', drugId] as const,
};

export function useFavorites() {
  return useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: () => fetchFavorites(),
  });
}

export function useIsFavorited(drugId: string) {
  return useQuery({
    queryKey: favoriteKeys.check(drugId),
    queryFn: () => checkFavorite(drugId),
    enabled: !!drugId,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (drugId: string) => addFavorite(drugId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (drugId: string) => removeFavorite(drugId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      drugId,
      isFavorited,
    }: {
      drugId: string;
      isFavorited: boolean;
    }) => {
      if (isFavorited) {
        await removeFavorite(drugId);
      } else {
        await addFavorite(drugId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}
