import { View, Text, StyleSheet } from "@react-pdf/renderer";
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

const c = COLORS.modern;
const s = SIZES;

const st = StyleSheet.create({
  container: { padding: s.padding, fontFamily: "Pretendard" },
  // header
  accentBar: {
    width: 48,
    height: 3,
    backgroundColor: c.accent,
    borderRadius: 2,
    marginBottom: 8,
  },
  header: {
    marginBottom: s.headerMarginBottom,
    paddingBottom: s.headerMarginBottom * 0.6,
  },
  name: { fontSize: s.nameSize, fontWeight: 700, color: c.name },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 12,
    rowGap: 2,
    marginTop: 4,
    fontSize: s.smallFont,
    color: c.secondary,
  },
  atSymbol: { color: c.accent },
  summary: {
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: c.accentBorder,
    paddingLeft: 8,
    fontSize: s.smallFont,
    color: c.body,
    lineHeight: s.lineHeight,
  },
  // sections
  sections: { gap: s.sectionGap },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: s.sectionGap * 0.5,
  },
  sectionLine: { flex: 1, height: 0.5, backgroundColor: c.headingLine },
  sectionTitle: {
    fontSize: s.headingSize - 2,
    fontWeight: 700,
    color: c.heading,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  // items
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTitle: { fontSize: s.fontSize, fontWeight: 600, color: c.name, flex: 1 },
  position: { fontSize: s.fontSize - 1, color: c.accent, marginTop: 1 },
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
  // skills - pill style
  skillBlock: { marginBottom: 4 },
  skillCategory: {
    fontSize: s.smallFont,
    fontWeight: 600,
    color: c.body,
    marginBottom: 3,
  },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 3, marginTop: 3 },
  pill: {
    backgroundColor: c.pill.bg,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: s.tinyFont,
    color: c.pill.text,
  },
  techPill: {
    backgroundColor: c.techPill.bg,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    fontSize: s.tinyFont,
    color: c.techPill.text,
  },
  // simple
  simpleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  simpleLabel: { fontSize: s.smallFont, fontWeight: 500, color: c.name },
  simpleSub: { fontSize: s.smallFont, fontWeight: 400, color: c.muted },
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
      {items.map((item) => (
        <View key={item.id}>
          <View style={st.itemRow}>
            <Text style={st.itemTitle}>{item.company}</Text>
            <DateRange startDate={item.startDate} endDate={item.endDate} isCurrent={item.isCurrent} />
          </View>
          {item.position ? <Text style={st.position}>{item.position}</Text> : null}
          {item.description.length > 0 && (
            <View style={st.bulletList}>
              {item.description.map((line, i) => (
                <Text key={i} style={st.bulletItem}>{"•  "}{line}</Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

function EducationSection({ items }: { items: Education[] }) {
  return (
    <View style={{ gap: s.itemGap - 4 }}>
      {items.map((item) => (
        <View key={item.id}>
          <View style={st.itemRow}>
            <Text style={st.itemTitle}>{item.school}</Text>
            <DateRange startDate={item.startDate} endDate={item.endDate} isCurrent={item.isCurrent} />
          </View>
          {(item.degree || item.field) ? (
            <Text style={st.position}>{[item.degree, item.field].filter(Boolean).join(" ")}</Text>
          ) : null}
          {item.description ? <Text style={st.desc}>{item.description}</Text> : null}
        </View>
      ))}
    </View>
  );
}

function SkillsSection({ items }: { items: Skill[] }) {
  return (
    <View style={{ gap: Math.max(s.itemGap - 8, 4) }}>
      {items.map((item) => (
        <View key={item.id} style={st.skillBlock}>
          <Text style={st.skillCategory}>{item.category}</Text>
          <View style={st.pillRow}>
            {item.items.map((skill) => (
              <Text key={skill} style={st.pill}>{skill}</Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function ProjectsSection({ items }: { items: Project[] }) {
  return (
    <View style={{ gap: s.itemGap }}>
      {items.map((item) => (
        <View key={item.id}>
          <View style={st.itemRow}>
            <Text style={st.itemTitle}>{item.name}</Text>
            <DateRange startDate={item.startDate} endDate={item.endDate} isCurrent={false} />
          </View>
          {item.role ? <Text style={st.position}>{item.role}</Text> : null}
          {item.description.length > 0 && (
            <View style={st.bulletList}>
              {item.description.map((line, i) => (
                <Text key={i} style={st.bulletItem}>{"•  "}{line}</Text>
              ))}
            </View>
          )}
          {item.techStack && item.techStack.length > 0 && (
            <View style={st.pillRow}>
              {item.techStack.map((tech) => (
                <Text key={tech} style={st.techPill}>{tech}</Text>
              ))}
            </View>
          )}
        </View>
      ))}
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
        <View key={item.id}>
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

export function ModernDocument({ data }: { data: ResumeData }) {
  const { personalInfo, sections } = data;
  const visibleSections = sections
    .filter((sec) => sec.visible && sec.type !== "personalInfo")
    .sort((a, b) => a.order - b.order);

  return (
    <View style={st.container}>
      {/* Header with accent bar */}
      <View style={st.header}>
        <View style={st.accentBar} />
        <Text style={st.name}>{personalInfo.name || "이름을 입력하세요"}</Text>
        <View style={st.contactRow}>
          {personalInfo.email ? (
            <Text><Text style={st.atSymbol}>@ </Text>{personalInfo.email}</Text>
          ) : null}
          {personalInfo.phone ? <Text>{personalInfo.phone}</Text> : null}
          {personalInfo.address ? <Text>{personalInfo.address}</Text> : null}
          {personalInfo.linkedin ? <Text>{personalInfo.linkedin}</Text> : null}
          {personalInfo.github ? <Text>{personalInfo.github}</Text> : null}
          {personalInfo.website ? <Text>{personalInfo.website}</Text> : null}
        </View>
        {personalInfo.summary ? (
          <Text style={st.summary}>{personalInfo.summary}</Text>
        ) : null}
      </View>

      {/* Sections */}
      <View style={st.sections}>
        {visibleSections.map((section) => (
          <View key={section.id}>
            <View style={st.sectionHeaderRow}>
              <View style={st.sectionLine} />
              <Text style={st.sectionTitle}>{section.title}</Text>
              <View style={st.sectionLine} />
            </View>
            <SectionContent type={section.type} data={data} />
          </View>
        ))}
      </View>
    </View>
  );
}
