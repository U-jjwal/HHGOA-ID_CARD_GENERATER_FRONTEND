import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CardSummary } from '@/shared/types/card';
import { getCard } from '@/shared/api/cards.api';
import { toErrorMessage } from '@/shared/api/client';
import { ErrorBanner } from '@/shared/ui/ErrorBanner';
import { ShareButtons } from '@/features/share/components/ShareButtons';

export function CardViewPage(): JSX.Element {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<CardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cardId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getCard(cardId)
      .then((result) => {
        if (!cancelled) setCard(result);
      })
      .catch((err) => {
        if (!cancelled) setError(toErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cardId]);

  return (
    <main className="card-view-page">
      {loading && <p role="status">Loading…</p>}

      {!loading && error && <ErrorBanner message={error} />}

      {!loading && card && (
        <>
          <img
            className="card-view-page__image"
            src={card.imageUrl}
            alt={card.format === 'builder-id' && card.name ? `${card.name}'s HH Goa 2026 Builder ID` : 'HH Goa 2026 framed photo'}
            width={1080}
            height={1080}
          />
          <ShareButtons card={card} />
        </>
      )}

      <Link to="/" className="card-view-page__cta">
        Make your own
      </Link>
    </main>
  );
}
