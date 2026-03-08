<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-07 | Updated: 2026-03-07 -->

# app

## Purpose
Next.js App Router 디렉터리. 페이지, 레이아웃, 글로벌 스타일, API 라우트 포함.

## Key Files

| File | Description |
|------|-------------|
| `layout.tsx` | 루트 레이아웃 — Pretendard `localFont` 설정, `lang="ko"` |
| `page.tsx` | 메인 페이지 — 에디터(420px 사이드바) + 미리보기 2컬럼 레이아웃 |
| `globals.css` | Tailwind 글로벌 스타일 |
| `favicon.ico` | 파비콘 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | API 라우트 — PDF 생성 (see `api/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- `page.tsx`는 사이드바 420px, `bg-zinc-50`, `min-w-[1024px]` 레이아웃
- 새 페이지 추가 시 App Router 컨벤션 (`page.tsx`, `layout.tsx`) 준수

<!-- MANUAL: -->
