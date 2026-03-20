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

const c = COLORS.minimal;
const s = SIZES;

const st = StyleSheet.create({
  container: { padding: s.padding + 4, fontFamily: "Pretendard" },
  // header
  header: {
    marginBottom: s.headerMarginBottom,
    paddingBottom: s.headerMarginBottom * 0.4,
  },
  name: {
    fontSize: s.nameSize + 2,
    fontWeight: 400,
    color: c.name,
    letterSpacing: 1,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 8,
    rowGap: 2,
    marginTop: 4,
    fontSize: s.smallFont,
    color: c.muted,
  },
  separator: { color: c.separator },
  summary: {
    marginTop: 8,
    fontSize: s.smallFont,
    color: c.secondary,
    lineHeight: s.lineHeight,
  },
  divider: {
    height: 0.5,
    backgroundColor: c.divider,
    marginTop: 8,
  },
  // sections
  sections: { gap: s.sectionGap + 2 },
  sectionTitle: {
    fontSize: s.headingSize - 3,
    fontWeight: 400,
    color: c.heading,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: s.sectionGap * 0.5,
  },
  // items
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
  skillCategory: { width: 80, color: c.muted, flexShrink: 0 },
  skillItems: { color: c.body, flex: 1 },
  // tech text
  techText: { fontSize: s.tinyFont, color: c.muted, marginTop: 3 },
  // simple
  simpleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  simpleLabel: { fontSize: s.smallFont, color: c.body },
  simpleSub: { fontSize: s.smallFont, color: c.muted },
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
            <Text style={st.itemTitle}>
              {item.company}
              {item.position ? <Text style={st.itemSub}> / {item.position}</Text> : null}
            </Text>
            <DateRange startDate={item.startDate} endDate={item.endDate} isCurrent={item.isCurrent} />
          </View>
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
            <Text style={st.itemTitle}>
              {item.school}
              {(item.degree || item.field) ? (
                <Text style={st.itemSub}> / {[item.degree, item.field].filter(Boolean).join(" ")}</Text>
              ) : null}
            </Text>
            <DateRange startDate={item.startDate} endDate={item.endDate} isCurrent={item.isCurrent} />
          </View>
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
          <Text style={st.skillItems}>{item.items.join(" / ")}</Text>
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
            <Text style={st.itemTitle}>
              {item.name}
              {item.role ? <Text style={st.itemSub}> / {item.role}</Text> : null}
            </Text>
            <DateRange startDate={item.startDate} endDate={item.endDate} isCurrent={false} />
          </View>
          {item.description.length > 0 && (
            <View style={st.bulletList}>
              {item.description.map((line, i) => (
                <Text key={i} style={st.bulletItem}>{"•  "}{line}</Text>
              ))}
            </View>
          )}
          {item.techStack && item.techStack.length > 0 && (
            <Text style={st.techText}>{item.techStack.join(" / ")}</Text>
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
            {item.issuer ? <Text style={st.simpleSub}> / {item.issuer}</Text> : null}
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
          {item.level ? <Text style={st.simpleSub}> / {item.level}</Text> : null}
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
              {item.issuer ? <Text style={st.simpleSub}> / {item.issuer}</Text> : null}
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

export function MinimalDocument({ data }: { data: ResumeData }) {
  const { personalInfo, sections } = data;
  const visibleSections = sections
    .filter((sec) => sec.visible && sec.type !== "personalInfo")
    .sort((a, b) => a.order - b.order);

  const contactFields = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.address,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.website,
  ].filter(Boolean);

  return (
    <View style={st.container}>
      {/* Header */}
      <View style={st.header}>
        <Text style={st.name}>{personalInfo.name || "이름을 입력하세요"}</Text>
        <View style={st.contactRow}>
          {contactFields.map((field, i) => (
            <Text key={i}>
              {i > 0 ? <Text style={st.separator}> |  </Text> : null}
              {field}
            </Text>
          ))}
        </View>
        {personalInfo.summary ? (
          <Text style={st.summary}>{personalInfo.summary}</Text>
        ) : null}
        <View style={st.divider} />
      </View>

      {/* Sections */}
      <View style={st.sections}>
        {visibleSections.map((section) => (
          <View key={section.id}>
            <Text style={st.sectionTitle}>{section.title}</Text>
            <SectionContent type={section.type} data={data} />
          </View>
        ))}
      </View>
    </View>
  );
}
