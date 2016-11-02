/* eslint-env mocha */
import {expect} from 'chai';

import {yesOrNo} from 'in-services/formatters/boolean';


describe('in-services/formatters/boolean', () => {
  describe('yesOrNo', () => {
    it('should return No for falsy values', () => {
      expect(yesOrNo(false)).to.equal('No');
      expect(yesOrNo(0)).to.equal('No');
      expect(yesOrNo(null)).to.equal('No');
      expect(yesOrNo(undefined)).to.equal('No');
      expect(yesOrNo('')).to.equal('No');
      expect(yesOrNo(1 < 0)).to.equal('No');
    });

    it('should return Yes for non-falsy values', () => {
      expect(yesOrNo(true)).to.equal('Yes');
      expect(yesOrNo(1)).to.equal('Yes');
      expect(yesOrNo({})).to.equal('Yes');
      expect(yesOrNo('foo')).to.equal('Yes');
      expect(yesOrNo(1 > 0)).to.equal('Yes');
    });
  });
});
