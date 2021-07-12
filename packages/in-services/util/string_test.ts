/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { isBlank, getAThroughZRepresentation } from 'in-services/util/string';

describe('in-services/util/string', () => {
  describe('isBlank', () => {
    it('must declare null as blank', () => {
      // @ts-ignore
      expect(isBlank(null)).toEqual(true);
    });

    it('must declare undefined as blank', () => {
      expect(isBlank(undefined)).toEqual(true);
    });

    it('must declare empty string as blank', () => {
      expect(isBlank('')).toEqual(true);
    });

    it('must declare string with only whitespace as blank', () => {
      expect(isBlank('   \n  \t')).toEqual(true);
    });

    it('must declare strings with content as not blank', () => {
      expect(isBlank('a fart')).toEqual(false);
    });
  });

  describe('getAThroughZRepresentation', () => {
    check(0, 'A');
    check(1, 'B');
    check(25, 'Z');
    check(26, 'AA');
    check(27, 'AB');
    check(52, 'BA');

    function check(given: number, expected: string) {
      it(`must convert ${given} to ${expected}`, () => {
        expect(getAThroughZRepresentation(given)).toEqual(expected);
      });
    }
  });
});
