export function isBlank(s) {
  return s == null || s.length === 0 || s.trim().length === 0;
}

export function compare(a, b) {
  if (a == null && b == null) {
    return 0;
  } else if (a == null) {
    return -1;
  } else if (b == null) {
    return 1;
  }

  return a.localeCompare(b);
}

export function compareIgnoreCase(a, b) {
  if (a == null && b == null) {
    return 0;
  } else if (a == null) {
    return -1;
  } else if (b == null) {
    return 1;
  }

  return a.localeCompare(b, 'en-US', {
    sensitivity: 'base'
  });
}
