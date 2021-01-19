/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import { getEndCursorForFieldValue } from 'in-stores/search/lexer/thirdStage';
import lexSecondStage from 'in-stores/search/lexer/secondStage';
import lexThirdStage from 'in-stores/search/lexer/thirdStage';
import lexFirstStage from 'in-stores/search/lexer/firstStage';

describe('in-stores/search/lexer/secondStage', () => {
  describe('getEndCursorForFieldValue', () => {
    expect(getEndCursorForFieldValue(0, [{ token: 'whitespace' }])).to.equal(-1);

    expect(getEndCursorForFieldValue(1, [{ token: 'whitespace' }, { token: 'term' }])).to.equal(1);

    expect(
      getEndCursorForFieldValue(0, [
        { token: 'grouping', lexeme: '(' },
        { token: 'term' },
        { token: 'whitespace' },
        { token: 'term' },
        { token: 'grouping', lexeme: ')' }
      ])
    ).to.equal(4);

    expect(
      getEndCursorForFieldValue(2, [
        { token: 'termn' },
        { token: 'whitespace' },
        { token: 'grouping', lexeme: '(' },
        { token: 'term' },
        { token: 'grouping', lexeme: ')' }
      ])
    ).to.equal(4);

    expect(
      getEndCursorForFieldValue(0, [
        { token: 'grouping', lexeme: '(' },
        { token: 'term' },
        { token: 'grouping', lexeme: '(' },
        { token: 'term' },
        { token: 'grouping', lexeme: ')' }
      ])
    ).to.equal(-1);

    expect(
      getEndCursorForFieldValue(0, [
        { token: 'grouping', lexeme: '(' },
        { token: 'term' },
        { token: 'grouping', lexeme: ')' },
        { token: 'term' },
        { token: 'grouping', lexeme: ')' }
      ])
    ).to.equal(2);
  });

  it('must parse terms', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('hello')), 0)).to.deep.equal([
      {
        token: 'term',
        lexeme: 'hello',
        start: 0,
        end: 5
      }
    ]);
  });

  it('must ignore fields missing value', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3 },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4 }
    ]);
  });

  it('must ignore values without a field', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage(':bar')), 0)).to.deep.equal([
      { token: 'fieldSeparator', lexeme: ':', start: 0, end: 1 },
      { token: 'term', lexeme: 'bar', start: 1, end: 4 }
    ]);
  });

  it('must ignore lonely fieldSeparators', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage(':')), 0)).to.deep.equal([
      { token: 'fieldSeparator', lexeme: ':', start: 0, end: 1 }
    ]);
  });

  it('must recognize block start when first char is an parenthesized', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('(ui-backend)')), 0)).to.deep.equal([
      { token: 'grouping', lexeme: '(', start: 0, end: 1 },
      {
        token: 'term',
        lexeme: 'ui-backend',
        start: 1,
        end: 11,
        blockId: '0',
        isBlockingStart: true,
        isBlockingEnd: true
      },
      { token: 'grouping', lexeme: ')', start: 11, end: 12 }
    ]);
  });

  it('must set field token for a valid field sequence, term - fieldSeperator - term)', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:bar')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3, blockId: '0', isBlockingStart: true },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4, blockId: '0' },
      { token: 'term', lexeme: 'bar', start: 4, end: 7, blockId: '0', isBlockingEnd: true }
    ]);

    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:money makes rich')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3, blockId: '0', isBlockingStart: true },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4, blockId: '0' },
      { token: 'term', lexeme: 'money', start: 4, end: 9, blockId: '0', isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 9, end: 10 },
      { token: 'term', lexeme: 'makes', start: 10, end: 15, blockId: '1', isBlockingStart: true, isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 15, end: 16 },
      { token: 'term', lexeme: 'rich', start: 16, end: 20, blockId: '2', isBlockingStart: true, isBlockingEnd: true }
    ]);
  });

  it('a set field token for a valid field sequence, term - fieldSeperator - phrase)', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:""')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3, blockId: '0', isBlockingStart: true },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4, blockId: '0' },
      { token: 'phrase', lexeme: '""', start: 4, end: 6, blockId: '0', isBlockingEnd: true }
    ]);

    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:"hokus pokus"')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3, blockId: '0', isBlockingStart: true },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4, blockId: '0' },
      { token: 'phrase', lexeme: '"hokus pokus"', start: 4, end: 17, blockId: '0', isBlockingEnd: true }
    ]);
  });

  it('a set field token for a valid field sequence, term - fieldSeperator - grouping)', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:()')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3, blockId: '0', isBlockingStart: true },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4, blockId: '0' },
      { token: 'grouping', lexeme: '(', start: 4, end: 5, blockId: '0' },
      { token: 'grouping', lexeme: ')', start: 5, end: 6, blockId: '0', isBlockingEnd: true }
    ]);

    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:(a AND b)')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3, blockId: '0', isBlockingStart: true },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4, blockId: '0' },
      { token: 'grouping', lexeme: '(', start: 4, end: 5, blockId: '0' },
      { token: 'term', lexeme: 'a', start: 5, end: 6, blockId: '0' },
      { token: 'whitespace', lexeme: ' ', start: 6, end: 7, blockId: '0' },
      { token: 'operator', lexeme: 'AND', start: 7, end: 10, blockId: '0' },
      { token: 'whitespace', lexeme: ' ', start: 10, end: 11, blockId: '0' },
      { token: 'term', lexeme: 'b', start: 11, end: 12, blockId: '0' },
      { token: 'grouping', lexeme: ')', start: 12, end: 13, blockId: '0', isBlockingEnd: true }
    ]);

    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:("bar")')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3, blockId: '0', isBlockingStart: true },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4, blockId: '0' },
      { token: 'grouping', lexeme: '(', start: 4, end: 5, blockId: '0' },
      { token: 'phrase', lexeme: '"bar"', start: 5, end: 10, blockId: '0' },
      { token: 'grouping', lexeme: ')', start: 10, end: 11, blockId: '0', isBlockingEnd: true }
    ]);

    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:(a AND (b))')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3, blockId: '0', isBlockingStart: true },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4, blockId: '0' },
      { token: 'grouping', lexeme: '(', start: 4, end: 5, blockId: '0' },
      { token: 'term', lexeme: 'a', start: 5, end: 6, blockId: '0' },
      { token: 'whitespace', lexeme: ' ', start: 6, end: 7, blockId: '0' },
      { token: 'operator', lexeme: 'AND', start: 7, end: 10, blockId: '0' },
      { token: 'whitespace', lexeme: ' ', start: 10, end: 11, blockId: '0' },
      { token: 'grouping', lexeme: '(', start: 11, end: 12, blockId: '0' },
      { token: 'term', lexeme: 'b', start: 12, end: 13, blockId: '0' },
      { token: 'grouping', lexeme: ')', start: 13, end: 14, blockId: '0' },
      { token: 'grouping', lexeme: ')', start: 14, end: 15, blockId: '0', isBlockingEnd: true }
    ]);
  });

  it('must search for closing phrase', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:"a b c"')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3, blockId: '0', isBlockingStart: true },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4, blockId: '0' },
      { token: 'phrase', lexeme: '"a b c"', start: 4, end: 11, blockId: '0', isBlockingEnd: true }
    ]);
  });

  it('must ignore invalid phrases', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:"a b c')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3 },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4 },
      { token: 'phrase', lexeme: '"a b c', start: 4, end: 10 }
    ]);
  });

  it('must take regex into account', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:/this is regex/')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3, blockId: '0', isBlockingStart: true },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4, blockId: '0' },
      { token: 'regex', lexeme: '/this is regex/', start: 4, end: 19, blockId: '0', isBlockingEnd: true }
    ]);
  });

  it('must detect lonely regex', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('/reg/ /ex/ ')), 0)).to.deep.equal([
      { token: 'regex', lexeme: '/reg/', start: 0, end: 5, blockId: '0', isBlockingStart: true, isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 5, end: 6 },
      { token: 'regex', lexeme: '/ex/', start: 6, end: 10, blockId: '1', isBlockingStart: true, isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 10, end: 11 }
    ]);
  });

  it('must detect lonely phrases', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('"" "foo bar" ')), 0)).to.deep.equal([
      { token: 'phrase', lexeme: '""', start: 0, end: 2, blockId: '0', isBlockingStart: true, isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 2, end: 3 },
      {
        token: 'phrase',
        lexeme: '"foo bar"',
        start: 3,
        end: 12,
        blockId: '1',
        isBlockingStart: true,
        isBlockingEnd: true
      },
      { token: 'whitespace', lexeme: ' ', start: 12, end: 13 }
    ]);
  });

  it('must detect multiple blocks', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('foo:(a) OR bar:(b)')), 0)).to.deep.equal([
      { token: 'field', lexeme: 'foo', start: 0, end: 3, blockId: '0', isBlockingStart: true },
      { token: 'fieldSeparator', lexeme: ':', start: 3, end: 4, blockId: '0' },
      { token: 'grouping', lexeme: '(', start: 4, end: 5, blockId: '0' },
      { token: 'term', lexeme: 'a', start: 5, end: 6, blockId: '0' },
      { token: 'grouping', lexeme: ')', start: 6, end: 7, blockId: '0', isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 7, end: 8 },
      { token: 'operator', lexeme: 'OR', start: 8, end: 10, blockId: '2', isBlockingStart: true, isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 10, end: 11 },
      { token: 'field', lexeme: 'bar', start: 11, end: 14, blockId: '1', isBlockingStart: true },
      { token: 'fieldSeparator', lexeme: ':', start: 14, end: 15, blockId: '1' },
      { token: 'grouping', lexeme: '(', start: 15, end: 16, blockId: '1' },
      { token: 'term', lexeme: 'b', start: 16, end: 17, blockId: '1' },
      { token: 'grouping', lexeme: ')', start: 17, end: 18, blockId: '1', isBlockingEnd: true }
    ]);
  });

  it('must also block terms if it is the first one', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('foobar ')), 0)).to.deep.equal([
      { token: 'term', lexeme: 'foobar', start: 0, end: 6, blockId: '0', isBlockingStart: true, isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 6, end: 7 }
    ]);

    expect(lexThirdStage(lexSecondStage(lexFirstStage(' foobar')), 0)).to.deep.equal([
      { token: 'whitespace', lexeme: ' ', start: 0, end: 1 },
      { token: 'term', lexeme: 'foobar', start: 1, end: 7, blockId: '0', isBlockingStart: true, isBlockingEnd: true }
    ]);

    expect(lexThirdStage(lexSecondStage(lexFirstStage(' foobar ')), 0)).to.deep.equal([
      { token: 'whitespace', lexeme: ' ', start: 0, end: 1 },
      { token: 'term', lexeme: 'foobar', start: 1, end: 7, blockId: '0', isBlockingStart: true, isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 7, end: 8 }
    ]);
  });

  it('must also block terms if it is the first one', () => {
    expect(lexThirdStage(lexSecondStage(lexFirstStage('AND a OR b ')), 0)).to.deep.equal([
      { token: 'operator', lexeme: 'AND', start: 0, end: 3, blockId: '0', isBlockingStart: true, isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 3, end: 4 },
      { token: 'term', lexeme: 'a', start: 4, end: 5, blockId: '1', isBlockingStart: true, isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 5, end: 6 },
      { token: 'operator', lexeme: 'OR', start: 6, end: 8, blockId: '2', isBlockingStart: true, isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 8, end: 9 },
      { token: 'term', lexeme: 'b', start: 9, end: 10, blockId: '3', isBlockingStart: true, isBlockingEnd: true },
      { token: 'whitespace', lexeme: ' ', start: 10, end: 11 }
    ]);
  });

  describe('required / prohibit operator', () => {
    it('must block required operator with the following block for fields', () => {
      expect(lexThirdStage(lexSecondStage(lexFirstStage('+foo:bar')), 0)).to.deep.equal([
        { token: 'operator', lexeme: '+', start: 0, end: 1, blockId: '0', isBlockingStart: true },
        { token: 'field', lexeme: 'foo', start: 1, end: 4, blockId: '0' },
        { token: 'fieldSeparator', lexeme: ':', start: 4, end: 5, blockId: '0' },
        { token: 'term', lexeme: 'bar', start: 5, end: 8, blockId: '0', isBlockingEnd: true }
      ]);
    });

    it('must not block required operator with the following operator block', () => {
      expect(lexThirdStage(lexSecondStage(lexFirstStage('+AND foo:bar')), 0)).to.deep.equal([
        { token: 'operator', lexeme: '+', start: 0, end: 1 },
        {
          token: 'operator',
          lexeme: 'AND',
          start: 1,
          end: 4,
          blockId: '1',
          isBlockingStart: true,
          isBlockingEnd: true
        },
        { token: 'whitespace', lexeme: ' ', start: 4, end: 5 },
        { token: 'field', lexeme: 'foo', start: 5, end: 8, blockId: '0', isBlockingStart: true },
        { token: 'fieldSeparator', lexeme: ':', start: 8, end: 9, blockId: '0' },
        { token: 'term', lexeme: 'bar', start: 9, end: 12, blockId: '0', isBlockingEnd: true }
      ]);
    });

    it('must block required operator with the following term', () => {
      expect(lexThirdStage(lexSecondStage(lexFirstStage('+foobar')), 0)).to.deep.equal([
        { token: 'operator', lexeme: '+', start: 0, end: 1, blockId: '0', isBlockingStart: true },
        { token: 'term', lexeme: 'foobar', start: 1, end: 7, blockId: '0', isBlockingEnd: true }
      ]);
    });
  });
});
