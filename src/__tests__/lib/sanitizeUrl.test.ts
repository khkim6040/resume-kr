import { describe, it, expect } from "vitest";
import { sanitizeUrl } from "@/lib/sanitizeUrl";

describe("sanitizeUrl", () => {
  it("https URL을 허용한다", () => {
    expect(sanitizeUrl("https://github.com/user")).toBe("https://github.com/user");
  });

  it("http URL을 허용한다", () => {
    expect(sanitizeUrl("http://example.com")).toBe("http://example.com/");
  });

  it("javascript: 프로토콜을 거부한다", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBeUndefined();
  });

  it("data: 프로토콜을 거부한다", () => {
    expect(sanitizeUrl("data:text/html,<h1>hi</h1>")).toBeUndefined();
  });

  it("프로토콜 없는 URL에 https를 자동 추가한다", () => {
    const result = sanitizeUrl("github.com/user");
    expect(result).toBe("https://github.com/user");
  });

  it("공백을 trim한다", () => {
    expect(sanitizeUrl("  https://example.com  ")).toBe("https://example.com/");
  });

  it("빈 문자열은 undefined를 반환한다", () => {
    expect(sanitizeUrl("")).toBeUndefined();
    expect(sanitizeUrl("   ")).toBeUndefined();
  });

  it("유효하지 않은 URL은 undefined를 반환한다", () => {
    expect(sanitizeUrl("not a url at all")).toBeUndefined();
  });
});
