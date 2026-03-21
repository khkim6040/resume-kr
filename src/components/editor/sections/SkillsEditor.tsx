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
import type { Skill } from "@/types/resume";
import TagInput from "../TagInput";
import { SortableItem } from "../SortableItem";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function SkillsEditor() {
  const { data, addSkill, updateSkill, removeSkill, reorderSkills, toggleSectionVisibility } = useResumeStore();
  const items = data.skills;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSkills(oldIndex, newIndex);
    }
  }

  function addItem() {
    const section = data.sections.find(s => s.type === "skills");
    if (section && !section.visible) {
      toggleSectionVisibility(section.id);
    }
    const item: Skill = {
      id: crypto.randomUUID(),
      category: "",
      items: [],
    };
    addSkill(item);
  }

  return (
    <div className="flex flex-col gap-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
                <input
                  type="text"
                  placeholder="카테고리 (예: 프론트엔드)"
                  value={item.category}
                  onChange={(e) => updateSkill(item.id, { category: e.target.value })}
                  className={INPUT}
                />
                <TagInput
                  tags={item.items}
                  onChange={(items) => updateSkill(item.id, { items })}
                  placeholder="기술 입력 후 Enter (예: React)"
                />
                <button
                  onClick={() => removeSkill(item.id)}
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
        + 기술 카테고리 추가
      </button>
    </div>
  );
}
