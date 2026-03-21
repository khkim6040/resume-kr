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
import type { WorkExperience } from "@/types/resume";
import { SortableItem } from "../SortableItem";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function WorkExperienceEditor() {
  const { data, addWorkExperience, updateWorkExperience, removeWorkExperience, reorderWorkExperience, toggleSectionVisibility } = useResumeStore();
  const items = data.workExperience;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderWorkExperience(oldIndex, newIndex);
    }
  }

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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
                <div className="flex gap-2 min-w-0">
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
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="month"
                    value={item.startDate}
                    onChange={(e) => updateWorkExperience(item.id, { startDate: e.target.value })}
                    className={`${INPUT} flex-1`}
                  />
                  <input
                    type="month"
                    value={item.endDate ?? ""}
                    min={item.startDate || undefined}
                    onChange={(e) => updateWorkExperience(item.id, { endDate: e.target.value })}
                    disabled={item.isCurrent}
                    className={`${INPUT} flex-1 disabled:bg-zinc-100 disabled:text-zinc-400`}
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
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <button
        onClick={addItem}
        className="rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
      >
        + 경력 추가
      </button>
    </div>
  );
}
