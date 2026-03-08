<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-07 | Updated: 2026-03-07 -->

# fonts

## Purpose
Pretendard 한글 폰트 정적 TTF 파일. 4가지 웨이트 제공.

## Key Files

| File | Description |
|------|-------------|
| `Pretendard-Regular.ttf` | 400 웨이트 — 본문 텍스트 |
| `Pretendard-Medium.ttf` | 500 웨이트 — 중간 강조 |
| `Pretendard-SemiBold.ttf` | 600 웨이트 — 소제목 |
| `Pretendard-Bold.ttf` | 700 웨이트 — 제목 |

## For AI Agents

### Working In This Directory
- Variable 폰트(.woff2) 사용 금지 — `@react-pdf/renderer` 미지원
- 폰트 추가/변경 시 `src/app/layout.tsx`의 `localFont` 설정과 PDF API route의 폰트 등록도 함께 수정

<!-- MANUAL: -->
