"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume";
import type { CustomFieldDefinition, CustomFieldType, CustomFieldValue, CustomSectionItem, Section } from "@/types/resume";
import { SortableList } from "../SortableList";

const INPUT =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

const FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  text: "텍스트",
  date: "날짜",
  link: "링크",
  descriptionList: "설명 리스트",
};

function DescriptionListInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  function addLine() {
    onChange([...value, ""]);
  }
  function updateLine(index: number, text: string) {
    const next = [...value];
    next[index] = text;
    onChange(next);
  }
  function removeLine(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }
  return (
    <div className="flex flex-col gap-1.5">
      {value.map((line, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="text-xs text-zinc-400">•</span>
          <input
            type="text"
            value={line}
            onChange={(e) => updateLine(i, e.target.value)}
            className={`${INPUT} flex-1`}
          />
          <button
            onClick={() => removeLine(i)}
            className="text-xs text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addLine}
        className="self-start text-xs text-zinc-500 hover:text-zinc-700"
      >
        + 항목 추가
      </button>
    </div>
  );
}

function FieldManager({
  fieldDefs,
  onUpdate,
}: {
  fieldDefs: CustomFieldDefinition[];
  onUpdate: (fields: CustomFieldDefinition[]) => void;
}) {
  function addField() {
    onUpdate([...fieldDefs, { id: crypto.randomUUID(), name: "", type: "text" }]);
  }
  function updateField(id: string, updates: Partial<CustomFieldDefinition>) {
    onUpdate(fieldDefs.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }
  function removeField(id: string) {
    if (fieldDefs.length <= 1) return;
    onUpdate(fieldDefs.filter((f) => f.id !== id));
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-3">
      <span className="text-xs font-medium text-zinc-500">필드 구성</span>
      {fieldDefs.map((field) => (
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
            className={`${INPUT} w-28`}
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
            disabled={fieldDefs.length <= 1}
            className="text-zinc-400 hover:text-red-500 disabled:invisible"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={addField}
        className="self-start text-xs text-zinc-500 hover:text-zinc-700"
      >
        + 필드 추가
      </button>
    </div>
  );
}

export default function CustomSectionEditor({ section }: { section: Section }) {
  const {
    data,
    addCustomSectionItem,
    updateCustomSectionItem,
    removeCustomSectionItem,
    reorderCustomSectionItems,
    updateCustomSectionSchema,
    toggleSectionVisibility,
  } = useResumeStore();

  const [showFieldManager, setShowFieldManager] = useState(false);

  const items = data.customSections[section.id] ?? [];
  const fieldDefs = section.fieldDefinitions ?? [];

  function getFieldValue(item: CustomSectionItem, fieldId: string): string | string[] {
    const field = item.fields.find((f) => f.fieldId === fieldId);
    return field?.value ?? "";
  }

  function setFieldValue(item: CustomSectionItem, fieldId: string, value: string | string[]) {
    const fields: CustomFieldValue[] = fieldDefs.map((def) => ({
      fieldId: def.id,
      value: def.id === fieldId ? value : getFieldValue(item, def.id),
    }));
    updateCustomSectionItem(section.id, item.id, fields);
  }

  function addItem() {
    if (!section.visible) {
      toggleSectionVisibility(section.id);
    }
    const newItem: CustomSectionItem = {
      id: crypto.randomUUID(),
      fields: fieldDefs.map((def) => ({
        fieldId: def.id,
        value: def.type === "descriptionList" ? [] : "",
      })),
    };
    addCustomSectionItem(section.id, newItem);
  }

  return (
    <div className="flex flex-col gap-4">
      <SortableList
        items={items}
        onReorder={(from, to) => reorderCustomSectionItems(section.id, from, to)}
      >
        {(item) => (
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4">
            {fieldDefs.map((def) => {
              const val = getFieldValue(item, def.id);
              switch (def.type) {
                case "text":
                  return (
                    <input
                      key={def.id}
                      type="text"
                      placeholder={def.name}
                      value={typeof val === "string" ? val : ""}
                      onChange={(e) => setFieldValue(item, def.id, e.target.value)}
                      className={INPUT}
                    />
                  );
                case "date":
                  return (
                    <div key={def.id} className="flex items-center gap-2">
                      <label className="text-xs text-zinc-500 shrink-0">{def.name}</label>
                      <input
                        type="month"
                        value={typeof val === "string" ? val : ""}
                        onChange={(e) => setFieldValue(item, def.id, e.target.value)}
                        className={`${INPUT} flex-1`}
                      />
                    </div>
                  );
                case "link":
                  return (
                    <input
                      key={def.id}
                      type="url"
                      placeholder={def.name}
                      value={typeof val === "string" ? val : ""}
                      onChange={(e) => setFieldValue(item, def.id, e.target.value)}
                      className={INPUT}
                    />
                  );
                case "descriptionList":
                  return (
                    <div key={def.id}>
                      <label className="mb-1 block text-xs text-zinc-500">{def.name}</label>
                      <DescriptionListInput
                        value={Array.isArray(val) ? val : []}
                        onChange={(v) => setFieldValue(item, def.id, v)}
                      />
                    </div>
                  );
              }
            })}
            <button
              onClick={() => removeCustomSectionItem(section.id, item.id)}
              className="self-end text-xs text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </div>
        )}
      </SortableList>

      <div className="flex gap-2">
        <button
          onClick={addItem}
          className="flex-1 rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
        >
          + 항목 추가
        </button>
        <button
          onClick={() => setShowFieldManager(!showFieldManager)}
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            showFieldManager
              ? "border-zinc-400 bg-zinc-100 text-zinc-700"
              : "border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600"
          }`}
          title="필드 구성 편집"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {showFieldManager && (
        <FieldManager
          fieldDefs={fieldDefs}
          onUpdate={(fields) => updateCustomSectionSchema(section.id, fields)}
        />
      )}
    </div>
  );
}
