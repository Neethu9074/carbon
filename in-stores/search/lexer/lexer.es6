import lexSecondStage from 'in-stores/search/lexer/secondStage';
import lexThirdStage from 'in-stores/search/lexer/thirdStage';
import lexFirstStage from 'in-stores/search/lexer/firstStage';

export function lex(str) {
  return lexThirdStage(lexSecondStage(lexFirstStage(str)));
}

export function getTokenForColumn(tokens, pos) {
  if (tokens.length === 0) {
    return {
      start: 0,
      end: 0,
      lexeme: '',
      token: 'term'
    };
  }
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (pos >= token.start && pos < token.end) {
      return token;
    }
  }
  return null;
}

export function isTerm(token) {
  return token.token === 'term';
}

export function isField(token) {
  return token.token === 'field';
}

export function isFieldSeparator(token) {
  return token.token === 'fieldSeparator';
}

export function isOperator(token) {
  return token.token === 'operator';
}

export function isPhrase(token) {
  return token.token === 'phrase';
}

export function isGrouping(token) {
  return token.token === 'grouping';
}

export function isWhitespace(token) {
  return token.token === 'whitespace';
}

export function isRegex(token) {
  return token.token === 'regex';
}
