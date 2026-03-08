import type { ResumeData, TemplateId } from "@/types/resume";

interface PdfEntry {
  data: ResumeData;
  templateId: TemplateId;
  expires: number;
}

const store = new Map<string, PdfEntry>();

export function saveData(id: string, data: ResumeData, templateId: TemplateId = "classic"): void {
  store.set(id, { data, templateId, expires: Date.now() + 30_000 });
}

export function getData(id: string): { data: ResumeData; templateId: TemplateId } | null {
  const entry = store.get(id);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(id);
    return null;
  }
  store.delete(id); // 1회 조회 후 삭제
  return { data: entry.data, templateId: entry.templateId };
}
