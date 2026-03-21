"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useResumeStore } from "@/store/resume";
import type { Project } from "@/types/resume";
import TagInput from "../TagInput";
import { SortableItem } from "../SortableItem";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function ProjectsEditor() {
  const { data, addProject, updateProject, removeProject, reorderProjects, toggleSectionVisibility } = useResumeStore();
  const items = data.projects;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderProjects(oldIndex, newIndex);
    }
  }

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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
                <div className="flex gap-2 min-w-0">
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
                <div className="flex gap-2 min-w-0">
                  <input
                    type="month"
                    value={item.startDate}
                    onChange={(e) => updateProject(item.id, { startDate: e.target.value })}
                    className={`${INPUT} flex-1`}
                  />
                  <input
                    type="month"
                    value={item.endDate ?? ""}
                    min={item.startDate || undefined}
                    onChange={(e) => updateProject(item.id, { endDate: e.target.value })}
                    className={`${INPUT} flex-1`}
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
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <button
        onClick={addItem}
        className="rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
      >
        + 프로젝트 추가
      </button>
    </div>
  );
}
