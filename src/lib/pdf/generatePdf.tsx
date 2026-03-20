"use client";

import { pdf } from "@react-pdf/renderer";
import { ResumeDocument } from "./ResumeDocument";
import type { ResumeData, TemplateId } from "@/types/resume";

export async function generatePdf(data: ResumeData, templateId: TemplateId) {
  const blob = await pdf(
    <ResumeDocument data={data} templateId={templateId} />,
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
