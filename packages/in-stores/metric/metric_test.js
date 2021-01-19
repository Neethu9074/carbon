/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { getDefaultMetricRollupDuration } from 'in-stores/metric';
import { hours, minutes } from 'in-services/time';

describe('in-stores/metric', () => {
  describe('getDefaultMetricRollupDuration', () => {
    const timeConfig = (to, windowSize) => {
      return { to, windowSize };
    };

    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should not use any rollup when the timeConfig is undefined', () => {
      expect(getDefaultMetricRollupDuration(null).rollup).to.equal(null);
      expect(getDefaultMetricRollupDuration().rollup).to.equal(null);
    });

    it('should define no rollup size for 5 minutes', () => {
      expect(getDefaultMetricRollupDuration(timeConfig(null, minutes.toMillis(5))).rollup).to.equal(null);
    });

    it('should define no rollup size for 10 minutes', () => {
      expect(getDefaultMetricRollupDuration(timeConfig(null, minutes.toMillis(10))).rollup).to.equal(null);
    });

    it('should define no rollup size for 10 minutes and a small room for error', () => {
      expect(getDefaultMetricRollupDuration(timeConfig(null, minutes.toMillis(10) + 50)).rollup).to.equal(null);
    });

    it('should use five second rollups for 15  minutes', () => {
      expect(getDefaultMetricRollupDuration(timeConfig(null, minutes.toMillis(15))).rollup).to.equal(5000);
    });

    it('should use five second rollups for one hour timeConfigs', () => {
      expect(getDefaultMetricRollupDuration(timeConfig(null, hours.toMillis(1))).rollup).to.equal(5000);
    });

    it('should use hourly rollups for any larger timeConfig', () => {
      expect(getDefaultMetricRollupDuration(timeConfig(null, Number.MAX_VALUE)).rollup).to.equal(hours.toMillis(1));
    });

    it('should not use any rollup when the timeConfig is undefined', () => {
      expect(getDefaultMetricRollupDuration(null).rollup).to.equal(null);
      expect(getDefaultMetricRollupDuration().rollup).to.equal(null);
    });

    it('should define no rollup size for 5 minutes', () => {
      clock.tick(minutes.toMillis(10));

      expect(getDefaultMetricRollupDuration(timeConfig(minutes.toMillis(5), minutes.toMillis(5))).rollup).to.equal(
        null
      );
    });

    it(
      'should use a rollup size for windows smaller than 10 minutes when the data is not ' +
        'retained for the selected time window',
      () => {
        clock.tick(minutes.toMillis(20));

        expect(getDefaultMetricRollupDuration(timeConfig(minutes.toMillis(5), minutes.toMillis(15))).rollup).to.equal(
          5000
        );
      }
    );
  });
});
