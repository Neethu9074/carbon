/* eslint-env mocha */

import { expect } from 'chai';

import toPx from './toPx';

describe('formatters.toPx', () => {
  it('should remove decimal places to avoid sub pixel rendering artifacts', () => {
    expect(toPx(42.876328990321231)).to.equal('42px');
  });

  it('should convert negative values to 0', () => {
    expect(toPx(-5)).to.equal('0px');
  });
});
