<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-07 | Updated: 2026-03-07 -->

# hooks

## Purpose
커스텀 React 훅. 자동 레이아웃 피팅 로직 등 재사용 가능한 상태/효과 로직.

## Key Files

| File | Description |
|------|-------------|
| `useAutoFit.ts` | 4단계 자동 레이아웃 스케일링 훅 — FitLevel 0~3, ResizeObserver 기반, `dataVersion` 변경 시에만 재계산 |

## For AI Agents

### Working In This Directory
- `useAutoFit`는 fitLevel → 스타일 변경 → 높이 변경 → fitLevel 변경의 무한 루프에 주의. `iterationRef`로 최대 4회 제한
- CSS 변수가 아닌 인라인 스타일로 직접 적용하는 방식

<!-- MANUAL: -->
