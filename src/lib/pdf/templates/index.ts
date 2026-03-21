import type { TemplateId, ResumeData } from "@/types/resume";
import type { ComponentType } from "react";
import { ClassicDocument } from "./ClassicDocument";

export const PDF_TEMPLATES: Record<
  TemplateId,
  ComponentType<{ data: ResumeData }>
> = {
  classic: ClassicDocument,
};
