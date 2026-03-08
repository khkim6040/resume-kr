"use client";

import { useResumeStore } from "@/store/resume";
import { useAutoFit } from "@/hooks/useAutoFit";
import { A4Content } from "./A4Content";

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const SCALE = 2.8;

const FIT_LABELS: Record<number, string> = {
  1: "약간 축소",
  2: "축소 적용",
  3: "최대 축소",
};

export default function Preview() {
  const { data, dataVersion, templateId } = useResumeStore();
  const { contentRef, fitLevel, styles: fs } = useAutoFit(dataVersion);

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto bg-zinc-100 p-8">
      {/* Fit status indicator */}
      {fitLevel > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700 shadow-sm">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          자동 {FIT_LABELS[fitLevel]} - 1페이지 맞춤
        </div>
      )}

      {/* A4 Page */}
      <div
        className="relative bg-white shadow-lg"
        style={{
          width: A4_WIDTH * SCALE,
          height: A4_HEIGHT * SCALE,
          overflow: "hidden",
          fontFamily: "Pretendard, sans-serif",
          wordBreak: "keep-all",
        }}
      >
        <A4Content data={data} fs={fs} contentRef={contentRef} templateId={templateId} />

        {/* Page number */}
        <div
          className="absolute bottom-0 left-0 right-0 text-center text-zinc-400"
          style={{ fontSize: 10, paddingBottom: 12 }}
        >
          1
        </div>
      </div>
    </div>
  );
}
