import { describe, it, expect } from "vitest";
import { sectionHasContent } from "@/lib/sectionHasContent";
import type { ResumeData } from "@/types/resume";

function makeData(overrides: Partial<ResumeData> = {}): ResumeData {
  return {
    personalInfo: { name: "", email: "", phone: "" },
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certificates: [],
    languages: [],
    awards: [],
    sections: [],
    ...overrides,
  };
}

describe("sectionHasContent", () => {
  it("workExperience: company가 있으면 true", () => {
    expect(sectionHasContent("workExperience", makeData({
      workExperience: [{ id: "1", company: "회사", position: "", startDate: "", isCurrent: false, description: [] }],
    }))).toBe(true);
  });

  it("workExperience: company가 비어있으면 false", () => {
    expect(sectionHasContent("workExperience", makeData({
      workExperience: [{ id: "1", company: "  ", position: "", startDate: "", isCurrent: false, description: [] }],
    }))).toBe(false);
  });

  it("education: school이 있으면 true", () => {
    expect(sectionHasContent("education", makeData({
      education: [{ id: "1", school: "대학", degree: "", field: "", startDate: "", isCurrent: false }],
    }))).toBe(true);
  });

  it("skills: category 또는 items가 있으면 true", () => {
    expect(sectionHasContent("skills", makeData({
      skills: [{ id: "1", category: "", items: ["React"] }],
    }))).toBe(true);
  });

  it("skills: 둘 다 비어있으면 false", () => {
    expect(sectionHasContent("skills", makeData({
      skills: [{ id: "1", category: "", items: [] }],
    }))).toBe(false);
  });

  it("projects: name이 있으면 true", () => {
    expect(sectionHasContent("projects", makeData({
      projects: [{ id: "1", name: "프로젝트", startDate: "", description: [] }],
    }))).toBe(true);
  });

  it("certificates: name이 있으면 true", () => {
    expect(sectionHasContent("certificates", makeData({
      certificates: [{ id: "1", name: "자격증", issuer: "", date: "" }],
    }))).toBe(true);
  });

  it("languages: name이 있으면 true", () => {
    expect(sectionHasContent("languages", makeData({
      languages: [{ id: "1", name: "영어", level: "" }],
    }))).toBe(true);
  });

  it("awards: name이 있으면 true", () => {
    expect(sectionHasContent("awards", makeData({
      awards: [{ id: "1", name: "수상", issuer: "", date: "" }],
    }))).toBe(true);
  });

  it("personalInfo는 항상 true", () => {
    expect(sectionHasContent("personalInfo", makeData())).toBe(true);
  });

  it("빈 배열이면 false", () => {
    expect(sectionHasContent("workExperience", makeData())).toBe(false);
    expect(sectionHasContent("education", makeData())).toBe(false);
    expect(sectionHasContent("projects", makeData())).toBe(false);
  });
});
