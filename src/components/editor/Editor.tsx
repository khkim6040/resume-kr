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
import DownloadButton from "./DownloadButton";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

function PersonalInfoEditor() {
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = data;
  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="이름"
        value={personalInfo.name}
        onChange={(e) => updatePersonalInfo({ name: e.target.value })}
        className={INPUT}
      />
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
      <input
        type="text"
        placeholder="주소 (선택)"
        value={personalInfo.address ?? ""}
        onChange={(e) => updatePersonalInfo({ address: e.target.value })}
        className={INPUT}
      />
      <input
        type="url"
        placeholder="LinkedIn URL (선택)"
        value={personalInfo.linkedin ?? ""}
        onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
        className={INPUT}
      />
      <input
        type="url"
        placeholder="GitHub URL (선택)"
        value={personalInfo.github ?? ""}
        onChange={(e) => updatePersonalInfo({ github: e.target.value })}
        className={INPUT}
      />
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

function sectionContent(type: Section["type"]) {
  switch (type) {
    case "personalInfo": return <PersonalInfoEditor />;
    case "workExperience": return <WorkExperienceEditor />;
    case "education": return <EducationEditor />;
    case "skills": return <SkillsEditor />;
    case "projects": return <ProjectsEditor />;
    case "certificates": return <CertificatesEditor />;
    case "languages": return <LanguagesEditor />;
    case "awards": return <AwardsEditor />;
  }
}

function SortableSection({ section }: { section: Section }) {
  const { toggleSectionVisibility } = useResumeStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-zinc-400 hover:text-zinc-600 active:cursor-grabbing"
          aria-label="드래그하여 순서 변경"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.2" />
            <circle cx="5" cy="8" r="1.2" />
            <circle cx="5" cy="12" r="1.2" />
            <circle cx="11" cy="4" r="1.2" />
            <circle cx="11" cy="8" r="1.2" />
            <circle cx="11" cy="12" r="1.2" />
          </svg>
        </button>
        <h2 className="flex-1 text-sm font-semibold text-zinc-700">{section.title}</h2>
        <button
          onClick={() => toggleSectionVisibility(section.id)}
          className="text-xs text-zinc-400 hover:text-zinc-600"
          aria-label={section.visible ? "섹션 숨기기" : "섹션 표시"}
        >
          {section.visible ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </button>
      </div>
      {section.visible && sectionContent(section.type)}
    </div>
  );
}

export default function Editor() {
  const { data, reorderSections } = useResumeStore();
  const sorted = [...data.sections].sort((a, b) => a.order - b.order);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">이력서 편집</h1>
        <DownloadButton />
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sorted.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-6">
            {sorted.map((section) => (
              <SortableSection key={section.id} section={section} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
