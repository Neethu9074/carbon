/* eslint-env mocha */

import createScale from 'in-charts/scale';
import { expect } from 'chai';

import { getAxisTickPositions } from './timeAxis';

describe('timeAxis', () => {
  let scale;

  beforeEach(() => {
    scale = createScale();
  });

  it('should create an empty result when the domain is not available', () => {
    scale.setRangeFrom(0);
    scale.setRangeTo(0);
    scale.setDomainFrom(0);
    scale.setDomainTo(0);

    const ticks = getAxisTickPositions(scale);
    expect(ticks).to.have.length(0);
  });

  it('should always contain the min and max domains', () => {
    let ticks = getAxisTickPositions(scale);
    expect(ticks.length).to.be.above(1);
    expect(ticks[0].range).to.equal(0);
    expect(ticks[ticks.length - 1].range).to.equal(1);
    expect(ticks[0].domain).to.equal(0);
    expect(ticks[ticks.length - 1].domain).to.equal(1);

    scale.setRangeFrom(-10);
    scale.setRangeTo(10);
    scale.setDomainFrom(2);
    scale.setDomainTo(-2);
    ticks = getAxisTickPositions(scale);
    expect(ticks.length).to.be.above(1);
    expect(ticks[0].range).to.equal(-10);
    expect(ticks[ticks.length - 1].range).to.equal(10);
    expect(ticks[0].domain).to.equal(2);
    expect(ticks[ticks.length - 1].domain).to.equal(-2);
  });
});
