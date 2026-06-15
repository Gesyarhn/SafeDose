import { apiGet, apiPost, apiDelete } from '../api-client';
import type { DrugData } from '../../types';

// ---- Types ----

export interface FavoriteRecord {
  id: string;
  drugId: string;
  drug?: DrugData;
  createdAt: string;
}

// ---- API functions ----

export function fetchFavorites(): Promise<FavoriteRecord[]> {
  return apiGet<FavoriteRecord[]>('/api/favorites');
}

export function addFavorite(drugId: string): Promise<FavoriteRecord> {
  return apiPost<FavoriteRecord>('/api/favorites', { drugId });
}

export function removeFavorite(drugId: string): Promise<void> {
  return apiDelete(`/api/favorites/${drugId}`);
}

export function checkFavorite(drugId: string): Promise<boolean> {
  return apiGet<boolean>(`/api/favorites/check/${drugId}`);
}
