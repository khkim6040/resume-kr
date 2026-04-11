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
