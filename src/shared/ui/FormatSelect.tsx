import { CardFormat } from '@/shared/types/card';

interface FormatSelectProps {
  onSelect: (format: CardFormat) => void;
}

export function FormatSelect({ onSelect }: FormatSelectProps): JSX.Element {
  return (
    <div className="format-select">
      <button type="button" className="format-select__option" onClick={() => onSelect('pfp-frame')}>
        <span className="format-select__title">PFP Frame</span>
        <span className="format-select__hint">Wrap your photo in the HH Goa frame for a new profile pic</span>
      </button>

      <button type="button" className="format-select__option" onClick={() => onSelect('builder-id')}>
        <span className="format-select__title">Builder ID Card</span>
        <span className="format-select__hint">Your photo + name + role, laid out like an event badge</span>
      </button>
    </div>
  );
}
