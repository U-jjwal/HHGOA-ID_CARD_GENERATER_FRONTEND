import { useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImageBlob } from '@/shared/utils/getCroppedImageBlob';

interface CropStageProps {
  imageSrc: string;
  onConfirm: (croppedBlob: Blob) => void;
  onCancel: () => void;
  busy?: boolean;
}

export function CropStage({ imageSrc, onConfirm, onCancel, busy }: CropStageProps): JSX.Element {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixelsResult: Area) => {
    setCroppedAreaPixels(croppedAreaPixelsResult);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) {
      setError('Adjust the frame over your photo, then continue.');
      return;
    }
    setError(null);
    setProcessing(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      onConfirm(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not crop that photo. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const isBusy = busy || processing;

  return (
    <div className="crop-stage">
      <div className="crop-stage__canvas">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <label className="crop-stage__zoom">
        Zoom
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
      </label>

      {error && (
        <p className="crop-stage__error" role="alert">
          {error}
        </p>
      )}

      <div className="crop-stage__actions">
        <button type="button" onClick={onCancel} disabled={isBusy}>
          Back
        </button>
        <button type="button" onClick={() => void handleConfirm()} disabled={isBusy}>
          {isBusy ? 'Processing…' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
