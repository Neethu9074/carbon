/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';

import lexSecondStage from 'in-stores/search/lexer/secondStage';
import lexFirstStage from 'in-stores/search/lexer/firstStage';

describe('in-stores/search/lexer/secondStage', () => {
  it('must parse ignore terms', () => {
    expect(lexSecondStage(lexFirstStage('hello'))).to.deep.equal([
      {
        token: 'term',
        lexeme: 'hello',
        start: 0,
        end: 5
      }
    ]);
  });

  it('must ignore fields missing value', () => {
    expect(lexSecondStage(lexFirstStage('foo:'))).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3 },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4 }
    ]);
  });

  it('must ignore values without a field', () => {
    expect(lexSecondStage(lexFirstStage(':bar'))).to.deep.equal([
      { token: 'fieldSeparator', lexeme: ':', start: 0, end: 1 },
      { token: 'term', lexeme: 'bar', start: 1, end: 4 }
    ]);
  });

  it('must ignore lonely fieldSeparators', () => {
    expect(lexSecondStage(lexFirstStage(':'))).to.deep.equal([
      { token: 'fieldSeparator', lexeme: ':', start: 0, end: 1 }
    ]);
  });

  it('a set field token for a valid field sequence, term - fieldSeperator - term)', () => {
    expect(lexSecondStage(lexFirstStage('foo:bar'))).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3 },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4 },
      { token: 'term', lexeme: 'bar', start: 4, end: 7 }
    ]);

    expect(lexSecondStage(lexFirstStage('foo:money makes rich'))).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3 },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4 },
      { token: 'term', lexeme: 'money', start: 4, end: 9 },
      { token: 'whitespace', lexeme: ' ', start: 9, end: 10 },
      { token: 'term', lexeme: 'makes', start: 10, end: 15 },
      { token: 'whitespace', lexeme: ' ', start: 15, end: 16 },
      { token: 'term', lexeme: 'rich', start: 16, end: 20 }
    ]);
  });

  it('a set field token for a valid field sequence, term - fieldSeperator - phrase)', () => {
    expect(lexSecondStage(lexFirstStage('foo:""'))).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3 },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4 },
      { token: 'phrase', lexeme: '""', start: 4, end: 6 }
    ]);

    expect(lexSecondStage(lexFirstStage('foo:"hokus pokus"'))).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3 },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4 },
      { token: 'phrase', lexeme: '"hokus pokus"', start: 4, end: 17 }
    ]);
  });

  it('a set field token for a valid field sequence, term - fieldSeperator - grouping)', () => {
    expect(lexSecondStage(lexFirstStage('foo:()'))).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3 },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4 },
      { token: 'grouping', lexeme: '(', start: 4, end: 5 },
      { token: 'grouping', lexeme: ')', start: 5, end: 6 }
    ]);

    expect(lexSecondStage(lexFirstStage('foo:(a AND b)'))).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3 },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4 },
      { token: 'grouping', lexeme: '(', start: 4, end: 5 },
      { token: 'term', lexeme: 'a', start: 5, end: 6 },
      { token: 'whitespace', lexeme: ' ', start: 6, end: 7 },
      { token: 'operator', lexeme: 'AND', start: 7, end: 10 },
      { token: 'whitespace', lexeme: ' ', start: 10, end: 11 },
      { token: 'term', lexeme: 'b', start: 11, end: 12 },
      { token: 'grouping', lexeme: ')', start: 12, end: 13 }
    ]);

    expect(lexSecondStage(lexFirstStage('foo:("bar")'))).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3 },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4 },
      { token: 'grouping', lexeme: '(', start: 4, end: 5 },
      { token: 'phrase', lexeme: '"bar"', start: 5, end: 10 },
      { token: 'grouping', lexeme: ')', start: 10, end: 11 }
    ]);
  });
});
