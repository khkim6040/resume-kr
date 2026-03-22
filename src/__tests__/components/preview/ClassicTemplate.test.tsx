import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClassicTemplate } from "@/components/preview/templates/ClassicTemplate";
import type { ResumeData } from "@/types/resume";
import type { FitStyles } from "@/hooks/useAutoFit";
import { createRef } from "react";

const defaultFs: FitStyles = {
  sectionGap: 14,
  fontSize: 13,
  headingSize: 15,
  nameSize: 22,
  itemGap: 12,
  padding: 36,
  headerMarginBottom: 18,
  lineHeight: 1.45,
};

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
    customSections: {},
    sections: [
      { id: "sec-personal", type: "personalInfo", title: "인적사항", visible: true, order: 0 },
      { id: "sec-work", type: "workExperience", title: "경력", visible: true, order: 1 },
      { id: "sec-education", type: "education", title: "학력", visible: true, order: 2 },
      { id: "sec-skills", type: "skills", title: "기술", visible: true, order: 3 },
      { id: "sec-projects", type: "projects", title: "프로젝트", visible: true, order: 4 },
      { id: "sec-certificates", type: "certificates", title: "자격증", visible: false, order: 5 },
      { id: "sec-languages", type: "languages", title: "어학", visible: false, order: 6 },
      { id: "sec-awards", type: "awards", title: "수상", visible: false, order: 7 },
    ],
    ...overrides,
  };
}

function renderTemplate(data: ResumeData) {
  const ref = createRef<HTMLDivElement>();
  return render(<ClassicTemplate data={data} fs={defaultFs} contentRef={ref} />);
}

describe("ClassicTemplate", () => {
  describe("헤더", () => {
    it("이름이 없으면 placeholder를 표시한다", () => {
      renderTemplate(makeData());
      expect(screen.getByText("이름을 입력하세요")).toBeInTheDocument();
    });

    it("이름을 표시한다", () => {
      renderTemplate(makeData({ personalInfo: { name: "홍길동", email: "", phone: "" } }));
      expect(screen.getByText("홍길동")).toBeInTheDocument();
    });

    it("이메일, 전화번호, 주소를 표시한다", () => {
      renderTemplate(makeData({
        personalInfo: {
          name: "홍길동",
          email: "hong@test.com",
          phone: "010-1234-5678",
          address: "서울시 강남구",
        },
      }));
      expect(screen.getByText("hong@test.com")).toBeInTheDocument();
      expect(screen.getByText("010-1234-5678")).toBeInTheDocument();
      expect(screen.getByText("서울시 강남구")).toBeInTheDocument();
    });

    it("summary가 있으면 표시한다", () => {
      renderTemplate(makeData({
        personalInfo: {
          name: "홍길동",
          email: "",
          phone: "",
          summary: "열정적인 개발자입니다.",
        },
      }));
      expect(screen.getByText("열정적인 개발자입니다.")).toBeInTheDocument();
    });
  });

  describe("섹션 가시성", () => {
    it("visible이 true이고 항목이 있는 섹션만 렌더링한다", () => {
      renderTemplate(makeData({
        workExperience: [{ id: "w1", company: "테스트", position: "", startDate: "", isCurrent: false, description: [] }],
        education: [{ id: "e1", school: "테스트대", degree: "", field: "", startDate: "", isCurrent: false }],
      }));
      expect(screen.getByText("경력")).toBeInTheDocument();
      expect(screen.getByText("학력")).toBeInTheDocument();
      expect(screen.queryByText("자격증")).not.toBeInTheDocument();
      expect(screen.queryByText("어학")).not.toBeInTheDocument();
    });

    it("항목이 없는 visible 섹션은 렌더링하지 않는다", () => {
      renderTemplate(makeData());
      expect(screen.queryByText("경력")).not.toBeInTheDocument();
      expect(screen.queryByText("학력")).not.toBeInTheDocument();
    });

    it("personalInfo 섹션은 섹션 목록에 나타나지 않는다", () => {
      renderTemplate(makeData({
        workExperience: [{ id: "w1", company: "테스트", position: "", startDate: "", isCurrent: false, description: [] }],
      }));
      const headings = screen.getAllByRole("heading", { level: 2 });
      const headingTexts = headings.map((h) => h.textContent);
      expect(headingTexts).not.toContain("인적사항");
    });

    it("personalInfo가 visible: false이면 헤더가 렌더링되지 않는다", () => {
      renderTemplate(makeData({
        personalInfo: { name: "홍길동", email: "test@test.com", phone: "010-0000-0000" },
        sections: [
          { id: "sec-personal", type: "personalInfo", title: "인적사항", visible: false, order: 0 },
        ],
      }));
      expect(screen.queryByText("홍길동")).not.toBeInTheDocument();
      expect(screen.queryByText("test@test.com")).not.toBeInTheDocument();
    });
  });

  describe("경력 섹션", () => {
    it("경력 항목을 렌더링한다", () => {
      renderTemplate(makeData({
        workExperience: [{
          id: "w1",
          company: "네이버",
          position: "프론트엔드 개발자",
          startDate: "2020-01",
          isCurrent: true,
          description: ["React 개발", "성능 최적화"],
        }],
      }));
      expect(screen.getByText("네이버")).toBeInTheDocument();
      expect(screen.getByText(/프론트엔드 개발자/)).toBeInTheDocument();
      expect(screen.getByText("React 개발")).toBeInTheDocument();
      expect(screen.getByText("성능 최적화")).toBeInTheDocument();
    });

    it("빈 경력 섹션은 미리보기에서 숨겨진다", () => {
      renderTemplate(makeData());
      expect(screen.queryByText("경력")).not.toBeInTheDocument();
    });
  });

  describe("학력 섹션", () => {
    it("학력 항목을 렌더링한다", () => {
      renderTemplate(makeData({
        education: [{
          id: "e1",
          school: "서울대학교",
          degree: "학사",
          field: "컴퓨터공학",
          startDate: "2016-03",
          endDate: "2020-02",
          isCurrent: false,
        }],
      }));
      expect(screen.getByText("서울대학교")).toBeInTheDocument();
      expect(screen.getByText(/학사/)).toBeInTheDocument();
      expect(screen.getByText(/컴퓨터공학/)).toBeInTheDocument();
    });
  });

  describe("기술 섹션", () => {
    it("카테고리와 기술 목록을 렌더링한다", () => {
      renderTemplate(makeData({
        skills: [{
          id: "s1",
          category: "Frontend",
          items: ["React", "TypeScript", "Next.js"],
        }],
      }));
      expect(screen.getByText("Frontend")).toBeInTheDocument();
      expect(screen.getByText("React, TypeScript, Next.js")).toBeInTheDocument();
    });
  });

  describe("프로젝트 섹션", () => {
    it("프로젝트 정보와 기술 스택을 렌더링한다", () => {
      renderTemplate(makeData({
        sections: [
          { id: "sec-projects", type: "projects", title: "프로젝트", visible: true, order: 0 },
        ],
        projects: [{
          id: "p1",
          name: "이력서 빌더",
          role: "리드 개발자",
          startDate: "2024-01",
          description: ["React 기반 이력서 빌더"],
          techStack: ["React", "Next.js"],
        }],
      }));
      expect(screen.getByText("이력서 빌더")).toBeInTheDocument();
      expect(screen.getByText(/리드 개발자/)).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Next.js")).toBeInTheDocument();
    });

    it("유효한 링크가 있으면 링크 아이콘을 표시한다", () => {
      renderTemplate(makeData({
        sections: [
          { id: "sec-projects", type: "projects", title: "프로젝트", visible: true, order: 0 },
        ],
        projects: [{
          id: "p1",
          name: "이력서 빌더",
          startDate: "2024-01",
          description: [],
          link: "https://github.com/user/repo",
        }],
      }));
      const link = screen.getByLabelText("프로젝트 링크");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://github.com/user/repo");
    });

    it("링크가 없으면 링크 아이콘을 표시하지 않는다", () => {
      renderTemplate(makeData({
        sections: [
          { id: "sec-projects", type: "projects", title: "프로젝트", visible: true, order: 0 },
        ],
        projects: [{
          id: "p1",
          name: "이력서 빌더",
          startDate: "2024-01",
          description: [],
        }],
      }));
      expect(screen.queryByLabelText("프로젝트 링크")).not.toBeInTheDocument();
    });

    it("javascript: 스킴 링크는 렌더링하지 않는다", () => {
      renderTemplate(makeData({
        sections: [
          { id: "sec-projects", type: "projects", title: "프로젝트", visible: true, order: 0 },
        ],
        projects: [{
          id: "p1",
          name: "이력서 빌더",
          startDate: "2024-01",
          description: [],
          link: "javascript:alert(1)",
        }],
      }));
      expect(screen.queryByLabelText("프로젝트 링크")).not.toBeInTheDocument();
    });
  });

  describe("자격증 섹션", () => {
    it("visible일 때 자격증을 렌더링한다", () => {
      renderTemplate(makeData({
        sections: [
          { id: "sec-certificates", type: "certificates", title: "자격증", visible: true, order: 0 },
        ],
        certificates: [{
          id: "c1",
          name: "정보처리기사",
          issuer: "한국산업인력공단",
          date: "2023-06",
        }],
      }));
      expect(screen.getByText("정보처리기사")).toBeInTheDocument();
      expect(screen.getByText(/한국산업인력공단/)).toBeInTheDocument();
    });
  });

  describe("어학 섹션", () => {
    it("visible일 때 어학을 렌더링한다", () => {
      renderTemplate(makeData({
        sections: [
          { id: "sec-languages", type: "languages", title: "어학", visible: true, order: 0 },
        ],
        languages: [{ id: "l1", name: "영어", level: "상" }],
      }));
      expect(screen.getByText("영어")).toBeInTheDocument();
      expect(screen.getByText(/상/)).toBeInTheDocument();
    });
  });

  describe("수상 섹션", () => {
    it("visible일 때 수상 내역을 렌더링한다", () => {
      renderTemplate(makeData({
        sections: [
          { id: "sec-awards", type: "awards", title: "수상", visible: true, order: 0 },
        ],
        awards: [{
          id: "a1",
          name: "최우수상",
          issuer: "해커톤",
          date: "2023-11",
          description: "1등 수상",
        }],
      }));
      expect(screen.getByText("최우수상")).toBeInTheDocument();
      expect(screen.getByText(/해커톤/)).toBeInTheDocument();
      expect(screen.getByText("1등 수상")).toBeInTheDocument();
    });
  });

  describe("섹션 순서", () => {
    it("order에 따라 섹션이 정렬된다", () => {
      renderTemplate(makeData({
        sections: [
          { id: "sec-skills", type: "skills", title: "기술", visible: true, order: 0 },
          { id: "sec-work", type: "workExperience", title: "경력", visible: true, order: 1 },
        ],
        skills: [{ id: "s1", category: "Frontend", items: ["React"] }],
        workExperience: [{ id: "w1", company: "테스트", position: "", startDate: "", isCurrent: false, description: [] }],
      }));
      const headings = screen.getAllByRole("heading", { level: 2 });
      expect(headings[0].textContent).toBe("기술");
      expect(headings[1].textContent).toBe("경력");
    });
  });
});
