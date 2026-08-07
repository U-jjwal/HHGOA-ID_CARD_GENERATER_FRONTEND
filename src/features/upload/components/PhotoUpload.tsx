import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '@/shared/config/constants';
import { useHeicConvert } from '../hooks/useHeicConvert';

interface PhotoUploadProps {
  onPhotoReady: (file: File) => void;
}

function validateFile(file: File): string | null {
  const isAcceptedType =
    ACCEPTED_IMAGE_TYPES.includes(file.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);

  if (!isAcceptedType) {
    return 'Please upload a JPG, PNG, WebP, or HEIC photo.';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'That photo is too large (max 15MB). Try a different one or take a lower-resolution shot.';
  }
  if (file.size === 0) {
    return 'That file looks empty. Please choose a different photo.';
  }
  return null;
}

export function PhotoUpload({ onPhotoReady }: PhotoUploadProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { converting, convertIfNeeded } = useHeicConvert();

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setError(null);

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        const readyFile = await convertIfNeeded(file);
        onPhotoReady(readyFile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not process that photo. Please try another.');
      }
    },
    [convertIfNeeded, onPhotoReady],
  );

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    void handleFile(event.target.files?.[0]);
    // Reset so selecting the same file again still fires onChange
    event.target.value = '';
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="photo-upload">
      <div
        className={`photo-upload__dropzone${isDragging ? ' photo-upload__dropzone--active' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
        }}
      >
        {converting ? (
          <p>Converting your photo&hellip;</p>
        ) : (
          <>
            <p className="photo-upload__title">Tap to upload a photo</p>
            <p className="photo-upload__hint">JPG, PNG, WebP, or iPhone HEIC · up to 15MB</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        onChange={onInputChange}
        hidden
      />

      {error && (
        <p className="photo-upload__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
