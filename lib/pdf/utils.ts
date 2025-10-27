/**
 * Sanitize text to remove characters that might cause font encoding issues
 * Replaces unsupported Unicode characters with safe alternatives
 */
export function sanitizeText(text: string): string {
  if (!text) return "";

  return (
    text
      // Replace middle dot with hyphen
      .replace(/·/g, "-")
      // Replace em dash with regular dash
      .replace(/—/g, "-")
      // Replace en dash with regular dash
      .replace(/–/g, "-")
      // Replace smart quotes with regular quotes
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      // Replace ellipsis
      .replace(/…/g, "...")
      // Remove emojis and other problematic Unicode characters
      .replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, "") // Misc Symbols and Pictographs
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // Transport and Map
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "") // Flags
      .replace(/[\u{2600}-\u{26FF}]/gu, "") // Misc symbols
      .replace(/[\u{2700}-\u{27BF}]/gu, "") // Dingbats
      // Remove non-printable characters except newlines and tabs
      .replace(/[^\x20-\x7E\n\t\u00A0-\u00FF\u0100-\u017F]/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Sanitize an array of strings
 */
export function sanitizeArray(arr: string[]): string[] {
  return arr.map(sanitizeText);
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  const sanitized = sanitizeText(text);
  if (sanitized.length <= maxLength) return sanitized;
  return sanitized.slice(0, maxLength - 3) + "...";
}
