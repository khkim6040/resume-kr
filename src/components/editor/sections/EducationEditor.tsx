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
import type { Education } from "@/types/resume";
import { SortableItem } from "../SortableItem";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function EducationEditor() {
  const { data, addEducation, updateEducation, removeEducation, reorderEducation, toggleSectionVisibility } = useResumeStore();
  const items = data.education;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderEducation(oldIndex, newIndex);
    }
  }

  function addItem() {
    const section = data.sections.find(s => s.type === "education");
    if (section && !section.visible) {
      toggleSectionVisibility(section.id);
    }
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
                <div className="flex gap-2 min-w-0">
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
                {/* 복수/부전공 */}
                {(item.minors ?? []).map((minor, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="학위 (예: 학사)"
                      value={minor.degree}
                      onChange={(e) => {
                        const minors = [...(item.minors ?? [])];
                        minors[idx] = { ...minors[idx], degree: e.target.value };
                        updateEducation(item.id, { minors });
                      }}
                      className={`${INPUT} flex-1`}
                    />
                    <input
                      type="text"
                      placeholder="전공"
                      value={minor.field}
                      onChange={(e) => {
                        const minors = [...(item.minors ?? [])];
                        minors[idx] = { ...minors[idx], field: e.target.value };
                        updateEducation(item.id, { minors });
                      }}
                      className={`${INPUT} flex-1`}
                    />
                    <button
                      onClick={() => {
                        const minors = (item.minors ?? []).filter((_, i) => i !== idx);
                        updateEducation(item.id, { minors });
                      }}
                      className="shrink-0 text-xs text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const minors = [...(item.minors ?? []), { degree: "", field: "" }];
                    updateEducation(item.id, { minors });
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-700"
                >
                  + 복수/부전공 추가
                </button>
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="month"
                    value={item.startDate}
                    onChange={(e) => updateEducation(item.id, { startDate: e.target.value })}
                    className={`${INPUT} flex-1`}
                  />
                  <input
                    type="month"
                    value={item.endDate ?? ""}
                    min={item.startDate || undefined}
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
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <button
        onClick={addItem}
        className="rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
      >
        + 학력 추가
      </button>
    </div>
  );
}
