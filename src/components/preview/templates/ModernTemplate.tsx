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
import type { TemplateProps } from "./ClassicTemplate";
import { formatDate } from "./utils";

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
      className="shrink-0 text-slate-400"
      style={{ fontSize: fs.fontSize - 2 }}
    >
      {formatDate(startDate)} - {formatDate(endDate, isCurrent)}
    </span>
  );
}

function Placeholder() {
  return <p className="text-sm text-slate-300">항목을 추가하세요</p>;
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
            <span style={{ fontSize: fs.fontSize }} className="font-semibold text-slate-800">
              {item.company}
            </span>
            <DateRange
              startDate={item.startDate}
              endDate={item.endDate}
              isCurrent={item.isCurrent}
              fs={fs}
            />
          </div>
          {item.position && (
            <p className="text-blue-600" style={{ fontSize: fs.fontSize - 1 }}>
              {item.position}
            </p>
          )}
          {item.description.length > 0 && (
            <ul className="mt-1 space-y-0.5 pl-4">
              {item.description.map((line, i) => (
                <li
                  key={i}
                  className="list-disc text-slate-600"
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
            <span style={{ fontSize: fs.fontSize }} className="font-semibold text-slate-800">
              {item.school}
            </span>
            <DateRange
              startDate={item.startDate}
              endDate={item.endDate}
              isCurrent={item.isCurrent}
              fs={fs}
            />
          </div>
          {(item.degree || item.field) && (
            <p className="text-blue-600" style={{ fontSize: fs.fontSize - 1 }}>
              {[item.degree, item.field].filter(Boolean).join(" ")}
            </p>
          )}
          {item.description && (
            <p
              className="mt-0.5 text-slate-500"
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
    <div className="flex flex-col" style={{ gap: Math.max(fs.itemGap - 8, 4) }}>
      {items.map((item) => (
        <div key={item.id} style={{ fontSize: fs.fontSize - 2 }}>
          <span className="font-semibold text-slate-700">{item.category}</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {item.items.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700"
                style={{ fontSize: fs.fontSize - 3 }}
              >
                {skill}
              </span>
            ))}
          </div>
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
            <span style={{ fontSize: fs.fontSize }} className="font-semibold text-slate-800">
              {item.name}
            </span>
            <DateRange
              startDate={item.startDate}
              endDate={item.endDate}
              isCurrent={false}
              fs={fs}
            />
          </div>
          {item.role && (
            <p className="text-blue-600" style={{ fontSize: fs.fontSize - 1 }}>
              {item.role}
            </p>
          )}
          {item.description.length > 0 && (
            <ul className="mt-1 space-y-0.5 pl-4">
              {item.description.map((line, i) => (
                <li
                  key={i}
                  className="list-disc text-slate-600"
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
                  className="rounded-full bg-slate-100 px-1.5 py-0.5 text-slate-500"
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
            <span className="font-medium text-slate-700">{item.name}</span>
            {item.issuer && (
              <span className="ml-1 text-slate-400">- {item.issuer}</span>
            )}
          </span>
          <span className="text-slate-400" style={{ fontSize: fs.fontSize - 2 }}>
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
          <span className="font-medium text-slate-700">{item.name}</span>
          {item.level && (
            <span className="ml-1 text-slate-400">- {item.level}</span>
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
              <span className="font-medium text-slate-700">{item.name}</span>
              {item.issuer && (
                <span className="ml-1 text-slate-400">- {item.issuer}</span>
              )}
            </span>
            <span className="text-slate-400" style={{ fontSize: fs.fontSize - 2 }}>
              {formatDate(item.date)}
            </span>
          </div>
          {item.description && (
            <p
              className="mt-0.5 text-slate-500"
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

export function ModernTemplate({ data, fs, contentRef }: TemplateProps) {
  const { personalInfo, sections } = data;
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div ref={contentRef} style={{ padding: fs.padding }}>
      {/* Header with accent bar */}
      <div
        style={{
          marginBottom: fs.headerMarginBottom,
          paddingBottom: fs.headerMarginBottom * 0.6,
        }}
      >
        <div className="mb-3 h-1 w-16 rounded-full bg-blue-600" />
        <h1 className="font-bold text-slate-900" style={{ fontSize: fs.nameSize }}>
          {personalInfo.name || "이름을 입력하세요"}
        </h1>
        <div
          className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-slate-500"
          style={{ fontSize: fs.fontSize - 2 }}
        >
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <span className="text-blue-500">@</span> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
        {personalInfo.summary && (
          <p
            className="mt-3 border-l-2 border-blue-200 pl-3 text-slate-600"
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
                className="flex items-center gap-2 font-bold uppercase tracking-wider text-blue-600"
                style={{
                  fontSize: fs.headingSize - 2,
                  marginBottom: fs.sectionGap * 0.5,
                }}
              >
                <span className="h-px flex-1 bg-blue-100" />
                <span>{section.title}</span>
                <span className="h-px flex-1 bg-blue-100" />
              </h2>
              <SectionContent type={section.type} data={data} fs={fs} />
            </div>
          ))}
      </div>
    </div>
  );
}
