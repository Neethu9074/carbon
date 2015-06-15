/*eslint-env mocha*/
/*eslint-disable no-unused-vars, new-cap */

'use strict';

import {expect} from 'chai';

import {
  rgbToHex,
  hexToRGB,
  hexToRGBNormalized
  } from './colors';


describe('util.colors', () => {

  it('should return rgb as hex', () => {
    expect(rgbToHex(255, 0, 0)).to.equal('ff0000');
    expect(rgbToHex(0, 255, 0)).to.equal('00ff00');
    expect(rgbToHex(255, 0, 255)).to.equal('ff00ff');
    expect(rgbToHex(255, 0, 255)).to.equal('ff00ff');
    expect(rgbToHex(76, 204, 187)).to.equal('4cccbb');
  });

  it('should return hex as rgb', () => {
    let rgb = hexToRGB('#4cccbb');
    expect(rgb.r).to.equal(76);
  });

  it('should return hex as rgb between [0, 1]', () => {
    let rgb = hexToRGBNormalized('#4cccbb');
    expect(rgb.r).to.equal(76 / 255);
  });
});
