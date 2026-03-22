import type { SectionType, ResumeData } from "@/types/resume";

export function sectionHasContent(
  type: SectionType,
  data: ResumeData,
  sectionId?: string,
): boolean {
  switch (type) {
    case "workExperience":
      return data.workExperience.some((item) => item.company.trim());
    case "education":
      return data.education.some((item) => item.school.trim());
    case "skills":
      return data.skills.some((item) => item.category.trim() || item.items.length > 0);
    case "projects":
      return data.projects.some((item) => item.name.trim());
    case "certificates":
      return data.certificates.some((item) => item.name.trim());
    case "languages":
      return data.languages.some((item) => item.name.trim());
    case "awards":
      return data.awards.some((item) => item.name.trim());
    case "personalInfo":
      return true;
    case "custom": {
      if (!sectionId) return false;
      const items = data.customSections[sectionId] ?? [];
      return items.some((item) =>
        item.fields.some((f) =>
          Array.isArray(f.value) ? f.value.some((v) => v.trim() !== "") : f.value.trim() !== "",
        ),
      );
    }
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
