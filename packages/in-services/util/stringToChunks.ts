/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export const PARAMETER: ParameterChunkType = 'p';
export const MESSAGE_CHUNK: MessageChunkType = 'm';

type ParameterChunkType = 'p';
type MessageChunkType = 'm';

interface Chunk {
  type: ParameterChunkType | MessageChunkType;
  value: string;
}

export function toChunks(message: string, matcher: string[]) {
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

function createChunks(message: string, matcher: string[]): Chunk[] {
  const chunks: Chunk[] = [];

  let indexOfNextMatcher: number = -1;
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

type Match = [number, string];

export function findNextMatcherIndex(message: string, matcher: string[]) {
  const matches: Match[] = [];
  for (let i = 0; i < matcher.length; i++) {
    const match = matcher[i];
    const indexOfNextParam = message.indexOf(match);
    if (indexOfNextParam >= 0) {
      matches[i] = [indexOfNextParam, match];
    }
  }
  matches.sort(sorter);
  return matches[0] ?? [-1, ''];
}

function sorter(matchA: Match, matchB: Match): number {
  return matchA[0] - matchB[0];
}

export function fillWithParams(chunks: Chunk[], params: any[]) {
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
