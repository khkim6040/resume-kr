"use client";

import { useResumeStore } from "@/store/resume";
import type {
  WorkExperience,
  Education,
  Skill,
  Project,
  Certificate,
  Language,
  Award,
  SectionType,
  ResumeData,
} from "@/types/resume";

const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const SCALE = 2.8;

function formatDate(date: string | undefined, isCurrent?: boolean): string {
  if (isCurrent) return "현재";
  if (!date) return "";
  return date.replace(/-/g, ".").slice(0, 7);
}

function DateRange({
  startDate,
  endDate,
  isCurrent,
}: {
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}) {
  return (
    <span className="text-sm text-zinc-500">
      {formatDate(startDate)} - {formatDate(endDate, isCurrent)}
    </span>
  );
}

function Placeholder() {
  return <p className="text-sm text-zinc-400">항목을 추가하세요</p>;
}

function WorkExperienceSection({ items }: { items: WorkExperience[] }) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex items-baseline justify-between">
            <span className="font-medium">
              {item.company}
              {item.position && (
                <span className="ml-1 font-normal text-zinc-600">
                  | {item.position}
                </span>
              )}
            </span>
            <DateRange
              startDate={item.startDate}
              endDate={item.endDate}
              isCurrent={item.isCurrent}
            />
          </div>
          {item.description.length > 0 && (
            <ul className="mt-1 space-y-0.5 pl-4">
              {item.description.map((line, i) => (
                <li key={i} className="list-disc text-sm text-zinc-700">
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationSection({ items }: { items: Education[] }) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex items-baseline justify-between">
            <span className="font-medium">
              {item.school}
              {(item.degree || item.field) && (
                <span className="ml-1 font-normal text-zinc-600">
                  | {[item.degree, item.field].filter(Boolean).join(" ")}
                </span>
              )}
            </span>
            <DateRange
              startDate={item.startDate}
              endDate={item.endDate}
              isCurrent={item.isCurrent}
            />
          </div>
          {item.description && (
            <p className="mt-0.5 text-sm text-zinc-600">{item.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillsSection({ items }: { items: Skill[] }) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.id} className="flex text-sm">
          <span className="w-28 shrink-0 font-medium text-zinc-700">
            {item.category}
          </span>
          <span className="text-zinc-600">{item.items.join(", ")}</span>
        </div>
      ))}
    </div>
  );
}

function ProjectsSection({ items }: { items: Project[] }) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex items-baseline justify-between">
            <span className="font-medium">
              {item.name}
              {item.role && (
                <span className="ml-1 font-normal text-zinc-600">
                  ({item.role})
                </span>
              )}
            </span>
            <DateRange
              startDate={item.startDate}
              endDate={item.endDate}
              isCurrent={false}
            />
          </div>
          {item.description.length > 0 && (
            <ul className="mt-1 space-y-0.5 pl-4">
              {item.description.map((line, i) => (
                <li key={i} className="list-disc text-sm text-zinc-700">
                  {line}
                </li>
              ))}
            </ul>
          )}
          {item.techStack && item.techStack.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {item.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CertificatesSection({ items }: { items: Certificate[] }) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.id} className="flex items-baseline justify-between">
          <span className="text-sm">
            <span className="font-medium">{item.name}</span>
            {item.issuer && (
              <span className="ml-1 text-zinc-600">- {item.issuer}</span>
            )}
          </span>
          <span className="text-sm text-zinc-500">
            {formatDate(item.date)}
          </span>
        </div>
      ))}
    </div>
  );
}

function LanguagesSection({ items }: { items: Language[] }) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.id} className="text-sm">
          <span className="font-medium">{item.name}</span>
          {item.level && (
            <span className="ml-1 text-zinc-600">- {item.level}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function AwardsSection({ items }: { items: Award[] }) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex items-baseline justify-between">
            <span className="text-sm">
              <span className="font-medium">{item.name}</span>
              {item.issuer && (
                <span className="ml-1 text-zinc-600">- {item.issuer}</span>
              )}
            </span>
            <span className="text-sm text-zinc-500">
              {formatDate(item.date)}
            </span>
          </div>
          {item.description && (
            <p className="mt-0.5 text-sm text-zinc-600">{item.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function SectionContent({
  type,
  data,
}: {
  type: SectionType;
  data: ResumeData;
}) {
  switch (type) {
    case "workExperience":
      return <WorkExperienceSection items={data.workExperience} />;
    case "education":
      return <EducationSection items={data.education} />;
    case "skills":
      return <SkillsSection items={data.skills} />;
    case "projects":
      return <ProjectsSection items={data.projects} />;
    case "certificates":
      return <CertificatesSection items={data.certificates} />;
    case "languages":
      return <LanguagesSection items={data.languages} />;
    case "awards":
      return <AwardsSection items={data.awards} />;
    default:
      return null;
  }
}

export default function Preview() {
  const { data } = useResumeStore();
  const { personalInfo, sections } = data;

  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-full items-start justify-center overflow-y-auto bg-zinc-100 p-8">
      <div
        className="bg-white shadow-lg"
        style={{
          width: A4_WIDTH * SCALE,
          minHeight: A4_HEIGHT * SCALE,
          padding: 40,
          fontFamily: "Pretendard, sans-serif",
          wordBreak: "keep-all",
        }}
      >
        {/* Header */}
        <div className="mb-6 border-b border-zinc-200 pb-4">
          <h1 className="text-2xl font-bold">
            {personalInfo.name || "이름을 입력하세요"}
          </h1>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
          </div>
          {personalInfo.summary && (
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              {personalInfo.summary}
            </p>
          )}
        </div>

        {/* Sections */}
        {visibleSections
          .filter((s) => s.type !== "personalInfo")
          .map((section) => (
            <div key={section.id} className="mb-5">
              <h2 className="mb-2 border-b border-zinc-100 pb-1 text-base font-semibold">
                {section.title}
              </h2>
              <SectionContent type={section.type} data={data} />
            </div>
          ))}
      </div>
    </div>
  );
}
