"use client";

import { useResumeStore } from "@/store/resume";
import type { Project } from "@/types/resume";
import TagInput from "../TagInput";
import { SortableList } from "../SortableList";
import MonthInput from "../MonthInput";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function ProjectsEditor() {
  const { data, addProject, updateProject, removeProject, reorderProjects, toggleSectionVisibility } = useResumeStore();
  const items = data.projects;

  function addItem() {
    const section = data.sections.find(s => s.type === "projects");
    if (section && !section.visible) {
      toggleSectionVisibility(section.id);
    }
    const item: Project = {
      id: crypto.randomUUID(),
      name: "",
      startDate: "",
      description: [],
    };
    addProject(item);
  }

  return (
    <div className="flex flex-col gap-4">
      <SortableList items={items} onReorder={reorderProjects}>
        {(item) => (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
            <div className="flex flex-wrap gap-2 min-w-0">
              <input
                type="text"
                placeholder="프로젝트명"
                value={item.name}
                onChange={(e) => updateProject(item.id, { name: e.target.value })}
                className={`${INPUT} flex-1`}
              />
              <input
                type="text"
                placeholder="역할 (선택)"
                value={item.role ?? ""}
                onChange={(e) => updateProject(item.id, { role: e.target.value })}
                className={`${INPUT} flex-1`}
              />
            </div>
            <div className="flex flex-wrap gap-2 min-w-0">
              <MonthInput
                value={item.startDate}
                onChange={(v) => updateProject(item.id, { startDate: v })}
                placeholder="시작일 (2000.01)"
                className="flex-1"
              />
              <MonthInput
                value={item.endDate ?? ""}
                min={item.startDate || undefined}
                onChange={(v) => updateProject(item.id, { endDate: v })}
                placeholder="종료일 (2000.01)"
                className="flex-1"
              />
            </div>
            <textarea
              placeholder="프로젝트 설명 (줄바꿈으로 항목 구분)"
              value={item.description.join("\n")}
              onChange={(e) => updateProject(item.id, { description: e.target.value.split("\n") })}
              rows={3}
              className={INPUT}
            />
            <TagInput
              tags={item.techStack ?? []}
              onChange={(techStack) => updateProject(item.id, { techStack })}
              placeholder="기술 스택 입력 후 Enter (예: React)"
            />
            <input
              type="url"
              placeholder="링크 (선택)"
              value={item.link ?? ""}
              onChange={(e) => updateProject(item.id, { link: e.target.value })}
              className={INPUT}
            />
            <button
              onClick={() => removeProject(item.id)}
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
        + 프로젝트 추가
      </button>
    </div>
  );
}
