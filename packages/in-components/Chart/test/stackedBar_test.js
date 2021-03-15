/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';

import { shouldSkipFirstDataPoint } from 'in-components/Chart/renderer/stackedBar';
import createScale from 'in-services/scale';

describe('in-components/Chart/renderer/stackedBar', () => {
  const scale = createScale();
  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setDomainFrom(0);
  scale.setDomainTo(100);

  describe('shouldSkipFirstDataPoint', () => {
    it('should skip the first data point if it reaches out of view', () => {
      expect(shouldSkipFirstDataPoint([0, 42], scale, 10)).to.equal(true);
      expect(shouldSkipFirstDataPoint([10, 42], scale, 10)).to.equal(false);
      expect(shouldSkipFirstDataPoint([4, 42], scale, 8)).to.equal(false);
      expect(shouldSkipFirstDataPoint([4, 42], scale, 10)).to.equal(true);
      expect(shouldSkipFirstDataPoint([5, 42], scale, 8)).to.equal(false);
      expect(shouldSkipFirstDataPoint([5, 42], scale, 11)).to.equal(true);
    });
  });
});
