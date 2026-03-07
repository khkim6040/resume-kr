import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Page,
  View,
  Text,
  Font,
  StyleSheet,
  renderToBuffer,
  type DocumentProps,
} from "@react-pdf/renderer";
import React from "react";
import type { ResumeData, Section } from "@/types/resume";
import path from "path";

Font.register({
  family: "Pretendard",
  fonts: [
    {
      src: path.join(process.cwd(), "public/fonts/Pretendard-Regular.ttf"),
      fontWeight: 400,
    },
    {
      src: path.join(process.cwd(), "public/fonts/Pretendard-Medium.ttf"),
      fontWeight: 500,
    },
    {
      src: path.join(process.cwd(), "public/fonts/Pretendard-SemiBold.ttf"),
      fontWeight: 600,
    },
    {
      src: path.join(process.cwd(), "public/fonts/Pretendard-Bold.ttf"),
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Pretendard",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 48,
    paddingRight: 48,
    color: "#1a1a1a",
  },
  // Personal info header
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a1a",
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  contactItem: {
    fontSize: 9,
    color: "#555",
  },
  summary: {
    fontSize: 9,
    color: "#444",
    marginTop: 6,
    lineHeight: 1.5,
  },
  // Section
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  // Item row
  itemBlock: {
    marginBottom: 8,
  },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 600,
  },
  itemSubtitle: {
    fontSize: 9,
    color: "#555",
  },
  itemDate: {
    fontSize: 9,
    color: "#888",
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 2,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 9,
    marginRight: 4,
    color: "#555",
  },
  bulletText: {
    fontSize: 9,
    color: "#444",
    flex: 1,
    lineHeight: 1.4,
  },
  // Skills
  skillRow: {
    flexDirection: "row",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  skillCategory: {
    fontSize: 9,
    fontWeight: 600,
    marginRight: 6,
    minWidth: 70,
  },
  skillItems: {
    fontSize: 9,
    color: "#444",
    flex: 1,
    flexWrap: "wrap",
  },
  // Inline small
  techStack: {
    fontSize: 8,
    color: "#666",
    marginTop: 2,
  },
  // Certificates / Languages / Awards
  inlineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  inlineLeft: {
    fontSize: 9,
    fontWeight: 600,
  },
  inlineRight: {
    fontSize: 9,
    color: "#888",
  },
  inlineSub: {
    fontSize: 9,
    color: "#555",
  },
});

function formatDate(dateStr: string | undefined, isCurrent?: boolean): string {
  if (isCurrent) return "현재";
  if (!dateStr) return "";
  return dateStr;
}

function PersonalInfoSection({ data }: { data: ResumeData }) {
  const { personalInfo } = data;
  const contacts: string[] = [];
  if (personalInfo.email) contacts.push(personalInfo.email);
  if (personalInfo.phone) contacts.push(personalInfo.phone);
  if (personalInfo.address) contacts.push(personalInfo.address);
  if (personalInfo.linkedin) contacts.push(personalInfo.linkedin);
  if (personalInfo.github) contacts.push(personalInfo.github);
  if (personalInfo.website) contacts.push(personalInfo.website);

  return React.createElement(
    View,
    { style: styles.header },
    React.createElement(Text, { style: styles.name }, personalInfo.name || "이름"),
    contacts.length > 0
      ? React.createElement(
          View,
          { style: styles.contactRow },
          ...contacts.map((c, i) =>
            React.createElement(Text, { key: i, style: styles.contactItem }, c)
          )
        )
      : null,
    personalInfo.summary
      ? React.createElement(Text, { style: styles.summary }, personalInfo.summary)
      : null
  );
}

function WorkExperienceSection({ data }: { data: ResumeData }) {
  if (!data.workExperience.length) return null;
  return React.createElement(
    View,
    { style: styles.section },
    React.createElement(Text, { style: styles.sectionTitle }, "경력"),
    ...data.workExperience.map((w) =>
      React.createElement(
        View,
        { key: w.id, style: styles.itemBlock },
        React.createElement(
          View,
          { style: styles.itemHeaderRow },
          React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.itemTitle }, `${w.company} · ${w.position}`),
          ),
          React.createElement(
            Text,
            { style: styles.itemDate },
            `${formatDate(w.startDate)} – ${formatDate(w.endDate, w.isCurrent)}`
          )
        ),
        ...w.description.map((d, i) =>
          React.createElement(
            View,
            { key: i, style: styles.bulletRow },
            React.createElement(Text, { style: styles.bullet }, "•"),
            React.createElement(Text, { style: styles.bulletText }, d)
          )
        )
      )
    )
  );
}

function EducationSection({ data }: { data: ResumeData }) {
  if (!data.education.length) return null;
  return React.createElement(
    View,
    { style: styles.section },
    React.createElement(Text, { style: styles.sectionTitle }, "학력"),
    ...data.education.map((e) =>
      React.createElement(
        View,
        { key: e.id, style: styles.itemBlock },
        React.createElement(
          View,
          { style: styles.itemHeaderRow },
          React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.itemTitle }, e.school),
            React.createElement(
              Text,
              { style: styles.itemSubtitle },
              `${e.degree} · ${e.field}`
            )
          ),
          React.createElement(
            Text,
            { style: styles.itemDate },
            `${formatDate(e.startDate)} – ${formatDate(e.endDate, e.isCurrent)}`
          )
        ),
        e.description
          ? React.createElement(
              View,
              { style: styles.bulletRow },
              React.createElement(Text, { style: styles.bullet }, "•"),
              React.createElement(Text, { style: styles.bulletText }, e.description)
            )
          : null
      )
    )
  );
}

function SkillsSection({ data }: { data: ResumeData }) {
  if (!data.skills.length) return null;
  return React.createElement(
    View,
    { style: styles.section },
    React.createElement(Text, { style: styles.sectionTitle }, "기술"),
    ...data.skills.map((s) =>
      React.createElement(
        View,
        { key: s.id, style: styles.skillRow },
        React.createElement(Text, { style: styles.skillCategory }, s.category),
        React.createElement(Text, { style: styles.skillItems }, s.items.join(", "))
      )
    )
  );
}

function ProjectsSection({ data }: { data: ResumeData }) {
  if (!data.projects.length) return null;
  return React.createElement(
    View,
    { style: styles.section },
    React.createElement(Text, { style: styles.sectionTitle }, "프로젝트"),
    ...data.projects.map((p) =>
      React.createElement(
        View,
        { key: p.id, style: styles.itemBlock },
        React.createElement(
          View,
          { style: styles.itemHeaderRow },
          React.createElement(
            View,
            null,
            React.createElement(
              Text,
              { style: styles.itemTitle },
              p.role ? `${p.name} · ${p.role}` : p.name
            ),
            p.link
              ? React.createElement(Text, { style: styles.itemSubtitle }, p.link)
              : null
          ),
          React.createElement(
            Text,
            { style: styles.itemDate },
            p.endDate
              ? `${formatDate(p.startDate)} – ${formatDate(p.endDate)}`
              : formatDate(p.startDate)
          )
        ),
        ...p.description.map((d, i) =>
          React.createElement(
            View,
            { key: i, style: styles.bulletRow },
            React.createElement(Text, { style: styles.bullet }, "•"),
            React.createElement(Text, { style: styles.bulletText }, d)
          )
        ),
        p.techStack && p.techStack.length > 0
          ? React.createElement(
              Text,
              { style: styles.techStack },
              `기술 스택: ${p.techStack.join(", ")}`
            )
          : null
      )
    )
  );
}

function CertificatesSection({ data }: { data: ResumeData }) {
  if (!data.certificates.length) return null;
  return React.createElement(
    View,
    { style: styles.section },
    React.createElement(Text, { style: styles.sectionTitle }, "자격증"),
    ...data.certificates.map((c) =>
      React.createElement(
        View,
        { key: c.id, style: styles.inlineRow },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.inlineLeft }, c.name),
          React.createElement(Text, { style: styles.inlineSub }, c.issuer)
        ),
        React.createElement(Text, { style: styles.inlineRight }, c.date)
      )
    )
  );
}

function LanguagesSection({ data }: { data: ResumeData }) {
  if (!data.languages.length) return null;
  return React.createElement(
    View,
    { style: styles.section },
    React.createElement(Text, { style: styles.sectionTitle }, "어학"),
    ...data.languages.map((l) =>
      React.createElement(
        View,
        { key: l.id, style: styles.inlineRow },
        React.createElement(Text, { style: styles.inlineLeft }, l.name),
        React.createElement(Text, { style: styles.inlineSub }, l.level)
      )
    )
  );
}

function AwardsSection({ data }: { data: ResumeData }) {
  if (!data.awards.length) return null;
  return React.createElement(
    View,
    { style: styles.section },
    React.createElement(Text, { style: styles.sectionTitle }, "수상"),
    ...data.awards.map((a) =>
      React.createElement(
        View,
        { key: a.id, style: styles.itemBlock },
        React.createElement(
          View,
          { style: styles.inlineRow },
          React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.inlineLeft }, a.name),
            React.createElement(Text, { style: styles.inlineSub }, a.issuer)
          ),
          React.createElement(Text, { style: styles.inlineRight }, a.date)
        ),
        a.description
          ? React.createElement(
              View,
              { style: styles.bulletRow },
              React.createElement(Text, { style: styles.bullet }, "•"),
              React.createElement(Text, { style: styles.bulletText }, a.description)
            )
          : null
      )
    )
  );
}

const SECTION_RENDERERS: Record<
  string,
  (data: ResumeData) => React.ReactElement | null
> = {
  personalInfo: (data) => React.createElement(PersonalInfoSection, { data }),
  workExperience: (data) => React.createElement(WorkExperienceSection, { data }),
  education: (data) => React.createElement(EducationSection, { data }),
  skills: (data) => React.createElement(SkillsSection, { data }),
  projects: (data) => React.createElement(ProjectsSection, { data }),
  certificates: (data) => React.createElement(CertificatesSection, { data }),
  languages: (data) => React.createElement(LanguagesSection, { data }),
  awards: (data) => React.createElement(AwardsSection, { data }),
};

function buildDocument(data: ResumeData): React.ReactElement {
  const orderedSections: Section[] = [...data.sections]
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.visible);

  const children: React.ReactElement[] = [];
  for (const section of orderedSections) {
    const renderer = SECTION_RENDERERS[section.type];
    if (renderer) {
      const el = renderer(data);
      if (el) children.push(el);
    }
  }

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      ...children
    )
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let data: ResumeData;
  try {
    data = (await req.json()) as ResumeData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const doc = buildDocument(data) as React.ReactElement<DocumentProps>;
  const buffer = await renderToBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="resume.pdf"',
    },
  });
}
