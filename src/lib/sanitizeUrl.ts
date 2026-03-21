export function sanitizeUrl(url: string): string | undefined {
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch { /* invalid URL */ }
  return undefined;
}
