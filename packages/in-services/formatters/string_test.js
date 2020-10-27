/* eslint-env mocha */

import { expect } from 'chai';

import { capitalize, createFormatter } from 'in-services/formatters/string';

describe('in-services.string', () => {
  describe('capitalize', () => {
    it('must return the string with the first letter being uppercase', () => {
      expect(capitalize('look at me!')).to.equal('Look at me!');
    });

    it('must return the the uppercase string with only the first letter being uppercase', () => {
      expect(capitalize('LOOK AT ME!')).to.equal('Look at me!');
    });

    it('must not fail for falsy values', () => {
      expect(capitalize(null)).to.equal(null);
      expect(capitalize(undefined)).to.equal(undefined);
      expect(capitalize('')).to.equal('');
    });
  });

  describe('createFormatter', () => {
    it('must replace without a prefix', () => {
      expect(createFormatter()('a {0} c', ['b'])).to.equal('a b c');
    });

    it('must not replace number for which no data is avaialble', () => {
      expect(createFormatter()('a {0} {1} {2} e', [undefined, 'c', undefined])).to.equal('a {0} c {2} e');
    });

    it('must replace with a prefix', () => {
      expect(createFormatter('alpha-')('a {alpha-0} c', ['b'])).to.equal('a b c');
    });

    it('must replace with a prefix and should not touch non prefixed vars', () => {
      expect(createFormatter('alpha-')('a {alpha-0} {0} d', ['b'])).to.equal('a b {0} d');
    });

    it('must replace with a prefix and suffix', () => {
      expect(createFormatter('alpha-', '-bet')('a {alpha-0-bet} {alpha-0} {0-bet} e', ['b'])).to.equal(
        'a b {alpha-0} {0-bet} e'
      );
    });
  });
});
