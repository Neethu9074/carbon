/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';

import { lighten, rgbToHex, hexToRGBA, hexToRGB, hexToRGBNormalized } from 'in-services/formatters/color';

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

  describe('lighten', () => {
    it('should add transparency to a valid hex', () => {
      const actual = lighten('#000000', 0.5);
      const expected = '#7f7f7f';
      expect(actual).to.equal(expected);
    });

    it('should take the input as #000000 if invalid one provided by the user', () => {
      const actual = lighten('#hjg332', 0);
      const expected = '#ffffff';
      expect(actual).to.equal(expected);
    });
  });

  describe('hexToRGBA', () => {
    it('should convert a valid hex and opactiy', () => {
      const actual = hexToRGBA('#ffaa88', 0.2);
      const expected = 'rgba(255, 170, 136, 0.2)';
      expect(actual).to.equal(expected);
    });
  });
});
