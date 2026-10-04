/**
 * Helper utility for fellowship registration PIN format: sent 1, sent 2, sent 3, ...
 * Handles both number and word equivalents (e.g. 'sent one' -> 1).
 */

const WORDS_TO_NUM: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
};

const NUM_TO_WORDS: Record<number, string> = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
};

export const getPinNumber = (id: string): number | null => {
  if (!id) return null;
  const numMatch = id.match(/^(?:sent[-\s]?|MAN-\d{4}-)(\d+)$/i);
  if (numMatch) return parseInt(numMatch[1], 10);
  const wordMatch = id.match(/^sent\s+([a-z]+)$/i);
  if (wordMatch && WORDS_TO_NUM[wordMatch[1].toLowerCase()]) {
    return WORDS_TO_NUM[wordMatch[1].toLowerCase()];
  }
  return null;
};

export const formatPinDisplay = (id: string): string => {
  if (!id) return '';
  const num = getPinNumber(id);
  if (num !== null) {
    return `sent ${num}`;
  }
  return id;
};

export const matchesPinSearch = (id: string, searchTerm: string): boolean => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return true;
  const idLower = (id || '').toLowerCase();
  if (idLower.includes(term)) return true;

  const num = getPinNumber(id);
  if (num !== null) {
    if (term === String(num) || term === `sent ${num}` || term === `sent-${num}`) return true;
    const word = NUM_TO_WORDS[num];
    if (word && (term === word || term === `sent ${word}`)) return true;
  }
  return false;
};
