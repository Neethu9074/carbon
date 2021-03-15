/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';

import { rgbToHex, hexToRGB, hexToRGBNormalized } from 'in-services/formatters/color';

describe('in-services/formatters/color', () => {
  describe('formatColors', () => {
    it('should return rgb as hex', () => {
      expect(rgbToHex(255, 0, 0)).to.equal('#ff0000');
      expect(rgbToHex(0, 255, 0)).to.equal('#00ff00');
      expect(rgbToHex(255, 0, 255)).to.equal('#ff00ff');
      expect(rgbToHex(255, 0, 255)).to.equal('#ff00ff');
      expect(rgbToHex(76, 204, 187)).to.equal('#4cccbb');
    });

    it('should return hex as rgb', () => {
      const rgb = hexToRGB('#4cccbb');
      expect(rgb.r).to.equal(76);
    });

    it('should return hex as rgb between [0, 1]', () => {
      const rgb = hexToRGBNormalized('#4cccbb');
      expect(rgb.r).to.equal(76 / 255);
    });
  });
});
