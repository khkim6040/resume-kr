# react-pdf 벡터 PDF 내보내기 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** html2canvas 래스터 PDF를 @react-pdf/renderer 벡터 PDF로 교체하여 텍스트 선명도, 선택/검색, 파일 크기를 근본적으로 개선한다. HTML 미리보기는 기존 유지.

**Architecture:** DownloadButton에서 react-pdf의 `pdf()` 함수를 호출해 클라이언트 사이드에서 벡터 PDF Blob을 생성 → 다운로드. 3개 템플릿(classic/modern/minimal)을 react-pdf 전용으로 재작성하되, HTML 템플릿과 동일한 디자인 토큰을 공유하여 시각적 일관성을 유지한다. 서버 API(/api/pdf), Playwright 등 기존 서버사이드 PDF 인프라는 제거한다.

**Tech Stack:** @react-pdf/renderer, Pretendard TTF (기존 public/fonts/), React 19, Zustand

---

## 파일 구조

### 신규 생성
- `src/lib/pdf/fonts.ts` — Pretendard 폰트 등록 (@react-pdf/renderer Font.register)
- `src/lib/pdf/tokens.ts` — 3개 템플릿의 공유 디자인 토큰 (색상, 폰트 크기, 간격)
- `src/lib/pdf/styles.ts` — react-pdf StyleSheet 헬퍼 (토큰 → react-pdf 스타일 변환)
- `src/lib/pdf/utils.ts` — formatDate 등 PDF 전용 유틸 (기존 templates/utils.ts 재활용)
- `src/lib/pdf/templates/ClassicDocument.tsx` — Classic 템플릿 react-pdf 버전
- `src/lib/pdf/templates/ModernDocument.tsx` — Modern 템플릿 react-pdf 버전
- `src/lib/pdf/templates/MinimalDocument.tsx` — Minimal 템플릿 react-pdf 버전
- `src/lib/pdf/templates/index.ts` — PDF 템플릿 레지스트리
- `src/lib/pdf/ResumeDocument.tsx` — Document/Page 래퍼 + 템플릿 디스패처
- `src/lib/pdf/generatePdf.ts` — pdf() 호출 → Blob 생성 → 다운로드 트리거

### 수정
- `package.json` — playwright 제거, @react-pdf/renderer 추가
- `src/components/editor/DownloadButton.tsx` — 서버 API 호출 → generatePdf() 호출로 교체

### 삭제
- `src/app/api/pdf/route.ts`
- `src/app/api/pdf/data/route.ts`
- `src/app/print/page.tsx`
- `src/lib/browser.ts`
- `src/lib/pdfConstants.ts`
- `src/lib/pdfDataStore.ts`

### 변경 없음
- `src/components/preview/` 전체 (HTML 미리보기 유지)
- `src/hooks/useAutoFit.ts`
- `src/store/resume.ts`
- `src/types/resume.ts`

---

## Task 1: 의존성 교체

**Files:**
- Modify: `package.json`

- [ ] **Step 1: playwright 제거, @react-pdf/renderer 설치**

```bash
cd /Users/gwanhokim/personal-projects/resume-kr
npm uninstall playwright
npm install @react-pdf/renderer
```

- [ ] **Step 2: 빌드 확인**

Run: `npm run build`
Expected: 빌드 성공 (playwright import 하는 파일이 서버 API 쪽이라 빌드는 실패할 수 있음 — 다음 태스크에서 삭제 예정이므로 경고만 확인)

- [ ] **Step 3: 커밋**

```bash
git add package.json package-lock.json
git commit -m "chore: playwright 제거, @react-pdf/renderer 추가"
```

---

## Task 2: 서버사이드 PDF 인프라 삭제

**Files:**
- Delete: `src/app/api/pdf/route.ts`
- Delete: `src/app/api/pdf/data/route.ts`
- Delete: `src/app/print/page.tsx`
- Delete: `src/lib/browser.ts`
- Delete: `src/lib/pdfConstants.ts`
- Delete: `src/lib/pdfDataStore.ts`

- [ ] **Step 1: 파일 삭제**

```bash
rm -f src/app/api/pdf/route.ts src/app/api/pdf/data/route.ts
rm -rf src/app/api/pdf
rm -f src/app/print/page.tsx
rm -rf src/app/print
rm -f src/lib/browser.ts src/lib/pdfConstants.ts src/lib/pdfDataStore.ts
```

- [ ] **Step 2: 빌드 확인**

Run: `npm run build`
Expected: 빌드 성공 (DownloadButton이 아직 /api/pdf를 호출하지만 런타임 에러일 뿐 빌드는 통과)

- [ ] **Step 3: 커밋**

```bash
git add -A
git commit -m "refactor: 서버사이드 PDF 생성 인프라 삭제 (Playwright, API routes, print page)"
```

---

## Task 3: 폰트 등록 및 디자인 토큰

**Files:**
- Create: `src/lib/pdf/fonts.ts`
- Create: `src/lib/pdf/tokens.ts`
- Create: `src/lib/pdf/utils.ts`

- [ ] **Step 1: 폰트 등록 모듈 작성**

`src/lib/pdf/fonts.ts`:
```tsx
import { Font } from "@react-pdf/renderer";

const BASE = "/fonts";

export function registerFonts() {
  Font.register({
    family: "Pretendard",
    fonts: [
      { src: `${BASE}/Pretendard-Regular.ttf`, fontWeight: 400 },
      { src: `${BASE}/Pretendard-Medium.ttf`, fontWeight: 500 },
      { src: `${BASE}/Pretendard-SemiBold.ttf`, fontWeight: 600 },
      { src: `${BASE}/Pretendard-Bold.ttf`, fontWeight: 700 },
    ],
  });

  Font.registerHyphenationCallback((word) => [word]);
}
```

참고: `registerHyphenationCallback`으로 한글 하이픈 방지. `BASE`는 public/ 기준 경로.

- [ ] **Step 2: 디자인 토큰 작성**

`src/lib/pdf/tokens.ts`:
HTML 템플릿의 Tailwind 색상/크기를 pt 단위 수치로 매핑. 3개 템플릿 × FitLevel 0 기준.

```tsx
export const COLORS = {
  classic: {
    name: "#27272a",        // zinc-800
    heading: "#27272a",     // zinc-800
    headingBorder: "#e4e4e7", // zinc-200
    headerBorder: "#27272a",  // zinc-800
    body: "#3f3f46",        // zinc-700
    secondary: "#52525b",   // zinc-600
    muted: "#71717a",       // zinc-500
    pill: { bg: "#f4f4f5", text: "#52525b" }, // zinc-100, zinc-600
  },
  modern: {
    name: "#0f172a",        // slate-900
    heading: "#2563eb",     // blue-600
    headingLine: "#dbeafe", // blue-100
    accent: "#2563eb",      // blue-600
    accentLight: "#eff6ff", // blue-50
    accentBorder: "#bfdbfe",// blue-200
    body: "#475569",        // slate-600
    secondary: "#64748b",   // slate-500
    muted: "#94a3b8",       // slate-400
    pill: { bg: "#eff6ff", text: "#1d4ed8" }, // blue-50, blue-700
    techPill: { bg: "#f1f5f9", text: "#64748b" }, // slate-100, slate-500
  },
  minimal: {
    name: "#171717",        // neutral-900
    heading: "#a3a3a3",     // neutral-400
    divider: "#e5e5e5",     // neutral-200
    body: "#525252",        // neutral-600
    secondary: "#737373",   // neutral-500
    muted: "#a3a3a3",       // neutral-400
    separator: "#d4d4d4",   // neutral-300
  },
} as const;

export const SIZES = {
  // FitLevel 0 기준, pt 단위 (react-pdf 기본 단위)
  nameSize: 18,       // 24px ≈ 18pt
  headingSize: 12,    // 16px ≈ 12pt
  fontSize: 10.5,     // 14px ≈ 10.5pt
  smallFont: 9,       // 12px ≈ 9pt
  tinyFont: 7.5,      // 10px ≈ 7.5pt
  lineHeight: 1.5,
  sectionGap: 14,
  itemGap: 10,
  padding: 30,        // 40px ≈ 30pt
  headerMarginBottom: 16,
} as const;
```

- [ ] **Step 3: 유틸리티 작성**

`src/lib/pdf/utils.ts`:
```tsx
export function formatDate(date: string | undefined, isCurrent?: boolean): string {
  if (isCurrent) return "현재";
  if (!date) return "";
  return date.replace(/-/g, ".").slice(0, 7);
}
```

- [ ] **Step 4: 커밋**

```bash
git add src/lib/pdf/fonts.ts src/lib/pdf/tokens.ts src/lib/pdf/utils.ts
git commit -m "feat: react-pdf 폰트 등록, 디자인 토큰, 유틸리티 추가"
```

---

## Task 4: Classic 템플릿 (react-pdf)

**Files:**
- Create: `src/lib/pdf/templates/ClassicDocument.tsx`

- [ ] **Step 1: ClassicDocument 작성**

Classic 템플릿 특징:
- 이름 bold + border-bottom-2 zinc-800
- 연락처 한 줄 (gap-3, zinc-600)
- 섹션 제목: semibold + border-bottom zinc-200
- 경력: "회사 | 직책" 한 줄 + 날짜 우측 + bullet description
- 학력: "학교 | 학위 전공" + 날짜 우측
- 스킬: category(7rem 고정) + items 쉼표 구분
- 프로젝트: "이름 (역할)" + 날짜 + bullets + tech pill (zinc-100)
- 자격증/어학/수상: "이름 - 발급처" + 날짜

react-pdf의 `Document`, `Page`, `View`, `Text`, `StyleSheet` 사용.
flexDirection 기본이 column, 모든 스타일은 인라인 객체 또는 StyleSheet.

```tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData, SectionType } from "@/types/resume";
import { COLORS, SIZES } from "../tokens";
import { formatDate } from "../utils";

const c = COLORS.classic;
const s = SIZES;

const styles = StyleSheet.create({
  container: { padding: s.padding, fontFamily: "Pretendard" },
  // header
  header: {
    borderBottomWidth: 2,
    borderBottomColor: c.headerBorder,
    paddingBottom: s.headerMarginBottom * 0.6,
    marginBottom: s.headerMarginBottom,
  },
  name: { fontSize: s.nameSize, fontWeight: 700, color: c.name },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    fontSize: s.smallFont,
    color: c.secondary,
  },
  summary: {
    marginTop: 6,
    fontSize: s.smallFont,
    color: c.body,
    lineHeight: s.lineHeight,
  },
  // sections
  sectionTitle: {
    fontSize: s.headingSize,
    fontWeight: 600,
    color: c.heading,
    borderBottomWidth: 1,
    borderBottomColor: c.headingBorder,
    paddingBottom: s.sectionGap * 0.2,
    marginBottom: s.sectionGap * 0.4,
  },
  // items
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  itemTitle: { fontSize: s.fontSize, fontWeight: 500, color: c.name },
  itemSub: { fontSize: s.fontSize, fontWeight: 400, color: c.secondary },
  dateText: { fontSize: s.smallFont, color: c.muted, flexShrink: 0 },
  bulletList: { marginTop: 3, paddingLeft: 12 },
  bulletItem: { fontSize: s.smallFont, color: c.body, lineHeight: s.lineHeight, marginBottom: 1 },
  bulletDot: { position: "absolute", left: -8 },
  desc: { fontSize: s.smallFont, color: c.secondary, lineHeight: s.lineHeight, marginTop: 2 },
  // skills
  skillRow: { flexDirection: "row", fontSize: s.smallFont, marginBottom: 2 },
  skillCategory: { width: 80, fontWeight: 500, color: c.body, flexShrink: 0 },
  skillItems: { color: c.secondary, flex: 1 },
  // tech pill
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 3, marginTop: 3 },
  pill: {
    backgroundColor: c.pill.bg,
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    fontSize: s.tinyFont,
    color: c.pill.text,
  },
});
```

각 섹션(WorkExperience, Education, Skills, Projects, Certificates, Languages, Awards)을 View/Text로 렌더링.
전체 컴포넌트는 `export function ClassicDocument({ data }: { data: ResumeData })` 형태로 내보냄.

- [ ] **Step 2: 빌드 확인**

Run: `npx tsc --noEmit`
Expected: 타입 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/lib/pdf/templates/ClassicDocument.tsx
git commit -m "feat: Classic 템플릿 react-pdf 버전 추가"
```

---

## Task 5: Modern 템플릿 (react-pdf)

**Files:**
- Create: `src/lib/pdf/templates/ModernDocument.tsx`

- [ ] **Step 1: ModernDocument 작성**

Modern 템플릿 특징 (Classic과 다른 점):
- 블루 액센트 바 (h-1, w-16, bg-blue-600) 상단
- 이메일 앞에 "@" 파란색 텍스트
- summary에 좌측 파란 보더 (borderLeftWidth: 2, borderLeftColor: blue-200, paddingLeft)
- 섹션 제목: 대문자, tracking-wider, blue-600 + 양쪽 라인 (blue-100)
- 직책: 별도 줄에 blue-600 텍스트
- 스킬: pill 형태 (rounded-full, bg-blue-50, text-blue-700)
- tech stack: slate-100 pill (rounded-full)

```tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";
import { COLORS, SIZES } from "../tokens";
import { formatDate } from "../utils";

const c = COLORS.modern;
const s = SIZES;
// ... StyleSheet.create with modern-specific styles
```

- [ ] **Step 2: 타입 확인**

Run: `npx tsc --noEmit`

- [ ] **Step 3: 커밋**

```bash
git add src/lib/pdf/templates/ModernDocument.tsx
git commit -m "feat: Modern 템플릿 react-pdf 버전 추가"
```

---

## Task 6: Minimal 템플릿 (react-pdf)

**Files:**
- Create: `src/lib/pdf/templates/MinimalDocument.tsx`

- [ ] **Step 1: MinimalDocument 작성**

Minimal 템플릿 특징 (Classic과 다른 점):
- 이름: font-light (fontWeight: 300 → Pretendard에 없으므로 400), tracking-wide (letterSpacing: 1), +2pt
- 연락처: "|" 파이프 구분자 (neutral-300)
- 헤더 하단에 h-px 수평선 (neutral-200)
- 패딩 +4pt
- 섹션 제목: 대문자, tracking-widest (letterSpacing: 2), -3pt 크기, neutral-400
- 구분자: "/" (스킬 items, tech stack, 보조 정보)
- pill 없음 — 텍스트만

- [ ] **Step 2: 타입 확인**

Run: `npx tsc --noEmit`

- [ ] **Step 3: 커밋**

```bash
git add src/lib/pdf/templates/MinimalDocument.tsx
git commit -m "feat: Minimal 템플릿 react-pdf 버전 추가"
```

---

## Task 7: PDF 문서 래퍼 및 레지스트리

**Files:**
- Create: `src/lib/pdf/templates/index.ts`
- Create: `src/lib/pdf/ResumeDocument.tsx`

- [ ] **Step 1: 템플릿 레지스트리 작성**

`src/lib/pdf/templates/index.ts`:
```tsx
import type { TemplateId, ResumeData } from "@/types/resume";
import type { ComponentType } from "react";
import { ClassicDocument } from "./ClassicDocument";
import { ModernDocument } from "./ModernDocument";
import { MinimalDocument } from "./MinimalDocument";

export const PDF_TEMPLATES: Record<TemplateId, ComponentType<{ data: ResumeData }>> = {
  classic: ClassicDocument,
  modern: ModernDocument,
  minimal: MinimalDocument,
};
```

- [ ] **Step 2: ResumeDocument 래퍼 작성**

`src/lib/pdf/ResumeDocument.tsx`:
```tsx
import { Document, Page } from "@react-pdf/renderer";
import type { ResumeData, TemplateId } from "@/types/resume";
import { PDF_TEMPLATES } from "./templates";
import { registerFonts } from "./fonts";

registerFonts();

interface Props {
  data: ResumeData;
  templateId: TemplateId;
}

export function ResumeDocument({ data, templateId }: Props) {
  const Template = PDF_TEMPLATES[templateId];
  return (
    <Document>
      <Page size="A4" style={{ fontFamily: "Pretendard" }}>
        <Template data={data} />
      </Page>
    </Document>
  );
}
```

- [ ] **Step 3: 커밋**

```bash
git add src/lib/pdf/templates/index.ts src/lib/pdf/ResumeDocument.tsx
git commit -m "feat: PDF 문서 래퍼 및 템플릿 레지스트리 추가"
```

---

## Task 8: PDF 생성 함수 및 DownloadButton 연결

**Files:**
- Create: `src/lib/pdf/generatePdf.ts`
- Modify: `src/components/editor/DownloadButton.tsx`

- [ ] **Step 1: generatePdf 함수 작성**

`src/lib/pdf/generatePdf.ts`:
```tsx
import { pdf } from "@react-pdf/renderer";
import { ResumeDocument } from "./ResumeDocument";
import type { ResumeData, TemplateId } from "@/types/resume";

export async function generatePdf(data: ResumeData, templateId: TemplateId) {
  const blob = await pdf(<ResumeDocument data={data} templateId={templateId} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 2: DownloadButton 수정**

`src/components/editor/DownloadButton.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume";

export default function DownloadButton() {
  const data = useResumeStore((s) => s.data);
  const templateId = useResumeStore((s) => s.templateId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    setError(null);
    try {
      const { generatePdf } = await import("@/lib/pdf/generatePdf");
      await generatePdf(data, templateId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "생성 중..." : "PDF 다운로드"}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
```

참고: `await import()`로 dynamic import하여 react-pdf 번들이 초기 로드에 포함되지 않도록 함.

- [ ] **Step 3: 빌드 확인**

Run: `npm run build`
Expected: 빌드 성공

- [ ] **Step 4: 커밋**

```bash
git add src/lib/pdf/generatePdf.ts src/components/editor/DownloadButton.tsx
git commit -m "feat: DownloadButton을 react-pdf 벡터 PDF 생성으로 전환"
```

---

## Task 9: 통합 테스트 및 마무리

- [ ] **Step 1: 개발 서버에서 수동 테스트**

```bash
npm run dev
```

브라우저에서 확인:
1. 이력서 데이터 입력
2. 3개 템플릿 각각 PDF 다운로드
3. PDF 열어서 확인: 텍스트 선택 가능, 선명도, 레이아웃 정상

- [ ] **Step 2: 빌드 + lint 확인**

```bash
npm run build && npm run lint
```

- [ ] **Step 3: 최종 커밋**

빌드/린트에서 발견된 문제가 있다면 수정 후 커밋.
