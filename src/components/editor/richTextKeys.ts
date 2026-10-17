import type { KeyboardEvent } from "react";

const MARKS: Record<string, string> = { b: "**", i: "*", u: "__" };

// Cmd/Ctrl+B, I, U: 선택 영역을 **굵게** / *기울임* / __밑줄__ 표기로 감싸거나 해제한다.
// setRangeText 후 input 이벤트를 쏘면 React의 기존 onChange가 그대로 받는다.
export function richTextKeyDown(e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) {
  if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
  const mark = MARKS[e.key.toLowerCase()];
  if (!mark) return;
  e.preventDefault();

  const el = e.currentTarget;
  const { value } = el;
  const start = el.selectionStart ?? 0;
  const end = el.selectionEnd ?? start;
  const sel = value.slice(start, end);
  const n = mark.length;

  if (sel.length >= 2 * n && sel.startsWith(mark) && sel.endsWith(mark)) {
    el.setRangeText(sel.slice(n, -n), start, end, "select");
  } else if (value.slice(start - n, start) === mark && value.slice(end, end + n) === mark) {
    el.setRangeText(sel, start - n, end + n, "select");
  } else {
    el.setRangeText(mark + sel + mark, start, end);
    el.setSelectionRange(start + n, end + n);
  }
  el.dispatchEvent(new Event("input", { bubbles: true }));
}
