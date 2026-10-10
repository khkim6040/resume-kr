import { Document, Page } from "@react-pdf/renderer";
import type { ResumeData, TemplateId } from "@/types/resume";
import { PDF_TEMPLATES } from "./templates";
import { registerFonts } from "./fonts";
import { SIZES } from "./tokens";

registerFonts();

interface Props {
  data: ResumeData;
  templateId: TemplateId;
}

const RESUME_DATA_PREFIX = "RESUME_KR_DATA:";

export function ResumeDocument({ data, templateId }: Props) {
  const Template = PDF_TEMPLATES[templateId];
  const encoded = RESUME_DATA_PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  return (
    <Document subject={encoded}>
      {/* 여백은 Page에 둬야 페이지마다 적용된다 */}
      <Page size="A4" style={{ fontFamily: "Pretendard", padding: SIZES.padding }}>
        <Template data={data} />
      </Page>
    </Document>
  );
}
