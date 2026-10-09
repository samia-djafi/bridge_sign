export function normalizeText(text: string): string {
  if (!text) return '';

  let normalized = text.toLowerCase().trim();

  // Remove French/Latin diacritics
  normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Normalize Arabic characters
  normalized = normalized
    // Remove Arabic diacritics / tashkeel: fatha, damma, kasra, sukun, shadda, tanween
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Alef variants to bare Alef (ا)
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Taa Marbuta (ة) to Haa (ه)
    .replace(/ة/g, 'ه')
    // Normalize Alif Maqsura (ى) to Yaa (ي)
    .replace(/ى/g, 'ي')
    // Tatweel / Kashida
    .replace(/\u0640/g, '');

  // Replace punctuation and symbols with space (including Arabic punctuation: ؟ ، ؛)
  normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»،؟؛…—–\[\]\\<>]/g, ' ');

  // Collapse multiple whitespaces
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

export function tokenize(text: string): string[] {
  const norm = normalizeText(text);
  return norm.length > 0 ? norm.split(' ') : [];
}
