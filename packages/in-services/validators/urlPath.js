/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function build(parsedResult) {
  let result = '';
  if (!parsedResult || parsedResult.length === 0) {
    return result;
  }
  if (typeof parsedResult === 'string') {
    return parsedResult;
  }

  for (let i = 0; i < parsedResult.length; i++) {
    const parsedPart = parsedResult[i];
    if (parsedPart.type === 'FIXED') {
      result += `/${parsedPart.name}`;
    } else if (parsedPart.type === 'PARAMETER') {
      result += `/{${parsedPart.name}}`;
    } else if (parsedPart.type === 'MATCH_ALL') {
      result += `/*`;
    }
  }
  return result;
}

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

    if (isParameter(part)) {
      parsedResult.push({
        type: 'PARAMETER',
        name: part.slice(1, part.length - 1) // remove { and }
      });
    } else if (isMatchAll(part)) {
      parsedResult.push({
        type: 'MATCH_ALL'
      });
    } else if (isFixed(part)) {
      parsedResult.push({
        type: 'FIXED',
        name: part
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
  return str.match(/^[^/{*]+$/i);
}

function isParameter(str) {
  return str.match(/^\{.*\}$/i);
}

function isMatchAll(str) {
  return str === '*';
}

export function validate(parsedResult) {
  if (!parsedResult || parsedResult.length === 0) {
    return null;
  }

  const validationResult = [];
  for (let i = 0; i < parsedResult.length; i++) {
    const parsedPart = parsedResult[i];
    if (parsedPart.type === 'UNSUPPORTED') {
      validationResult.push({
        severity: 'error',
        message: `The given path is unsupported (${parsedPart.name})`
      });
    }
  }

  if (validationResult.length === 0) {
    return null;
  }
  return validationResult;
}
