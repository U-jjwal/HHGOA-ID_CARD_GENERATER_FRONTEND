import { CardFormat } from '@/shared/types/card';
import { SHARE_TEXT_BUILDER_ID, SHARE_TEXT_PFP } from '@/shared/config/constants';

/**
 * Builds an X (Twitter) web intent URL. We share the /card/:id link (not the
 * raw image) because X's crawler will unfurl that link's OG tags into a
 * large image preview - attaching a raw image URL directly doesn't work via
 * the plain web intent, and this approach also means the caption, hashtag,
 * and image preview all arrive together in one tap.
 */
export function buildXShareUrl(shareUrl: string, format: CardFormat): string {
  const text = format === 'builder-id' ? SHARE_TEXT_BUILDER_ID : SHARE_TEXT_PFP;
  const params = new URLSearchParams({ text, url: shareUrl });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Downloads the generated image as a real file. Fetches it as a blob first
 * (rather than just setting <a href>) so this works even though the image
 * is served cross-origin from ImageKit's CDN.
 */
export async function downloadImage(imageUrl: string, fileName: string): Promise<void> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error('Could not download the image. Please try again.');
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}
