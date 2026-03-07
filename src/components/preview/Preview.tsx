"use client";

import { useResumeStore } from "@/store/resume";

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const SCALE = 2.8;

export default function Preview() {
  const { data } = useResumeStore();
  const { personalInfo, sections } = data;

  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-full items-start justify-center overflow-y-auto bg-zinc-100 p-8">
      <div
        className="bg-white shadow-lg"
        style={{
          width: A4_WIDTH * SCALE,
          minHeight: A4_HEIGHT * SCALE,
          padding: 40,
          fontFamily: "Pretendard, sans-serif",
          wordBreak: "keep-all",
        }}
      >
        {/* Header */}
        <div className="mb-6 border-b border-zinc-200 pb-4">
          <h1 className="text-2xl font-bold">
            {personalInfo.name || "이름을 입력하세요"}
          </h1>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
          </div>
          {personalInfo.summary && (
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              {personalInfo.summary}
            </p>
          )}
        </div>

        {/* Sections */}
        {visibleSections
          .filter((s) => s.type !== "personalInfo")
          .map((section) => (
            <div key={section.id} className="mb-5">
              <h2 className="mb-2 border-b border-zinc-100 pb-1 text-base font-semibold">
                {section.title}
              </h2>
              <p className="text-sm text-zinc-400">
                항목을 추가하세요
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
