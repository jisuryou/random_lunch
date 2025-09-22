import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { LocationDialog } from './components/LocationDialog';
import type { LocationPoint } from './types';

const STORAGE_KEY = 'random-lunch-location';
const MENU_OPTIONS = [
  '김치찌개',
  '된장찌개',
  '비빔밥',
  '돈까스',
  '짬뽕',
  '제육볶음',
  '칼국수',
  '샐러드',
  '회덮밥',
  '파스타',
];
const LOCATION_HINTS = [
  '예) 판교역 1번 출구',
  '예) 서울특별시 중구 세종대로 110',
  '예) 강남역 2호선',
];
const CAROUSEL_ROTATION_MS = 4000;

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  url: string;
}

export default function App() {
  const [location, setLocation] = useState<LocationPoint | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const mapSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      let restored: LocationPoint | null = null;
      if (typeof parsed === 'string') {
        restored = { address: parsed };
      } else if (parsed && typeof parsed.address === 'string') {
        restored = { address: parsed.address };
      }

      if (restored) {
        setLocation(restored);
      }
    } catch (err) {
      console.warn('저장된 위치를 불러오지 못했습니다.', err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (location) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      setShowLocationDialog(false);
    }
  }, [location]);

  const handleLocationSelect = useCallback((value: LocationPoint) => {
    setLocation(value);
    setMenu(null);
    setSearchUrl(null);
    setActiveCarouselIndex(0);
  }, []);

  const handleRecommendation = useCallback(() => {
    if (!location) {
      return;
    }

    const randomMenu = MENU_OPTIONS[Math.floor(Math.random() * MENU_OPTIONS.length)];
    const query = `${location.address} ${randomMenu} 750m 15000원 이하 식당`;
    const url = `https://map.naver.com/p/search/${encodeURIComponent(query)}`;

    setMenu(randomMenu);
    setSearchUrl(url);
    setActiveCarouselIndex(0);
  }, [location]);

  useEffect(() => {
    if (!menu) return;
    if (!mapSectionRef.current) return;
    mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [menu]);

  const carouselItems: CarouselItem[] = useMemo(() => {
    if (!location || !menu || !searchUrl) {
      return [];
    }

    return [1, 2, 3].map((rank) => ({
      id: rank,
      title: `${rank}순위 후보`,
      description: `${location.address} 주변 ${menu} 식당`,
      url: `${searchUrl}?rank=${rank}`,
    }));
  }, [location, menu, searchUrl]);

  useEffect(() => {
    if (carouselItems.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveCarouselIndex((prev) => {
        const next = prev + 1;
        if (next >= carouselItems.length) {
          return 0;
        }
        return next;
      });
    }, CAROUSEL_ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [carouselItems]);

  const handleCarouselClick = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener');
  }, []);

  const placeholder = useMemo(
    () => LOCATION_HINTS[Math.floor(Math.random() * LOCATION_HINTS.length)],
    [],
  );

  const handleLocationSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = locationInput.trim();
      if (!trimmed) {
        setLocationError('위치를 입력해 주세요.');
        return;
      }

      handleLocationSelect({ address: trimmed });
      setLocationInput('');
      setLocationError(null);
    },
    [handleLocationSelect, locationInput],
  );

  useEffect(() => {
    if (locationInput && locationError) {
      setLocationError(null);
    }
  }, [locationInput, locationError]);

  return (
    <div className="app">
      {location && (
        <div className="location-badge">
          <span className="location-text">{location.address}</span>
          <button type="button" onClick={() => setShowLocationDialog(true)} className="location-change">
            위치 변경
          </button>
        </div>
      )}

      <main className="stage">
        {!location ? (
          <section className="location-setup">
            <h1>점심을 먹을 위치를 입력해 주세요</h1>
            <form onSubmit={handleLocationSubmit} className="location-form">
              <input
                type="text"
                value={locationInput}
                onChange={(event) => setLocationInput(event.target.value)}
                placeholder={placeholder}
                aria-label="현재 위치"
              />
              <button type="submit">위치 설정</button>
            </form>
            {locationError && <p className="location-error">{locationError}</p>}
          </section>
        ) : (
          <section className="menu-stage">
            {!menu ? (
              <button type="button" onClick={handleRecommendation} className="draw-button">
                랜덤 메뉴 추첨하기
              </button>
            ) : (
              <div className="result-area" ref={mapSectionRef}>
                <div className="menu-display" aria-live="polite">
                  <span className="menu-label">오늘의 메뉴</span>
                  <strong className="menu-name">{menu}</strong>
                </div>

                {searchUrl && (
                  <div className="map-panel">
                    <iframe
                      key={searchUrl}
                      src={searchUrl}
                      title={`${menu} 네이버 지도 검색 결과`}
                      allowFullScreen
                    />
                  </div>
                )}

                {carouselItems.length > 0 && (
                  <section className="carousel" aria-label="추천 식당 순위">
                    <div className="carousel-header">
                      <h2>추천 식당 1~3순위</h2>
                      <p>카드를 클릭하면 해당 네이버 플레이스를 새 창에서 확인할 수 있어요.</p>
                    </div>
                    <div className="carousel-viewport">
                      <div
                        className="carousel-track"
                        style={{ transform: `translateX(-${activeCarouselIndex * 100}%)` }}
                      >
                        {carouselItems.map((item) => (
                          <article
                            key={item.id}
                            className="carousel-item"
                            role="button"
                            tabIndex={0}
                            onClick={() => handleCarouselClick(item.url)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                handleCarouselClick(item.url);
                              }
                            }}
                          >
                            <span className="carousel-rank">{item.title}</span>
                            <strong className="carousel-title">{menu}</strong>
                            <span className="carousel-description">{item.description}</span>
                            <span className="carousel-link">네이버 플레이스 열기</span>
                          </article>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      <LocationDialog
        open={showLocationDialog}
        initialQuery={location?.address}
        onSelect={handleLocationSelect}
        onClose={() => setShowLocationDialog(false)}
      />
    </div>
  );
}
