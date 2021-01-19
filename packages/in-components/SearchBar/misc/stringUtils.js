/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function getSubstringTillDotBackwards(str, cursor) {
  if (!str) {
    return '';
  }

  if (cursor) {
    str = str.substr(0, cursor);
  }

  const parts = str.split('.');
  if (parts.length > 0) {
    return parts[parts.length - 1];
  }
  return str;
}

export function getCursorTillNextDot(str, cursor) {
  if (!str) {
    return 0;
  }

  let currentCursor = cursor || 0;
  while (currentCursor < str.length) {
    if (str[currentCursor] === '.') {
      return currentCursor;
    }
    currentCursor++;
  }
  return currentCursor;
}

export function replaceWith(originalStr, from, to, replaceWith) {
  const startPart = originalStr.substr(0, from);
  const endPart = originalStr.substr(to);
  const replacedStartPart = `${startPart}${replaceWith}`;

  return {
    string: `${replacedStartPart}${endPart}`,
    cursorAfterInsertion: replacedStartPart.length
  };
}
