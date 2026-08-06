import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/shared/config/constants';
import { ApiError } from '@/shared/types/card';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
});

/** Normalizes any thrown error (Axios, network, or unexpected) into a readable message. */
export function toErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.code === 'ECONNABORTED') {
      return 'The request took too long. Please check your connection and try again.';
    }
    if (!axiosError.response) {
      return 'Could not reach the server. Please check your connection and try again.';
    }
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}
