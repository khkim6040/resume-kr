import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ResumeData,
  Section,
  TemplateId,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certificate,
  Language,
  Award,
  CustomFieldDefinition,
  CustomFieldValue,
  CustomSectionItem,
} from "@/types/resume";

const defaultSections: Section[] = [
  { id: "sec-personal", type: "personalInfo", title: "인적사항", visible: true, order: 0 },
  { id: "sec-work", type: "workExperience", title: "경력", visible: true, order: 1 },
  { id: "sec-education", type: "education", title: "학력", visible: true, order: 2 },
  { id: "sec-skills", type: "skills", title: "기술", visible: true, order: 3 },
  { id: "sec-projects", type: "projects", title: "프로젝트", visible: true, order: 4 },
  { id: "sec-certificates", type: "certificates", title: "자격증", visible: false, order: 5 },
  { id: "sec-languages", type: "languages", title: "어학", visible: false, order: 6 },
  { id: "sec-awards", type: "awards", title: "수상", visible: false, order: 7 },
];

const defaultResumeData: ResumeData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certificates: [],
  languages: [],
  awards: [],
  sections: defaultSections,
  customSections: {},
};

interface ResumeStore {
  data: ResumeData;
  dataVersion: number;
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
  setData: (data: ResumeData) => void;
  updatePersonalInfo: (info: Partial<ResumeData["personalInfo"]>) => void;
  setSections: (sections: Section[]) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;

  addWorkExperience: (item: WorkExperience) => void;
  updateWorkExperience: (id: string, item: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;

  addEducation: (item: Education) => void;
  updateEducation: (id: string, item: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  addSkill: (item: Skill) => void;
  updateSkill: (id: string, item: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  addProject: (item: Project) => void;
  updateProject: (id: string, item: Partial<Project>) => void;
  removeProject: (id: string) => void;

  addCertificate: (item: Certificate) => void;
  updateCertificate: (id: string, item: Partial<Certificate>) => void;
  removeCertificate: (id: string) => void;

  addLanguage: (item: Language) => void;
  updateLanguage: (id: string, item: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  addAward: (item: Award) => void;
  updateAward: (id: string, item: Partial<Award>) => void;
  removeAward: (id: string) => void;

  reorderWorkExperience: (fromIndex: number, toIndex: number) => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;
  reorderSkills: (fromIndex: number, toIndex: number) => void;
  reorderProjects: (fromIndex: number, toIndex: number) => void;
  reorderCertificates: (fromIndex: number, toIndex: number) => void;
  reorderLanguages: (fromIndex: number, toIndex: number) => void;
  reorderAwards: (fromIndex: number, toIndex: number) => void;

  addCustomSection: (title: string, fieldDefinitions: CustomFieldDefinition[]) => void;
  removeCustomSection: (sectionId: string) => void;
  updateCustomSectionSchema: (sectionId: string, fieldDefinitions: CustomFieldDefinition[]) => void;
  addCustomSectionItem: (sectionId: string, item: CustomSectionItem) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, fields: CustomFieldValue[]) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
  reorderCustomSectionItems: (sectionId: string, fromIndex: number, toIndex: number) => void;
}

function makeArrayActions<T extends { id: string }>(
  key: keyof ResumeData,
  set: (fn: (state: { data: ResumeData }) => { data: ResumeData }) => void,
) {
  return {
    add: (item: T) =>
      set((state) => ({
        data: {
          ...state.data,
          [key]: [...(state.data[key] as unknown as T[]), item],
        },
      })),
    update: (id: string, partial: Partial<T>) =>
      set((state) => ({
        data: {
          ...state.data,
          [key]: (state.data[key] as unknown as T[]).map((item) =>
            item.id === id ? { ...item, ...partial } : item,
          ),
        },
      })),
    remove: (id: string) =>
      set((state) => ({
        data: {
          ...state.data,
          [key]: (state.data[key] as unknown as T[]).filter((item) => item.id !== id),
        },
      })),
    reorder: (fromIndex: number, toIndex: number) =>
      set((state) => {
        const items = [...(state.data[key] as unknown as T[])];
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) {
          return { data: state.data };
        }
        const [moved] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, moved);
        return { data: { ...state.data, [key]: items } };
      }),
  };
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => {
      // Wrap set to auto-increment dataVersion on every mutation
      const vSet: typeof set = (fn) =>
        set((state) => {
          const result = typeof fn === "function" ? fn(state) : fn;
          return { ...result, dataVersion: state.dataVersion + 1 };
        });

      const work = makeArrayActions<WorkExperience>("workExperience", vSet);
      const edu = makeArrayActions<Education>("education", vSet);
      const skill = makeArrayActions<Skill>("skills", vSet);
      const project = makeArrayActions<Project>("projects", vSet);
      const cert = makeArrayActions<Certificate>("certificates", vSet);
      const lang = makeArrayActions<Language>("languages", vSet);
      const award = makeArrayActions<Award>("awards", vSet);

      return {
        data: defaultResumeData,
        dataVersion: 0,
        templateId: "classic" as TemplateId,
        setTemplateId: (id) => vSet({ templateId: id }),
        setData: (data) => vSet({ data }),
        updatePersonalInfo: (info) =>
          vSet((state) => ({
            data: {
              ...state.data,
              personalInfo: { ...state.data.personalInfo, ...info },
            },
          })),
        setSections: (sections) =>
          vSet((state) => ({
            data: { ...state.data, sections },
          })),
        reorderSections: (fromIndex, toIndex) =>
          vSet((state) => {
            const sections = [...state.data.sections].sort(
              (a, b) => a.order - b.order,
            );
            const [moved] = sections.splice(fromIndex, 1);
            sections.splice(toIndex, 0, moved);
            return {
              data: {
                ...state.data,
                sections: sections.map((s, i) => ({ ...s, order: i })),
              },
            };
          }),
        toggleSectionVisibility: (sectionId) =>
          vSet((state) => ({
            data: {
              ...state.data,
              sections: state.data.sections.map((s) =>
                s.id === sectionId ? { ...s, visible: !s.visible } : s,
              ),
            },
          })),
        updateSectionTitle: (sectionId, title) =>
          vSet((state) => ({
            data: {
              ...state.data,
              sections: state.data.sections.map((s) =>
                s.id === sectionId ? { ...s, title } : s,
              ),
            },
          })),

        addWorkExperience: work.add,
        updateWorkExperience: work.update,
        removeWorkExperience: work.remove,

        addEducation: edu.add,
        updateEducation: edu.update,
        removeEducation: edu.remove,

        addSkill: skill.add,
        updateSkill: skill.update,
        removeSkill: skill.remove,

        addProject: project.add,
        updateProject: project.update,
        removeProject: project.remove,

        addCertificate: cert.add,
        updateCertificate: cert.update,
        removeCertificate: cert.remove,

        addLanguage: lang.add,
        updateLanguage: lang.update,
        removeLanguage: lang.remove,

        addAward: award.add,
        updateAward: award.update,
        removeAward: award.remove,

        reorderWorkExperience: work.reorder,
        reorderEducation: edu.reorder,
        reorderSkills: skill.reorder,
        reorderProjects: project.reorder,
        reorderCertificates: cert.reorder,
        reorderLanguages: lang.reorder,
        reorderAwards: award.reorder,

        addCustomSection: (title, fieldDefinitions) =>
          vSet((state) => {
            const id = crypto.randomUUID();
            const newSection: Section = {
              id,
              type: "custom",
              title,
              visible: true,
              order: state.data.sections.length,
              fieldDefinitions,
            };
            return {
              data: {
                ...state.data,
                sections: [...state.data.sections, newSection],
                customSections: { ...state.data.customSections, [id]: [] },
              },
            };
          }),

        removeCustomSection: (sectionId) =>
          vSet((state) => {
            const { [sectionId]: _, ...rest } = state.data.customSections;
            return {
              data: {
                ...state.data,
                sections: state.data.sections.filter((s) => s.id !== sectionId),
                customSections: rest,
              },
            };
          }),

        updateCustomSectionSchema: (sectionId, fieldDefinitions) =>
          vSet((state) => {
            const validFieldIds = new Set(fieldDefinitions.map((f) => f.id));
            const cleanedItems = (state.data.customSections[sectionId] ?? []).map((item) => ({
              ...item,
              fields: item.fields.filter((f) => validFieldIds.has(f.fieldId)),
            }));
            return {
              data: {
                ...state.data,
                sections: state.data.sections.map((s) =>
                  s.id === sectionId ? { ...s, fieldDefinitions } : s,
                ),
                customSections: { ...state.data.customSections, [sectionId]: cleanedItems },
              },
            };
          }),

        addCustomSectionItem: (sectionId, item) =>
          vSet((state) => ({
            data: {
              ...state.data,
              customSections: {
                ...state.data.customSections,
                [sectionId]: [...(state.data.customSections[sectionId] ?? []), item],
              },
            },
          })),

        updateCustomSectionItem: (sectionId, itemId, fields) =>
          vSet((state) => ({
            data: {
              ...state.data,
              customSections: {
                ...state.data.customSections,
                [sectionId]: (state.data.customSections[sectionId] ?? []).map((item) =>
                  item.id === itemId ? { ...item, fields } : item,
                ),
              },
            },
          })),

        removeCustomSectionItem: (sectionId, itemId) =>
          vSet((state) => ({
            data: {
              ...state.data,
              customSections: {
                ...state.data.customSections,
                [sectionId]: (state.data.customSections[sectionId] ?? []).filter(
                  (item) => item.id !== itemId,
                ),
              },
            },
          })),

        reorderCustomSectionItems: (sectionId, fromIndex, toIndex) =>
          vSet((state) => {
            const items = [...(state.data.customSections[sectionId] ?? [])];
            if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) {
              return { data: state.data };
            }
            const [moved] = items.splice(fromIndex, 1);
            items.splice(toIndex, 0, moved);
            return {
              data: {
                ...state.data,
                customSections: { ...state.data.customSections, [sectionId]: items },
              },
            };
          }),
      };
    },
    {
      name: "resume-kr-storage",
      version: 3,
      partialize: (state) => ({ data: state.data, templateId: state.templateId }),
      migrate: (persisted: unknown) => {
        const state = persisted as Record<string, unknown>;
        if (state.templateId !== "classic") {
          state.templateId = "classic";
        }
        // Migrate date format from YYYY.MM to YYYY-MM for type="month" inputs
        const data = state.data as Record<string, unknown> | undefined;
        if (data) {
          const migrateDate = (d: string | undefined): string | undefined => {
            if (typeof d !== 'string') return d;
            const match = d.match(/^\s*(\d{4})\.(\d{1,2})\s*$/);
            if (!match) return d;
            return `${match[1]}-${match[2].padStart(2, '0')}`;
          };
          const migrateItems = (items: Array<Record<string, unknown>> | undefined, fields: string[]) => {
            items?.forEach(item => {
              fields.forEach(f => {
                if (typeof item[f] === 'string') {
                  item[f] = migrateDate(item[f] as string);
                }
              });
            });
          };
          migrateItems(data.workExperience as Array<Record<string, unknown>>, ['startDate', 'endDate']);
          migrateItems(data.education as Array<Record<string, unknown>>, ['startDate', 'endDate']);
          migrateItems(data.projects as Array<Record<string, unknown>>, ['startDate', 'endDate']);
          migrateItems(data.certificates as Array<Record<string, unknown>>, ['date']);
          migrateItems(data.awards as Array<Record<string, unknown>>, ['date']);

          // v2→v3: customSections 초기화
          if (!data.customSections) {
            data.customSections = {};
          }
        }
        return state;
      },
    },
  ),
);
