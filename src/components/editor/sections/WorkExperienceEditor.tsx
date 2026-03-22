"use client";

import { useResumeStore } from "@/store/resume";
import type { WorkExperience } from "@/types/resume";
import { SortableList } from "../SortableList";
import MonthInput from "../MonthInput";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function WorkExperienceEditor() {
  const { data, addWorkExperience, updateWorkExperience, removeWorkExperience, reorderWorkExperience, toggleSectionVisibility } = useResumeStore();
  const items = data.workExperience;

  function addItem() {
    const section = data.sections.find(s => s.type === "workExperience");
    if (section && !section.visible) {
      toggleSectionVisibility(section.id);
    }
    const item: WorkExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      isCurrent: false,
      description: [],
    };
    addWorkExperience(item);
  }

  return (
    <div className="flex flex-col gap-4">
      <SortableList items={items} onReorder={reorderWorkExperience}>
        {(item) => (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
            <div className="flex flex-wrap gap-2 min-w-0">
              <input
                type="text"
                placeholder="회사명"
                value={item.company}
                onChange={(e) => updateWorkExperience(item.id, { company: e.target.value })}
                className={`${INPUT} flex-1`}
              />
              <input
                type="text"
                placeholder="직책"
                value={item.position}
                onChange={(e) => updateWorkExperience(item.id, { position: e.target.value })}
                className={`${INPUT} flex-1`}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <MonthInput
                value={item.startDate}
                onChange={(v) => updateWorkExperience(item.id, { startDate: v })}
                placeholder="입사일 (2000.01)"
                className="flex-1"
              />
              <MonthInput
                value={item.endDate ?? ""}
                min={item.startDate || undefined}
                onChange={(v) => updateWorkExperience(item.id, { endDate: v })}
                disabled={item.isCurrent}
                placeholder="퇴사일 (2000.01)"
                className="flex-1"
              />
              <label className="flex items-center gap-1 text-sm text-zinc-600 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={item.isCurrent}
                  onChange={(e) => updateWorkExperience(item.id, { isCurrent: e.target.checked, endDate: undefined })}
                />
                현재 재직
              </label>
            </div>
            <textarea
              placeholder="업무 내용 (줄바꿈으로 항목 구분)"
              value={item.description.join("\n")}
              onChange={(e) => updateWorkExperience(item.id, { description: e.target.value.split("\n") })}
              rows={3}
              className={INPUT}
            />
            <button
              onClick={() => removeWorkExperience(item.id)}
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
        + 경력 추가
      </button>
    </div>
  );
}
