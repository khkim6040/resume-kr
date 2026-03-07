import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ResumeData,
  Section,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certificate,
  Language,
  Award,
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
};

interface ResumeStore {
  data: ResumeData;
  dataVersion: number;
  setData: (data: ResumeData) => void;
  updatePersonalInfo: (info: Partial<ResumeData["personalInfo"]>) => void;
  setSections: (sections: Section[]) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  toggleSectionVisibility: (sectionId: string) => void;

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
      };
    },
    {
      name: "resume-kr-storage",
      partialize: (state) => ({ data: state.data }),
    },
  ),
);
