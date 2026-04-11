import { describe, it, expect, vi, beforeEach } from "vitest";
import { safeGetItem, safeSetItem, safeRemoveItem } from "@/lib/safeStorage";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("safeGetItem", () => {
  it("localStorage에 값이 있으면 반환한다", () => {
    localStorage.setItem("test-key", "test-value");
    expect(safeGetItem("test-key")).toBe("test-value");
  });

  it("예외 발생 시 null을 반환하고 예외를 전파하지 않는다", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => safeGetItem("test-key")).not.toThrow();
    expect(safeGetItem("test-key")).toBeNull();
  });
});

describe("safeSetItem", () => {
  it("localStorage에 값을 저장한다", () => {
    safeSetItem("test-key", "test-value");
    expect(localStorage.getItem("test-key")).toBe("test-value");
  });

  it("예외 발생 시 예외를 전파하지 않는다", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => safeSetItem("test-key", "test-value")).not.toThrow();
  });
});

describe("safeRemoveItem", () => {
  it("localStorage에서 값을 제거한다", () => {
    localStorage.setItem("test-key", "test-value");
    safeRemoveItem("test-key");
    expect(localStorage.getItem("test-key")).toBeNull();
  });

  it("예외 발생 시 예외를 전파하지 않는다", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => safeRemoveItem("test-key")).not.toThrow();
  });
});
