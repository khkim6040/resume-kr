"use client";

import { useRef, useState } from "react";
import { useResumeStore } from "@/store/resume";

export default function ImportButton() {
  const setData = useResumeStore((s) => s.setData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const { importPdf } = await import("@/lib/pdf/importPdf");
      const data = await importPdf(file);
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "..." : "Import"}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-500 whitespace-pre-line">{error}</p>
      )}
    </div>
  );
}
