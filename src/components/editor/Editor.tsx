"use client";

import { useResumeStore } from "@/store/resume";

export default function Editor() {
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = data;

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
      <h1 className="text-xl font-bold">이력서 편집</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-zinc-500">인적사항</h2>
        <input
          type="text"
          placeholder="이름"
          value={personalInfo.name}
          onChange={(e) => updatePersonalInfo({ name: e.target.value })}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
        <input
          type="email"
          placeholder="이메일"
          value={personalInfo.email}
          onChange={(e) => updatePersonalInfo({ email: e.target.value })}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
        <input
          type="tel"
          placeholder="전화번호"
          value={personalInfo.phone}
          onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="주소 (선택)"
          value={personalInfo.address ?? ""}
          onChange={(e) => updatePersonalInfo({ address: e.target.value })}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
        <textarea
          placeholder="자기소개 (선택)"
          value={personalInfo.summary ?? ""}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          rows={3}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </section>
    </div>
  );
}
