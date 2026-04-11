"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { safeGetItem, safeSetItem } from "@/lib/safeStorage";

const STORAGE_KEY = "sidebar-width";
const DEFAULT_WIDTH = 420;
const MIN_WIDTH = 300;
const STATIC_MAX = 800;

export function useResizable() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const widthRef = useRef(width);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const maxWidthRef = useRef(STATIC_MAX);

  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  useEffect(() => {
    const update = () => {
      maxWidthRef.current = Math.max(MIN_WIDTH, Math.min(STATIC_MAX, Math.floor(window.innerWidth * 0.5)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // localStorage에서 저장된 너비 복원 (hydration 이후)
  useEffect(() => {
    const stored = safeGetItem(STORAGE_KEY);
    if (stored) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= STATIC_MAX) {
        setWidth(Math.min(parsed, maxWidthRef.current));
      }
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = widthRef.current;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleDoubleClick = useCallback(() => {
    setWidth(DEFAULT_WIDTH);
    safeSetItem(STORAGE_KEY, String(DEFAULT_WIDTH));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - startX.current;
      const newWidth = Math.min(
        maxWidthRef.current,
        Math.max(MIN_WIDTH, startWidth.current + delta)
      );
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      safeSetItem(STORAGE_KEY, String(widthRef.current));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const requestWidth = useCallback((desired: number) => {
    const clamped = Math.min(maxWidthRef.current, Math.max(MIN_WIDTH, desired));
    if (clamped > widthRef.current) {
      setWidth(clamped);
      safeSetItem(STORAGE_KEY, String(clamped));
    }
  }, []);

  return { width, handleMouseDown, handleDoubleClick, requestWidth };
}
