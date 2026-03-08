<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-07 | Updated: 2026-03-07 -->

# preview

## Purpose
A4 실시간 미리보기 컴포넌트. 자동 레이아웃 피팅, 페이지 번호, 피트 상태 인디케이터 포함.

## Key Files

| File | Description |
|------|-------------|
| `Preview.tsx` | A4 미리보기 — useAutoFit 통합, 동적 font-size/spacing/margin/lineHeight, 피트 상태 뱃지, A4 고정 높이 컨테이너, 페이지 번호 |

## For AI Agents

### Working In This Directory
- 미리보기는 store를 읽기 전용으로 구독
- 스타일은 인라인 스타일로 직접 적용 (CSS 변수 아님)
- `word-break: keep-all` 필수 (한글 줄바꿈)
- Phase 3에서 이 컴포넌트의 출력이 PDF와 동일해야 함 (CSS = PDF 일치)

<!-- MANUAL: -->
