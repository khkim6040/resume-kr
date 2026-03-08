<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-07 | Updated: 2026-03-07 -->

# components

## Purpose
React UI 컴포넌트. 에디터(편집 폼)와 미리보기(A4 렌더링) 두 영역으로 분리.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `editor/` | 이력서 편집 폼 컴포넌트 (see `editor/AGENTS.md`) |
| `preview/` | A4 실시간 미리보기 컴포넌트 (see `preview/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 에디터 컴포넌트는 Zustand store를 직접 구독
- 미리보기 컴포넌트는 읽기 전용으로 store 데이터를 표시

<!-- MANUAL: -->
