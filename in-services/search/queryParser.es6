import Lexer from 'lex';

import ParsingError from 'in-services/search/ParsingError';

export function parse(query) {
  const result = [];
  let row = 1;

  const lexer = new Lexer((char) => {
    throw new ParsingError(`Unexpected character at row ${row}: ${char}`, row);
  });

  lexer.addRule(/\n/, function onMatch() {
    row++;
  });

  lexer.addRule(/([a-z0-9._\-]+) *(<=|>=|=|<|>|~) *"(((\\")|[^"])+)"/i, function onMatch(s, key, operator, value) {
    result.push({
      type: 'kv',
      key,
      operator,
      value,
      row
    });
  });

  lexer.addRule(/([a-z0-9._\-]+) *(<=|>=|=|<|>|~) *([^\s]+)/i, function onMatch(s, key, operator, value) {
    result.push({
      type: 'kv',
      key,
      operator,
      value,
      row
    });
  });

  lexer.addRule(/"(((\\")|[^"])+)"/, function onMatch(s, value) {
    result.push({
      type: 'freeText',
      text: value.trim()
    });
  });

  lexer.addRule(/([a-z0-9.\-_*~/]+)/i, function onMatch(s, value) {
    result.push({
      type: 'freeText',
      text: value.trim()
    });
  });

  lexer.addRule(/ */, function onMatch() {
    /* ignore excess whitespace */
  });

  lexer.input = query;

  lexer.lex();

  return result;
}
