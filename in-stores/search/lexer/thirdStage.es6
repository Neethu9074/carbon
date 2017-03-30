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
  if (tokens.length >= 2 && tokens[1].token === 'whitespace' && (
      tokens[0].token === 'term' || tokens[0].token === 'regex'
    )) {
    const blockId = String(currentBlockId++);
    tokens[0].blockId = blockId;
    tokens[0].isBlockingStart = true;
    tokens[0].isBlockingEnd = true;
  }
}

function detectFieldFieldSeperatorValueBlocks(i, tokens) {
  const currentToken = tokens[i];
  const nextToken = tokens[i + 1];
  if (currentToken.token === 'field' && nextToken.token === 'fieldSeparator') {
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

  if (currentToken.token === 'whitespace') {
    const nextNextToken = tokens[i + 2];
    if (nextNextToken.token === 'whitespace' && (nextToken.token === 'term' || nextToken.token === 'regex')) {
      const blockId = String(currentBlockId++);
      nextToken.blockId = blockId;
      nextToken.isBlockingStart = true;
      nextToken.isBlockingEnd = true;
    }
  }
}

export function getEndCursorForFieldValue(start, tokens) {
  if (tokens[start].token === 'term') {
    return start;
  }
  if (tokens[start].token === 'grouping' && tokens[start].lexeme === '(') {
    let openingGroupings = 1;
    let groupingCursor = start + 1;

    while(groupingCursor < tokens.length) {
      if (tokens[groupingCursor].token === 'grouping') {
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
  if (tokens[start].token === 'phrase') {
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
