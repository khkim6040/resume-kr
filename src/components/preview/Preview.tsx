"use client";

import { useResumeStore } from "@/store/resume";
import { useAutoFit } from "@/hooks/useAutoFit";
import { A4Content } from "./A4Content";

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const SCALE = 2.8;

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
          minHeight: A4_HEIGHT * SCALE,
          fontFamily: "Pretendard, sans-serif",
          wordBreak: "keep-all",
        }}
      >
        <A4Content data={data} fs={fs} contentRef={contentRef} templateId={templateId} />
      </div>
    </div>
  );
}
