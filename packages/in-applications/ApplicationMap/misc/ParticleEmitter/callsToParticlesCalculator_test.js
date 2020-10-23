/* eslint-env mocha */
import { expect } from 'chai';

import calc from 'in-applications/ApplicationMap/misc/ParticleEmitter/callsToParticlesCalculator';

describe('callsToParticlesCalculator', () => {
  it('should never return a negative value', () => {
    expect(calc(-Number.MAX_VALUE)).to.not.be.below(0);
    expect(calc(0)).to.not.be.below(0);
    expect(calc(0.000001)).to.not.be.below(0);
    expect(calc(1)).to.not.be.below(0);
    expect(calc(Number.MAX_VALUE)).to.not.be.below(0);
    expect(calc(Number.MAX_VALUE)).to.be.above(0);
    expect(calc(undefined)).to.not.be.below(0);
    expect(calc(null)).to.not.be.below(0);
    expect(calc(NaN)).to.not.be.below(0);
    expect(calc(-1)).to.not.be.below(0);
  });

  it('should at least return 1 for very low frequent calls, 0 for 0', () => {
    expect(calc(-Number.MAX_VALUE)).to.equal(0);
    expect(calc(0)).to.equal(0);
    expect(calc(0.000001)).to.be.above(0);
    expect(calc(1)).to.be.above(0);
  });
});
