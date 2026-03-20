export function formatDate(
  date: string | undefined,
  isCurrent?: boolean,
): string {
  if (isCurrent) return "현재";
  if (!date) return "";
  return date.replace(/-/g, ".").slice(0, 7);
}
