/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getFuzzyMatchingRegex } from 'in-components/AnalyzeView/fuzzyMatch';

describe('packages/in-components/AnalyzeView/fuzzyMatch.ts', () => {
  it('should return a RegEx where every letter of the input is interleaved with a wildcard', () => {
    // GIVEN
    const input = 'test search string';
    const expectedResult = /t.*e.*s.*t.* .*s.*e.*a.*r.*c.*h.* .*s.*t.*r.*i.*n.*g/i;

    // WHEN
    const result = getFuzzyMatchingRegex(input);

    // THEN
    expect(result).toStrictEqual(expectedResult);
  });

  it('should fuzzy match multiple inputs as long as the order of letters is correct', () => {
    // GIVEN
    const needle = 'eh ng';
    const haystack = ['search string', 'some other string', 'completely different'];
    const expectedResults = ['search string', 'some other string'];

    // WHEN
    const fuzzyMatchingRegex = getFuzzyMatchingRegex(needle);
    const results = haystack.filter(element => fuzzyMatchingRegex.test(element));

    // THEN
    expect(results).toStrictEqual(expectedResults);
  });
});
