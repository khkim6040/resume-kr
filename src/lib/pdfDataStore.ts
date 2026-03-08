import type { ResumeData } from "@/types/resume";

const store = new Map<string, { data: ResumeData; expires: number }>();

export function saveData(id: string, data: ResumeData): void {
  store.set(id, { data, expires: Date.now() + 30_000 });
}

export function getData(id: string): ResumeData | null {
  const entry = store.get(id);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(id);
    return null;
  }
  store.delete(id); // 1회 조회 후 삭제
  return entry.data;
}
