import type { SectionType, ResumeData } from "@/types/resume";

export function sectionHasContent(type: SectionType, data: ResumeData): boolean {
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
    case "custom":
      return true;
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
