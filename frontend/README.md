# Random Lunch Helper Frontend

React + Vite로 구현된 직장인 랜덤 점심 추천 웹앱입니다. 위치와 메뉴를 조합한 네이버 지도 검색 결과를 새 창으로 열어 주며,
서버 없이 프런트엔드만으로 동작합니다.

## 개발 서버 실행

```bash
npm install
npm run dev
```

개발 서버는 `http://localhost:5173`에서 실행됩니다. 첫 방문 시 위치 입력 모달이 나타나며 입력한 위치는 로컬 스토리지에 저장됩니다.

## 주요 스크립트

- `npm run dev` – 개발 서버 시작
- `npm run build` – 정적 빌드 출력 (`dist/`)
- `npm run preview` – 빌드 결과 미리 보기

## 구조

- `src/App.tsx` – 워크플로우 상태 관리 및 메인 UI
- `src/components/LocationDialog.tsx` – 위치 입력 모달
- `src/components/RecommendationList.tsx` – 메뉴와 네이버 지도 검색 링크 표시
- `src/components/WorkflowTimeline.tsx` – 단계별 진행 상황 표시
- `src/App.css` – 전체 스타일 정의

## 메뉴 교체하기

`src/App.tsx`의 `MENU_OPTIONS` 배열을 원하는 메뉴 이름으로 수정하면 됩니다.

## 배포

`npm run build` 후 생성되는 정적 파일을 임의의 정적 호스팅 서비스(예: Vercel, Netlify, Cloudflare Pages 등)에 업로드하면 됩니다.
