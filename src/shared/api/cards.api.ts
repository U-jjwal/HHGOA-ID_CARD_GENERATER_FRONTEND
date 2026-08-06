import { apiClient } from './client';
import { ApiSuccess, CardSummary, CreateCardPayload } from '@/shared/types/card';

export async function createCard(payload: CreateCardPayload): Promise<CardSummary> {
  const { data } = await apiClient.post<ApiSuccess<CardSummary>>('/api/cards', payload);
  return data.data;
}

export async function getCard(cardId: string): Promise<CardSummary> {
  const { data } = await apiClient.get<ApiSuccess<CardSummary>>(`/api/cards/${cardId}`);
  return data.data;
}
