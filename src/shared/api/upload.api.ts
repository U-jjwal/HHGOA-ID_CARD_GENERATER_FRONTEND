import { apiClient } from './client';
import { ApiSuccess, CloudinaryAuthResponse } from '@/shared/types/card';

interface UploadResult {
  filePath: string; // We'll store public_id here
  url: string; // secure_url from cloudinary
}

async function getUploadAuth(): Promise<CloudinaryAuthResponse> {
  const { data } = await apiClient.get<ApiSuccess<CloudinaryAuthResponse>>('/api/upload/auth');
  return data.data;
}

/**
 * Uploads a file (or Blob) directly to Cloudinary from the browser using a
 * signature from our backend.
 */
export async function uploadPhotoToCloudinary(file: Blob, fileName: string): Promise<UploadResult> {
  const auth = await getUploadAuth();
  
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${auth.cloudName}/image/upload`;

  const formData = new FormData();
  formData.append('file', file, fileName);
  formData.append('api_key', auth.apiKey);
  formData.append('timestamp', String(auth.timestamp));
  formData.append('signature', auth.signature);
  formData.append('folder', auth.folder);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Photo upload failed (${response.status}). ${errorBody.slice(0, 200)}`.trim());
  }

  const result = (await response.json()) as { public_id: string; secure_url: string };
  return { filePath: result.public_id, url: result.secure_url };
}
