export function parse(str) {
  const parsedResult = [];

  if (!str) {
    return parsedResult;
  }

  const parts = str.split('/');
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) {
      continue;
    }
  }

  return parsedResult;
}

export function validate(parsedResult) {
  if (!parsedResult || parsedResult.length === 0) {
    return null;
  }

  return null;
}
