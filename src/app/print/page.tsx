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
      .catch((err) => setError((err as Error).message));
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
      <A4Content data={data} fs={fs} contentRef={contentRef} />
    </div>
  );
}
