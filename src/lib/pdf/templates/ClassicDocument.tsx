import { View, Text, Link, StyleSheet, Svg, Path, Circle, Line, G } from "@react-pdf/renderer";
import type {
  ResumeData,
  SectionType,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certificate,
  Language,
  Award,
} from "@/types/resume";
import { COLORS, SIZES } from "../tokens";
import { formatDate } from "../utils";
import { sanitizeUrl } from "../../sanitizeUrl";

const c = COLORS.classic;
const s = SIZES;

const ICON_SIZE = 10;

function LinkedInIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={ICON_SIZE} height={ICON_SIZE}>
      <Path
        d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"
        fill={c.secondary}
      />
    </Svg>
  );
}

function GitHubIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={ICON_SIZE} height={ICON_SIZE}>
      <Path
        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
        fill={c.secondary}
      />
    </Svg>
  );
}

function WebsiteIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={ICON_SIZE} height={ICON_SIZE}>
      <Circle cx="12" cy="12" r="10" fill="none" stroke={c.secondary} strokeWidth={2} />
      <Line x1="2" y1="12" x2="22" y2="12" stroke={c.secondary} strokeWidth={2} />
      <Path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        fill="none"
        stroke={c.secondary}
        strokeWidth={2}
      />
    </Svg>
  );
}

function LinkIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={ICON_SIZE} height={ICON_SIZE}>
      <Path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        fill="none"
        stroke={c.secondary}
        strokeWidth={2}
      />
      <Path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        fill="none"
        stroke={c.secondary}
        strokeWidth={2}
      />
    </Svg>
  );
}

const st = StyleSheet.create({
  container: { padding: s.padding, fontFamily: "Pretendard" },
  // header
  header: {
    borderBottomWidth: 2,
    borderBottomColor: c.headerBorder,
    paddingBottom: s.headerMarginBottom * 0.6,
    marginBottom: s.headerMarginBottom,
  },
  name: { fontSize: s.nameSize, fontWeight: 700, color: c.name },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    fontSize: s.smallFont,
    color: c.secondary,
  },
  summary: {
    marginTop: 6,
    fontSize: s.smallFont,
    color: c.body,
    lineHeight: s.lineHeight,
  },
  // sections
  sections: { gap: s.sectionGap },
  sectionBlock: {},
  sectionTitle: {
    fontSize: s.headingSize,
    fontWeight: 600,
    color: c.heading,
    borderBottomWidth: 1,
    borderBottomColor: c.headingBorder,
    paddingBottom: s.sectionGap * 0.2,
    marginBottom: s.sectionGap * 0.4,
  },
  // shared item styles
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTitle: { fontSize: s.fontSize, fontWeight: 500, color: c.name, flex: 1 },
  itemSub: { fontWeight: 400, color: c.secondary },
  dateText: { fontSize: s.smallFont, color: c.muted, flexShrink: 0 },
  bulletList: { marginTop: 3, paddingLeft: 12 },
  bulletItem: {
    fontSize: s.smallFont,
    color: c.body,
    lineHeight: s.lineHeight,
    marginBottom: 1,
  },
  desc: {
    fontSize: s.smallFont,
    color: c.secondary,
    lineHeight: s.lineHeight,
    marginTop: 2,
  },
  // skills
  skillRow: {
    flexDirection: "row",
    fontSize: s.smallFont,
    marginBottom: 2,
  },
  skillCategory: { width: 80, fontWeight: 500, color: c.body, flexShrink: 0 },
  skillItems: { color: c.secondary, flex: 1 },
  // pills
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 3, marginTop: 3 },
  pill: {
    backgroundColor: c.pill.bg,
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    fontSize: s.tinyFont,
    color: c.pill.text,
  },
  // simple list
  simpleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  simpleLabel: { fontSize: s.smallFont, fontWeight: 500, color: c.name },
  simpleSub: { fontSize: s.smallFont, fontWeight: 400, color: c.secondary },
});

function DateRange({ startDate, endDate, isCurrent }: { startDate: string; endDate?: string; isCurrent: boolean }) {
  return (
    <Text style={st.dateText}>
      {formatDate(startDate)} - {formatDate(endDate, isCurrent)}
    </Text>
  );
}

function WorkExperienceSection({ items }: { items: WorkExperience[] }) {
  return (
    <View style={{ gap: s.itemGap }}>
      {items.map((item) => {
        const lines = item.description.filter(line => line.trim());
        return (
          <View key={item.id}>
            <View style={st.itemRow} wrap={false}>
              <Text style={st.itemTitle}>
                {item.company}
                {item.position ? <Text style={st.itemSub}> | {item.position}</Text> : null}
              </Text>
              <DateRange startDate={item.startDate} endDate={item.endDate} isCurrent={item.isCurrent} />
            </View>
            {lines.length > 0 && (
              <View style={st.bulletList}>
                {lines.map((line, i) => (
                  <Text key={i} style={st.bulletItem}>
                    {"•  "}{line}
                  </Text>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

function EducationSection({ items }: { items: Education[] }) {
  return (
    <View style={{ gap: s.itemGap - 4 }}>
      {items.map((item) => (
        <View key={item.id}>
          <View style={st.itemRow} wrap={false}>
            <Text style={st.itemTitle}>
              {item.school}
              {(item.degree || item.field) ? (
                <Text style={st.itemSub}> | {[item.degree, item.field].filter(Boolean).join(" ")}</Text>
              ) : null}
            </Text>
            <DateRange startDate={item.startDate} endDate={item.endDate} isCurrent={item.isCurrent} />
          </View>
          {item.minors?.filter(m => m.degree || m.field).map((minor, idx) => (
            <Text key={idx} style={st.desc}>
              {[minor.degree, minor.field].filter(Boolean).join(" ")}
            </Text>
          ))}
          {item.description ? <Text style={st.desc}>{item.description}</Text> : null}
        </View>
      ))}
    </View>
  );
}

function SkillsSection({ items }: { items: Skill[] }) {
  return (
    <View style={{ gap: Math.max(s.itemGap - 10, 4) }}>
      {items.map((item) => (
        <View key={item.id} style={st.skillRow}>
          <Text style={st.skillCategory}>{item.category}</Text>
          <Text style={st.skillItems}>{item.items.join(", ")}</Text>
        </View>
      ))}
    </View>
  );
}

function ProjectsSection({ items }: { items: Project[] }) {
  return (
    <View style={{ gap: s.itemGap }}>
      {items.map((item) => {
        const lines = item.description.filter(line => line.trim());
        return (
          <View key={item.id}>
            <View style={st.itemRow} wrap={false}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={st.itemTitle}>
                  {item.name}
                  {item.role ? <Text style={st.itemSub}> ({item.role})</Text> : null}
                </Text>
                {item.link ? <Link src={sanitizeUrl(item.link)} style={{textDecoration: 'none'}}><LinkIcon /></Link> : null}
              </View>
              <DateRange startDate={item.startDate} endDate={item.endDate} isCurrent={false} />
            </View>
            {lines.length > 0 && (
              <View style={st.bulletList}>
                {lines.map((line, i) => (
                  <Text key={i} style={st.bulletItem}>
                    {"•  "}{line}
                  </Text>
                ))}
              </View>
            )}
            {item.techStack && item.techStack.length > 0 && (
              <View style={st.pillRow}>
                {item.techStack.map((tech) => (
                  <Text key={tech} style={st.pill}>{tech}</Text>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

function CertificatesSection({ items }: { items: Certificate[] }) {
  return (
    <View style={{ gap: Math.max(s.itemGap - 10, 4) }}>
      {items.map((item) => (
        <View key={item.id} style={st.simpleRow}>
          <Text>
            <Text style={st.simpleLabel}>{item.name}</Text>
            {item.issuer ? <Text style={st.simpleSub}> - {item.issuer}</Text> : null}
          </Text>
          <Text style={st.dateText}>{formatDate(item.date)}</Text>
        </View>
      ))}
    </View>
  );
}

function LanguagesSection({ items }: { items: Language[] }) {
  return (
    <View style={{ gap: Math.max(s.itemGap - 10, 4) }}>
      {items.map((item) => (
        <Text key={item.id} style={{ fontSize: s.smallFont }}>
          <Text style={st.simpleLabel}>{item.name}</Text>
          {item.level ? <Text style={st.simpleSub}> - {item.level}</Text> : null}
        </Text>
      ))}
    </View>
  );
}

function AwardsSection({ items }: { items: Award[] }) {
  return (
    <View style={{ gap: s.itemGap - 4 }}>
      {items.map((item) => (
        <View key={item.id} wrap={false}>
          <View style={st.simpleRow}>
            <Text>
              <Text style={st.simpleLabel}>{item.name}</Text>
              {item.issuer ? <Text style={st.simpleSub}> - {item.issuer}</Text> : null}
            </Text>
            <Text style={st.dateText}>{formatDate(item.date)}</Text>
          </View>
          {item.description ? <Text style={st.desc}>{item.description}</Text> : null}
        </View>
      ))}
    </View>
  );
}

function SectionContent({ type, data }: { type: SectionType; data: ResumeData }) {
  switch (type) {
    case "workExperience": return <WorkExperienceSection items={data.workExperience} />;
    case "education": return <EducationSection items={data.education} />;
    case "skills": return <SkillsSection items={data.skills} />;
    case "projects": return <ProjectsSection items={data.projects} />;
    case "certificates": return <CertificatesSection items={data.certificates} />;
    case "languages": return <LanguagesSection items={data.languages} />;
    case "awards": return <AwardsSection items={data.awards} />;
    default: return null;
  }
}

export function ClassicDocument({ data }: { data: ResumeData }) {
  const { personalInfo, sections } = data;
  const visibleSections = sections
    .filter((sec) => sec.visible && sec.type !== "personalInfo")
    .sort((a, b) => a.order - b.order);

  const safeLinkedin = personalInfo.linkedin ? sanitizeUrl(personalInfo.linkedin) : undefined;
  const safeGithub = personalInfo.github ? sanitizeUrl(personalInfo.github) : undefined;
  const safeWebsite = personalInfo.website ? sanitizeUrl(personalInfo.website) : undefined;

  return (
    <View style={st.container}>
      {/* Header */}
      <View style={st.header}>
        <Text style={st.name}>{personalInfo.name || "이름을 입력하세요"}</Text>
        <View style={st.contactRow}>
          {personalInfo.email ? <Text>{personalInfo.email}</Text> : null}
          {personalInfo.phone ? <Text>{personalInfo.phone}</Text> : null}
          {personalInfo.address ? <Text>{personalInfo.address}</Text> : null}
          {safeLinkedin ? <Link src={safeLinkedin} style={{textDecoration: 'none'}}><LinkedInIcon /></Link> : null}
          {safeGithub ? <Link src={safeGithub} style={{textDecoration: 'none'}}><GitHubIcon /></Link> : null}
          {safeWebsite ? <Link src={safeWebsite} style={{textDecoration: 'none'}}><WebsiteIcon /></Link> : null}
        </View>
        {personalInfo.summary ? (
          <Text style={st.summary}>{personalInfo.summary}</Text>
        ) : null}
      </View>

      {/* Sections */}
      <View style={st.sections}>
        {visibleSections.map((section) => (
          <View key={section.id} style={st.sectionBlock}>
            <Text style={st.sectionTitle}>{section.title}</Text>
            <SectionContent type={section.type} data={data} />
          </View>
        ))}
      </View>
    </View>
  );
}
