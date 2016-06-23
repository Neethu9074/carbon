import Lexer from 'lex';

import ParsingError from 'in-services/search/ParsingError';

export function parse(query) {
  const result = [];
  let row = 1;
  const freeTextFilters = [];

  const lexer = new Lexer((char) => {
    throw new ParsingError(row, char);
  });

  lexer.addRule(/\n/, function onMatch() {
    row++;
  });

  lexer.addRule(/([a-z0-9._\-]+) *= *"([^"]+)"/i, function onMatch(s, key, value) {
    result.push({
      type: 'kv',
      key: key,
      value: value,
      row
    });
  });

  lexer.addRule(/([a-z0-9._\-]+) *= *([^\s]+)/i, function onMatch(s, key, value) {
    result.push({
      type: 'kv',
      key: key,
      value: value,
      row
    });
  });

  lexer.addRule(/"([^"]+)"/, function onMatch(s, value) {
    freeTextFilters.push(value.trim());
  });

  lexer.addRule(/([a-z0-9.-_]+)/i, function onMatch(s, value) {
    freeTextFilters.push(value.trim());
  });

  lexer.addRule(/ */, function onMatch() {
    /* ignore excess whitespace */
  });

  lexer.input = query;

  lexer.lex();

  if (freeTextFilters.length !== 0) {
    result.push({
      type: 'freeText',
      text: freeTextFilters.join(' ')
    });
  }

  return result;
}
