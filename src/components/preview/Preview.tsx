"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume";
import { useAutoFit } from "@/hooks/useAutoFit";
import { A4Content } from "./A4Content";

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const DEFAULT_SCALE = 2.8;
const MIN_SCALE = 1.5;
const MAX_SCALE = 4.0;
const SCALE_STEP = 0.3;

export default function Preview() {
  const { data, dataVersion, templateId } = useResumeStore();
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const pageHeight = A4_HEIGHT * scale;
  const { contentRef, styles: fs } = useAutoFit(dataVersion, scale);

  return (
    <div className="flex h-full flex-col">
      {/* Zoom controls */}
      <div className="flex items-center justify-center gap-2 border-b border-zinc-200 bg-white px-4 py-2">
        <button
          onClick={() => setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(1)))}
          disabled={scale <= MIN_SCALE}
          className="rounded-md border border-zinc-200 p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="축소"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <span className="min-w-[3.5rem] text-center text-sm text-zinc-600">
          {Math.round((scale / DEFAULT_SCALE) * 100)}%
        </span>
        <button
          onClick={() => setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(1)))}
          disabled={scale >= MAX_SCALE}
          className="rounded-md border border-zinc-200 p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="확대"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
      </div>

      {/* A4 Page area */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto bg-zinc-100 p-8">
        <div
          className="relative bg-white shadow-lg"
          style={{
            width: A4_WIDTH * scale,
            minHeight: pageHeight,
            fontFamily: "Pretendard, sans-serif",
            wordBreak: "keep-all",
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent,
              transparent ${pageHeight - 1}px,
              #d4d4d8 ${pageHeight - 1}px,
              #d4d4d8 ${pageHeight}px
            )`,
            backgroundSize: `100% ${pageHeight}px`,
          }}
        >
          <A4Content data={data} fs={fs} contentRef={contentRef} templateId={templateId} />
        </div>
      </div>
    </div>
  );
}
