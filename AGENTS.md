<!-- Generated: 2026-03-07 | Updated: 2026-03-07 -->

# resume-kr

## Purpose
한국어에 최적화된 이력서 빌더 웹 서비스. 섹션 자유 편집, 자동 레이아웃 조절, 고품질 PDF 내보내기가 핵심 가치.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | 프로젝트 의존성 및 스크립트 |
| `next.config.ts` | Next.js 16 설정 |
| `tsconfig.json` | TypeScript 설정 |
| `eslint.config.mjs` | ESLint flat config |
| `postcss.config.mjs` | PostCSS (Tailwind) 설정 |
| `HANDOFF.md` | 프로젝트 핸드오프 문서 (gitignore 대상) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | 애플리케이션 소스 코드 (see `src/AGENTS.md`) |
| `public/` | 정적 에셋 — 폰트, 아이콘 (see `public/AGENTS.md`) |
| `docs/` | 프로젝트 문서 및 계획서 (see `docs/AGENTS.md`) |
| `.github/` | GitHub 설정 — PR 템플릿 |

## For AI Agents

### Working In This Directory
- 스택: Next.js 16 + TypeScript + Tailwind CSS + Zustand + @dnd-kit
- 한글 폰트: Pretendard 정적 TTF (Variable 폰트는 react-pdf 미지원)
- `word-break: keep-all` 필수 (한글 줄바꿈)
- 하이브리드 아키텍처: HTML/CSS 실시간 미리보기 + 서버 PDF 생성

### Testing Requirements
- `npm run build`로 빌드 확인
- `npm run lint`로 린트 통과 확인

### Common Patterns
- Zustand `makeArrayActions<T>` 제네릭 헬퍼로 배열 CRUD
- `vSet` 래퍼로 모든 mutation에 `dataVersion` 자동 증가
- persist: key `resume-kr-storage`, `partialize`로 `dataVersion` 제외

## Dependencies

### External
- Next.js 16 — React 프레임워크
- Zustand — 상태 관리
- @react-pdf/renderer — 서버사이드 PDF 생성
- @dnd-kit — 드래그 앤 드롭
- Tailwind CSS — 스타일링

<!-- MANUAL: -->
