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

    if (isFixed(part)) {
      parsedResult.push({
        type: 'FIXED',
        name: part
      });
    } else if (isParameter(part)) {
      parsedResult.push({
        type: 'PARAMETER',
        name: part.slice(1, part.length - 1) // remove { and }
      });
    } else if (isMatchAll(part)) {
      parsedResult.push({
        type: 'MATCH_ALL'
      });
    } else {
      parsedResult.push({
        type: 'UNSUPPORTED',
        name: part
      });
    }
  }

  return parsedResult;
}

function isFixed(str) {
  return str.match(/^\w+$/i);
}

function isParameter(str) {
  return str.match(/^\{\w+\}$/i);
}

function isMatchAll(str) {
  return str === '*';
}

export function validate(parsedResult) {
  if (!parsedResult || parsedResult.length === 0) {
    return null;
  }

  return null;
}
