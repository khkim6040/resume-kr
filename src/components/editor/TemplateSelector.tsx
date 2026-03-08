"use client";

import { useResumeStore } from "@/store/resume";
import { TEMPLATES } from "@/components/preview/templates";
import type { TemplateId } from "@/types/resume";

const templateIds = Object.keys(TEMPLATES) as TemplateId[];

export default function TemplateSelector() {
  const { templateId, setTemplateId } = useResumeStore();

  return (
    <div className="flex gap-2">
      {templateIds.map((id) => {
        const { name, description } = TEMPLATES[id];
        const isSelected = templateId === id;

        return (
          <button
            key={id}
            onClick={() => setTemplateId(id)}
            className={`flex-1 rounded-lg border px-3 py-2 text-left transition-all ${
              isSelected
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
            }`}
          >
            <span
              className={`block text-xs font-semibold ${
                isSelected ? "text-blue-700" : "text-zinc-700"
              }`}
            >
              {name}
            </span>
            <span
              className={`block text-[10px] ${
                isSelected ? "text-blue-500" : "text-zinc-400"
              }`}
            >
              {description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
