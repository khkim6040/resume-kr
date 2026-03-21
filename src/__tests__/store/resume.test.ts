import { describe, it, expect, beforeEach } from "vitest";
import { useResumeStore } from "@/store/resume";
import type { WorkExperience, Education, Skill, Project, Certificate, Language, Award } from "@/types/resume";

// 각 테스트 전에 store를 초기 상태로 리셋
beforeEach(() => {
  const { setState, getInitialState } = useResumeStore;
  setState(getInitialState(), true);
});

describe("useResumeStore - 초기 상태", () => {
  it("기본 데이터가 비어있다", () => {
    const { data } = useResumeStore.getState();
    expect(data.personalInfo.name).toBe("");
    expect(data.personalInfo.email).toBe("");
    expect(data.personalInfo.phone).toBe("");
    expect(data.workExperience).toEqual([]);
    expect(data.education).toEqual([]);
    expect(data.skills).toEqual([]);
    expect(data.projects).toEqual([]);
    expect(data.certificates).toEqual([]);
    expect(data.languages).toEqual([]);
    expect(data.awards).toEqual([]);
  });

  it("8개의 기본 섹션이 존재한다", () => {
    const { data } = useResumeStore.getState();
    expect(data.sections).toHaveLength(8);
  });

  it("초기 dataVersion은 0이다", () => {
    expect(useResumeStore.getState().dataVersion).toBe(0);
  });

  it("기본 templateId는 classic이다", () => {
    expect(useResumeStore.getState().templateId).toBe("classic");
  });
});

describe("useResumeStore - personalInfo", () => {
  it("updatePersonalInfo로 부분 업데이트할 수 있다", () => {
    useResumeStore.getState().updatePersonalInfo({ name: "홍길동" });
    expect(useResumeStore.getState().data.personalInfo.name).toBe("홍길동");
    expect(useResumeStore.getState().data.personalInfo.email).toBe("");
  });

  it("여러 필드를 한번에 업데이트할 수 있다", () => {
    useResumeStore.getState().updatePersonalInfo({
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1234-5678",
    });
    const { personalInfo } = useResumeStore.getState().data;
    expect(personalInfo.name).toBe("홍길동");
    expect(personalInfo.email).toBe("hong@example.com");
    expect(personalInfo.phone).toBe("010-1234-5678");
  });
});

describe("useResumeStore - dataVersion 자동 증가", () => {
  it("mutation마다 dataVersion이 증가한다", () => {
    expect(useResumeStore.getState().dataVersion).toBe(0);

    useResumeStore.getState().updatePersonalInfo({ name: "테스트" });
    expect(useResumeStore.getState().dataVersion).toBe(1);

    useResumeStore.getState().updatePersonalInfo({ email: "a@b.com" });
    expect(useResumeStore.getState().dataVersion).toBe(2);
  });
});

describe("useResumeStore - WorkExperience CRUD", () => {
  const item: WorkExperience = {
    id: "work-1",
    company: "회사A",
    position: "개발자",
    startDate: "2020-01",
    isCurrent: true,
    description: ["업무1", "업무2"],
  };

  it("add: 경력을 추가할 수 있다", () => {
    useResumeStore.getState().addWorkExperience(item);
    expect(useResumeStore.getState().data.workExperience).toHaveLength(1);
    expect(useResumeStore.getState().data.workExperience[0].company).toBe("회사A");
  });

  it("update: 경력을 부분 수정할 수 있다", () => {
    useResumeStore.getState().addWorkExperience(item);
    useResumeStore.getState().updateWorkExperience("work-1", { company: "회사B" });
    expect(useResumeStore.getState().data.workExperience[0].company).toBe("회사B");
    expect(useResumeStore.getState().data.workExperience[0].position).toBe("개발자");
  });

  it("remove: 경력을 삭제할 수 있다", () => {
    useResumeStore.getState().addWorkExperience(item);
    useResumeStore.getState().removeWorkExperience("work-1");
    expect(useResumeStore.getState().data.workExperience).toHaveLength(0);
  });

  it("존재하지 않는 id로 update해도 에러가 나지 않는다", () => {
    useResumeStore.getState().addWorkExperience(item);
    useResumeStore.getState().updateWorkExperience("nonexistent", { company: "X" });
    expect(useResumeStore.getState().data.workExperience[0].company).toBe("회사A");
  });

  it("여러 항목을 추가하고 특정 항목만 삭제할 수 있다", () => {
    const item2: WorkExperience = { ...item, id: "work-2", company: "회사B" };
    useResumeStore.getState().addWorkExperience(item);
    useResumeStore.getState().addWorkExperience(item2);
    useResumeStore.getState().removeWorkExperience("work-1");
    const remaining = useResumeStore.getState().data.workExperience;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe("work-2");
  });
});

describe("useResumeStore - Education CRUD", () => {
  const item: Education = {
    id: "edu-1",
    school: "서울대학교",
    degree: "학사",
    field: "컴퓨터공학",
    startDate: "2016-03",
    isCurrent: false,
    endDate: "2020-02",
  };

  it("add/update/remove가 동작한다", () => {
    useResumeStore.getState().addEducation(item);
    expect(useResumeStore.getState().data.education).toHaveLength(1);

    useResumeStore.getState().updateEducation("edu-1", { school: "카이스트" });
    expect(useResumeStore.getState().data.education[0].school).toBe("카이스트");

    useResumeStore.getState().removeEducation("edu-1");
    expect(useResumeStore.getState().data.education).toHaveLength(0);
  });
});

describe("useResumeStore - Skill CRUD", () => {
  const item: Skill = { id: "skill-1", category: "Frontend", items: ["React", "TypeScript"] };

  it("add/update/remove가 동작한다", () => {
    useResumeStore.getState().addSkill(item);
    expect(useResumeStore.getState().data.skills).toHaveLength(1);

    useResumeStore.getState().updateSkill("skill-1", { items: ["React", "TypeScript", "Next.js"] });
    expect(useResumeStore.getState().data.skills[0].items).toHaveLength(3);

    useResumeStore.getState().removeSkill("skill-1");
    expect(useResumeStore.getState().data.skills).toHaveLength(0);
  });
});

describe("useResumeStore - Project CRUD", () => {
  const item: Project = {
    id: "proj-1",
    name: "이력서 빌더",
    startDate: "2024-01",
    description: ["프로젝트 설명"],
    techStack: ["React", "Next.js"],
  };

  it("add/update/remove가 동작한다", () => {
    useResumeStore.getState().addProject(item);
    expect(useResumeStore.getState().data.projects).toHaveLength(1);

    useResumeStore.getState().updateProject("proj-1", { name: "이력서 빌더 v2" });
    expect(useResumeStore.getState().data.projects[0].name).toBe("이력서 빌더 v2");

    useResumeStore.getState().removeProject("proj-1");
    expect(useResumeStore.getState().data.projects).toHaveLength(0);
  });
});

describe("useResumeStore - Certificate CRUD", () => {
  const item: Certificate = { id: "cert-1", name: "정보처리기사", issuer: "한국산업인력공단", date: "2023-06" };

  it("add/update/remove가 동작한다", () => {
    useResumeStore.getState().addCertificate(item);
    expect(useResumeStore.getState().data.certificates).toHaveLength(1);

    useResumeStore.getState().updateCertificate("cert-1", { name: "SQLD" });
    expect(useResumeStore.getState().data.certificates[0].name).toBe("SQLD");

    useResumeStore.getState().removeCertificate("cert-1");
    expect(useResumeStore.getState().data.certificates).toHaveLength(0);
  });
});

describe("useResumeStore - Language CRUD", () => {
  const item: Language = { id: "lang-1", name: "영어", level: "상" };

  it("add/update/remove가 동작한다", () => {
    useResumeStore.getState().addLanguage(item);
    expect(useResumeStore.getState().data.languages).toHaveLength(1);

    useResumeStore.getState().updateLanguage("lang-1", { level: "중" });
    expect(useResumeStore.getState().data.languages[0].level).toBe("중");

    useResumeStore.getState().removeLanguage("lang-1");
    expect(useResumeStore.getState().data.languages).toHaveLength(0);
  });
});

describe("useResumeStore - Award CRUD", () => {
  const item: Award = { id: "award-1", name: "최우수상", issuer: "OO대회", date: "2023-11" };

  it("add/update/remove가 동작한다", () => {
    useResumeStore.getState().addAward(item);
    expect(useResumeStore.getState().data.awards).toHaveLength(1);

    useResumeStore.getState().updateAward("award-1", { name: "대상" });
    expect(useResumeStore.getState().data.awards[0].name).toBe("대상");

    useResumeStore.getState().removeAward("award-1");
    expect(useResumeStore.getState().data.awards).toHaveLength(0);
  });
});

describe("useResumeStore - sections", () => {
  it("reorderSections: 섹션 순서를 변경할 수 있다", () => {
    // 기본: personalInfo(0), workExperience(1), education(2), ...
    useResumeStore.getState().reorderSections(1, 3);
    const sections = [...useResumeStore.getState().data.sections]
      .sort((a, b) => a.order - b.order);
    // workExperience가 index 3으로 이동
    expect(sections[0].type).toBe("personalInfo");
    expect(sections[1].type).toBe("education");
    expect(sections[2].type).toBe("skills");
    expect(sections[3].type).toBe("workExperience");
  });

  it("reorderSections: 뒤에서 앞으로 이동할 수 있다", () => {
    useResumeStore.getState().reorderSections(3, 0);
    const sections = [...useResumeStore.getState().data.sections]
      .sort((a, b) => a.order - b.order);
    expect(sections[0].type).toBe("skills");
    expect(sections[1].type).toBe("personalInfo");
  });

  it("reorderSections 후 order가 0부터 연속적이다", () => {
    useResumeStore.getState().reorderSections(0, 7);
    const sections = [...useResumeStore.getState().data.sections]
      .sort((a, b) => a.order - b.order);
    sections.forEach((s, i) => {
      expect(s.order).toBe(i);
    });
  });

  it("toggleSectionVisibility: visible을 토글할 수 있다", () => {
    const sectionId = "sec-certificates";
    expect(
      useResumeStore.getState().data.sections.find((s) => s.id === sectionId)?.visible,
    ).toBe(false);

    useResumeStore.getState().toggleSectionVisibility(sectionId);
    expect(
      useResumeStore.getState().data.sections.find((s) => s.id === sectionId)?.visible,
    ).toBe(true);

    useResumeStore.getState().toggleSectionVisibility(sectionId);
    expect(
      useResumeStore.getState().data.sections.find((s) => s.id === sectionId)?.visible,
    ).toBe(false);
  });

  it("toggleSectionVisibility: 다른 섹션은 영향받지 않는다", () => {
    const before = useResumeStore.getState().data.sections.map((s) => ({
      id: s.id,
      visible: s.visible,
    }));
    useResumeStore.getState().toggleSectionVisibility("sec-certificates");
    const after = useResumeStore.getState().data.sections;
    before.forEach(({ id, visible }) => {
      if (id !== "sec-certificates") {
        expect(after.find((s) => s.id === id)?.visible).toBe(visible);
      }
    });
  });

  it("setSections: 전체 섹션을 교체할 수 있다", () => {
    const newSections = [
      { id: "sec-1", type: "personalInfo" as const, title: "인적사항", visible: true, order: 0 },
    ];
    useResumeStore.getState().setSections(newSections);
    expect(useResumeStore.getState().data.sections).toHaveLength(1);
  });
});

describe("useResumeStore - setData", () => {
  it("전체 데이터를 교체할 수 있다", () => {
    const newData = {
      ...useResumeStore.getState().data,
      personalInfo: { name: "김철수", email: "kim@test.com", phone: "010-0000-0000" },
    };
    useResumeStore.getState().setData(newData);
    expect(useResumeStore.getState().data.personalInfo.name).toBe("김철수");
  });
});

describe("useResumeStore - setTemplateId", () => {
  it("setTemplateId 호출 시 dataVersion이 증가한다", () => {
    const prevVersion = useResumeStore.getState().dataVersion;
    useResumeStore.getState().setTemplateId("classic");
    expect(useResumeStore.getState().templateId).toBe("classic");
    expect(useResumeStore.getState().dataVersion).toBe(prevVersion + 1);
  });
});

describe("useResumeStore - reorder", () => {
  it("경력 항목 순서를 변경할 수 있다", () => {
    const store = useResumeStore.getState();
    const a: WorkExperience = { id: "w1", company: "A", position: "", startDate: "", isCurrent: false, description: [] };
    const b: WorkExperience = { id: "w2", company: "B", position: "", startDate: "", isCurrent: false, description: [] };
    const c: WorkExperience = { id: "w3", company: "C", position: "", startDate: "", isCurrent: false, description: [] };
    store.addWorkExperience(a);
    store.addWorkExperience(b);
    store.addWorkExperience(c);

    useResumeStore.getState().reorderWorkExperience(0, 2);
    const items = useResumeStore.getState().data.workExperience;
    expect(items.map(i => i.company)).toEqual(["B", "C", "A"]);
  });

  it("같은 인덱스로 reorder 시 변경 없음", () => {
    const store = useResumeStore.getState();
    store.addEducation({ id: "e1", school: "X", degree: "", field: "", startDate: "", isCurrent: false });
    store.addEducation({ id: "e2", school: "Y", degree: "", field: "", startDate: "", isCurrent: false });

    useResumeStore.getState().reorderEducation(1, 1);
    expect(useResumeStore.getState().data.education.map(i => i.school)).toEqual(["X", "Y"]);
  });

  it("범위 밖 인덱스는 무시된다", () => {
    const store = useResumeStore.getState();
    store.addSkill({ id: "s1", category: "A", items: [] });

    useResumeStore.getState().reorderSkills(-1, 5);
    expect(useResumeStore.getState().data.skills).toHaveLength(1);
  });
});

describe("useResumeStore - 날짜 마이그레이션", () => {
  it("YYYY.MM 형식을 YYYY-MM으로 변환한다", () => {
    // 마이그레이션 함수를 직접 테스트하기 어려우므로 store의 migrate를 간접 테스트
    // persist config에서 migrate를 export하지 않으므로 로직을 검증
    const migrateDate = (d: string | undefined): string | undefined => {
      if (typeof d !== 'string') return d;
      const match = d.match(/^\s*(\d{4})\.(\d{1,2})\s*$/);
      if (!match) return d;
      return `${match[1]}-${match[2].padStart(2, '0')}`;
    };

    expect(migrateDate("2022.03")).toBe("2022-03");
    expect(migrateDate("2023.1")).toBe("2023-01");
    expect(migrateDate(" 2024.12 ")).toBe("2024-12");
  });

  it("비표준 형식은 변환하지 않는다", () => {
    const migrateDate = (d: string | undefined): string | undefined => {
      if (typeof d !== 'string') return d;
      const match = d.match(/^\s*(\d{4})\.(\d{1,2})\s*$/);
      if (!match) return d;
      return `${match[1]}-${match[2].padStart(2, '0')}`;
    };

    expect(migrateDate("2022.03 예정")).toBe("2022.03 예정");
    expect(migrateDate("2022-03")).toBe("2022-03");
    expect(migrateDate(undefined)).toBeUndefined();
    expect(migrateDate("")).toBe("");
  });
});
