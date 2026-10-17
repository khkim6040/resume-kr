import { describe, it, expect } from "vitest";
import { formatPhone, validateEmail, validatePhone } from "@/lib/validation";

describe("validateEmail", () => {
  it("빈 문자열 → null", () => {
    expect(validateEmail("")).toBeNull();
  });

  it("user@example.com → null", () => {
    expect(validateEmail("user@example.com")).toBeNull();
  });

  it("user+tag@sub.example.com → null", () => {
    expect(validateEmail("user+tag@sub.example.com")).toBeNull();
  });

  it("invalid → 에러 메시지", () => {
    expect(validateEmail("invalid")).toBe("올바른 이메일 형식이 아닙니다");
  });

  it("@example.com → 에러 메시지", () => {
    expect(validateEmail("@example.com")).toBe("올바른 이메일 형식이 아닙니다");
  });

  it("user@ → 에러 메시지", () => {
    expect(validateEmail("user@")).toBe("올바른 이메일 형식이 아닙니다");
  });

  it("공백 포함 → 에러 메시지", () => {
    expect(validateEmail("user @example.com")).toBe("올바른 이메일 형식이 아닙니다");
  });
});

describe("validatePhone", () => {
  it("빈 문자열 → null", () => {
    expect(validatePhone("")).toBeNull();
  });

  it("010-1234-5678 → null", () => {
    expect(validatePhone("010-1234-5678")).toBeNull();
  });

  it("01012345678 → null", () => {
    expect(validatePhone("01012345678")).toBeNull();
  });

  it("02-123-4567 → null", () => {
    expect(validatePhone("02-123-4567")).toBeNull();
  });

  it("021234567 → null", () => {
    expect(validatePhone("021234567")).toBeNull();
  });

  it("abc → 에러 메시지", () => {
    expect(validatePhone("abc")).toBe("올바른 전화번호 형식이 아닙니다");
  });

  it("123 → 에러 메시지", () => {
    expect(validatePhone("123")).toBe("올바른 전화번호 형식이 아닙니다");
  });

  it("010-123-456 (짧음) → 에러 메시지", () => {
    expect(validatePhone("010-123-456")).toBe("올바른 전화번호 형식이 아닙니다");
  });
});

describe("formatPhone", () => {
  it("3자리, 추가 4자리 입력 시 자동으로 하이픈을 넣는다", () => {
    expect(formatPhone("010")).toBe("010");
    expect(formatPhone("0101")).toBe("010-1");
    expect(formatPhone("0101234")).toBe("010-1234");
    expect(formatPhone("01012345678")).toBe("010-1234-5678");
  });
  it("10자리 번호는 3-3-4로 나눈다", () => {
    expect(formatPhone("0311234567")).toBe("031-123-4567");
  });
  it("서울 지역번호 02는 2자리로 나눈다", () => {
    expect(formatPhone("021234567")).toBe("02-123-4567");
    expect(formatPhone("0212345678")).toBe("02-1234-5678");
  });
  it("숫자 외 문자를 제거하고 11자리를 넘지 않는다", () => {
    expect(formatPhone("010-1234-5678")).toBe("010-1234-5678");
    expect(formatPhone("010a1234b56789")).toBe("010-1234-5678");
    expect(formatPhone("")).toBe("");
  });
});
