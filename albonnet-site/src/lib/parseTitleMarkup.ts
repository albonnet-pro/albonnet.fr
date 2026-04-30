export type TitleSegment = {
  text: string;
  accent: boolean;
  underline: boolean;
};

/**
 * Parse a title string with simple markup:
 *   **text** → accent color + wavy underline
 *   *text*   → accent color only
 *
 * Plain text produces segments with accent: false, underline: false.
 * Falls back to plain text if no markers are found.
 *
 * Example:
 *   "Je conçois des **expériences web** qui marquent."
 *   → [ { text: "Je conçois des ", … }, { text: "expériences web", accent: true, underline: true }, … ]
 */
export function parseTitleMarkup(title: string): TitleSegment[] {
  const segments: TitleSegment[] = [];
  // Match **...** before *...* to avoid consuming the double asterisks as two singles
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(title)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: title.slice(lastIndex, match.index), accent: false, underline: false });
    }
    if (match[1] !== undefined) {
      segments.push({ text: match[1], accent: true, underline: true });
    } else if (match[2] !== undefined) {
      segments.push({ text: match[2], accent: true, underline: false });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < title.length) {
    segments.push({ text: title.slice(lastIndex), accent: false, underline: false });
  }

  return segments.length > 0
    ? segments
    : [{ text: title, accent: false, underline: false }];
}