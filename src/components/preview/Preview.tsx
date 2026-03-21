"use client";

import { useResumeStore } from "@/store/resume";
import { useAutoFit } from "@/hooks/useAutoFit";
import { A4Content } from "./A4Content";

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const SCALE = 2.8;
const PAGE_HEIGHT = A4_HEIGHT * SCALE;

export default function Preview() {
  const { data, dataVersion, templateId } = useResumeStore();
  const { contentRef, styles: fs } = useAutoFit(dataVersion);

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto bg-zinc-100 p-8">
      {/* A4 Page */}
      <div
        className="relative bg-white shadow-lg"
        style={{
          width: A4_WIDTH * SCALE,
          minHeight: PAGE_HEIGHT,
          fontFamily: "Pretendard, sans-serif",
          wordBreak: "keep-all",
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent,
            transparent ${PAGE_HEIGHT - 1}px,
            #d4d4d8 ${PAGE_HEIGHT - 1}px,
            #d4d4d8 ${PAGE_HEIGHT}px
          )`,
          backgroundSize: `100% ${PAGE_HEIGHT}px`,
        }}
      >
        <A4Content data={data} fs={fs} contentRef={contentRef} templateId={templateId} />
      </div>
    </div>
  );
}
