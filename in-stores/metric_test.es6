/* eslint-env mocha */

import {expect} from 'chai';

import * as metricStore from 'in-stores/metric';

const oneMinute = 1000 * 60;

describe('in-stores/metric', () => {
  describe('getDefaultMetricRollupDuration', () => {
    it('should not use any rollup when the timeframe is undefined', () => {
      expect(metricStore.getDefaultMetricRollupDuration(null))
        .to.equal(null);
      expect(metricStore.getDefaultMetricRollupDuration())
        .to.equal(null);
    });

    it('should define no rollup size for 5 minutes', () => {
      expect(metricStore.getDefaultMetricRollupDuration(oneMinute * 5))
        .to.equal(null);
    });

    it('should define no rollup size for exactly 10 minutes', () => {
      expect(metricStore.getDefaultMetricRollupDuration(oneMinute * 10))
        .to.equal(null);
    });

    it('should use five second rollups for 15  minutes', () => {
      expect(metricStore.getDefaultMetricRollupDuration(oneMinute * 15))
        .to.equal(5000);
    });

    it('should use five second rollups for one hour timeframes', () => {
      expect(metricStore.getDefaultMetricRollupDuration(oneMinute * 60))
        .to.equal(5000);
    });

    it('should use five minute rollups for any larger timeframe', () => {
      expect(metricStore.getDefaultMetricRollupDuration(Number.MAX_VALUE))
        .to.equal(1000 * 60 * 5);
    });
  });

  describe('getMetricName', () => {
    it('should not use any rollup for short timeframes', () => {
      expect(metricStore.getMetricName('cpu.sys', oneMinute * 10))
        .to.equal('cpu.sys');
    });

    it('should use rollups for larger time windows', () => {
      expect(metricStore.getMetricName('cpu.sys', oneMinute * 60))
        .to.equal('cpu.sys.mean.5000');
    });
  });
});
