"use client";

import { useResumeStore } from "@/store/resume";
import type { CustomFieldValue, CustomSectionItem, Section } from "@/types/resume";
import { SortableList } from "../SortableList";

const INPUT =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

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

export default function CustomSectionEditor({ section }: { section: Section }) {
  const {
    data,
    addCustomSectionItem,
    updateCustomSectionItem,
    removeCustomSectionItem,
    reorderCustomSectionItems,
    toggleSectionVisibility,
  } = useResumeStore();

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
      <button
        onClick={addItem}
        className="rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
      >
        + 항목 추가
      </button>
    </div>
  );
}
