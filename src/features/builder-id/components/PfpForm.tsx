import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

interface PfpFormProps {
  photoBlob: Blob;
  onSubmit: (fields: null, finalBlob: Blob) => void;
  onCancel: () => void;
}

export function PfpForm({ photoBlob, onSubmit, onCancel }: PfpFormProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(photoBlob);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoBlob]);

  const handleGenerate = async () => {
    if (!cardRef.current) return;
    
    // Slight delay to ensure fonts/images are rendered
    await new Promise((r) => setTimeout(r, 100));

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      canvas.toBlob(
        (blob) => {
          if (blob) {
            onSubmit(null, blob);
          }
        },
        'image/jpeg',
        0.95
      );
    } catch (err) {
      console.error('Canvas capture failed:', err);
    }
  };

  return (
    <div className="builder-split-view">
      <div className="builder-form">
        <h2>Your Profile Picture</h2>
        <p style={{ fontFamily: 'var(--font-mono)', marginBottom: '24px' }}>
          Preview your Hacker House Goa 2026 profile picture. Click generate when you're ready!
        </p>
        <div className="builder-form__actions">
          <button type="button" onClick={onCancel}>
            Back
          </button>
          <button type="button" onClick={() => void handleGenerate()}>
            Generate PFP
          </button>
        </div>
      </div>

      <div className="builder-live-preview">
        <h3 className="builder-live-preview__title">LIVE PREVIEW</h3>
        
        <div id="pfp-wrap">
          <div className="pfp-card" ref={cardRef}>
            <div className="pfp-card__header">
              <div className="pfp-card__title">HACKER HOUSE</div>
              <div className="pfp-card__hindi">गोवा</div>
            </div>
            
            <div className="pfp-card__photo-ring">
              {photoUrl && <img src={photoUrl} alt="Your photo" crossOrigin="anonymous" />}
            </div>

            <div className="pfp-card__footer">
              GOA, INDIA • 28 - 31 OCT 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
