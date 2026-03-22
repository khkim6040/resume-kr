export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  minors?: { degree: string; field: string }[];
}

export interface Skill {
  id: string;
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  role?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description: string[];
  techStack?: string[];
  link?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Award {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description?: string;
}

export type CustomFieldType = "text" | "date" | "link" | "descriptionList";

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: CustomFieldType;
}

export interface CustomFieldValue {
  fieldId: string;
  value: string | string[];
}

export interface CustomSectionItem {
  id: string;
  fields: CustomFieldValue[];
}

export type SectionType =
  | "personalInfo"
  | "workExperience"
  | "education"
  | "skills"
  | "projects"
  | "certificates"
  | "languages"
  | "awards"
  | "custom";

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
  fieldDefinitions?: CustomFieldDefinition[];
}

export type TemplateId = "classic";

export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  languages: Language[];
  awards: Award[];
  sections: Section[];
  customSections: Record<string, CustomSectionItem[]>;
}
