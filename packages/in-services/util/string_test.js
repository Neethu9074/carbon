/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import { expect } from 'chai';

import { isBlank, getAThroughZRepresentation } from 'in-services/util/string';

describe('in-services/util/string', () => {
  describe('isBlank', () => {
    it('must declare null as blank', () => {
      expect(isBlank(null)).to.equal(true);
    });

    it('must declare undefined as blank', () => {
      expect(isBlank(undefined)).to.equal(true);
    });

    it('must declare empty string as blank', () => {
      expect(isBlank('')).to.equal(true);
    });

    it('must declare string with only whitespace as blank', () => {
      expect(isBlank('   \n  \t')).to.equal(true);
    });

    it('must declare strings with content as not blank', () => {
      expect(isBlank('a fart')).to.equal(false);
    });
  });

  describe('getAThroughZRepresentation', () => {
    check(0, 'A');
    check(1, 'B');
    check(25, 'Z');
    check(26, 'AA');
    check(27, 'AB');
    check(52, 'BA');

    function check(given, expected) {
      it(`must convert ${given} to ${expected}`, () => {
        expect(getAThroughZRepresentation(given)).to.equal(expected);
      });
    }
  });
});
