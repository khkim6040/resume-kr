import { View, Text, Link, StyleSheet } from "@react-pdf/renderer";
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
          <View key={item.id} wrap={false}>
            <View style={st.itemRow}>
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
        <View key={item.id} wrap={false}>
          <View style={st.itemRow}>
            <Text style={st.itemTitle}>
              {item.school}
              {(item.degree || item.field) ? (
                <Text style={st.itemSub}> | {[item.degree, item.field].filter(Boolean).join(" ")}</Text>
              ) : null}
            </Text>
            <DateRange startDate={item.startDate} endDate={item.endDate} isCurrent={item.isCurrent} />
          </View>
          {item.minors && item.minors.length > 0 && item.minors.map((minor, idx) => (
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
          <View key={item.id} wrap={false}>
            <View style={st.itemRow}>
              <Text style={st.itemTitle}>
                {item.name}
                {item.role ? <Text style={st.itemSub}> ({item.role})</Text> : null}
              </Text>
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
          {safeLinkedin ? <Link src={safeLinkedin} style={{color: c.secondary, textDecoration: 'none', fontSize: s.smallFont}}><Text>LinkedIn</Text></Link> : null}
          {safeGithub ? <Link src={safeGithub} style={{color: c.secondary, textDecoration: 'none', fontSize: s.smallFont}}><Text>GitHub</Text></Link> : null}
          {safeWebsite ? <Link src={safeWebsite} style={{color: c.secondary, textDecoration: 'none', fontSize: s.smallFont}}><Text>{safeWebsite.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</Text></Link> : null}
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
