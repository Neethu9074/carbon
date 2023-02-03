/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';
import sinon from 'sinon';

import { getInfraGranularity, getChartGranularity } from 'in-stores/metric';
import { days, hours, minutes, seconds } from 'in-services/time';

describe('in-stores/metric', () => {
  describe('getChartGranularity', () => {
    const expectations = [
      {
        label: '1min',
        timeConfig: {
          windowSize: 60000
        },
        expected: 1000
      },
      {
        label: '5min',
        timeConfig: {
          windowSize: 300000
        },
        expected: 5000
      },
      {
        label: '10min',
        timeConfig: {
          windowSize: 600000
        },
        expected: 10000
      },
      {
        label: '30min',
        timeConfig: {
          windowSize: 1800000
        },
        expected: 60000
      },
      {
        label: '1hour',
        timeConfig: {
          windowSize: 3600000
        },
        expected: 60000
      },
      {
        label: '6hour',
        timeConfig: {
          windowSize: 21600000
        },
        expected: 300000
      },
      {
        label: '12hour',
        timeConfig: {
          windowSize: 43200000
        },
        expected: 600000
      },
      {
        label: '24hour',
        timeConfig: {
          windowSize: 86400000
        },
        expected: 1800000
      },
      {
        label: 'yesterday',
        timeConfig: {
          windowSize: 86400000
        },
        expected: 1800000
      },
      {
        label: 'two days ago',
        timeConfig: {
          windowSize: 172800000
        },
        expected: 3600000
      },
      {
        label: 'last 7 days',
        timeConfig: {
          windowSize: 604800000
        },
        expected: 14400000
      },
      {
        label: 'previous week',
        timeConfig: {
          windowSize: 604800000
        },
        expected: 14400000
      },
      {
        label: '59minutes',
        timeConfig: {
          windowSize: 3540000
        },
        expected: 60000
      },
      {
        label: '5 days, 8h, and 45min',
        timeConfig: {
          windowSize: 463500000
        },
        expected: 14400000
      },
      {
        label: '7 days and 1min',
        timeConfig: {
          windowSize: 604852000
        },
        expected: 14400000
      }
    ];

    expectations.forEach(({ timeConfig, expected, label }) => {
      it(`should return ${expected}ms for a time frame of ${label}`, () => {
        expect(getChartGranularity(timeConfig)).to.equal(expected);
      });
    });
  });

  describe('getInfraGranularity', () => {
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

    it('should use the largest granularity when the timeConfig is undefined', () => {
      expect(getInfraGranularity(null)).to.equal(hours.toMillis(1));
      expect(getInfraGranularity()).to.equal(hours.toMillis(1));
    });

    it('should define 1s rollup for 5 minutes', () => {
      expect(getInfraGranularity(timeConfig(null, minutes.toMillis(5)))).to.equal(1000);
    });

    it('should define 1s rollup for 10 minutes', () => {
      expect(getInfraGranularity(timeConfig(null, minutes.toMillis(10)))).to.equal(1000);
    });

    it('should define 1s rollup for 10 minutes and a small room for error', () => {
      expect(getInfraGranularity(timeConfig(null, minutes.toMillis(10) + 50))).to.equal(1000);
    });

    it('should use five second rollups for 15  minutes', () => {
      expect(getInfraGranularity(timeConfig(null, minutes.toMillis(15)))).to.equal(5000);
    });

    it('should use five second rollups for one hour timeConfigs', () => {
      expect(getInfraGranularity(timeConfig(null, hours.toMillis(1)))).to.equal(5000);
    });

    it('should use hourly rollups for any larger timeConfig', () => {
      expect(getInfraGranularity(timeConfig(null, Number.MAX_VALUE))).to.equal(hours.toMillis(1));
    });

    it('should define 1s rollup for 5 minutes', () => {
      clock.tick(minutes.toMillis(10));

      expect(getInfraGranularity(timeConfig(minutes.toMillis(5), minutes.toMillis(5)))).to.equal(1000);
    });

    it(
      'should use a rollup size for windows smaller than 10 minutes when the data is not ' +
        'retained for the selected time window',
      () => {
        clock.tick(minutes.toMillis(20));

        expect(getInfraGranularity(timeConfig(minutes.toMillis(5), minutes.toMillis(15)))).to.equal(5000);
      }
    );
  });

  const aroundNow = hours.toMillis(1);
  const aboutADayAgo = hours.toMillis(25);
  const aboutAMonthAgo = 32 * hours.toMillis(24);
  const about3MonthsAgo = 94 * hours.toMillis(24);
  const about13MonthsAgo = 14 * 30 * hours.toMillis(24);

  const expectations = [
    // 1 second
    { age: aroundNow, desired: seconds.toMillis(1), expected: seconds.toMillis(1), window: minutes.toMillis(10) },
    { age: aroundNow, desired: seconds.toMillis(2), expected: seconds.toMillis(5), window: minutes.toMillis(10) },
    // 5 seconds
    { age: aroundNow, desired: seconds.toMillis(5), expected: seconds.toMillis(5) },
    { age: aroundNow, desired: seconds.toMillis(7), expected: seconds.toMillis(10) },
    { age: aroundNow, desired: seconds.toMillis(9), expected: seconds.toMillis(10) },
    // 10 second
    { age: aroundNow, desired: seconds.toMillis(10), expected: seconds.toMillis(10) },
    { age: aroundNow, desired: seconds.toMillis(11), expected: seconds.toMillis(60) },
    { age: aroundNow, desired: seconds.toMillis(24), expected: seconds.toMillis(60) },
    { age: aroundNow, desired: seconds.toMillis(59), expected: seconds.toMillis(60) },
    // 1 minute
    { age: aroundNow, desired: minutes.toMillis(1), expected: minutes.toMillis(1) },
    { age: aroundNow, desired: seconds.toMillis(65), expected: minutes.toMillis(5) },
    // 5 minutes
    { age: aroundNow, desired: minutes.toMillis(5), expected: minutes.toMillis(5) },
    { age: aroundNow, desired: minutes.toMillis(6), expected: minutes.toMillis(10) },
    { age: aroundNow, desired: minutes.toMillis(11), expected: minutes.toMillis(30) },
    { age: aroundNow, desired: minutes.toMillis(22), expected: minutes.toMillis(30) },
    { age: aroundNow, desired: minutes.toMillis(59), expected: minutes.toMillis(60) },
    // 1 hour
    { age: aroundNow, desired: hours.toMillis(1), expected: hours.toMillis(1) },
    { age: aroundNow, desired: minutes.toMillis(61), expected: hours.toMillis(4) },
    { age: aroundNow, desired: hours.toMillis(15), expected: days.toMillis(1) },
    // drops 10 second resolution
    { age: aboutADayAgo, desired: seconds.toMillis(11), expected: minutes.toMillis(1) },
    // drops 1 minute resolution
    { age: aboutAMonthAgo, desired: seconds.toMillis(11), expected: minutes.toMillis(5) },
    { age: aboutAMonthAgo, desired: minutes.toMillis(2), expected: minutes.toMillis(5) },
    // drops 5 minute resolution
    { age: about3MonthsAgo, desired: seconds.toMillis(11), expected: hours.toMillis(1) },
    { age: about3MonthsAgo, desired: minutes.toMillis(2), expected: hours.toMillis(1) },
    { age: about3MonthsAgo, desired: minutes.toMillis(5), expected: hours.toMillis(1) },
    // no metrics
    // fall back to an hour, if there is no data available, then the plot will be empty
    { age: about13MonthsAgo, desired: minutes.toMillis(5), expected: hours.toMillis(1) }
  ];

  describe('getInfraGranularity', () => {
    expectations.forEach(({ age, desired, expected, window }) => {
      it(`should return ${expected}ms given user desired ${desired}ms for a time ${age}ms ago`, () => {
        const windowSize = window ?? hours.toMillis(1);
        const to = Date.now() - age + windowSize;
        const dataPoints = windowSize / desired;
        expect(getInfraGranularity({ to, windowSize }, undefined, dataPoints)).to.equal(expected);
      });
    });
  });
});
