import { describe, it, expect } from "vitest";
import { COLORS, SIZES } from "@/lib/pdf/tokens";

describe("COLORS", () => {
  it("classic 테마의 모든 색상 키가 존재한다", () => {
    expect(COLORS.classic).toHaveProperty("name");
    expect(COLORS.classic).toHaveProperty("heading");
    expect(COLORS.classic).toHaveProperty("headingBorder");
    expect(COLORS.classic).toHaveProperty("headerBorder");
    expect(COLORS.classic).toHaveProperty("body");
    expect(COLORS.classic).toHaveProperty("secondary");
    expect(COLORS.classic).toHaveProperty("muted");
    expect(COLORS.classic).toHaveProperty("pill");
  });

  it("pill은 bg와 text를 포함한다", () => {
    expect(COLORS.classic.pill).toHaveProperty("bg");
    expect(COLORS.classic.pill).toHaveProperty("text");
  });

  it("모든 색상값이 유효한 hex 코드이다", () => {
    const hexPattern = /^#[0-9a-f]{6}$/i;
    expect(COLORS.classic.name).toMatch(hexPattern);
    expect(COLORS.classic.heading).toMatch(hexPattern);
    expect(COLORS.classic.body).toMatch(hexPattern);
    expect(COLORS.classic.secondary).toMatch(hexPattern);
    expect(COLORS.classic.muted).toMatch(hexPattern);
    expect(COLORS.classic.pill.bg).toMatch(hexPattern);
    expect(COLORS.classic.pill.text).toMatch(hexPattern);
  });
});

describe("SIZES", () => {
  it("모든 사이즈 키가 양수이다", () => {
    for (const [key, value] of Object.entries(SIZES)) {
      expect(value, `${key} should be positive`).toBeGreaterThan(0);
    }
  });

  it("폰트 사이즈가 올바른 크기 순서이다 (tiny < small < base < heading < name)", () => {
    expect(SIZES.tinyFont).toBeLessThan(SIZES.smallFont);
    expect(SIZES.smallFont).toBeLessThan(SIZES.fontSize);
    expect(SIZES.fontSize).toBeLessThan(SIZES.headingSize);
    expect(SIZES.headingSize).toBeLessThan(SIZES.nameSize);
  });
});
