"use client";

import { useResumeStore } from "@/store/resume";
import type { Education } from "@/types/resume";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function EducationEditor() {
  const { data, addEducation, updateEducation, removeEducation } = useResumeStore();
  const items = data.education;

  function addItem() {
    const item: Education = {
      id: crypto.randomUUID(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      isCurrent: false,
    };
    addEducation(item);
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="학교명"
              value={item.school}
              onChange={(e) => updateEducation(item.id, { school: e.target.value })}
              className={`${INPUT} flex-1`}
            />
            <input
              type="text"
              placeholder="학위 (예: 학사)"
              value={item.degree}
              onChange={(e) => updateEducation(item.id, { degree: e.target.value })}
              className={`${INPUT} flex-1`}
            />
          </div>
          <input
            type="text"
            placeholder="전공"
            value={item.field}
            onChange={(e) => updateEducation(item.id, { field: e.target.value })}
            className={INPUT}
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="시작일 (예: 2018.03)"
              value={item.startDate}
              onChange={(e) => updateEducation(item.id, { startDate: e.target.value })}
              className={`${INPUT} flex-1`}
            />
            <input
              type="text"
              placeholder="종료일"
              value={item.endDate ?? ""}
              onChange={(e) => updateEducation(item.id, { endDate: e.target.value })}
              disabled={item.isCurrent}
              className={`${INPUT} flex-1 disabled:bg-zinc-100 disabled:text-zinc-400`}
            />
            <label className="flex items-center gap-1 text-sm text-zinc-600 whitespace-nowrap">
              <input
                type="checkbox"
                checked={item.isCurrent}
                onChange={(e) => updateEducation(item.id, { isCurrent: e.target.checked, endDate: undefined })}
              />
              재학 중
            </label>
          </div>
          <button
            onClick={() => removeEducation(item.id)}
            className="self-end text-xs text-red-500 hover:text-red-700"
          >
            삭제
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
      >
        + 학력 추가
      </button>
    </div>
  );
}
