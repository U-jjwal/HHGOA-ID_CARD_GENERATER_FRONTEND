export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB, generous for phone camera photos before compression

export const SHARE_HASHTAG = '#FrameInGoa';
export const SHARE_TEXT_PFP = `Just built my HH Goa 2026 profile pic! ${SHARE_HASHTAG} \n`;
export const SHARE_TEXT_BUILDER_ID = `Got my HH Goa 2026 Builder ID!\n\nCreate your own Builder Card: https://hhgoa-id-card-generater-frontend.vercel.app/\n\n${SHARE_HASHTAG}\n\n`;
