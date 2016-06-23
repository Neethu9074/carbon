import Lexer from 'lex';

export function parse(query) {
  const result = [];
  let row = 0;
  let col = 0;
  const freeTextFilters = [];

  const lexer = new Lexer((char) => {
    throw new Error(`Unexpected character at row ${row}, col ${col}: ${char}`);
  });

  lexer.addRule(/\n/, function onMatch() {
    row++;
    col = 1;
  });

  lexer.addRule(/./, function onMatch() {
    this.reject = true;
    col++;
  });

  lexer.addRule(/([a-z0-9._\-]+) *= *"([^"]+)"/i, function onMatch(s, key, value) {
    result.push({
      type: 'kv',
      key: key,
      value: value
    });
  });

  lexer.addRule(/([a-z0-9._\-]+) *= *([^\s]+)/i, function onMatch(s, key, value) {
    result.push({
      type: 'kv',
      key: key,
      value: value
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
