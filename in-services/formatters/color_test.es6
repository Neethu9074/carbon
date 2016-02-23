/* eslint-env mocha */
import {expect} from 'chai';

import * as converter from 'in-services/formatters/color';


describe('in-services/formatters/color', () => {
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
});
