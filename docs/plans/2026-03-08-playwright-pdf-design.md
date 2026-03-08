# Phase 3: Playwright PDF 전환 설계

## 목표

`@react-pdf/renderer`를 제거하고 Playwright `page.pdf()`로 전환하여 미리보기 = PDF 100% 일치 달성

## 결정 사항

- PDF 엔진: Playwright `page.pdf()` (내부 페이지 캡처 방식)
- 템플릿 다양화: Phase 3에서 스킵, 향후 진행
- `@react-pdf/renderer`: 완전 제거 (폴백 없음)
- 배포 환경: 로컬 우선, 향후 AWS/Naver Cloud (Chromium 사용 가능)

## 아키텍처

```
현재: DownloadButton → POST /api/pdf (JSON) → @react-pdf/renderer → PDF buffer
변경: DownloadButton → POST /api/pdf (JSON) → Playwright → localhost/print → page.pdf() → PDF buffer
```

## 주요 변경

### 1. `/print` 전용 페이지 (`src/app/print/page.tsx`)

- Preview.tsx의 A4 렌더링을 재사용하는 인쇄 전용 페이지
- 배경 UI 없이 A4 콘텐츠만 렌더링
- 데이터 수신: `/api/pdf/data?id={uuid}` 에서 fetch
- `@media print` 스타일 적용

### 2. PDF API route 재작성 (`src/app/api/pdf/route.ts`)

- `@react-pdf/renderer` 코드 전체 삭제 (~460줄)
- 흐름:
  1. 요청 JSON을 임시 저장 (메모리 Map, uuid 키)
  2. Playwright 브라우저로 `localhost:{port}/print?id={uuid}` 접속
  3. 페이지 렌더링 완료 대기
  4. `page.pdf({ format: 'A4' })` 호출
  5. 임시 데이터 삭제
  6. PDF buffer 반환

### 3. 데이터 전달 API (`src/app/api/pdf/data/route.ts`)

- GET /api/pdf/data?id={uuid}
- 임시 저장된 resume 데이터를 JSON으로 반환
- 1회 조회 후 자동 삭제 (일회용)

### 4. Playwright 브라우저 관리 (`src/lib/browser.ts`)

- 싱글톤 패턴으로 브라우저 인스턴스 재사용
- 매 요청마다 새 페이지(탭)만 생성/닫기

### 5. 의존성 변경

- 제거: `@react-pdf/renderer`
- 추가: `playwright` (또는 `playwright-core`)

## 삭제 대상

- `route.ts`의 react-pdf 전체 (Font.register, StyleSheet, React.createElement 섹션 컴포넌트들)

## 고려 사항

- 포트 감지: API route에서 자기 서버 포트를 알아야 `/print` 접근 가능
- Pretendard 폰트: `/print` 페이지에서 layout.tsx의 localFont로 자연스럽게 로드
- useAutoFit: print 페이지에서도 동일 작동 → PDF에도 자동 레이아웃 반영
- 속도: 브라우저 재사용으로 ~1-3초 목표
