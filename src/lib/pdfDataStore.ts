import type { ResumeData, TemplateId } from "@/types/resume";
import { writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

interface PdfEntry {
  data: ResumeData;
  templateId: TemplateId;
  expires: number;
}

const PREFIX = "resume-kr-pdf-";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function filePath(id: string): string {
  if (!UUID_RE.test(id)) throw new Error("Invalid id format");
  return join(tmpdir(), `${PREFIX}${id}.json`);
}

export async function saveData(id: string, data: ResumeData, templateId: TemplateId = "classic"): Promise<void> {
  const entry: PdfEntry = { data, templateId, expires: Date.now() + 30_000 };
  await writeFile(filePath(id), JSON.stringify(entry), "utf-8");
}

export async function getData(id: string): Promise<{ data: ResumeData; templateId: TemplateId } | null> {
  let fp: string;
  try {
    fp = filePath(id);
  } catch {
    return null;
  }

  try {
    const raw = await readFile(fp, "utf-8");
    const entry = JSON.parse(raw) as PdfEntry;
    await unlink(fp);

    if (Date.now() > entry.expires) return null;
    return { data: entry.data, templateId: entry.templateId };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      await unlink(fp).catch(() => {});
    }
    return null;
  }
}
