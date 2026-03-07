"use client";

import { useResumeStore } from "@/store/resume";
import type { Skill } from "@/types/resume";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function SkillsEditor() {
  const { data, addSkill, updateSkill, removeSkill } = useResumeStore();
  const items = data.skills;

  function addItem() {
    const item: Skill = {
      id: crypto.randomUUID(),
      category: "",
      items: [],
    };
    addSkill(item);
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
          <input
            type="text"
            placeholder="카테고리 (예: 프론트엔드)"
            value={item.category}
            onChange={(e) => updateSkill(item.id, { category: e.target.value })}
            className={INPUT}
          />
          <input
            type="text"
            placeholder="기술 목록 (쉼표로 구분: React, TypeScript, Next.js)"
            value={item.items.join(", ")}
            onChange={(e) =>
              updateSkill(item.id, {
                items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
            className={INPUT}
          />
          <button
            onClick={() => removeSkill(item.id)}
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
        + 기술 카테고리 추가
      </button>
    </div>
  );
}
