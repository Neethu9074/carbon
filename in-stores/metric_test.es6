/* eslint-env mocha */
import {expect} from 'chai';

import * as metricStore from 'in-stores/metric';

const oneMinute = 1000 * 60;

describe('in-stores/metric', () => {
  describe('getDefaultMetricRollupDuration', () => {
    it('should not use any rollup when the timeframe is undefined', () => {
      expect(metricStore.getDefaultMetricRollupDuration(null)).to.equal(null);
      expect(metricStore.getDefaultMetricRollupDuration()).to.equal(null);
    });

    it('should define no rollup size for 5 minutes', () => {
      expect(metricStore.getDefaultMetricRollupDuration({ windowSize: oneMinute * 5 })).to.equal(null);
    });

    it('should define no rollup size for exactly 10 minutes', () => {
      expect(metricStore.getDefaultMetricRollupDuration({ windowSize: oneMinute * 10 })).to.equal(null);
    });

    it('should use five second rollups for 15  minutes', () => {
      expect(metricStore.getDefaultMetricRollupDuration({ windowSize: oneMinute * 15 })).to.equal(5000);
    });

    it('should use five second rollups for one hour timeframes', () => {
      expect(metricStore.getDefaultMetricRollupDuration({ windowSize: oneMinute * 60 })).to.equal(5000);
    });

    it('should use hourly rollups for any larger timeframe', () => {
      expect(metricStore.getDefaultMetricRollupDuration({ windowSize: Number.MAX_VALUE })).to.equal(1000 * 60 * 60);
    });
  });
});
