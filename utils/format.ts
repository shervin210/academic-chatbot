export function formatForDisplay(text: string): string {
  return text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{4E00}-\u{9FFF}\u{AC00}-\u{D7AF}]/gu, '???')
    .replace(/\*\*(.*?)\*\*/g, '<br><strong>$1</strong><br>')
    .replace(/\n?\*\s+(.*?)(?=\n|$)/g, '<br>• $1')
    .replace(/\n?(\d+\.\s.*?)(?=\n|$)/g, '<br>$1')
    .replace(/\n{2,}/g, '<br><br>')
    .replace(/:\s*(?=\S)/g, ': ')
    .replace(/^<br>/, '')
    .trim();
}