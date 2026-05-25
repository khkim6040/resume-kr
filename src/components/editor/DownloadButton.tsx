"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume";

export default function DownloadButton() {
  const data = useResumeStore((s) => s.data);
  const templateId = useResumeStore((s) => s.templateId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    setError(null);
    try {
      const { generatePdf } = await import("@/lib/pdf/generatePdf");
      await generatePdf(data, templateId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "..." : "Export"}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
