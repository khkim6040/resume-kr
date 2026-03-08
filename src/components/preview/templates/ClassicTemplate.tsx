"use client";

import type { FitStyles } from "@/hooks/useAutoFit";
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
import type { RefObject } from "react";

function formatDate(date: string | undefined, isCurrent?: boolean): string {
  if (isCurrent) return "현재";
  if (!date) return "";
  return date.replace(/-/g, ".").slice(0, 7);
}

function DateRange({
  startDate,
  endDate,
  isCurrent,
  fs,
}: {
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  fs: FitStyles;
}) {
  return (
    <span
      className="shrink-0 text-zinc-500"
      style={{ fontSize: fs.fontSize - 2 }}
    >
      {formatDate(startDate)} - {formatDate(endDate, isCurrent)}
    </span>
  );
}

function Placeholder() {
  return <p className="text-sm text-zinc-400">항목을 추가하세요</p>;
}

function WorkExperienceSection({
  items,
  fs,
}: {
  items: WorkExperience[];
  fs: FitStyles;
}) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="flex flex-col" style={{ gap: fs.itemGap }}>
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex items-baseline justify-between gap-2">
            <span style={{ fontSize: fs.fontSize }} className="font-medium">
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
              fs={fs}
            />
          </div>
          {item.description.length > 0 && (
            <ul className="mt-1 space-y-0.5 pl-4">
              {item.description.map((line, i) => (
                <li
                  key={i}
                  className="list-disc text-zinc-700"
                  style={{
                    fontSize: fs.fontSize - 2,
                    lineHeight: fs.lineHeight,
                  }}
                >
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

function EducationSection({
  items,
  fs,
}: {
  items: Education[];
  fs: FitStyles;
}) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="flex flex-col" style={{ gap: fs.itemGap - 4 }}>
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex items-baseline justify-between gap-2">
            <span style={{ fontSize: fs.fontSize }} className="font-medium">
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
              fs={fs}
            />
          </div>
          {item.description && (
            <p
              className="mt-0.5 text-zinc-600"
              style={{
                fontSize: fs.fontSize - 2,
                lineHeight: fs.lineHeight,
              }}
            >
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillsSection({ items, fs }: { items: Skill[]; fs: FitStyles }) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="flex flex-col" style={{ gap: Math.max(fs.itemGap - 10, 4) }}>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex"
          style={{ fontSize: fs.fontSize - 2 }}
        >
          <span className="w-28 shrink-0 font-medium text-zinc-700">
            {item.category}
          </span>
          <span className="text-zinc-600">{item.items.join(", ")}</span>
        </div>
      ))}
    </div>
  );
}

function ProjectsSection({
  items,
  fs,
}: {
  items: Project[];
  fs: FitStyles;
}) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="flex flex-col" style={{ gap: fs.itemGap }}>
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex items-baseline justify-between gap-2">
            <span style={{ fontSize: fs.fontSize }} className="font-medium">
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
              fs={fs}
            />
          </div>
          {item.description.length > 0 && (
            <ul className="mt-1 space-y-0.5 pl-4">
              {item.description.map((line, i) => (
                <li
                  key={i}
                  className="list-disc text-zinc-700"
                  style={{
                    fontSize: fs.fontSize - 2,
                    lineHeight: fs.lineHeight,
                  }}
                >
                  {line}
                </li>
              ))}
            </ul>
          )}
          {item.techStack && item.techStack.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {item.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-600"
                  style={{ fontSize: fs.fontSize - 4 }}
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

function CertificatesSection({
  items,
  fs,
}: {
  items: Certificate[];
  fs: FitStyles;
}) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="flex flex-col" style={{ gap: Math.max(fs.itemGap - 10, 4) }}>
      {items.map((item) => (
        <div key={item.id} className="flex items-baseline justify-between">
          <span style={{ fontSize: fs.fontSize - 2 }}>
            <span className="font-medium">{item.name}</span>
            {item.issuer && (
              <span className="ml-1 text-zinc-600">- {item.issuer}</span>
            )}
          </span>
          <span
            className="text-zinc-500"
            style={{ fontSize: fs.fontSize - 2 }}
          >
            {formatDate(item.date)}
          </span>
        </div>
      ))}
    </div>
  );
}

function LanguagesSection({
  items,
  fs,
}: {
  items: Language[];
  fs: FitStyles;
}) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="flex flex-col" style={{ gap: Math.max(fs.itemGap - 10, 4) }}>
      {items.map((item) => (
        <div key={item.id} style={{ fontSize: fs.fontSize - 2 }}>
          <span className="font-medium">{item.name}</span>
          {item.level && (
            <span className="ml-1 text-zinc-600">- {item.level}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function AwardsSection({ items, fs }: { items: Award[]; fs: FitStyles }) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="flex flex-col" style={{ gap: fs.itemGap - 4 }}>
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex items-baseline justify-between">
            <span style={{ fontSize: fs.fontSize - 2 }}>
              <span className="font-medium">{item.name}</span>
              {item.issuer && (
                <span className="ml-1 text-zinc-600">- {item.issuer}</span>
              )}
            </span>
            <span
              className="text-zinc-500"
              style={{ fontSize: fs.fontSize - 2 }}
            >
              {formatDate(item.date)}
            </span>
          </div>
          {item.description && (
            <p
              className="mt-0.5 text-zinc-600"
              style={{
                fontSize: fs.fontSize - 2,
                lineHeight: fs.lineHeight,
              }}
            >
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function SectionContent({
  type,
  data,
  fs,
}: {
  type: SectionType;
  data: ResumeData;
  fs: FitStyles;
}) {
  switch (type) {
    case "workExperience":
      return <WorkExperienceSection items={data.workExperience} fs={fs} />;
    case "education":
      return <EducationSection items={data.education} fs={fs} />;
    case "skills":
      return <SkillsSection items={data.skills} fs={fs} />;
    case "projects":
      return <ProjectsSection items={data.projects} fs={fs} />;
    case "certificates":
      return <CertificatesSection items={data.certificates} fs={fs} />;
    case "languages":
      return <LanguagesSection items={data.languages} fs={fs} />;
    case "awards":
      return <AwardsSection items={data.awards} fs={fs} />;
    default:
      return null;
  }
}

export interface TemplateProps {
  data: ResumeData;
  fs: FitStyles;
  contentRef: RefObject<HTMLDivElement | null>;
}

export function ClassicTemplate({ data, fs, contentRef }: TemplateProps) {
  const { personalInfo, sections } = data;
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div ref={contentRef} style={{ padding: fs.padding }}>
      {/* Header */}
      <div
        className="border-b-2 border-zinc-800"
        style={{
          marginBottom: fs.headerMarginBottom,
          paddingBottom: fs.headerMarginBottom * 0.6,
        }}
      >
        <h1 className="font-bold" style={{ fontSize: fs.nameSize }}>
          {personalInfo.name || "이름을 입력하세요"}
        </h1>
        <div
          className="mt-2 flex flex-wrap gap-3 text-zinc-600"
          style={{ fontSize: fs.fontSize - 2 }}
        >
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.linkedin && (
            <span>{personalInfo.linkedin}</span>
          )}
          {personalInfo.github && <span>{personalInfo.github}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
        {personalInfo.summary && (
          <p
            className="mt-2 text-zinc-700"
            style={{
              fontSize: fs.fontSize - 2,
              lineHeight: fs.lineHeight,
            }}
          >
            {personalInfo.summary}
          </p>
        )}
      </div>

      {/* Sections */}
      <div className="flex flex-col" style={{ gap: fs.sectionGap }}>
        {visibleSections
          .filter((s) => s.type !== "personalInfo")
          .map((section) => (
            <div key={section.id}>
              <h2
                className="border-b border-zinc-200 font-semibold text-zinc-800"
                style={{
                  fontSize: fs.headingSize,
                  marginBottom: fs.sectionGap * 0.4,
                  paddingBottom: fs.sectionGap * 0.2,
                }}
              >
                {section.title}
              </h2>
              <SectionContent type={section.type} data={data} fs={fs} />
            </div>
          ))}
      </div>
    </div>
  );
}
