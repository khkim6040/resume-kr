export { ClassicTemplate } from "./ClassicTemplate";
export type { TemplateProps } from "./ClassicTemplate";
export { ModernTemplate } from "./ModernTemplate";
export { MinimalTemplate } from "./MinimalTemplate";

import type { TemplateId } from "@/types/resume";
import type { ComponentType } from "react";
import type { TemplateProps } from "./ClassicTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { MinimalTemplate } from "./MinimalTemplate";

export const TEMPLATES: Record<TemplateId, { name: string; description: string; Component: ComponentType<TemplateProps> }> = {
  classic: { name: "클래식", description: "전통적인 이력서 스타일", Component: ClassicTemplate },
  modern: { name: "모던", description: "세련된 액센트 컬러", Component: ModernTemplate },
  minimal: { name: "미니멀", description: "깔끔하고 여백 있는", Component: MinimalTemplate },
};
