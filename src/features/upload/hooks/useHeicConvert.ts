import { useCallback, useState } from 'react';

interface UseHeicConvertResult {
  converting: boolean;
  error: string | null;
  convertIfNeeded: (file: File) => Promise<File>;
}

const HEIC_TYPES = ['image/heic', 'image/heif'];
const HEIC_EXTENSIONS = /\.(heic|heif)$/i;

function isHeicFile(file: File): boolean {
  return HEIC_TYPES.includes(file.type) || HEIC_EXTENSIONS.test(file.name);
}

/**
 * iPhones default to HEIC, which browsers can't render in <img>/<canvas>.
 * We detect and convert client-side before anything else touches the file,
 * so the rest of the pipeline only ever deals with JPEG/PNG/WebP.
 */
export function useHeicConvert(): UseHeicConvertResult {
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertIfNeeded = useCallback(async (file: File): Promise<File> => {
    if (!isHeicFile(file)) return file;

    setConverting(true);
    setError(null);
    try {
      const heic2any = (await import('heic2any')).default;
      const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
      const blob = Array.isArray(converted) ? converted[0] : converted;
      const newFileName = file.name.replace(HEIC_EXTENSIONS, '.jpg');
      return new File([blob], newFileName, { type: 'image/jpeg' });
    } catch (err) {
      const message =
        'Could not convert this HEIC photo. Try taking a screenshot of it, or switch your camera to "Most Compatible" format in iPhone Settings > Camera > Formats.';
      setError(message);
      throw new Error(message);
    } finally {
      setConverting(false);
    }
  }, []);

  return { converting, error, convertIfNeeded };
}
