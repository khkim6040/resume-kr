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
    ],
  });

  // 한글 하이픈 방지
  Font.registerHyphenationCallback((word) => [word]);
}
