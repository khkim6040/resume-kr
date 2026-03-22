"use client";

import { useState, useCallback, useMemo, useRef, useEffect, type ChangeEvent } from "react";

interface MonthInputProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

function toDisplay(stored: string): string {
  if (!stored) return "";
  return stored.replace("-", ".");
}

function toStored(display: string): string {
  if (!display) return "";
  return display.replace(".", "-");
}

function formatDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 4) return digits;
  let mm = digits.slice(4);
  if (mm.length === 2) {
    const n = Number(mm);
    if (n < 1) mm = "01";
    else if (n > 12) mm = "12";
  } else if (mm.length === 1 && Number(mm) > 1) {
    mm = "0" + mm;
  }
  return digits.slice(0, 4) + "." + mm;
}

function clampToMin(formatted: string, min: string | undefined): string {
  if (!min || formatted.length !== 7) return formatted;
  const minDisplay = toDisplay(min);
  if (minDisplay.length !== 7) return formatted;
  if (formatted < minDisplay) return minDisplay;
  return formatted;
}

export default function MonthInput({
  value,
  onChange,
  min,
  disabled,
  className = "",
  placeholder = "날짜 (2000.01)",
}: MonthInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(() => toDisplay(value));
  const [isFocused, setIsFocused] = useState(false);

  // Sync draft from external value changes when not focused
  useEffect(() => {
    if (!isFocused) {
      setDraft(toDisplay(value));
    }
  }, [value, isFocused]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const formatted = formatDigits(raw);
      const prevLen = draft.length;
      const nextLen = formatted.length;

      setDraft(formatted);

      // Emit to store only when complete YYYY.MM
      if (formatted.length === 7) {
        const clamped = clampToMin(formatted, min);
        onChange(toStored(clamped));
        if (clamped !== formatted) {
          setDraft(clamped);
        }
      } else if (!formatted) {
        onChange("");
      }

      // Fix cursor position after auto-inserting dot
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (!el) return;
        if (prevLen === 4 && nextLen === 6) {
          el.setSelectionRange(nextLen, nextLen);
        }
      });
    },
    [draft, min, onChange],
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // On blur, if incomplete input, revert to last valid value
    if (draft.length !== 7 && draft.length !== 0) {
      setDraft(toDisplay(value));
    } else if (draft.length === 7) {
      const clamped = clampToMin(draft, min);
      onChange(toStored(clamped));
      setDraft(clamped);
    }
  }, [draft, min, onChange, value]);

  const inputClass =
    "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";
  const disabledClass = disabled
    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
    : "";

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={7}
      placeholder={placeholder}
      value={draft}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      disabled={disabled}
      className={`${inputClass} ${disabledClass} ${className}`}
    />
  );
}
