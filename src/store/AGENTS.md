<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-07 | Updated: 2026-03-07 -->

# store

## Purpose
Zustand 기반 전역 상태 관리. 이력서 데이터, 섹션 순서/가시성, 배열 CRUD 액션 포함.

## Key Files

| File | Description |
|------|-------------|
| `resume.ts` | 메인 스토어 — `makeArrayActions<T>` 제네릭 헬퍼, `vSet` 래퍼(dataVersion 자동 증가), persist 설정 |

## For AI Agents

### Working In This Directory
- `vSet` 래퍼를 통해 모든 mutation에서 `dataVersion`이 자동 증가
- persist key: `resume-kr-storage`, `partialize`로 `dataVersion` 제외
- 새 섹션 추가 시 `makeArrayActions<T>` 패턴을 따를 것

<!-- MANUAL: -->
