import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { richTextKeyDown } from "@/components/editor/richTextKeys";

function Box({ initial }: { initial: string }) {
  const [v, setV] = useState(initial);
  return (
    <textarea
      aria-label="box"
      value={v}
      onChange={(e) => setV(e.target.value)}
      onKeyDown={richTextKeyDown}
    />
  );
}

function setup(initial: string, start: number, end: number) {
  const { getByLabelText } = render(<Box initial={initial} />);
  const el = getByLabelText("box") as HTMLTextAreaElement;
  el.setSelectionRange(start, end);
  return el;
}

describe("richTextKeyDown", () => {
  it("Cmd+B로 선택 영역을 굵게 감싸고 안쪽 텍스트를 선택 상태로 둔다", () => {
    const el = setup("핵심 성과", 0, 2);
    fireEvent.keyDown(el, { key: "b", metaKey: true });
    expect(el.value).toBe("**핵심** 성과");
    expect([el.selectionStart, el.selectionEnd]).toEqual([2, 4]);
  });

  it("같은 키를 다시 누르면 해제된다 (토글)", () => {
    const el = setup("**핵심** 성과", 2, 4);
    fireEvent.keyDown(el, { key: "b", metaKey: true });
    expect(el.value).toBe("핵심 성과");
  });

  it("Ctrl+I는 기울임, 선택이 없으면 빈 표기를 넣고 커서를 가운데 둔다", () => {
    const el = setup("ab", 1, 1);
    fireEvent.keyDown(el, { key: "i", ctrlKey: true });
    expect(el.value).toBe("a**b");
    expect(el.selectionStart).toBe(2);
  });

  it("Cmd+U는 밑줄", () => {
    const el = setup("ab", 0, 2);
    fireEvent.keyDown(el, { key: "u", metaKey: true });
    expect(el.value).toBe("__ab__");
  });

  it("수식키 없는 b는 무시한다", () => {
    const el = setup("ab", 0, 2);
    fireEvent.keyDown(el, { key: "b" });
    expect(el.value).toBe("ab");
  });
});
