# Phase 2: Auto-Layout Engine + UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 콘텐츠 양에 따라 A4 1페이지에 자동 맞춤하는 레이아웃 엔진 + 에디터/미리보기 UI 개선

**Architecture:** ResizeObserver로 콘텐츠 높이를 측정하고, 4단계 fit level(normal/tight/compact/minimal)에 따라 CSS 변수를 조절하여 텍스트 리플로우를 유도한다. fit level은 데이터 변경 시에만 재계산하여 무한 루프를 방지한다.

**Tech Stack:** React hooks, ResizeObserver, CSS custom properties, Tailwind CSS

**A4 기준:** width=210mm, height=297mm, SCALE=2.8 → 588px x 831.6px. 패딩 40px x 2 = 80px → 가용 높이 ~751px

---

### Task 1: useAutoFit 훅 생성

**Files:**
- Create: `src/hooks/useAutoFit.ts`

**Step 1: 훅 구현**

```typescript
// src/hooks/useAutoFit.ts
import { useEffect, useRef, useState, useCallback } from "react";

const A4_HEIGHT_PX = 297 * 2.8; // 831.6px

export type FitLevel = 0 | 1 | 2 | 3;

export interface FitStyles {
  sectionGap: number;     // px between sections
  fontSize: number;       // base font size in px
  headingSize: number;    // section heading size in px
  nameSize: number;       // name font size in px
  itemGap: number;        // gap between items within a section
  padding: number;        // page padding in px
  headerMarginBottom: number;
}

const FIT_PRESETS: Record<FitLevel, FitStyles> = {
  0: { sectionGap: 20, fontSize: 14, headingSize: 16, nameSize: 24, itemGap: 16, padding: 40, headerMarginBottom: 24 },
  1: { sectionGap: 14, fontSize: 13, headingSize: 15, nameSize: 22, itemGap: 12, padding: 36, headerMarginBottom: 18 },
  2: { sectionGap: 10, fontSize: 12, headingSize: 14, nameSize: 20, itemGap: 8,  padding: 32, headerMarginBottom: 14 },
  3: { sectionGap: 6,  fontSize: 11, headingSize: 13, nameSize: 18, itemGap: 6,  padding: 24, headerMarginBottom: 10 },
};

export function useAutoFit(dataVersion: number) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [fitLevel, setFitLevel] = useState<FitLevel>(0);
  const iterationRef = useRef(0);

  const measure = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    const currentPadding = FIT_PRESETS[fitLevel].padding;
    const availableHeight = A4_HEIGHT_PX - currentPadding * 2;
    const contentHeight = el.scrollHeight;

    if (contentHeight > availableHeight && fitLevel < 3) {
      if (iterationRef.current < 4) {
        iterationRef.current++;
        setFitLevel((prev) => Math.min(prev + 1, 3) as FitLevel);
      }
    }
  }, [fitLevel]);

  // Reset when data changes
  useEffect(() => {
    iterationRef.current = 0;
    setFitLevel(0);
  }, [dataVersion]);

  // Measure after render
  useEffect(() => {
    // RAF to ensure layout is complete
    const id = requestAnimationFrame(() => {
      measure();
    });
    return () => cancelAnimationFrame(id);
  }, [fitLevel, dataVersion, measure]);

  return {
    contentRef,
    fitLevel,
    styles: FIT_PRESETS[fitLevel],
  };
}
```

**Step 2: Commit**
```bash
git add src/hooks/useAutoFit.ts
git commit -m "feat: useAutoFit 훅 추가 - 4단계 자동 레이아웃 스케일링"
```

---

### Task 2: Preview에 useAutoFit 통합 + 스타일 시스템 리팩터

**Files:**
- Modify: `src/components/preview/Preview.tsx`

**Step 1: Preview 컴포넌트를 useAutoFit 훅과 통합**

핵심 변경:
- `useAutoFit` 훅에서 반환된 `contentRef`를 콘텐츠 래퍼에 연결
- `styles` 객체를 인라인 스타일로 적용 (CSS 변수 대신 직접 적용이 더 단순)
- `dataVersion`을 Zustand 데이터의 변경 감지용으로 계산
- 피트 상태 인디케이터 추가

주요 스타일 매핑:
- `styles.sectionGap` → 섹션 간 `marginBottom`
- `styles.fontSize` → 본문 텍스트 `fontSize`
- `styles.headingSize` → 섹션 제목 `fontSize`
- `styles.nameSize` → 이름 `fontSize`
- `styles.padding` → A4 컨테이너 `padding`
- `styles.headerMarginBottom` → 헤더 `marginBottom`
- `styles.itemGap` → 항목 간 `gap`

피트 인디케이터:
- fitLevel 0: 표시 없음
- fitLevel 1-3: "자동 축소 적용" 뱃지 (미리보기 상단)

**Step 2: Commit**
```bash
git add src/components/preview/Preview.tsx
git commit -m "feat: Preview에 자동 레이아웃 엔진 통합"
```

---

### Task 3: 에디터 UI 개선 - 카드 스타일 + 아코디언

**Files:**
- Modify: `src/components/editor/Editor.tsx`

**Step 1: 에디터 UI 개선**

변경 사항:
- 각 섹션을 카드로 감싸기 (border, rounded, shadow-sm, hover 효과)
- 섹션 헤더 클릭으로 아코디언 토글 (열기/닫기)
- 드래그 핸들 + 가시성 토글 + 아코디언 토글을 한 줄에 배치
- 섹션 타이틀에 아이콘 추가 (SVG 아이콘, 외부 라이브러리 없이)
- 전체 에디터 헤더 영역 스타일 개선
- 접힌 상태에서 간단한 요약 표시 (항목 수 등)

아코디언 상태: 컴포넌트 로컬 state (useState<Set<string>>)

**Step 2: Commit**
```bash
git add src/components/editor/Editor.tsx
git commit -m "feat: 에디터 UI 개선 - 카드 스타일, 아코디언 토글"
```

---

### Task 4: 페이지 레이아웃 (page.tsx) 개선

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: 레이아웃 개선**

변경 사항:
- 에디터 사이드바 배경색/보더 정돈
- 미리보기 영역 배경 개선 (미묘한 도트 패턴 또는 단색)
- 반응형 고려 (최소 너비 설정)

**Step 2: Commit**
```bash
git add src/app/page.tsx
git commit -m "feat: 페이지 레이아웃 UI 정돈"
```

---

### Task 5: 스토어에 dataVersion 추가

**Files:**
- Modify: `src/store/resume.ts`

**Step 1: dataVersion 카운터 추가**

스토어에 `dataVersion: number` 필드 추가. 모든 데이터 변경 액션에서 increment.
useAutoFit 훅이 이 값을 의존성으로 사용하여 fit level 재계산 트리거.

persist에서 dataVersion은 제외 (매 세션 0에서 시작해도 무방).

**Step 2: Commit**
```bash
git add src/store/resume.ts
git commit -m "feat: 스토어에 dataVersion 추가 (자동 레이아웃 트리거용)"
```

---

### Task 6: 빌드 검증 + 수동 테스트

**Step 1: 빌드 확인**
```bash
npm run build
```
Expected: 빌드 성공

**Step 2: 수동 테스트 시나리오**
- 빈 이력서 → fitLevel 0 유지
- 섹션 5개 이상 데이터 입력 → 콘텐츠 넘칠 때 자동 축소 확인
- 섹션 제거 → fitLevel 다시 0으로 복귀 확인
- 에디터 아코디언 토글 정상 동작
- PDF 다운로드 정상 동작

---

## 실행 순서

의존 관계: Task 5 (dataVersion) → Task 1 (useAutoFit) → Task 2 (Preview 통합)
독립: Task 3 (에디터 UI), Task 4 (레이아웃)는 병렬 가능

추천 순서: 5 → 1 → 2 → 3 → 4 → 6
