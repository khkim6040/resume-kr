export function sanitizeUrl(url: string): string | undefined {
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  // Support URLs without protocol (e.g., "github.com/user")
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch { /* invalid URL */ }
  return undefined;
}
