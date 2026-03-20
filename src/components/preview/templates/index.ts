export { ClassicTemplate } from "./ClassicTemplate";
export type { TemplateProps } from "./ClassicTemplate";

import type { TemplateId } from "@/types/resume";
import type { ComponentType } from "react";
import type { TemplateProps } from "./ClassicTemplate";
import { ClassicTemplate } from "./ClassicTemplate";

export const TEMPLATES: Record<TemplateId, { name: string; description: string; Component: ComponentType<TemplateProps> }> = {
  classic: { name: "클래식", description: "전통적인 이력서 스타일", Component: ClassicTemplate },
};
