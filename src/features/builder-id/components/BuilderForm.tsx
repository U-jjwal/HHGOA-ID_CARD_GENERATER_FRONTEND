import { FormEvent, useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

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
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3
      });
      
      const dataUrl = canvas.toDataURL('image/png');
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

import './passport.css';

      <div className="builder-live-preview">
        <h3 className="builder-live-preview__title">LIVE PREVIEW</h3>
        
        <div id="card-wrap">
          <div className="card" ref={cardRef}>
            <div className="bunting"></div>
            <div className="head">
              <div className="sun-glow"></div>
              <svg className="palm left" viewBox="0 0 100 100"><path d="M50 100 L55 40 M55 40 C40 30 25 32 15 20 M55 40 C45 22 45 8 35 0 M55 40 C55 20 62 8 58 -2 M55 40 C65 25 80 28 90 18 M55 40 C68 20 85 22 95 30"/></svg>
              <svg className="palm right" viewBox="0 0 100 100"><path d="M50 100 L55 40 M55 40 C40 30 25 32 15 20 M55 40 C45 22 45 8 35 0 M55 40 C55 20 62 8 58 -2 M55 40 C65 25 80 28 90 18 M55 40 C68 20 85 22 95 30"/></svg>
              <p className="masthead">HACKER HOUSE <span className="goa">Goa</span></p>
              <p className="trials"><span>OPEN TRIALS · OCT 28–31</span></p>
            </div>

            <div className="body">
              <svg className="frond-bg" viewBox="0 0 100 100"><path d="M50 100 L55 40 M55 40 C40 30 25 32 15 20 M55 40 C45 22 45 8 35 0 M55 40 C55 20 62 8 58 -2 M55 40 C65 25 80 28 90 18 M55 40 C68 20 85 22 95 30" stroke="#0B4A2E" strokeWidth="2" fill="none"/></svg>

              <svg className="stamp" viewBox="0 0 120 120" width="104" height="104">
                <circle cx="60" cy="60" r="52" strokeWidth="1.4" strokeDasharray="2 3"/>
                <circle cx="60" cy="60" r="44" strokeWidth="1"/>
                <path id="arcTop" d="M 14 60 A 46 46 0 1 1 106 60" fill="none"/>
                <path id="arcBot" d="M 106 62 A 46 46 0 1 1 14 62" fill="none"/>
                <text><textPath href="#arcTop" startOffset="50%" textAnchor="middle">Verified Builder</textPath></text>
                <text><textPath href="#arcBot" startOffset="50%" textAnchor="middle">Hacker House · Goa</textPath></text>
                <text className="center" x="60" y="57">IN</text>
                <text className="center2" x="60" y="70">28–31 OCT</text>
              </svg>

              <div className="photo-ring">
                <div className="inner" style={{ backgroundImage: photoUrl ? `url(${photoUrl})` : 'none' }}></div>
              </div>

              <p className="eyebrow">Builder Passport</p>
              <p className="name">{name || 'YOUR NAME'}</p>
              <p className="role"><span className="at">AT</span> X {teamName || 'CRYPTO'}</p>

              <div className="chips">
                <div className="chip c1">
                  <span className="flabel">Building</span>
                  <span className="fvalue">Code</span>
                </div>
                <div className="chip c2">
                  <span className="flabel">Status</span>
                  <span className="fvalue">Locked in</span>
                </div>
                <div className="chip c3">
                  <span className="flabel">Class</span>
                  <span className="fvalue">{role || 'Full-stack dev'}</span>
                </div>
              </div>

              <div className="footer">
                <span className="loc">GOA, INDIA · 28–31 OCT '26</span>
                <span className="tag">LESS NOISE, MORE SIGNAL.</span>
              </div>
            </div>
            <svg className="waves" viewBox="0 0 400 26" preserveAspectRatio="none">
              <path d="M0 10 Q 20 0 40 10 T 80 10 T 120 10 T 160 10 T 200 10 T 240 10 T 280 10 T 320 10 T 360 10 T 400 10 V26 H0 Z" fill="#137A4B"/>
              <path d="M0 14 Q 20 6 40 14 T 80 14 T 120 14 T 160 14 T 200 14 T 240 14 T 280 14 T 320 14 T 360 14 T 400 14 V26 H0 Z" fill="#0B4A2E"/>
            </svg>
            <div className="card-outline"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
