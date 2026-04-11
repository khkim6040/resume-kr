"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume";
import { useAutoFit } from "@/hooks/useAutoFit";
import { A4Content } from "./A4Content";

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const BASE_SCALE = 2.8;
const BASE_WIDTH = A4_WIDTH * BASE_SCALE;
const BASE_HEIGHT = A4_HEIGHT * BASE_SCALE;

const DEFAULT_ZOOM = 1.0;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.1;

export default function Preview() {
  const { data, dataVersion, templateId } = useResumeStore();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const { contentRef, styles: fs } = useAutoFit(dataVersion);

  return (
    <div className="flex h-full flex-col">
      {/* Zoom controls */}
      <div className="flex items-center justify-center gap-2 border-b border-zinc-200 bg-white px-4 py-2">
        <button
          onClick={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(1)))}
          disabled={zoom <= MIN_ZOOM}
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
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(1)))}
          disabled={zoom >= MAX_ZOOM}
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
      <div className="flex flex-1 flex-col items-center overflow-auto bg-zinc-100 p-8">
        {/* Scaled wrapper — takes up visual space for proper scrolling */}
        <div
          style={{
            width: BASE_WIDTH * zoom,
            minHeight: BASE_HEIGHT * zoom,
          }}
        >
          {/* Fixed-size A4 page with CSS transform for zoom */}
          <div
            className="relative bg-white shadow-lg"
            style={{
              width: BASE_WIDTH,
              minHeight: BASE_HEIGHT,
              fontFamily: "Pretendard, sans-serif",
              wordBreak: "keep-all",
              overflowWrap: "break-word",
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              backgroundImage: `repeating-linear-gradient(
                to bottom,
                transparent,
                transparent ${BASE_HEIGHT - 1}px,
                #d4d4d8 ${BASE_HEIGHT - 1}px,
                #d4d4d8 ${BASE_HEIGHT}px
              )`,
              backgroundSize: `100% ${BASE_HEIGHT}px`,
            }}
          >
            <A4Content data={data} fs={fs} contentRef={contentRef} templateId={templateId} />
          </div>
        </div>
      </div>
    </div>
  );
}
