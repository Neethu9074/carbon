/* eslint-env mocha */
import {expect} from 'chai';

import * as converter from './converter';


describe('converters', () => {
  describe('formatNumberShort', () => {
    it('should format numbers', () => {
      expect(converter.formatNumberShort(3200)).to.equal('3,200');
      expect(converter.formatNumberShort(3200.75)).to.equal('3,201');
    });
  });

  describe('formatNumberSI', () => {
    it('should format numbers', () => {
      expect(converter.formatNumberSI(3200)).to.equal('3.2k');
      expect(converter.formatNumberSI(0.0002)).to.equal('200µ');
      expect(converter.formatNumberSI(314475603)).to.equal('314.48M');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes', () => {
      expect(converter.formatBytes(1024)).to.equal('1 kB');
    });

    it('should fail on invalid numbers', () => {
      expect(() => converter.formatBytes(null)).to.throw(Error);
      expect(() => converter.formatBytes(NaN)).to.throw(Error);
      expect(() => converter.formatBytes('')).to.throw(Error);
    });
  });

  describe('formatPercentageShort', () => {
    it('should format percentages', () => {
      expect(converter.formatPercentageShort(0)).to.equal('0%');
      expect(converter.formatPercentageShort(1)).to.equal('100%');
      expect(converter.formatPercentageShort(0.7854)).to.equal('79%');
    });
  });

  describe('formatColors', () => {
    it('should return rgb as hex', () => {
      expect(converter.rgbToHex(255, 0, 0)).to.equal('ff0000');
      expect(converter.rgbToHex(0, 255, 0)).to.equal('00ff00');
      expect(converter.rgbToHex(255, 0, 255)).to.equal('ff00ff');
      expect(converter.rgbToHex(255, 0, 255)).to.equal('ff00ff');
      expect(converter.rgbToHex(76, 204, 187)).to.equal('4cccbb');
    });

    it('should return hex as rgb', () => {
      const rgb = converter.hexToRGB('#4cccbb');
      expect(rgb.r).to.equal(76);
    });

    it('should return hex as rgb between [0, 1]', () => {
      const rgb = converter.hexToRGBNormalized('#4cccbb');
      expect(rgb.r).to.equal(76 / 255);
    });
  });

  describe('capitalize', () => {
    it('should return the string with the first letter being uppercase', () => {
      expect(converter.capitalize('look at me!')).to.equal('Look at me!');
    });

    it('should not fail for falsy values', () => {
      expect(converter.capitalize(null)).to.equal(null);
      expect(converter.capitalize(undefined)).to.equal(undefined);
      expect(converter.capitalize('')).to.equal('');
    });
  });

});
