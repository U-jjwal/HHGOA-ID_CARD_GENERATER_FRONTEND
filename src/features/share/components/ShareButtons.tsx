import { useState } from 'react';
import { CardSummary } from '@/shared/types/card';
import { buildXShareUrl } from '../share.utils';

interface ShareButtonsProps {
  card: CardSummary;
  onDownload?: () => Promise<void>;
}

export function ShareButtons({ card, onDownload }: ShareButtonsProps): JSX.Element {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!onDownload) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      await onDownload();
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const shareUrl = buildXShareUrl(card.shareUrl, card.format);

  return (
    <div className="share-buttons">
      <button type="button" onClick={() => void handleDownload()} disabled={downloading}>
        {downloading ? 'Preparing…' : 'Download image'}
      </button>

      <a className="share-buttons__x" href={shareUrl} target="_blank" rel="noopener noreferrer">
        Share to X
      </a>

      {downloadError && (
        <p className="share-buttons__error" role="alert">
          {downloadError}
        </p>
      )}
    </div>
  );
}
