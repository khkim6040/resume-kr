# Phase 3: Playwright PDF 전환 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** @react-pdf/renderer를 Playwright page.pdf()로 교체하여 미리보기 = PDF 100% 일치 달성

**Architecture:** API route가 요청 데이터를 인메모리에 임시 저장하고, Playwright 브라우저로 /print 전용 페이지를 열어 동일한 Preview 컴포넌트를 렌더링한 뒤 page.pdf()로 PDF를 캡처한다. 브라우저는 싱글톤으로 재사용.

**Tech Stack:** Playwright (playwright-core), Next.js 16 App Router, Zustand, Tailwind CSS

---

### Task 1: 의존성 교체

**Files:**
- Modify: `package.json`

**Step 1: @react-pdf/renderer 제거**

Run: `npm uninstall @react-pdf/renderer`

**Step 2: playwright 설치**

Run: `npm install playwright`

**Step 3: Chromium 브라우저 설치**

Run: `npx playwright install chromium`

**Step 4: 빌드 확인**

Run: `npm run build`
Expected: @react-pdf/renderer import가 남아있어 빌드 실패 (정상 — 이후 Task에서 수정)

**Step 5: 커밋**

```bash
git add package.json package-lock.json
git commit -m "chore: @react-pdf/renderer 제거, playwright 추가"
```

---

### Task 2: Playwright 브라우저 싱글톤

**Files:**
- Create: `src/lib/browser.ts`

**Step 1: 브라우저 싱글톤 모듈 작성**

```typescript
import { chromium, type Browser } from "playwright";

let browserInstance: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browserInstance;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
```

**Step 2: 커밋**

```bash
git add src/lib/browser.ts
git commit -m "feat: Playwright 브라우저 싱글톤 모듈 추가"
```

---

### Task 3: 임시 데이터 저장소

**Files:**
- Create: `src/lib/pdfDataStore.ts`

**Step 1: 인메모리 데이터 저장소 작성**

PDF 생성 요청의 JSON 데이터를 임시 저장하여 /print 페이지에서 fetch할 수 있게 한다.
자동 만료(30초)로 메모리 누수 방지.

```typescript
import type { ResumeData } from "@/types/resume";

const store = new Map<string, { data: ResumeData; expires: number }>();

export function saveData(id: string, data: ResumeData): void {
  store.set(id, { data, expires: Date.now() + 30_000 });
}

export function getData(id: string): ResumeData | null {
  const entry = store.get(id);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(id);
    return null;
  }
  store.delete(id); // 1회 조회 후 삭제
  return entry.data;
}
```

**Step 2: 커밋**

```bash
git add src/lib/pdfDataStore.ts
git commit -m "feat: PDF 생성용 인메모리 임시 데이터 저장소 추가"
```

---

### Task 4: 데이터 전달 API 라우트

**Files:**
- Create: `src/app/api/pdf/data/route.ts`

**Step 1: GET /api/pdf/data?id={uuid} 라우트 작성**

/print 페이지에서 이 엔드포인트를 호출하여 렌더링할 데이터를 받는다.

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getData } from "@/lib/pdfDataStore";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const data = getData(id);
  if (!data) {
    return NextResponse.json({ error: "Data not found or expired" }, { status: 404 });
  }

  return NextResponse.json(data);
}
```

**Step 2: 커밋**

```bash
git add src/app/api/pdf/data/route.ts
git commit -m "feat: PDF 데이터 전달용 API 라우트 추가"
```

---

### Task 5: /print 전용 페이지

**Files:**
- Create: `src/app/print/page.tsx`
- Reference: `src/components/preview/Preview.tsx` (렌더링 로직 재사용)
- Reference: `src/hooks/useAutoFit.ts` (자동 레이아웃)

**Step 1: PrintPreview 컴포넌트 작성**

/print 페이지는 Preview.tsx와 동일한 A4 렌더링을 하되:
- 배경 UI(bg-zinc-100, 피트 인디케이터, 페이지 번호) 제거
- URL의 id 파라미터로 데이터를 fetch
- 렌더링 완료 시 `window.__PRINT_READY = true` 시그널 설정
- useAutoFit가 안정화될 시간 확보 (setTimeout)

Preview.tsx에서 섹션 렌더링 컴포넌트들을 그대로 import해야 하므로,
Preview.tsx의 섹션 컴포넌트들을 별도 파일로 추출하는 것이 이상적이나,
최소 변경을 위해 /print 페이지에서 직접 store에 데이터를 주입하고 Preview 컴포넌트를 재사용한다.

```tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useResumeStore } from "@/store/resume";
import Preview from "@/components/preview/Preview";
import type { ResumeData } from "@/types/resume";

declare global {
  interface Window {
    __PRINT_READY?: boolean;
  }
}

export default function PrintPage() {
  const searchParams = useSearchParams();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) {
      setError("Missing id parameter");
      return;
    }

    fetch(`/api/pdf/data?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Data fetch failed");
        return res.json() as Promise<ResumeData>;
      })
      .then((data) => {
        // store에 데이터 주입
        useResumeStore.setState({ data });
        setLoaded(true);

        // useAutoFit 안정화 대기 후 ready 시그널
        setTimeout(() => {
          window.__PRINT_READY = true;
        }, 500);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [searchParams]);

  if (error) return <div>Error: {error}</div>;
  if (!loaded) return <div>Loading...</div>;

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: 0,
        padding: 0,
        background: "white",
      }}
    >
      <Preview />
    </div>
  );
}
```

주의: Preview.tsx가 현재 외부 UI(bg-zinc-100 배경, 피트 인디케이터 뱃지 등)를 포함하고 있으므로,
print 페이지에서 깔끔하게 렌더링되려면 Preview.tsx를 리팩터링하여 **내부 A4 콘텐츠**와 **외부 래퍼**를 분리해야 한다.

**Step 2: Preview.tsx 리팩터링 — A4Content 분리**

`src/components/preview/Preview.tsx`를 수정하여:
1. A4 내부 콘텐츠를 `A4Content` 컴포넌트로 추출 (export)
2. 기존 `Preview`는 `A4Content`를 감싸는 래퍼로 유지
3. /print 페이지에서 `A4Content`를 직접 import

Preview.tsx에서 추출할 부분:
- 섹션 렌더링 컴포넌트들 (WorkExperienceSection, EducationSection 등)
- SectionContent 컴포넌트
- A4 컨테이너 내부 콘텐츠 (ref={contentRef} div 이하)

추출 대상 → `src/components/preview/A4Content.tsx`:
- `A4Content` 컴포넌트: data + fitStyles를 props로 받아 A4 내부를 렌더링
- 모든 섹션 컴포넌트를 이 파일로 이동

Preview.tsx는:
- `A4Content`를 import하여 기존과 동일하게 표시
- 피트 인디케이터, bg-zinc-100 배경 등 외부 UI 유지

/print 페이지는:
- `A4Content`를 import하여 배경 UI 없이 렌더링
- useAutoFit를 직접 사용

**Step 3: /print 페이지를 A4Content 기반으로 수정**

A4Content 추출 후, print/page.tsx를 업데이트:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useResumeStore } from "@/store/resume";
import { A4Content } from "@/components/preview/A4Content";
import { useAutoFit } from "@/hooks/useAutoFit";
import type { ResumeData } from "@/types/resume";

declare global {
  interface Window {
    __PRINT_READY?: boolean;
  }
}

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const SCALE = 2.8;

export default function PrintPage() {
  const searchParams = useSearchParams();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data, dataVersion } = useResumeStore();
  const { contentRef, styles: fs } = useAutoFit(dataVersion);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) {
      setError("Missing id parameter");
      return;
    }

    fetch(`/api/pdf/data?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Data fetch failed");
        return res.json() as Promise<ResumeData>;
      })
      .then((resumeData) => {
        useResumeStore.setState({
          data: resumeData,
          dataVersion: Date.now(),
        });
        setLoaded(true);
      })
      .catch((err) => setError(err.message));
  }, [searchParams]);

  // useAutoFit 안정화 후 ready 시그널
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      window.__PRINT_READY = true;
    }, 500);
    return () => clearTimeout(timer);
  }, [loaded]);

  if (error) return <div>Error: {error}</div>;
  if (!loaded) return <div>Loading...</div>;

  return (
    <div
      style={{
        width: A4_WIDTH * SCALE,
        height: A4_HEIGHT * SCALE,
        overflow: "hidden",
        fontFamily: "Pretendard, sans-serif",
        wordBreak: "keep-all",
        background: "white",
      }}
    >
      <A4Content
        data={data}
        fs={fs}
        contentRef={contentRef}
      />
    </div>
  );
}
```

**Step 4: 빌드 확인**

Run: `npm run build`
Expected: /print 페이지가 정상 빌드됨

**Step 5: 수동 확인**

Run: `npm run dev`
- 브라우저에서 `localhost:3000` 접속하여 기존 에디터/미리보기 정상 동작 확인
- (데이터 API가 없으면 /print 페이지는 아직 단독 테스트 불가)

**Step 6: 커밋**

```bash
git add src/components/preview/A4Content.tsx src/components/preview/Preview.tsx src/app/print/page.tsx
git commit -m "feat: A4Content 분리 및 /print 전용 페이지 추가"
```

---

### Task 6: PDF API route 재작성

**Files:**
- Rewrite: `src/app/api/pdf/route.ts`
- Reference: `src/lib/browser.ts`
- Reference: `src/lib/pdfDataStore.ts`

**Step 1: route.ts를 Playwright 기반으로 재작성**

기존 @react-pdf/renderer 코드 전체 삭제 후 새로 작성.

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getBrowser } from "@/lib/browser";
import { saveData } from "@/lib/pdfDataStore";
import type { ResumeData } from "@/types/resume";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let data: ResumeData;
  try {
    data = (await req.json()) as ResumeData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const id = randomUUID();
  saveData(id, data);

  // 현재 서버의 origin 추출
  const origin = req.nextUrl.origin;

  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(`${origin}/print?id=${id}`, {
      waitUntil: "networkidle",
    });

    // useAutoFit 안정화 + ready 시그널 대기
    await page.waitForFunction(() => window.__PRINT_READY === true, {
      timeout: 10_000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await page.close();
  }
}
```

**Step 2: window.__PRINT_READY 타입 선언 확인**

`src/app/print/page.tsx`에 이미 `declare global`이 있으므로 route.ts에서는 별도 선언 불필요.
다만 Playwright의 `waitForFunction`은 브라우저 컨텍스트에서 실행되므로 TypeScript 타입과 무관.

**Step 3: 빌드 확인**

Run: `npm run build`
Expected: 빌드 성공. @react-pdf/renderer import가 더 이상 없음.

**Step 4: 커밋**

```bash
git add src/app/api/pdf/route.ts
git commit -m "feat: PDF API를 Playwright page.pdf() 기반으로 재작성"
```

---

### Task 7: 통합 테스트

**Step 1: 개발 서버 시작**

Run: `npm run dev`

**Step 2: 에디터/미리보기 정상 동작 확인**

- `localhost:3000` 접속
- 에디터에서 이력서 내용 입력
- 오른쪽 미리보기에서 실시간 반영 확인

**Step 3: PDF 다운로드 테스트**

- "PDF 다운로드" 버튼 클릭
- resume.pdf 파일 다운로드 확인
- PDF 열어서 미리보기와 레이아웃 일치 확인

**Step 4: 자동 레이아웃 PDF 반영 확인**

- 에디터에서 내용을 많이 추가하여 useAutoFit이 축소 레벨을 적용하게 만듦
- PDF 다운로드하여 축소된 레이아웃이 PDF에도 반영되는지 확인

**Step 5: 빈 데이터 PDF 확인**

- 모든 항목을 비운 상태에서 PDF 다운로드
- 에러 없이 정상 생성되는지 확인

---

### Task 8: 정리 및 최종 커밋

**Files:**
- Check: `.gitignore` (playwright 관련 추가 필요 여부)
- Update: `HANDOFF.md`

**Step 1: .gitignore 확인**

Playwright가 생성하는 파일이 있는지 확인. 보통 `playwright-report/`, `test-results/` 등이 있지만,
이 프로젝트는 Playwright를 테스트 프레임워크로 쓰는 것이 아니라 PDF 생성용이므로 추가 불필요할 수 있음.

**Step 2: HANDOFF.md 업데이트**

Phase 3 완료 상태를 반영:
- Phase 3 완료 기록
- @react-pdf/renderer → Playwright 전환 완료
- 새 파일 목록 추가 (browser.ts, pdfDataStore.ts, A4Content.tsx, print/page.tsx, api/pdf/data/route.ts)
- Next Steps에서 Phase 3 항목 제거, 템플릿 다양화는 남겨둠

**Step 3: 린트 확인**

Run: `npm run lint`
Expected: 에러 없음

**Step 4: 프로덕션 빌드 확인**

Run: `npm run build`
Expected: 빌드 성공

**Step 5: 최종 커밋**

```bash
git add HANDOFF.md
git commit -m "docs: Phase 3 Playwright PDF 전환 완료 반영"
```

---

## 의존 관계

```
Task 1 (의존성 교체)
  ↓
Task 2 (브라우저 싱글톤) ─── Task 3 (데이터 저장소) ─── Task 4 (데이터 API)
  ↓                                                        ↓
  └──────────────── Task 5 (/print 페이지 + A4Content 분리) ─┘
                           ↓
                    Task 6 (PDF API 재작성)
                           ↓
                    Task 7 (통합 테스트)
                           ↓
                    Task 8 (정리)
```

Task 2, 3, 4는 서로 독립적이므로 병렬 진행 가능.
