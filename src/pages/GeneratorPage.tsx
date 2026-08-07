import { useEffect, useMemo, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { CardFormat, CardSummary } from '@/shared/types/card';
import { toErrorMessage } from '@/shared/api/client';
import { uploadPhotoToCloudinary } from '@/shared/api/upload.api';
import { createCard } from '@/shared/api/cards.api';
import { FormatSelect } from '@/shared/ui/FormatSelect';
import { ErrorBanner } from '@/shared/ui/ErrorBanner';
import { PhotoUpload } from '@/features/upload/components/PhotoUpload';
import { CropStage } from '@/features/frame-editor/components/CropStage';
import { ResultPreview } from '@/features/frame-editor/components/ResultPreview';
import { BuilderForm } from '@/features/builder-id/components/BuilderForm';

type Stage = 'select-format' | 'upload' | 'crop' | 'builder-form' | 'generating' | 'result';

interface BuilderFields {
  name: string;
  teamName: string;
  role: string;
}

const INITIAL_STAGE: Stage = 'select-format';

export function GeneratorPage(): JSX.Element {
  const [stage, setStage] = useState<Stage>(INITIAL_STAGE);
  const [format, setFormat] = useState<CardFormat | null>(null);
  const [photoObjectUrl, setPhotoObjectUrl] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [card, setCard] = useState<CardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Revoke object URLs on unmount / replacement to avoid leaking memory
  useEffect(() => {
    return () => {
      if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
    };
  }, [photoObjectUrl]);

  const resetAll = () => {
    if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
    setStage('select-format');
    setFormat(null);
    setPhotoObjectUrl(null);
    setCroppedBlob(null);
    setCard(null);
    setError(null);
  };

  const handleFormatSelect = (selected: CardFormat) => {
    setFormat(selected);
    setStage('upload');
  };

  const handlePhotoReady = (file: File) => {
    setError(null);
    const url = URL.createObjectURL(file);
    setPhotoObjectUrl(url);
    setStage('crop');
  };

  const generateCard = async (fields: BuilderFields | null, blobOverride?: Blob) => {
    const blob = blobOverride ?? croppedBlob;
    if (!blob || !format) return;

    setStage('generating');
    setError(null);
    try {
      const fileName = `upload-${Date.now()}.jpg`;
      
      const compressionOptions = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      
      const compressedBlob = await imageCompression(blob as File, compressionOptions);
      
      const { filePath } = await uploadPhotoToCloudinary(compressedBlob, fileName);

      const created = await createCard({
        format,
        cloudinaryPublicId: filePath,
        name: fields?.name.trim() || undefined,
        teamName: fields?.teamName.trim() || undefined,
        role: fields?.role.trim() || undefined,
        builderTitle: fields?.role.trim() || undefined,
      });

      setCard(created);
      setStage('result');
    } catch (err) {
      setError(toErrorMessage(err));
      // Send them back to the step they can retry from without re-uploading
      // the photo, since croppedBlob is still in memory.
      setStage(format === 'builder-id' ? 'builder-form' : 'crop');
    }
  };

  const handleCropConfirm = (blob: Blob) => {
    setCroppedBlob(blob);
    if (format === 'builder-id') {
      setStage('builder-form');
    } else {
      void generateCard(null, blob);
    }
  };

  const handleBuilderSubmit = (fields: BuilderFields, generatedBlob: Blob) => {
    void generateCard(fields, generatedBlob);
  };

  const heading = useMemo(() => {
    switch (stage) {
      case 'select-format':
        return 'Pick your format';
      case 'upload':
        return 'Upload your photo';
      case 'crop':
        return 'Frame your photo';
      case 'builder-form':
        return 'Add your details';
      case 'generating':
        return 'Generating your card…';
      case 'result':
        return "You're all set!";
      default:
        return '';
    }
  }, [stage]);

  return (
    <main className="generator-page">
      <header className="hh-header">
        <div className="hh-header__top">
          <div className="hh-header__logo">2:47PM<br/>STUDIO</div>
          <div className="hh-header__actions">
            <span className="hh-header__hype">CHECK HYPE</span>
            <button className="hh-header__apply">APPLY</button>
          </div>
        </div>
        <div className="hh-header__hero">
          <h1 className="hh-header__title">HACKER HOUSE</h1>
          <span className="hh-header__hindi">गोवा</span>
        </div>
        <div className="hh-header__footer">
          <span>GOA, INDIA • 28 - 31 OCT 2026</span>
          <span>2:47 PM STUDIO</span>
        </div>
      </header>
      <h2>{heading}</h2>

      {error && stage !== 'generating' && <ErrorBanner message={error} />}

      {stage === 'select-format' && <FormatSelect onSelect={handleFormatSelect} />}

      {stage === 'upload' && <PhotoUpload onPhotoReady={handlePhotoReady} />}

      {stage === 'crop' && photoObjectUrl && (
        <CropStage imageSrc={photoObjectUrl} onConfirm={handleCropConfirm} onCancel={() => setStage('upload')} />
      )}

      {stage === 'builder-form' && croppedBlob && (
        <BuilderForm photoBlob={croppedBlob} onSubmit={handleBuilderSubmit} onCancel={() => setStage('crop')} />
      )}

      {stage === 'generating' && (
        <div role="status" aria-label="Generating your card" className="progress-bar-container">
          <div className="progress-bar-fill"></div>
        </div>
      )}

      {stage === 'result' && card && <ResultPreview card={card} onStartOver={resetAll} />}
    </main>
  );
}
