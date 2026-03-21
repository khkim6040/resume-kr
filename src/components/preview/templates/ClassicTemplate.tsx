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
import { formatDate } from "./utils";
import { sanitizeUrl } from "@/lib/sanitizeUrl";

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
          {(() => {
            const lines = item.description.filter(line => line.trim());
            return lines.length > 0 ? (
              <ul className="mt-1 space-y-0.5 pl-4">
                {lines.map((line, i) => (
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
            ) : null;
          })()}
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
          {item.minors && item.minors.length > 0 && item.minors.map((minor, idx) => (
            <div key={idx} className="text-zinc-600" style={{ fontSize: fs.fontSize - 2 }}>
              {[minor.degree, minor.field].filter(Boolean).join(" ")}
            </div>
          ))}
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
          {(() => {
            const lines = item.description.filter(line => line.trim());
            return lines.length > 0 ? (
              <ul className="mt-1 space-y-0.5 pl-4">
                {lines.map((line, i) => (
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
            ) : null;
          })()}
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

  const safeLinkedin = personalInfo.linkedin ? sanitizeUrl(personalInfo.linkedin) : undefined;
  const safeGithub = personalInfo.github ? sanitizeUrl(personalInfo.github) : undefined;
  const safeWebsite = personalInfo.website ? sanitizeUrl(personalInfo.website) : undefined;

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
          {safeLinkedin && (
            <a href={safeLinkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn" className="inline-flex items-center text-zinc-600 hover:text-zinc-800">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
            </a>
          )}
          {safeGithub && (
            <a href={safeGithub} target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub" className="inline-flex items-center text-zinc-600 hover:text-zinc-800">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          )}
          {safeWebsite && (
            <a href={safeWebsite} target="_blank" rel="noopener noreferrer" title="웹사이트" aria-label="웹사이트" className="inline-flex items-center text-zinc-600 hover:text-zinc-800">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </a>
          )}
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
