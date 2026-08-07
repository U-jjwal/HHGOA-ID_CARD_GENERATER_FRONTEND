import { CardSummary } from '@/shared/types/card';
import { ShareButtons } from '@/features/share/components/ShareButtons';

interface ResultPreviewProps {
  card: CardSummary;
  onStartOver: () => void;
}

export function ResultPreview({ card, onStartOver }: ResultPreviewProps): JSX.Element {
  const handleDownload = async () => {
    try {
      const response = await fetch(card.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `hh-goa-2026-${card.format}-${card.cardId}.jpg`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  return (
    <div className="result-preview-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="result-preview" style={{ margin: '0 auto 24px auto', maxWidth: '400px' }}>
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

      <ShareButtons card={card} onDownload={handleDownload} />

      <button type="button" className="result-preview__start-over" onClick={onStartOver}>
        Make another
      </button>
    </div>
  );
}
