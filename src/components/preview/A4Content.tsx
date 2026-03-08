"use client";

import type { FitStyles } from "@/hooks/useAutoFit";
import type { ResumeData, TemplateId } from "@/types/resume";
import type { RefObject } from "react";
import { TEMPLATES } from "./templates";

interface A4ContentProps {
  data: ResumeData;
  fs: FitStyles;
  contentRef: RefObject<HTMLDivElement | null>;
  templateId?: TemplateId;
}

export function A4Content({ data, fs, contentRef, templateId = "classic" }: A4ContentProps) {
  const { Component } = TEMPLATES[templateId];
  return <Component data={data} fs={fs} contentRef={contentRef} />;
}
