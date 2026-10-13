/**
 * Ensures whatever the backend returns reads like a short, human aside --
 * never a paragraph. Takes the first sentence, hard-caps word count.
 */
export function toQuip(text, maxWords = 16) {
  if (!text) return "";
  const firstSentence = text.split(/(?<=[.!?])\s+/)[0] || text;
  const words = firstSentence.trim().split(/\s+/);
  if (words.length <= maxWords) return firstSentence.trim();
  return words.slice(0, maxWords).join(" ").replace(/[,;:]$/, "") + "…";
}
