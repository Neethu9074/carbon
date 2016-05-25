/* eslint-env mocha */
import {expect} from 'chai';
import sinon from 'sinon';

import * as metricStore from 'in-stores/metric';

const oneMinute = 1000 * 60;

describe('in-stores/metric', () => {
  describe('getDefaultMetricRollupDuration', () => {
    const timeframe = (to, windowSize) => {
      return {to, windowSize};
    };

    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should not use any rollup when the timeframe is undefined', () => {
      expect(metricStore.getDefaultMetricRollupDuration(null)).to.equal(null);
      expect(metricStore.getDefaultMetricRollupDuration()).to.equal(null);
    });

    it('should define no rollup size for 5 minutes', () => {
      expect(metricStore.getDefaultMetricRollupDuration(timeframe(null, oneMinute * 5)))
        .to.equal(null);
    });

    it('should define no rollup size for 10 minutes', () => {
      expect(metricStore.getDefaultMetricRollupDuration(timeframe(null, oneMinute * 10)))
        .to.equal(null);
    });

    it('should define no rollup size for 10 minutes and a small room for error', () => {
      expect(metricStore.getDefaultMetricRollupDuration(timeframe(null, oneMinute * 10 + 50)))
        .to.equal(null);
    });

    it('should use five second rollups for 15  minutes', () => {
      expect(metricStore.getDefaultMetricRollupDuration(timeframe(null, oneMinute * 15)))
        .to.equal(5000);
    });

    it('should use five second rollups for one hour timeframes', () => {
      expect(metricStore.getDefaultMetricRollupDuration(timeframe(null, oneMinute * 60)))
        .to.equal(5000);
    });

    it('should use hourly rollups for any larger timeframe', () => {
      expect(metricStore.getDefaultMetricRollupDuration(timeframe(null, Number.MAX_VALUE)))
        .to.equal(1000 * 60 * 60);
    });

    it('should not use any rollup when the timeframe is undefined', () => {
      expect(metricStore.getDefaultMetricRollupDuration(null)).to.equal(null);
      expect(metricStore.getDefaultMetricRollupDuration()).to.equal(null);
    });

    it('should define no rollup size for 5 minutes', () => {
      clock.tick(oneMinute * 10);

      expect(metricStore.getDefaultMetricRollupDuration(timeframe(oneMinute * 5, oneMinute * 5)))
        .to.equal(null);
    });

    it('should use a rollup size for windows smaller than 10 minutes when the data is not ' +
        'retained for the selected time window', () => {
      clock.tick(oneMinute * 20);

      expect(metricStore.getDefaultMetricRollupDuration(timeframe(oneMinute * 15, oneMinute * 10)))
        .to.equal(5000);
    });
  });
});
