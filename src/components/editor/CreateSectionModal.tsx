"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume";
import type { CustomFieldDefinition, CustomFieldType } from "@/types/resume";

const INPUT =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

const FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  text: "텍스트",
  date: "날짜",
  link: "링크",
  descriptionList: "설명 리스트",
};

export default function CreateSectionModal({ onClose }: { onClose: () => void }) {
  const { addCustomSection } = useResumeStore();
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState<CustomFieldDefinition[]>([
    { id: crypto.randomUUID(), name: "", type: "text" },
  ]);

  function addField() {
    setFields([...fields, { id: crypto.randomUUID(), name: "", type: "text" }]);
  }

  function updateField(id: string, updates: Partial<CustomFieldDefinition>) {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }

  function removeField(id: string) {
    if (fields.length <= 1) return;
    setFields(fields.filter((f) => f.id !== id));
  }

  function handleSubmit() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    const validFields = fields.filter((f) => f.name.trim());
    if (validFields.length === 0) return;
    addCustomSection(trimmedTitle, validFields);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-zinc-800">새 섹션 만들기</h2>

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">섹션 이름</label>
            <input
              type="text"
              placeholder="예: 봉사활동, 출판물"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${INPUT} w-full`}
              autoFocus
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600">필드 구성</label>
            <div className="flex flex-col gap-2">
              {fields.map((field) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="필드 이름"
                    value={field.name}
                    onChange={(e) => updateField(field.id, { name: e.target.value })}
                    className={`${INPUT} flex-1`}
                  />
                  <select
                    value={field.type}
                    onChange={(e) => updateField(field.id, { type: e.target.value as CustomFieldType })}
                    className={`${INPUT} w-32`}
                  >
                    {(Object.entries(FIELD_TYPE_LABELS) as [CustomFieldType, string][]).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                  <button
                    onClick={() => removeField(field.id)}
                    disabled={fields.length <= 1}
                    className="text-zinc-400 hover:text-red-500 disabled:invisible"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addField}
              className="mt-2 text-sm text-zinc-500 hover:text-zinc-700"
            >
              + 필드 추가
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !fields.some((f) => f.name.trim())}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700 disabled:opacity-40"
          >
            만들기
          </button>
        </div>
      </div>
    </div>
  );
}
