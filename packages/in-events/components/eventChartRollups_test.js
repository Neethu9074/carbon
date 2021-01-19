/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import { validRollups, getNextValidRollup } from 'in-events/components/eventChartRollups';

describe('in-events/components/eventChartRollups#getNextValidRollup', () => {
  it('should return the rollup on equal match', () => {
    for (let i = 0; i < validRollups.length; i++) {
      const rollup = validRollups[i];
      expect(getNextValidRollup(rollup)).to.equal(rollup);
    }
  });

  it('should turn boundaries into account', () => {
    expect(getNextValidRollup(0)).to.equal(validRollups[0]);
    expect(getNextValidRollup(Number.MAX_VALUE)).to.equal(validRollups[validRollups.length - 1]);
  });

  it('should turn boundaries into account', () => {
    for (let i = 0; i < validRollups.length - 1; i++) {
      const a = validRollups[i];
      const b = validRollups[i + 1];
      expect(getNextValidRollup(a + (b - a) / 2)).to.equal(b);
    }
  });
});
