import { Text } from "@react-pdf/renderer";
import { parseRichText } from "@/lib/richText";

export function PdfRichText({ text }: { text: string }) {
  return (
    <>
      {parseRichText(text).map((s, i) =>
        s.bold || s.italic || s.underline ? (
          <Text
            key={i}
            style={{
              ...(s.bold && { fontWeight: 700 }),
              ...(s.italic && { fontStyle: "italic" }),
              ...(s.underline && { textDecoration: "underline" }),
            }}
          >
            {s.text}
          </Text>
        ) : (
          s.text
        ),
      )}
    </>
  );
}
