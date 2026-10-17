// null = 유효, string = 에러 메시지

export function validateEmail(v: string): string | null {
  if (v === "") return null;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(v) ? null : "올바른 이메일 형식이 아닙니다";
}

export function validatePhone(v: string): string | null {
  if (v === "") return null;
  const re = /^(0\d{1,2})-?\d{3,4}-?\d{4}$/;
  return re.test(v) ? null : "올바른 전화번호 형식이 아닙니다";
}

// 숫자만 남기고 한국 전화번호 형식(010-1234-5678, 02-123-4567)으로 하이픈 삽입
export function formatPhone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  const areaLen = d.startsWith("02") ? 2 : 3;
  if (d.length <= areaLen) return d;
  const rest = d.slice(areaLen);
  if (rest.length <= 4) return `${d.slice(0, areaLen)}-${rest}`;
  const midLen = rest.length === 8 ? 4 : 3;
  return `${d.slice(0, areaLen)}-${rest.slice(0, midLen)}-${rest.slice(midLen)}`;
}
