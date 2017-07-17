/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { getDefaultMetricRollupDuration, getDynamicRollupMultiplier } from 'in-stores/metric';

const oneMinute = 1000 * 60;

describe('in-stores/metric', () => {
  describe('getDefaultMetricRollupDuration', () => {
    const timeframe = (to, windowSize) => {
      return { to, windowSize };
    };

    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should not use any rollup when the timeframe is undefined', () => {
      expect(getDefaultMetricRollupDuration(null).rollup).to.equal(null);
      expect(getDefaultMetricRollupDuration().rollup).to.equal(null);
    });

    it('should define no rollup size for 5 minutes', () => {
      expect(getDefaultMetricRollupDuration(timeframe(null, oneMinute * 5)).rollup).to.equal(null);
    });

    it('should define no rollup size for 10 minutes', () => {
      expect(getDefaultMetricRollupDuration(timeframe(null, oneMinute * 10)).rollup).to.equal(null);
    });

    it('should define no rollup size for 10 minutes and a small room for error', () => {
      expect(getDefaultMetricRollupDuration(timeframe(null, oneMinute * 10 + 50)).rollup).to.equal(null);
    });

    it('should use five second rollups for 15  minutes', () => {
      expect(getDefaultMetricRollupDuration(timeframe(null, oneMinute * 15)).rollup).to.equal(5000);
    });

    it('should use five second rollups for one hour timeframes', () => {
      expect(getDefaultMetricRollupDuration(timeframe(null, oneMinute * 60)).rollup).to.equal(5000);
    });

    it('should use hourly rollups for any larger timeframe', () => {
      expect(getDefaultMetricRollupDuration(timeframe(null, Number.MAX_VALUE)).rollup).to.equal(oneMinute * 60);
    });

    it('should not use any rollup when the timeframe is undefined', () => {
      expect(getDefaultMetricRollupDuration(null).rollup).to.equal(null);
      expect(getDefaultMetricRollupDuration().rollup).to.equal(null);
    });

    it('should define no rollup size for 5 minutes', () => {
      clock.tick(oneMinute * 10);

      expect(getDefaultMetricRollupDuration(timeframe(oneMinute * 5, oneMinute * 5)).rollup).to.equal(null);
    });

    it(
      'should use a rollup size for windows smaller than 10 minutes when the data is not ' +
        'retained for the selected time window',
      () => {
        clock.tick(oneMinute * 20);

        expect(getDefaultMetricRollupDuration(timeframe(oneMinute * 15, oneMinute * 10)).rollup).to.equal(5000);
      }
    );

    it('should get the minimum rollup if screen is able to show all datapoints', () => {
      const { dynamicRollupMultiplier, minAvailableRollup } = getDynamicRollupMultiplier(
        1000,
        timeframe(null, 60 * 1000),
        10
      );
      expect(minAvailableRollup.rollup).to.equal(null);
      expect(dynamicRollupMultiplier).to.equal(1);
    });

    it('should increase the rollup from 1sec to 3sec', () => {
      const { dynamicRollupMultiplier, minAvailableRollup } = getDynamicRollupMultiplier(
        1000,
        timeframe(null, 6 * 60 * 1000),
        10
      );
      expect(minAvailableRollup.rollup).to.equal(null);
      expect(dynamicRollupMultiplier).to.equal(4); // max 100 metrics, 360 are shown so you have to multiply by 4 (=400) to have enough space
    });

    it('should increase the rollup from 1sec to 1m', () => {
      const { dynamicRollupMultiplier, minAvailableRollup } = getDynamicRollupMultiplier(
        100,
        timeframe(null, 60 * 1000),
        10
      );
      expect(minAvailableRollup.rollup).to.equal(null);
      expect(dynamicRollupMultiplier).to.equal(6);
    });

    it('should increase the rollup from 1sec to 2m', () => {
      const { dynamicRollupMultiplier, minAvailableRollup } = getDynamicRollupMultiplier(
        100,
        timeframe(null, 2 * 60 * 1000),
        10
      );
      expect(minAvailableRollup.rollup).to.equal(null);
      expect(dynamicRollupMultiplier).to.equal(12);
    });

    it('should take at least the available rollup, even if it could render more', () => {
      const { dynamicRollupMultiplier, minAvailableRollup } = getDynamicRollupMultiplier(
        Number.MAX_VALUE,
        timeframe(null, oneMinute * 60),
        10
      );
      expect(minAvailableRollup.rollup).to.equal(1000 * 5);
      expect(dynamicRollupMultiplier).to.equal(1);
    });
  });
});
