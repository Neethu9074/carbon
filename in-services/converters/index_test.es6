/*eslint-env mocha*/

'use strict';

import {expect} from 'chai';
import * as converter from './index';

describe('converters', () => {
  describe('formatNumberShort', () => {
    it('should format numbers', () => {
      expect(converter.formatNumberShort(3200)).to.equal('3,200');
      expect(converter.formatNumberShort(3200.75)).to.equal('3,201');
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
      let rgb = converter.hexToRGB('#4cccbb');
      expect(rgb.r).to.equal(76);
    });

    it('should return hex as rgb between [0, 1]', () => {
      let rgb = converter.hexToRGBNormalized('#4cccbb');
      expect(rgb.r).to.equal(76 / 255);
    });
  });
});
