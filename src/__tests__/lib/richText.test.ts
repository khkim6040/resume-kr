import { describe, it, expect } from "vitest";
import { parseRichText } from "@/lib/richText";

const p = (text: string, bold = false, italic = false, underline = false) => ({ text, bold, italic, underline });

describe("parseRichText", () => {
  it("서식 없는 텍스트는 그대로", () => {
    expect(parseRichText("안녕")).toEqual([p("안녕")]);
    expect(parseRichText("")).toEqual([]);
  });

  it("굵게와 기울임", () => {
    expect(parseRichText("a **b** c *d*")).toEqual([
      p("a "), p("b", true), p(" c "), p("d", false, true),
    ]);
  });

  it("중첩과 삼중 별표", () => {
    expect(parseRichText("**a *b* c**")).toEqual([
      p("a ", true), p("b", true, true), p(" c", true),
    ]);
    expect(parseRichText("***x***")).toEqual([p("x", true, true)]);
  });

  it("밑줄과 중첩", () => {
    expect(parseRichText("__a **b**__")).toEqual([p("a ", false, false, true), p("b", true, false, true)]);
    expect(parseRichText("my__var")).toEqual([p("my__var")]);
  });

  it("짝이 없거나 공백에 닿는 별표는 글자 그대로", () => {
    expect(parseRichText("2 * 3 = 6")).toEqual([p("2 * 3 = 6")]);
    expect(parseRichText("C**")).toEqual([p("C**")]);
  });
});
