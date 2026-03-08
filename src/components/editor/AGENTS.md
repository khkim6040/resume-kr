<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-07 | Updated: 2026-03-07 -->

# editor

## Purpose
이력서 편집 UI. 카드 스타일 레이아웃, 아코디언 토글, 섹션별 아이콘, DnD 순서 변경, PDF 다운로드 버튼 포함.

## Key Files

| File | Description |
|------|-------------|
| `Editor.tsx` | 메인 에디터 — 카드 UI(rounded border, shadow, hover), 아코디언(`useState<Set<string>>`), 섹션별 SVG 아이콘, PersonalInfo 2-column 그리드 |
| `DownloadButton.tsx` | PDF 다운로드 버튼 — POST /api/pdf 호출 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `sections/` | 7개 섹션별 편집 폼 컴포넌트 (see `sections/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 에디터는 Zustand store를 직접 구독하여 양방향 바인딩
- 새 섹션 추가 시 `sections/`에 컴포넌트 생성 후 `Editor.tsx`에 등록
- DnD는 `@dnd-kit` 사용

<!-- MANUAL: -->
