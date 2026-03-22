"use client";

import { useResumeStore } from "@/store/resume";
import type { Award } from "@/types/resume";
import { SortableList } from "../SortableList";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function AwardsEditor() {
  const { data, addAward, updateAward, removeAward, reorderAwards, toggleSectionVisibility } = useResumeStore();
  const items = data.awards;

  function addItem() {
    const section = data.sections.find(s => s.type === "awards");
    if (section && !section.visible) {
      toggleSectionVisibility(section.id);
    }
    const item: Award = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
    };
    addAward(item);
  }

  return (
    <div className="flex flex-col gap-4">
      <SortableList items={items} onReorder={reorderAwards}>
        {(item) => (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
            <input
              type="text"
              placeholder="수상명"
              value={item.name}
              onChange={(e) => updateAward(item.id, { name: e.target.value })}
              className={INPUT}
            />
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="발급기관"
                value={item.issuer}
                onChange={(e) => updateAward(item.id, { issuer: e.target.value })}
                className={`${INPUT} flex-1`}
              />
              <input
                type="month"
                value={item.date}
                onChange={(e) => updateAward(item.id, { date: e.target.value })}
                className={`${INPUT} flex-1`}
              />
            </div>
            <textarea
              placeholder="설명 (선택)"
              value={item.description ?? ""}
              onChange={(e) => updateAward(item.id, { description: e.target.value })}
              rows={2}
              className={INPUT}
            />
            <button
              onClick={() => removeAward(item.id)}
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
        + 수상 추가
      </button>
    </div>
  );
}
