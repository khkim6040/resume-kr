"use client";

import { useResumeStore } from "@/store/resume";
import type { Language } from "@/types/resume";
import { SortableList } from "../SortableList";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function LanguagesEditor() {
  const { data, addLanguage, updateLanguage, removeLanguage, reorderLanguages, toggleSectionVisibility } = useResumeStore();
  const items = data.languages;

  function addItem() {
    const section = data.sections.find(s => s.type === "languages");
    if (section && !section.visible) {
      toggleSectionVisibility(section.id);
    }
    const item: Language = {
      id: crypto.randomUUID(),
      name: "",
      level: "",
    };
    addLanguage(item);
  }

  return (
    <div className="flex flex-col gap-4">
      <SortableList items={items} onReorder={reorderLanguages}>
        {(item) => (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="언어 (예: 영어)"
                value={item.name}
                onChange={(e) => updateLanguage(item.id, { name: e.target.value })}
                className={`${INPUT} flex-1`}
              />
              <input
                type="text"
                placeholder="수준 (예: 비즈니스 회화)"
                value={item.level}
                onChange={(e) => updateLanguage(item.id, { level: e.target.value })}
                className={`${INPUT} flex-1`}
              />
            </div>
            <button
              onClick={() => removeLanguage(item.id)}
              className="self-end text-xs text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </div>
        )}
      </SortableList>
      <button
        onClick={addItem}
        className="rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
      >
        + 언어 추가
      </button>
    </div>
  );
}
