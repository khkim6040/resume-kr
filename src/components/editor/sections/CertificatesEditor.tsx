"use client";

import { useResumeStore } from "@/store/resume";
import type { Certificate } from "@/types/resume";

const INPUT = "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function CertificatesEditor() {
  const { data, addCertificate, updateCertificate, removeCertificate } = useResumeStore();
  const items = data.certificates;

  function addItem() {
    const item: Certificate = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
    };
    addCertificate(item);
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
          <input
            type="text"
            placeholder="자격증명"
            value={item.name}
            onChange={(e) => updateCertificate(item.id, { name: e.target.value })}
            className={INPUT}
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="발급기관"
              value={item.issuer}
              onChange={(e) => updateCertificate(item.id, { issuer: e.target.value })}
              className={`${INPUT} flex-1`}
            />
            <input
              type="text"
              placeholder="취득일 (예: 2023.06)"
              value={item.date}
              onChange={(e) => updateCertificate(item.id, { date: e.target.value })}
              className={`${INPUT} flex-1`}
            />
          </div>
          <button
            onClick={() => removeCertificate(item.id)}
            className="self-end text-xs text-red-500 hover:text-red-700"
          >
            삭제
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
      >
        + 자격증 추가
      </button>
    </div>
  );
}
