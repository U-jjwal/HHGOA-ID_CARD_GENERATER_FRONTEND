import { useRef } from 'react';
import { toJpeg } from 'html-to-image';
import { CardSummary } from '@/shared/types/card';
import { ShareButtons } from '@/features/share/components/ShareButtons';

interface ResultPreviewProps {
  card: CardSummary;
  onStartOver: () => void;
}

export function ResultPreview({ card, onStartOver }: ResultPreviewProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      // Small delay to ensure all fonts/images are fully rendered before capturing
      await new Promise(r => setTimeout(r, 100));
      
      const dataUrl = await toJpeg(cardRef.current, { 
        quality: 0.95,
        pixelRatio: 2,
        style: { margin: '0' } // Strip margin during capture to prevent cropping
      });
      const link = document.createElement('a');
      link.download = `hh-goa-2026-${card.format}-${card.cardId}.jpg`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  return (
    <div className="result-preview-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {card.format === 'builder-id' ? (
        <div style={{ padding: '24px', background: 'var(--brand-green)', width: '100%', maxWidth: '448px' }}>
          <div className="builder-live-preview__card" ref={cardRef} style={{ margin: '0' }}>
          
          <div className="card-inner-header">
            <div className="card-inner-header__top">
              <div className="card-inner-header__title">
                HACKER HOUSE <span className="card-inner-header__hindi">गोवा</span>
              </div>
              <svg className="card-inner-header__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" fill="var(--brand-yellow)"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </div>
            <div className="card-inner-header__subtitle">OPEN TRIALS • OCT 28-31</div>
          </div>

          <div className="builder-live-preview__image-container">
            <img src={card.imageUrl} alt="Your photo" crossOrigin="anonymous" />
          </div>
          
          <div className="builder-live-preview__text">
            <div className="builder-live-preview__passport-label">BUILDER PASSPORT</div>
            <div className="builder-live-preview__name">{card.name || 'YOUR NAME'}</div>
            <div className="builder-live-preview__team">AT x {card.teamName || 'CRYPTO'}</div>
          </div>

          <div className="builder-live-preview__stats">
            <div className="stat-col">
              <span className="stat-label">BUILDING</span>
              <span className="stat-val">CODE</span>
            </div>
            <div className="stat-col">
              <span className="stat-label">STATUS</span>
              <span className="stat-val">LOCKED IN</span>
            </div>
            <div className="stat-col">
              <span className="stat-label">CLASS</span>
              <span className="stat-val">{card.role || 'THE SHIPPER'}</span>
            </div>
          </div>

          <div className="builder-live-preview__card-footer">
            <span>GOA, INDIA - 28-31 OCT '26</span>
            <span className="brand-pink">LESS NOISE, MORE SIGNAL.</span>
          </div>

          </div>
        </div>
      ) : (
        <div className="result-preview" ref={cardRef} style={{ margin: '0 auto 24px auto', maxWidth: '400px' }}>
          <img
            className="result-preview__image"
            src={card.imageUrl}
            alt="HH Goa 2026 framed photo"
            width={1080}
            height={1080}
            crossOrigin="anonymous"
            style={{ width: '100%', height: 'auto', display: 'block', margin: 0 }}
          />
        </div>
      )}

      <ShareButtons card={card} onDownload={handleDownload} />

      <button type="button" className="result-preview__start-over" onClick={onStartOver}>
        Make another
      </button>
    </div>
  );
}
