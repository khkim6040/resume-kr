"use client";

import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex gap-2 items-start">
        <button
          {...attributes}
          {...listeners}
          className="mt-4 cursor-grab touch-none text-zinc-300 transition-colors hover:text-zinc-500 active:cursor-grabbing shrink-0"
          aria-label="드래그하여 순서 변경"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.2" />
            <circle cx="5" cy="8" r="1.2" />
            <circle cx="5" cy="12" r="1.2" />
            <circle cx="11" cy="4" r="1.2" />
            <circle cx="11" cy="8" r="1.2" />
            <circle cx="11" cy="12" r="1.2" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
