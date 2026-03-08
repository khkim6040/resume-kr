"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useResumeStore } from "@/store/resume";
import { A4Content } from "@/components/preview/A4Content";
import { useAutoFit } from "@/hooks/useAutoFit";
import type { ResumeData, TemplateId } from "@/types/resume";

declare global {
  interface Window {
    __PRINT_READY?: boolean;
  }
}

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const SCALE = 2.8;

function PrintPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loaded, setLoaded] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { data, dataVersion, templateId } = useResumeStore();
  const { contentRef, styles: fs } = useAutoFit(dataVersion);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/pdf/data?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Data fetch failed");
        return res.json() as Promise<{ data: ResumeData; templateId: TemplateId }>;
      })
      .then((result) => {
        useResumeStore.setState({
          data: result.data,
          templateId: result.templateId,
          dataVersion: Date.now(),
        });
        setLoaded(true);
      })
      .catch((err) => setFetchError((err as Error).message));
  }, [id]);

  // useAutoFit 안정화 후 ready 시그널
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      window.__PRINT_READY = true;
    }, 500);
    return () => clearTimeout(timer);
  }, [loaded]);

  if (!id) return <div>Error: Missing id parameter</div>;
  if (fetchError) return <div>Error: {fetchError}</div>;
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
      <A4Content data={data} fs={fs} contentRef={contentRef} templateId={templateId} />
    </div>
  );
}

export default function PrintPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrintPageInner />
    </Suspense>
  );
}
