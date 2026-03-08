<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-07 | Updated: 2026-03-07 -->

# public

## Purpose
정적 에셋 디렉터리. Pretendard 한글 폰트와 기본 SVG 아이콘 포함.

## Key Files

| File | Description |
|------|-------------|
| `file.svg` | 기본 아이콘 |
| `globe.svg` | 기본 아이콘 |
| `next.svg` | Next.js 로고 |
| `vercel.svg` | Vercel 로고 |
| `window.svg` | 기본 아이콘 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `fonts/` | Pretendard TTF 폰트 파일 4종 (see `fonts/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 폰트 추가 시 `src/app/layout.tsx`의 `localFont` 설정도 함께 수정
- `@react-pdf/renderer`는 Variable 폰트 미지원 — 정적 TTF만 사용

<!-- MANUAL: -->
