import {
  isTerm,
  isField,
  isFieldSeparator,
  isOperator,
  isPhrase,
  isGrouping,
  isWhitespace,
  isRegex,
  isProhibitOrRequiredOperator
} from 'in-stores/search/lexer';

let currentBlockId = 0;
export default function lexThirdStage(secondStageLexResult, startId) {
  currentBlockId = startId == undefined ? currentBlockId : startId;

  detectBeginningBlockWithWhitespace(secondStageLexResult);
  detectFieldFieldSeperatorValueBlocks(secondStageLexResult);
  detectLonelyBlocks(secondStageLexResult);
  mergeRequiredAndProhibitOperatorWithFollowingBlock(secondStageLexResult);

  return secondStageLexResult;
}

function detectBeginningBlockWithWhitespace(tokens) {
  // edge case, there is just a term and a whitespace
  const currentToken = tokens[0];
  if (
    tokens.length >= 2 &&
    isWhitespace(tokens[1]) &&
    (isTerm(currentToken) || isRegex(currentToken) || isPhrase(currentToken) || isOperator(currentToken))
  ) {
    const blockId = String(currentBlockId++);
    currentToken.blockId = blockId;
    currentToken.isBlockingStart = true;
    currentToken.isBlockingEnd = true;
  }
}

function detectFieldFieldSeperatorValueBlocks(tokens) {
  for (let i = 0, length = tokens.length - 2; i < length; i++) {
    const currentToken = tokens[i];
    const nextToken = tokens[i + 1];
    if (isField(currentToken) && isFieldSeparator(nextToken)) {
      let start = i + 2;
      const end = getEndCursorForFieldValue(start, tokens);
      if (end >= start) {
        const blockId = String(currentBlockId++);
        while (start <= end) {
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
}

function detectLonelyBlocks(tokens) {
  for (let i = 0, length = tokens.length - 1; i < length; i++) {
    const currentToken = tokens[i];
    const nextToken = tokens[i + 1];

    if (isWhitespace(currentToken) || isProhibitOrRequiredOperator(currentToken)) {
      const nextNextToken = tokens[i + 2];
      if (
        (nextNextToken == null || isWhitespace(nextNextToken)) &&
        (isTerm(nextToken) || isRegex(nextToken) || isPhrase(nextToken) || isOperator(nextToken)) &&
        nextToken.blockId == null
      ) {
        const blockId = String(currentBlockId++);
        nextToken.blockId = blockId;
        nextToken.isBlockingStart = true;
        nextToken.isBlockingEnd = true;
      }
    }
  }
}

function mergeRequiredAndProhibitOperatorWithFollowingBlock(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];
    if (isProhibitOrRequiredOperator(token) && nextToken && !isOperator(nextToken) && nextToken.isBlockingStart) {
      token.isBlockingStart = true;
      token.blockId = nextToken.blockId;
      delete nextToken.isBlockingStart;
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

    while (groupingCursor < tokens.length) {
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
    if (lexeme.length > 1 && lexeme[0] === '"' && lexeme[lexeme.length - 1] === '"') {
      return start;
    }
  }
  if (isRegex(tokens[start])) {
    return start;
  }
  return -1;
}
