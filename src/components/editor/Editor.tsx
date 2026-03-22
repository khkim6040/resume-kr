"use client";

import { useState, useEffect } from "react";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useResumeStore } from "@/store/resume";
import type { Section } from "@/types/resume";
import WorkExperienceEditor from "./sections/WorkExperienceEditor";
import EducationEditor from "./sections/EducationEditor";
import SkillsEditor from "./sections/SkillsEditor";
import ProjectsEditor from "./sections/ProjectsEditor";
import CertificatesEditor from "./sections/CertificatesEditor";
import LanguagesEditor from "./sections/LanguagesEditor";
import AwardsEditor from "./sections/AwardsEditor";
import CustomSectionEditor from "./sections/CustomSectionEditor";
import CreateSectionModal from "./CreateSectionModal";
import DownloadButton from "./DownloadButton";

// 각 섹션이 줄바꿈 없이 표시되기 위한 최소 사이드바 너비
const SECTION_MIN_WIDTHS: Partial<Record<string, number>> = {
  personalInfo: 420,
  workExperience: 520,
  education: 460,
  projects: 480,
  certificates: 400,
  awards: 400,
  languages: 380,
  skills: 380,
};

const INPUT =
  "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm transition-colors focus:border-zinc-400 focus:bg-white focus:outline-none";

const SECTION_ICONS: Record<string, string> = {
  personalInfo: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z",
  workExperience: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
  education: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c0 0 3 3 6 3s6-3 6-3v-5",
  skills: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  projects: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  certificates: "M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zM9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7 15h4M15 9h3M15 13h3",
  languages: "M5 8l6 6 M4 14l6-6 2 2 M2 5h12 M7 2h1 M22 22l-5-10-5 10 M14 18h6",
  awards: "M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 8 7 8 M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 8 17 8 M12 2v7 M8 9h8l-1 8H9z M7 17l-2 5h14l-2-5",
  custom: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
};

function SectionIcon({ type }: { type: string }) {
  const d = SECTION_ICONS[type];
  if (!d) return null;
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-zinc-500"
    >
      <path d={d} />
    </svg>
  );
}

function PersonalInfoEditor() {
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = data;
  return (
    <div className="flex flex-col gap-2.5">
      <input
        type="text"
        placeholder="이름"
        value={personalInfo.name}
        onChange={(e) => updatePersonalInfo({ name: e.target.value })}
        className={INPUT}
      />
      <div className="grid grid-cols-2 gap-2.5 min-w-0">
        <input
          type="email"
          placeholder="이메일"
          value={personalInfo.email}
          onChange={(e) => updatePersonalInfo({ email: e.target.value })}
          className={INPUT}
        />
        <input
          type="tel"
          placeholder="전화번호"
          value={personalInfo.phone}
          onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
          className={INPUT}
        />
      </div>
      <input
        type="text"
        placeholder="주소 (선택)"
        value={personalInfo.address ?? ""}
        onChange={(e) => updatePersonalInfo({ address: e.target.value })}
        className={INPUT}
      />
      <div className="grid grid-cols-2 gap-2.5 min-w-0">
        <input
          type="url"
          placeholder="LinkedIn (선택)"
          value={personalInfo.linkedin ?? ""}
          onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
          className={INPUT}
        />
        <input
          type="url"
          placeholder="GitHub (선택)"
          value={personalInfo.github ?? ""}
          onChange={(e) => updatePersonalInfo({ github: e.target.value })}
          className={INPUT}
        />
      </div>
      <input
        type="url"
        placeholder="웹사이트 URL (선택)"
        value={personalInfo.website ?? ""}
        onChange={(e) => updatePersonalInfo({ website: e.target.value })}
        className={INPUT}
      />
      <textarea
        placeholder="자기소개 (선택)"
        value={personalInfo.summary ?? ""}
        onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
        rows={3}
        className={INPUT}
      />
    </div>
  );
}

function sectionContent(section: Section) {
  switch (section.type) {
    case "personalInfo":
      return <PersonalInfoEditor />;
    case "workExperience":
      return <WorkExperienceEditor />;
    case "education":
      return <EducationEditor />;
    case "skills":
      return <SkillsEditor />;
    case "projects":
      return <ProjectsEditor />;
    case "certificates":
      return <CertificatesEditor />;
    case "languages":
      return <LanguagesEditor />;
    case "awards":
      return <AwardsEditor />;
    case "custom":
      return <CustomSectionEditor section={section} />;
  }
}

function SortableSection({
  section,
  isExpanded,
  onToggleExpand,
}: {
  section: Section;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const { toggleSectionVisibility, removeCustomSection } = useResumeStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border bg-white transition-shadow ${
        isDragging
          ? "border-zinc-300 shadow-lg"
          : "border-zinc-200 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Section header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-zinc-300 transition-colors hover:text-zinc-500 active:cursor-grabbing"
          aria-label="드래그하여 순서 변경"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.2" />
            <circle cx="5" cy="8" r="1.2" />
            <circle cx="5" cy="12" r="1.2" />
            <circle cx="11" cy="4" r="1.2" />
            <circle cx="11" cy="8" r="1.2" />
            <circle cx="11" cy="12" r="1.2" />
          </svg>
        </button>

        <button
          onClick={onToggleExpand}
          className="flex flex-1 items-center gap-2"
        >
          <SectionIcon type={section.type} />
          <span className="flex-1 text-left text-sm font-medium text-zinc-700">
            {section.title}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-zinc-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <button
          onClick={() => toggleSectionVisibility(section.id)}
          className={`rounded-md p-1 transition-colors ${
            section.visible
              ? "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              : "text-zinc-300 hover:bg-zinc-100 hover:text-zinc-500"
          }`}
          aria-label={section.visible ? "섹션 숨기기" : "섹션 표시"}
        >
          {section.visible ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </button>

        {section.type === "custom" && (
          <button
            onClick={() => removeCustomSection(section.id)}
            className="rounded-md p-1 text-zinc-300 transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label="섹션 삭제"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>

      {/* Section content - accordion */}
      {isExpanded && (
        <div className="border-t border-zinc-100 px-3 pb-3 pt-3">
          {sectionContent(section)}
        </div>
      )}
    </div>
  );
}

export default function Editor({ onWidthRequest }: { onWidthRequest?: (w: number) => void }) {
  const { data, reorderSections } = useResumeStore();
  const sorted = [...data.sections].sort((a, b) => a.order - b.order);

  // Prevent hydration mismatch from @dnd-kit aria-describedby IDs
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Accordion state: first section expanded by default
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([sorted[0]?.id]),
  );

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // 섹션이 펼쳐질 때 해당 섹션의 최소 너비로 사이드바 확장 요청
        const section = sorted.find((s) => s.id === id);
        if (section && onWidthRequest) {
          const needed = SECTION_MIN_WIDTHS[section.type] ?? 380;
          onWidthRequest(needed);
        }
      }
      return next;
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = sorted.findIndex((s) => s.id === active.id);
    const toIndex = sorted.findIndex((s) => s.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      reorderSections(fromIndex, toIndex);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-800">이력서 편집</h1>
          <p className="mt-0.5 text-xs text-zinc-400">
            섹션을 드래그하여 순서를 변경할 수 있습니다
          </p>
        </div>
        <DownloadButton />
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">
        {(() => {
          const sectionList = (
            <div className="flex flex-col gap-3">
              {sorted.map((section) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  isExpanded={expandedIds.has(section.id)}
                  onToggleExpand={() => toggleExpand(section.id)}
                />
              ))}
            </div>
          );
          return isMounted ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sorted.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {sectionList}
              </SortableContext>
            </DndContext>
          ) : sectionList;
        })()}
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-3 w-full rounded-xl border-2 border-dashed border-zinc-200 px-3 py-3 text-sm text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-600"
        >
          + 새 섹션 만들기
        </button>
      </div>
      {showCreateModal && (
        <CreateSectionModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
