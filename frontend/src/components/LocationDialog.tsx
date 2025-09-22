import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { LocationPoint } from '../types';

interface LocationDialogProps {
  open: boolean;
  initialQuery?: string;
  onSelect: (location: LocationPoint) => void;
  onClose?: () => void;
}

const DEFAULT_HINTS = [
  '예) 판교역',
  '예) 서울특별시 중구 세종대로 110',
  '예) 강남역 2호선',
];

export function LocationDialog({ open, initialQuery = '', onSelect, onClose }: LocationDialogProps) {
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const placeholder = useMemo(() => DEFAULT_HINTS[Math.floor(Math.random() * DEFAULT_HINTS.length)], []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError('검색어를 입력해 주세요.');
      return;
    }
    onSelect({ address: trimmed });
    setQuery('');
    setError(null);
    onClose?.();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="location-dialog-title">점심을 먹을 위치를 입력하세요</h2>
        <p className="dialog-description">
          건물명, 지하철역, 도로명 주소 등을 입력하면 해당 위치를 기준으로 검색을 진행합니다.
        </p>
        <form onSubmit={handleSubmit} className="dialog-form">
          <input
            type="text"
            value={query}
            placeholder={placeholder}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="위치 입력"
          />
          <button type="submit">위치 설정</button>
        </form>
        {error && <p className="dialog-error">{error}</p>}
        <div className="dialog-hint">
          위치는 기기에서만 저장되며, 언제든지 다시 변경할 수 있습니다.
        </div>
        <div className="dialog-actions">
          <button type="button" onClick={onClose} className="secondary">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
