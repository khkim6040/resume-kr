<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-07 | Updated: 2026-03-07 -->

# sections

## Purpose
7개 이력서 섹션별 편집 폼 컴포넌트. 각 컴포넌트는 Zustand store의 해당 섹션을 직접 구독/수정.

## Key Files

| File | Description |
|------|-------------|
| `WorkExperienceEditor.tsx` | 경력 사항 편집 |
| `EducationEditor.tsx` | 학력 편집 |
| `ProjectsEditor.tsx` | 프로젝트 편집 (이슈 #4: 기술 스택 태그 UI 개선 예정) |
| `SkillsEditor.tsx` | 기술 스택 편집 (이슈 #4: 태그 입력 UI 개선 예정) |
| `CertificatesEditor.tsx` | 자격증 편집 |
| `LanguagesEditor.tsx` | 어학 능력 편집 |
| `AwardsEditor.tsx` | 수상 내역 편집 |

## For AI Agents

### Working In This Directory
- 각 컴포넌트는 `makeArrayActions<T>` 패턴으로 생성된 store 액션 사용
- 새 섹션 추가 시: `types/resume.ts` 타입 → `store/resume.ts` 액션 → 여기에 에디터 → `Editor.tsx`에 등록 → `Preview.tsx`에 렌더링
- 이슈 #4에서 `SkillsEditor`와 `ProjectsEditor`의 기술 스택 입력을 태그 UI로 개선 예정

<!-- MANUAL: -->
