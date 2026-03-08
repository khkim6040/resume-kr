<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-07 | Updated: 2026-03-07 -->

# pdf

## Purpose
PDF 생성 API 라우트. POST /api/pdf로 이력서 데이터를 받아 `@react-pdf/renderer`로 서버사이드 PDF 생성.

## Key Files

| File | Description |
|------|-------------|
| `route.ts` | API 핸들러 — `React.createElement`로 컴포넌트 생성 (JSX transform 이슈 회피), Pretendard 폰트 등록 |

## For AI Agents

### Working In This Directory
- `@react-pdf/renderer`는 서버 전용 — 클라이언트 번들(700KB+)에 포함 금지
- JSX 대신 `React.createElement` 사용 (Next.js + react-pdf 호환성 이슈 #2681)
- Variable 폰트 미지원 — 정적 TTF만 등록
- Phase 3에서 Playwright `page.pdf()`로 전환 예정 (Chromium ~300MB → Vercel 서버리스 제약 고려 필요)

<!-- MANUAL: -->
