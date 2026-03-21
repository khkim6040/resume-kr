import { useEffect, useRef, useState, useCallback } from "react";

const A4_HEIGHT_PX = 297 * 2.8; // 831.6px

export type FitLevel = 0 | 1 | 2 | 3;

export interface FitStyles {
  sectionGap: number;
  fontSize: number;
  headingSize: number;
  nameSize: number;
  itemGap: number;
  padding: number;
  headerMarginBottom: number;
  lineHeight: number;
}

const FIT_PRESETS: Record<FitLevel, FitStyles> = {
  0: { sectionGap: 20, fontSize: 14, headingSize: 16, nameSize: 24, itemGap: 16, padding: 40, headerMarginBottom: 24, lineHeight: 1.5 },
  1: { sectionGap: 14, fontSize: 13, headingSize: 15, nameSize: 22, itemGap: 12, padding: 36, headerMarginBottom: 18, lineHeight: 1.45 },
  2: { sectionGap: 10, fontSize: 12, headingSize: 14, nameSize: 20, itemGap: 8,  padding: 32, headerMarginBottom: 14, lineHeight: 1.4 },
  3: { sectionGap: 6,  fontSize: 11, headingSize: 13, nameSize: 18, itemGap: 6,  padding: 24, headerMarginBottom: 10, lineHeight: 1.35 },
};

export function useAutoFit(dataVersion: number) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [fitLevel, setFitLevel] = useState<FitLevel>(0);
  const lastDirectionRef = useRef<'up' | 'down' | null>(null);

  // Reset direction when dataVersion changes
  useEffect(() => {
    lastDirectionRef.current = null;
  }, [dataVersion]);

  const measure = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    const currentPadding = FIT_PRESETS[fitLevel].padding;
    const availableHeight = A4_HEIGHT_PX - currentPadding * 2;
    const contentHeight = el.scrollHeight;

    if (contentHeight > availableHeight && fitLevel < 3) {
      // Content overflows — increase fit level
      setFitLevel((prev) => Math.min(prev + 1, 3) as FitLevel);
      lastDirectionRef.current = 'up';
    } else if (fitLevel > 0 && lastDirectionRef.current !== 'up') {
      // Check if we can decrease fit level (content might fit with less shrinking)
      const prevLevel = (fitLevel - 1) as FitLevel;
      const prevPadding = FIT_PRESETS[prevLevel].padding;
      const prevAvailable = A4_HEIGHT_PX - prevPadding * 2;
      // Use a margin to prevent oscillation (content must be significantly smaller)
      if (contentHeight < prevAvailable * 0.92) {
        setFitLevel(prevLevel);
        lastDirectionRef.current = 'down';
      }
    }
  }, [fitLevel]);

  // Measure after render with RAF — no reset on dataVersion change
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      measure();
    });
    return () => cancelAnimationFrame(id);
  }, [fitLevel, dataVersion, measure]);

  return {
    contentRef,
    fitLevel,
    styles: FIT_PRESETS[fitLevel],
  };
}
