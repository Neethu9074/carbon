/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { expect } from 'chai';

import createScale, { ScaleType } from 'in-services/scale';
import getTickPositions from 'in-services/ticks/vertical';

describe('timeAxis', () => {
  let scale: ScaleType;

  beforeEach(() => {
    scale = createScale();
  });

  it('should create a single tick as an indicator when the domain is 0', () => {
    scale.setRangeFrom(0);
    scale.setRangeTo(0);
    scale.setDomainFrom(0);
    scale.setDomainTo(0);

    const ticks = getTickPositions({ scale });
    expect(ticks).to.have.length(1);
    expect(ticks[0].range).to.equal(0);
  });

  it('should always contain the min and max domains', () => {
    let ticks = getTickPositions({ scale });
    expect(ticks.length).to.be.above(1);
    expect(ticks[0].range).to.equal(0);
    expect(ticks[ticks.length - 1].range).to.equal(1);
    expect(ticks[0].domain).to.equal(0);
    expect(ticks[ticks.length - 1].domain).to.equal(1);

    scale.setRangeFrom(-10);
    scale.setRangeTo(10);
    scale.setDomainFrom(2);
    scale.setDomainTo(-2);
    ticks = getTickPositions({ scale });
    expect(ticks.length).to.be.above(1);
    expect(ticks[0].range).to.equal(-10);
    expect(ticks[ticks.length - 1].range).to.equal(10);
    expect(ticks[0].domain).to.equal(2);
    expect(ticks[ticks.length - 1].domain).to.equal(-2);
  });
});
