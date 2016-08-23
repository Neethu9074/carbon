/* eslint-env mocha */

import {expect} from 'chai';

import {capitalize, parseLong, hashCode} from 'in-services/formatters/string';


describe('in-services.string', () => {
  describe('capitalize', () => {
    it('should return the string with the first letter being uppercase', () => {
      expect(capitalize('look at me!')).to.equal('Look at me!');
    });

    it('should not fail for falsy values', () => {
      expect(capitalize(null)).to.equal(null);
      expect(capitalize(undefined)).to.equal(undefined);
      expect(capitalize('')).to.equal('');
    });
  });

  describe('parseLong', () => {
    it('should parse large numbers to long like number type', () => {
      expect(parseLong('2678400000.456')).to.equal(2678400000);
    });
  });

  describe('hashCode', () => {
    it('should generate a hash code for a string', () => {
      expect(hashCode('foobar')).to.equal(-1268878963);
    });

    it('should generate the same hash code multiple times', () => {
      expect(hashCode('foobar')).to.equal(hashCode('foobar'));
    });

    it('should generate a hash code for an empty string', () => {
      expect(hashCode('')).to.equal(0);
    });

    it('should not fail for undefined and null', () => {
      expect(hashCode(undefined)).to.equal(0);
      expect(hashCode(null)).to.equal(0);
    });
  });
});
