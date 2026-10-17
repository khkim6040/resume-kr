// 인라인 서식: **굵게**, *기울임*, ***둘 다***, __밑줄__. 짝이 안 맞는 표기는 글자 그대로 둔다.
export interface RichSpan {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

const MARK =
  /\*\*\*(\S(?:.*?\S)?)\*\*\*|\*\*(\S(?:.*?\S)?)\*\*|\*(\S(?:.*?\S)?)\*|__(\S(?:.*?\S)?)__/;

export function parseRichText(
  text: string,
  bold = false,
  italic = false,
  underline = false,
): RichSpan[] {
  const m = MARK.exec(text);
  if (!m) return text ? [{ text, bold, italic, underline }] : [];
  const before = text.slice(0, m.index);
  const after = text.slice(m.index + m[0].length);
  const inner =
    m[1] !== undefined
      ? parseRichText(m[1], true, true, underline)
      : m[2] !== undefined
        ? parseRichText(m[2], true, italic, underline)
        : m[3] !== undefined
          ? parseRichText(m[3], bold, true, underline)
          : parseRichText(m[4], bold, italic, true);
  return [
    ...(before ? [{ text: before, bold, italic, underline }] : []),
    ...inner,
    ...parseRichText(after, bold, italic, underline),
  ];
}
