/* eslint-env mocha */

import { expect } from 'chai';

import { capitalize, parseLong, hashCode, createFormatter } from 'in-services/formatters/string';

describe('in-services.string', () => {
  describe('capitalize', () => {
    it('must return the string with the first letter being uppercase', () => {
      expect(capitalize('look at me!')).to.equal('Look at me!');
    });

    it('must not fail for falsy values', () => {
      expect(capitalize(null)).to.equal(null);
      expect(capitalize(undefined)).to.equal(undefined);
      expect(capitalize('')).to.equal('');
    });
  });

  describe('parseLong', () => {
    it('must parse large numbers to long like number type', () => {
      expect(parseLong('2678400000.456')).to.equal(2678400000);
    });
  });

  describe('hashCode', () => {
    it('must generate a hash code for a string', () => {
      expect(hashCode('foobar')).to.equal(-1268878963);
    });

    it('must generate the same hash code multiple times', () => {
      expect(hashCode('foobar')).to.equal(hashCode('foobar'));
    });

    it('must generate a hash code for an empty string', () => {
      expect(hashCode('')).to.equal(0);
    });

    it('must not fail for undefined and null', () => {
      expect(hashCode(undefined)).to.equal(0);
      expect(hashCode(null)).to.equal(0);
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
