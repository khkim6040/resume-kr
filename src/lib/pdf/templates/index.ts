import type { TemplateId, ResumeData } from "@/types/resume";
import type { ComponentType } from "react";
import { ClassicDocument } from "./ClassicDocument";
import { ModernDocument } from "./ModernDocument";
import { MinimalDocument } from "./MinimalDocument";

export const PDF_TEMPLATES: Record<
  TemplateId,
  ComponentType<{ data: ResumeData }>
> = {
  classic: ClassicDocument,
  modern: ModernDocument,
  minimal: MinimalDocument,
};
