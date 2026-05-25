import type { ResumeData } from "@/types/resume";

const RESUME_DATA_PREFIX = "RESUME_KR_DATA:";

export async function importPdf(file: File): Promise<ResumeData> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await import("pdfjs-dist");

  // Use bundled worker to avoid CDN dependency
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const metadata = await doc.getMetadata();

  const subject = (metadata.info as Record<string, unknown>)?.Subject;
  if (typeof subject !== "string" || !subject.startsWith(RESUME_DATA_PREFIX)) {
    throw new Error(
      "이 PDF에는 resume-kr 데이터가 포함되어 있지 않습니다.\nresume-kr에서 내보낸 PDF만 가져올 수 있습니다.",
    );
  }

  const base64 = subject.slice(RESUME_DATA_PREFIX.length);
  const json = decodeURIComponent(escape(atob(base64)));
  const data: ResumeData = JSON.parse(json);
  return data;
}
