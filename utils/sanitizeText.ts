export default function sanitizeText(str: string): string {
  return str
    .replace(/[^A-Za-z0-9+\- ]/g, '') // strip invalid chars
    .trim()
    .toLowerCase();
}
