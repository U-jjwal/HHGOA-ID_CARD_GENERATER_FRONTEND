export type CardFormat = 'pfp-frame' | 'builder-id';

export interface CardSummary {
  cardId: string;
  format: CardFormat;
  imageUrl: string;
  name?: string;
  teamName?: string;
  role?: string;
  builderTitle?: string;
  createdAt: string;
  shareUrl: string;
}

export interface CreateCardPayload {
  format: CardFormat;
  cloudinaryPublicId: string;
  name?: string;
  teamName?: string;
  role?: string;
  builderTitle?: string;
}

export interface CloudinaryAuthResponse {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  uploadPreset: string;
  folder: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[] | undefined>;
  details?: unknown;
}
