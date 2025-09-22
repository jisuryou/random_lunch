import { useCallback, useEffect, useMemo, useState } from 'react';
import { LocationDialog } from './components/LocationDialog';
import { RecommendationList } from './components/RecommendationList';
import { WorkflowTimeline } from './components/WorkflowTimeline';
import type { LocationPoint, WorkflowStatus, WorkflowStep } from './types';

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

const INITIAL_STEPS: WorkflowStep[] = [
  { id: 'location', label: '위치 설정', status: 'active' },
  { id: 'menu', label: '메뉴 추첨', status: 'pending' },
  { id: 'search', label: '지도 검색', status: 'pending' },
];

export default function App() {
  const [steps, setSteps] = useState<WorkflowStep[]>(INITIAL_STEPS);
  const [location, setLocation] = useState<LocationPoint | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(true);

  const setStepStatus = useCallback(
    (id: WorkflowStep['id'], status: WorkflowStatus, message?: string) => {
      setSteps((prev) => prev.map((step) => (step.id === id ? { ...step, status, message } : step)));
    },
    [],
  );

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
        setSteps((prev) => prev.map((step) => (step.id === 'location' ? { ...step, status: 'done' } : step)));
        setShowLocationDialog(false);
      }
    } catch (err) {
      console.warn('저장된 위치를 불러오지 못했습니다.', err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (location) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      setSteps((prev) => prev.map((step) => (step.id === 'location' ? { ...step, status: 'done' } : step)));
      setShowLocationDialog(false);
    }
  }, [location]);

  const handleLocationSelect = useCallback((value: LocationPoint) => {
    setLocation(value);
    setMenu(null);
    setSearchUrl(null);
    setError(null);
    setSteps([
      { id: 'location', label: '위치 설정', status: 'done' },
      { id: 'menu', label: '메뉴 추첨', status: 'pending' },
      { id: 'search', label: '지도 검색', status: 'pending' },
    ]);
  }, []);

  const handleRecommendation = useCallback(() => {
    if (!location) {
      setError('먼저 위치를 설정해 주세요.');
      setShowLocationDialog(true);
      return;
    }

    setError(null);
    setStepStatus('menu', 'active');
    setStepStatus('search', 'pending');

    const randomMenu = MENU_OPTIONS[Math.floor(Math.random() * MENU_OPTIONS.length)];
    const url = `https://map.naver.com/p/search/${encodeURIComponent(`${location.address} ${randomMenu}`)}`;

    setMenu(randomMenu);
    setSearchUrl(url);
    setStepStatus('menu', 'done');
    setStepStatus('search', 'done', '네이버 지도 검색 결과를 새 창에서 확인하세요.');

    window.open(url, '_blank', 'noopener');
  }, [location, setStepStatus]);

  const handleOpenSearch = useCallback(() => {
    if (!searchUrl) return;
    window.open(searchUrl, '_blank', 'noopener');
  }, [searchUrl]);

  const workflowReady = useMemo(() => steps.length > 0, [steps]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>직장인 랜덤 점심 추천</h1>
          <p>위치를 선택하면 랜덤 메뉴를 추첨하고 네이버 지도로 바로 검색해 드려요.</p>
        </div>
        <div className="header-actions">
          <button type="button" onClick={() => setShowLocationDialog(true)} className="secondary">
            위치 변경
          </button>
          <button type="button" onClick={handleRecommendation}>
            랜덤 추천 실행
          </button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <main className="layout">
        <section className="left-panel">
          {workflowReady && <WorkflowTimeline steps={steps} />}
          <RecommendationList
            menu={menu}
            location={location?.address ?? null}
            searchUrl={searchUrl}
            onOpenSearch={handleOpenSearch}
          />
        </section>
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
