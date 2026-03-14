/** A4 용지 크기 (mm) */
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

/** mm → CSS px 변환 (96dpi 기준) */
export const MM_TO_PX = 96 / 25.4;

/** A4 크기 (CSS px, 96dpi) */
export const A4_WIDTH_PX = Math.ceil(A4_WIDTH_MM * MM_TO_PX);
export const A4_HEIGHT_PX = Math.ceil(A4_HEIGHT_MM * MM_TO_PX);
