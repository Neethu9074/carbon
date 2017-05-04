export function isBlank(s) {
  return s == null || s.length === 0 || s.trim().length === 0;
}

export const compare = new Intl.Collator('en-US').compare;
export const compareIgnoreCase = new Intl.Collator('en-US', { sensitivity: 'base' }).compare;
