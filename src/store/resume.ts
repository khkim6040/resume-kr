import { create } from "zustand";
import type { ResumeData, Section } from "@/types/resume";

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
  setData: (data: ResumeData) => void;
  updatePersonalInfo: (info: Partial<ResumeData["personalInfo"]>) => void;
  setSections: (sections: Section[]) => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  data: defaultResumeData,
  setData: (data) => set({ data }),
  updatePersonalInfo: (info) =>
    set((state) => ({
      data: {
        ...state.data,
        personalInfo: { ...state.data.personalInfo, ...info },
      },
    })),
  setSections: (sections) =>
    set((state) => ({
      data: { ...state.data, sections },
    })),
}));
