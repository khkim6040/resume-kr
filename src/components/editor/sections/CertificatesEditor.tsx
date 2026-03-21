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
import type { Certificate } from "@/types/resume";
import { SortableItem } from "../SortableItem";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function CertificatesEditor() {
  const { data, addCertificate, updateCertificate, removeCertificate, reorderCertificates, toggleSectionVisibility } = useResumeStore();
  const items = data.certificates;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderCertificates(oldIndex, newIndex);
    }
  }

  function addItem() {
    const section = data.sections.find(s => s.type === "certificates");
    if (section && !section.visible) {
      toggleSectionVisibility(section.id);
    }
    const item: Certificate = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
    };
    addCertificate(item);
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
                  placeholder="자격증명"
                  value={item.name}
                  onChange={(e) => updateCertificate(item.id, { name: e.target.value })}
                  className={INPUT}
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="발급기관"
                    value={item.issuer}
                    onChange={(e) => updateCertificate(item.id, { issuer: e.target.value })}
                    className={`${INPUT} flex-1`}
                  />
                  <input
                    type="month"
                    value={item.date}
                    onChange={(e) => updateCertificate(item.id, { date: e.target.value })}
                    className={`${INPUT} flex-1`}
                  />
                </div>
                <button
                  onClick={() => removeCertificate(item.id)}
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
        + 자격증 추가
      </button>
    </div>
  );
}
