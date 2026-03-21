import { describe, it, expect } from "vitest";
import { formatDate } from "@/components/preview/templates/utils";

describe("formatDate (preview)", () => {
  it("isCurrent가 true이면 '현재'를 반환한다", () => {
    expect(formatDate("2022-03", true)).toBe("현재");
  });

  it("isCurrent가 true이면 date가 없어도 '현재'를 반환한다", () => {
    expect(formatDate(undefined, true)).toBe("현재");
  });

  it("date가 undefined이면 빈 문자열을 반환한다", () => {
    expect(formatDate(undefined)).toBe("");
  });

  it("YYYY-MM 형식의 하이픈을 마침표로 변환한다", () => {
    expect(formatDate("2022-03")).toBe("2022.03");
  });

  it("YYYY-MM-DD 형식은 YYYY.MM까지만 잘라낸다", () => {
    expect(formatDate("2022-03-15")).toBe("2022.03");
  });
});
