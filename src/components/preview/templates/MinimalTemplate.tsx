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
      className="shrink-0 text-neutral-400"
      style={{ fontSize: fs.fontSize - 2 }}
    >
      {formatDate(startDate)} - {formatDate(endDate, isCurrent)}
    </span>
  );
}

function Placeholder() {
  return <p className="text-sm text-neutral-300">항목을 추가하세요</p>;
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
            <span style={{ fontSize: fs.fontSize }} className="font-medium text-neutral-800">
              {item.company}
              {item.position && (
                <span className="font-normal text-neutral-500"> / {item.position}</span>
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
                  className="list-disc text-neutral-600"
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
            <span style={{ fontSize: fs.fontSize }} className="font-medium text-neutral-800">
              {item.school}
              {(item.degree || item.field) && (
                <span className="font-normal text-neutral-500">
                  {" / "}{[item.degree, item.field].filter(Boolean).join(" ")}
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
              className="mt-0.5 text-neutral-500"
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
          <span className="w-28 shrink-0 text-neutral-400">{item.category}</span>
          <span className="text-neutral-700">{item.items.join(" / ")}</span>
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
            <span style={{ fontSize: fs.fontSize }} className="font-medium text-neutral-800">
              {item.name}
              {item.role && (
                <span className="font-normal text-neutral-500"> / {item.role}</span>
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
                  className="list-disc text-neutral-600"
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
            <p
              className="mt-1 text-neutral-400"
              style={{ fontSize: fs.fontSize - 3 }}
            >
              {item.techStack.join(" / ")}
            </p>
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
            <span className="text-neutral-700">{item.name}</span>
            {item.issuer && (
              <span className="text-neutral-400"> / {item.issuer}</span>
            )}
          </span>
          <span className="text-neutral-400" style={{ fontSize: fs.fontSize - 2 }}>
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
          <span className="text-neutral-700">{item.name}</span>
          {item.level && (
            <span className="text-neutral-400"> / {item.level}</span>
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
              <span className="text-neutral-700">{item.name}</span>
              {item.issuer && (
                <span className="text-neutral-400"> / {item.issuer}</span>
              )}
            </span>
            <span className="text-neutral-400" style={{ fontSize: fs.fontSize - 2 }}>
              {formatDate(item.date)}
            </span>
          </div>
          {item.description && (
            <p
              className="mt-0.5 text-neutral-500"
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

export function MinimalTemplate({ data, fs, contentRef }: TemplateProps) {
  const { personalInfo, sections } = data;
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div ref={contentRef} style={{ padding: fs.padding + 4 }}>
      {/* Header - ultra clean */}
      <div
        style={{
          marginBottom: fs.headerMarginBottom,
          paddingBottom: fs.headerMarginBottom * 0.4,
        }}
      >
        <h1 className="font-light tracking-wide text-neutral-900" style={{ fontSize: fs.nameSize + 2 }}>
          {personalInfo.name || "이름을 입력하세요"}
        </h1>
        <div
          className="mt-2 flex flex-wrap text-neutral-400"
          style={{ fontSize: fs.fontSize - 2, gap: "4px 12px" }}
        >
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span className="text-neutral-300">|</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.address && (
            <>
              <span className="text-neutral-300">|</span>
              <span>{personalInfo.address}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span className="text-neutral-300">|</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
          {personalInfo.github && (
            <>
              <span className="text-neutral-300">|</span>
              <span>{personalInfo.github}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span className="text-neutral-300">|</span>
              <span>{personalInfo.website}</span>
            </>
          )}
        </div>
        {personalInfo.summary && (
          <p
            className="mt-3 text-neutral-500"
            style={{
              fontSize: fs.fontSize - 2,
              lineHeight: fs.lineHeight,
            }}
          >
            {personalInfo.summary}
          </p>
        )}
        <div className="mt-3 h-px bg-neutral-200" />
      </div>

      {/* Sections */}
      <div className="flex flex-col" style={{ gap: fs.sectionGap + 2 }}>
        {visibleSections
          .filter((s) => s.type !== "personalInfo")
          .map((section) => (
            <div key={section.id}>
              <h2
                className="font-normal uppercase tracking-widest text-neutral-400"
                style={{
                  fontSize: fs.headingSize - 3,
                  marginBottom: fs.sectionGap * 0.5,
                  letterSpacing: "0.15em",
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
