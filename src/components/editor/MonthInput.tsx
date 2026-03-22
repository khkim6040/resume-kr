"use client";

import { useCallback, useMemo, useRef, type ChangeEvent } from "react";

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

export default function MonthInput({
  value,
  onChange,
  disabled,
  className = "",
  placeholder = "날짜 (2000.01)",
}: MonthInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = useMemo(() => toDisplay(value), [value]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const formatted = formatDigits(raw);
      const prevLen = displayValue.length;
      const nextLen = formatted.length;

      if (!formatted) {
        onChange("");
        return;
      }

      // Only emit stored value when we have a complete YYYY.MM
      if (formatted.length === 7) {
        onChange(toStored(formatted));
      } else {
        // Partial input — store as-is with dot conversion for consistency
        onChange(toStored(formatted));
      }

      // Fix cursor position after auto-inserting dot
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (!el) return;
        if (prevLen === 4 && nextLen === 6) {
          // Typed 5th digit, dot was inserted → cursor after the digit
          el.setSelectionRange(nextLen, nextLen);
        }
      });
    },
    [displayValue, onChange],
  );

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
      value={displayValue}
      onChange={handleChange}
      disabled={disabled}
      className={`${inputClass} ${disabledClass} ${className}`}
    />
  );
}
