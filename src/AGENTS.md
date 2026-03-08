<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-07 | Updated: 2026-03-07 -->

# src

## Purpose
애플리케이션 전체 소스 코드. Next.js App Router 구조를 따르며, 편집기/미리보기 컴포넌트, 상태 관리, 타입, 커스텀 훅으로 구성.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router — 페이지, 레이아웃, API 라우트 (see `app/AGENTS.md`) |
| `components/` | React 컴포넌트 — 에디터, 미리보기 (see `components/AGENTS.md`) |
| `hooks/` | 커스텀 React 훅 (see `hooks/AGENTS.md`) |
| `store/` | Zustand 상태 관리 (see `store/AGENTS.md`) |
| `types/` | TypeScript 타입 정의 (see `types/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Next.js App Router 컨벤션을 따름 (`app/` 디렉터리)
- 컴포넌트는 `components/`에, 비즈니스 로직은 `store/`에 분리
- 모든 타입은 `types/resume.ts`에 중앙 정의

<!-- MANUAL: -->
