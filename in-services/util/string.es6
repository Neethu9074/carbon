export function isBlank(s) {
  return s == null || s.length === 0 || s.trim().length === 0;
}

export function compare(a, b) {
  return a.localeCompare(b);
}

export function compareIgnoreCase(a, b) {
  return a.localeCompare(b, 'en-US', {
    sensitivity: 'base'
  });
}
