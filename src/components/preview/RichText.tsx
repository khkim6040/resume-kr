import { Fragment, type ReactNode } from "react";
import { parseRichText } from "@/lib/richText";

export function RichText({ text }: { text: string }) {
  return (
    <>
      {parseRichText(text).map((s, i) => {
        let node: ReactNode = s.text;
        if (s.underline) node = <u>{node}</u>;
        if (s.italic) node = <em>{node}</em>;
        if (s.bold) node = <strong>{node}</strong>;
        return <Fragment key={i}>{node}</Fragment>;
      })}
    </>
  );
}
