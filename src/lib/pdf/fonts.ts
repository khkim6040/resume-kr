import { Font } from "@react-pdf/renderer";

const BASE = "/fonts";

let registered = false;

export function registerFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: "Pretendard",
    fonts: [
      { src: `${BASE}/Pretendard-Regular.ttf`, fontWeight: 400 },
      { src: `${BASE}/Pretendard-Medium.ttf`, fontWeight: 500 },
      { src: `${BASE}/Pretendard-SemiBold.ttf`, fontWeight: 600 },
      { src: `${BASE}/Pretendard-Bold.ttf`, fontWeight: 700 },
      // Pretendard에는 이탤릭이 없어 scripts/make-oblique.py로 합성한 기울임 서체
      { src: `${BASE}/Pretendard-Italic.ttf`, fontWeight: 400, fontStyle: "italic" },
      { src: `${BASE}/Pretendard-BoldItalic.ttf`, fontWeight: 700, fontStyle: "italic" },
    ],
  });

  // 한글 하이픈 방지
  Font.registerHyphenationCallback((word) => [word]);
}
