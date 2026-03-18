import { pdf } from "@react-pdf/renderer";
import { ResumeDocument } from "./ResumeDocument";
import type { ResumeData, TemplateId } from "@/types/resume";

export async function generatePdf(data: ResumeData, templateId: TemplateId) {
  const rawBlob = await pdf(
    <ResumeDocument data={data} templateId={templateId} />,
  ).toBlob();
  const blob = new Blob([rawBlob], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
