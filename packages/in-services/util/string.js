export function isBlank(s) {
  return s == null || s.length === 0 || s.trim().length === 0;
}

export function isNotBlank(s) {
  return !isBlank(s);
}

export const compare = new Intl.Collator('en-US').compare;
export const compareIgnoreCase = new Intl.Collator('en-US', { sensitivity: 'base' }).compare;

export function containsIgnoreCase(s, search) {
  return s.toLowerCase().indexOf(search.toLowerCase()) !== -1;
}

export function toTitleCase(s) {
  if (s == null || typeof s !== 'string' || s.length < 2) {
    return s;
  }
  return s[0].toUpperCase() + s.substr(1).toLowerCase();
}

export function shorten(s, maxLength = 64) {
  if (!s) {
    return s;
  }
  if (s.length <= maxLength) {
    return s;
  }
  return s.substring(0, maxLength) + '…';
}

export function removeBlankLines(s) {
  if (!s) {
    return s;
  }

  return s
    .split('\n')
    .filter(isNotBlank)
    .join('\n');
}

const asciiAlphabetStart = 65;
export function getAThroughZRepresentation(n) {
  const character = String.fromCharCode(asciiAlphabetStart + (n % 26));

  const remainder = parseInt(n / 26, 10);
  const requiresMoreCharacters = remainder > 0;

  if (requiresMoreCharacters) {
    return getAThroughZRepresentation(remainder - 1) + character;
  }

  return character;
}
