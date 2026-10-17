# Pretendard에는 이탤릭이 없어서 PDF용 합성 기울임(oblique) 서체를 만든다.
# 실행: uv run --with fonttools scripts/make-oblique.py
import math
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen

SKEW = 0.25  # Chrome 합성 이탤릭과 동일한 기울기 (≈14°)

def make(src: str, dst: str, style: str) -> None:
    font = TTFont(src)
    # pdfkit은 PostScript 이름으로 폰트를 중복 제거하므로 이름을 반드시 바꿔야 한다
    for rec in font["name"].names:
        if rec.nameID in (2, 17):
            rec.string = style
        elif rec.nameID in (3, 4, 6):
            rec.string = f"Pretendard-{style.replace(' ', '')}"
    glyph_set = font.getGlyphSet()
    glyf = font["glyf"]
    for name in font.getGlyphOrder():
        pen = TTGlyphPen(glyph_set)
        glyph_set[name].draw(TransformPen(pen, (1, 0, SKEW, 1, 0, 0)))
        glyf[name] = pen.glyph()
    font["post"].italicAngle = -math.degrees(math.atan(SKEW))
    font["OS/2"].fsSelection = (font["OS/2"].fsSelection | 1) & ~(1 << 6)  # ITALIC on, REGULAR off
    font["head"].macStyle |= 2  # Italic
    font.save(dst)
    print("wrote", dst)

make("public/fonts/Pretendard-Regular.ttf", "public/fonts/Pretendard-Italic.ttf", "Italic")
make("public/fonts/Pretendard-Bold.ttf", "public/fonts/Pretendard-BoldItalic.ttf", "Bold Italic")
