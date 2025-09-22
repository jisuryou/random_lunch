interface RecommendationListProps {
  menu: string | null;
  location: string | null;
  searchUrl: string | null;
  onOpenSearch: () => void;
}

export function RecommendationList({ menu, location, searchUrl, onOpenSearch }: RecommendationListProps) {
  return (
    <div className="recommendation-panel">
      <h2>오늘의 랜덤 점심 메뉴</h2>
      <div className="menu-card">
        <span className="menu-label">추천 메뉴</span>
        <span className="menu-name">{menu ?? '메뉴 추첨을 시작해 주세요'}</span>
      </div>

      <section className="recommendations" aria-live="polite">
        <div className="section-header">
          <h3>네이버 지도 검색</h3>
          <p>추천 메뉴와 위치를 조합해 검색 결과를 새 창으로 열어 드립니다.</p>
        </div>
        {!location ? (
          <p className="empty">먼저 위치를 설정해 주세요.</p>
        ) : !menu ? (
          <p className="empty">랜덤 추천을 실행하면 검색 링크가 생성됩니다.</p>
        ) : (
          <div className="search-card">
            <p className="search-summary">
              <strong>{location}</strong> 근처에서 <strong>{menu}</strong>을(를) 찾고 있어요.
            </p>
            <button type="button" onClick={onOpenSearch} className="primary search-button">
              네이버 지도에서 열기
            </button>
            {searchUrl && (
              <p className="search-url">
                검색 주소:{' '}
                <a href={searchUrl} target="_blank" rel="noreferrer">
                  {searchUrl}
                </a>
              </p>
            )}
            <p className="search-tip">팝업이 차단되면 버튼을 다시 눌러 주세요.</p>
          </div>
        )}
      </section>
    </div>
  );
}
