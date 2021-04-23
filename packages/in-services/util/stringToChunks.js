/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export const PARAMETER = 'p';
export const MESSAGE_CHUNK = 'm';

export function toChunks(message, matcher) {
  if (!message) {
    return [];
  }
  if (!matcher || matcher.length === 0) {
    return [{ type: MESSAGE_CHUNK, value: message }];
  }

  return (
    createChunks(message, matcher)
      // remove empty chunks
      .filter(({ value }) => value)
  );
}

function createChunks(message, matcher) {
  const chunks = [];

  let indexOfNextMatcher = -1;
  do {
    const [_indexOfNextMatcher, match] = findNextMatcherIndex(message, matcher);
    indexOfNextMatcher = _indexOfNextMatcher;

    if (indexOfNextMatcher === -1) {
      chunks.push({ type: MESSAGE_CHUNK, value: message });
      return chunks;
    }
    chunks.push({ type: MESSAGE_CHUNK, value: message.substring(0, indexOfNextMatcher) });
    chunks.push({ type: PARAMETER, value: match });
    message = message.substring(indexOfNextMatcher + match.length);
  } while (indexOfNextMatcher >= 0);

  if (message) {
    chunks.push({ type: MESSAGE_CHUNK, value: message });
  }
  return chunks;
}

export function findNextMatcherIndex(message, matcher) {
  const matches = [];
  for (let i = 0; i < matcher.length; i++) {
    const match = matcher[i];
    const indexOfNextParam = message.indexOf(match);
    if (indexOfNextParam >= 0) {
      matches[i] = [indexOfNextParam, match];
    }
  }
  matches.sort(([i1], [i2]) => i1 - i2);
  return matches[0] ?? [-1, ''];
}

export function fillWithParams(chunks, params) {
  let paramIndex = 0;
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (chunk.type === PARAMETER) {
      const nextParam = params[paramIndex++];
      if (nextParam) {
        chunk.value = nextParam;
      } else {
        break;
      }
    }
  }
  return chunks;
}
