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

export function shorten(s, maxLength = 64) {
  if (!s) {
    return s;
  }

  if (s.length <= maxLength) {
    return s;
  }
  return s.substring(0, maxLength) + '…';
}
