let currentBlockId = 0;
export default function lexThirdStage(secondStageLexResult, startId) {
  currentBlockId = startId == undefined ? currentBlockId : startId;

  detectBeginningBlockWithWhitespace(secondStageLexResult);
  for (let i = 0, length = secondStageLexResult.length - 2; i < length; i++) {
    detectFieldFieldSeperatorValueBlocks(i, secondStageLexResult);
    detectLonelyBlocks(i, secondStageLexResult);
  }

  return secondStageLexResult;
}

function detectBeginningBlockWithWhitespace(tokens) {
  // edge case, there is just a term and a whitespace
  if (tokens.length >= 2 && isWhitespace(tokens[1]) && (isTerm(tokens[0]) || isRegex(tokens[0]))) {
    const blockId = String(currentBlockId++);
    tokens[0].blockId = blockId;
    tokens[0].isBlockingStart = true;
    tokens[0].isBlockingEnd = true;
  }
}

function detectFieldFieldSeperatorValueBlocks(i, tokens) {
  const currentToken = tokens[i];
  const nextToken = tokens[i + 1];
  if (isField(currentToken) && isFieldSeparator(nextToken)) {
    let start = i + 2;
    const end = getEndCursorForFieldValue(start, tokens);
    if (end >= start) {
      const blockId = String(currentBlockId++);
      while(start <= end) {
        tokens[start++].blockId = blockId;
      }
      currentToken.blockId = blockId;
      currentToken.isBlockingStart = true;

      nextToken.blockId = blockId;

      tokens[end].isBlockingEnd = true;

      i = end;
    }
  }
}

function detectLonelyBlocks(i, tokens) {
  const currentToken = tokens[i];
  const nextToken = tokens[i + 1];

  if (isWhitespace(currentToken)) {
    const nextNextToken = tokens[i + 2];
    if (isWhitespace(nextNextToken) && (isTerm(nextToken) || isRegex(nextToken))) {
      const blockId = String(currentBlockId++);
      nextToken.blockId = blockId;
      nextToken.isBlockingStart = true;
      nextToken.isBlockingEnd = true;
    }
  }
}

export function getEndCursorForFieldValue(start, tokens) {
  if (isTerm(tokens[start])) {
    return start;
  }
  if (isGrouping(tokens[start]) && tokens[start].lexeme === '(') {
    let openingGroupings = 1;
    let groupingCursor = start + 1;

    while(groupingCursor < tokens.length) {
      if (isGrouping(tokens[groupingCursor])) {
        if (openingGroupings === 1 && tokens[groupingCursor].lexeme === ')') {
          return groupingCursor;
        }
        if (tokens[groupingCursor].lexeme === '(') {
          openingGroupings++;
        } else if (tokens[groupingCursor].lexeme === ')') {
          openingGroupings--;
        }
      }

      groupingCursor++;
    }
  }
  if (isPhrase(tokens[start])) {
    const lexeme = tokens[start].lexeme;
    if (lexeme.length > 1 && lexeme.startsWith('"') && lexeme.endsWith('"')) {
      return start;
    }
  }
  if (tokens[start].token === 'regex') {
    return start;
  }
  return -1;
}

function isTerm(token) {
  return token.token === 'term';
}

function isField(token) {
  return token.token === 'field';
}

function isFieldSeparator(token) {
  return token.token === 'fieldSeparator';
}

function isPhrase(token) {
  return token.token === 'phrase';
}

function isGrouping(token) {
  return token.token === 'grouping';
}

function isWhitespace(token) {
  return token.token === 'whitespace';
}

function isRegex(token) {
  return token.token === 'regex';
}
