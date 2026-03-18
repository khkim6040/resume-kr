import { Document, Page } from "@react-pdf/renderer";
import type { ResumeData, TemplateId } from "@/types/resume";
import { PDF_TEMPLATES } from "./templates";
import { registerFonts } from "./fonts";

registerFonts();

interface Props {
  data: ResumeData;
  templateId: TemplateId;
}

export function ResumeDocument({ data, templateId }: Props) {
  const Template = PDF_TEMPLATES[templateId];
  return (
    <Document>
      <Page size="A4" style={{ fontFamily: "Pretendard" }}>
        <Template data={data} />
      </Page>
    </Document>
  );
}
