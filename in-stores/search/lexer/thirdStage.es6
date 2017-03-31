import {isTerm, isField, isFieldSeparator, isOperator, isPhrase, isGrouping,isWhitespace, isRegex} from 'in-stores/search/lexer';


let currentBlockId = 0;
export default function lexThirdStage(secondStageLexResult, startId) {
  currentBlockId = startId == undefined ? currentBlockId : startId;

  detectBeginningBlockWithWhitespace(secondStageLexResult);
  for (let i = 0, length = secondStageLexResult.length - 2; i < length; i++) {
    i = detectFieldFieldSeperatorValueBlocks(i, secondStageLexResult);
    detectLonelyBlocks(i, secondStageLexResult);
  }

  return secondStageLexResult;
}

function detectBeginningBlockWithWhitespace(tokens) {
  // edge case, there is just a term and a whitespace
  const currentToken = tokens[0];
  if (tokens.length >= 2 && isWhitespace(tokens[1]) && (isTerm(currentToken) || isRegex(currentToken) || isOperator(currentToken))) {
    const blockId = String(currentBlockId++);
    currentToken.blockId = blockId;
    currentToken.isBlockingStart = true;
    currentToken.isBlockingEnd = true;
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
  return i;
}

function detectLonelyBlocks(i, tokens) {
  const currentToken = tokens[i];
  const nextToken = tokens[i + 1];

  if (isWhitespace(currentToken)) {
    const nextNextToken = tokens[i + 2];
    if (isWhitespace(nextNextToken) && (isTerm(nextToken) || isRegex(nextToken) || isOperator(nextToken))) {
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
  if (isRegex(tokens[start])) {
    return start;
  }
  return -1;
}
