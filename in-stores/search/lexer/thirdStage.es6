let currentBlockId = 0;
export default function lexThirdStage(secondStageLexResult, startId) {
  currentBlockId = startId == undefined ? currentBlockId : startId;

  for (let i = 0, length = secondStageLexResult.length - 2; i < length; i++) {
    const currentToken = secondStageLexResult[i];
    const nextToken = secondStageLexResult[i + 1];
    if (currentToken.token === 'field' && nextToken.token === 'fieldSeparator') {
      let start = i + 2;
      const end = getEndCursorForFieldValue(start, secondStageLexResult);
      if (end >= start) {
        const blockId = String(currentBlockId++);
        while(start <= end) {
          secondStageLexResult[start++].blockId = blockId;
        }
        currentToken.blockId = blockId;
        currentToken.isBlockingStart = true;

        nextToken.blockId = blockId;

        secondStageLexResult[end].isBlockingEnd = true;

        i = end;
      }
    }
  }

  return secondStageLexResult;
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
  return -1;
}
