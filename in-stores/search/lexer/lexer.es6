import lexSecondStage from 'in-stores/search/lexer/secondStage';
import lexFirstStage from 'in-stores/search/lexer/firstStage';


export function lex(str) {
  return lexSecondStage(lexFirstStage(str));
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
