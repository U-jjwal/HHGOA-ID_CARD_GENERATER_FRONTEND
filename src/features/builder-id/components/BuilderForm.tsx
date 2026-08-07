import { FormEvent, useState, useEffect, useRef } from 'react';
import { toJpeg } from 'html-to-image';

interface BuilderFormProps {
  photoBlob?: Blob;
  onSubmit: (fields: { name: string; teamName: string; role: string }, generatedBlob: Blob) => void;
  onCancel: () => void;
  busy?: boolean;
}

const NAME_MAX = 40;
const ROLE_MAX = 40;

export function BuilderForm({ photoBlob, onSubmit, onCancel, busy }: BuilderFormProps): JSX.Element {
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (photoBlob) {
      const url = URL.createObjectURL(photoBlob);
      setPhotoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [photoBlob]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedTeamName = teamName.trim();
    const trimmedRole = role.trim();

    if (!trimmedName || !trimmedTeamName || !trimmedRole) {
      setError('Please fill in your name, team name, and stack/role.');
      return;
    }

    if (!cardRef.current) return;

    setError(null);
    setIsCapturing(true);

    try {
      // Small delay to ensure styles are completely applied
      await new Promise(r => setTimeout(r, 100));
      
      const dataUrl = await toJpeg(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        style: { margin: '0' }
      });
      
      // Convert dataUrl to Blob
      const res = await fetch(dataUrl);
      const generatedBlob = await res.blob();
      
      onSubmit({ name: trimmedName, teamName: trimmedTeamName, role: trimmedRole }, generatedBlob);
    } catch (err) {
      console.error(err);
      setError('Failed to generate image from preview.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="builder-split-view">
      <form className="builder-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            value={name}
            maxLength={NAME_MAX}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Ujjwal"
            disabled={busy}
          />
        </label>

        <label>
          Team Name
          <input
            value={teamName}
            maxLength={NAME_MAX}
            onChange={(event) => setTeamName(event.target.value)}
            placeholder="e.g. DARQLords"
            disabled={busy}
          />
        </label>

        <label>
          Stack / role
          <input
            value={role}
            maxLength={ROLE_MAX}
            onChange={(event) => setRole(event.target.value)}
            placeholder="e.g. Full-stack Builder"
            disabled={busy}
          />
        </label>

        {error && (
          <p className="builder-form__error" role="alert">
            {error}
          </p>
        )}

        <div className="builder-form__actions">
          <button type="button" onClick={onCancel} disabled={busy || isCapturing}>
            Back
          </button>
          <button type="submit" disabled={busy || isCapturing}>
            {busy || isCapturing ? 'Generating…' : 'Generate my ID'}
          </button>
        </div>
      </form>

      <div className="builder-live-preview">
        <h3 className="builder-live-preview__title">LIVE PREVIEW</h3>
        <div className="builder-live-preview__card" ref={cardRef}>
          
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
            {photoUrl && <img src={photoUrl} alt="Your photo" />}
          </div>
          
          <div className="builder-live-preview__text">
            <div className="builder-live-preview__passport-label">BUILDER PASSPORT</div>
            <div className="builder-live-preview__name">{name || 'YOUR NAME'}</div>
            <div className="builder-live-preview__team">AT x {teamName || 'CRYPTO'}</div>
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
              <span className="stat-val">{role || 'THE SHIPPER'}</span>
            </div>
          </div>

          <div className="builder-live-preview__card-footer">
            <span>GOA, INDIA - 28-31 OCT '26</span>
            <span className="brand-pink">LESS NOISE, MORE SIGNAL.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
