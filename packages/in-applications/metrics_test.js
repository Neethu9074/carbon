/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getSparkChartGranularity } from 'in-applications/metrics';

describe('in-appications/metrics', () => {
  describe('getSparkChartGranularity', () => {
    const expectations = [
      {
        label: '1min',
        timeConfig: {
          windowSize: 60000
        },
        expected: 5000
      },
      {
        label: '5min',
        timeConfig: {
          windowSize: 300000
        },
        expected: 25000
      },
      {
        label: '10min',
        timeConfig: {
          windowSize: 600000
        },
        expected: 60000
      },
      {
        label: '30min',
        timeConfig: {
          windowSize: 1800000
        },
        expected: 180000
      },
      {
        label: '1hour',
        timeConfig: {
          windowSize: 3600000
        },
        expected: 300000
      },
      {
        label: '6hour',
        timeConfig: {
          windowSize: 21600000
        },
        expected: 1800000
      },
      {
        label: '12hour',
        timeConfig: {
          windowSize: 43200000
        },
        expected: 3600000
      },
      {
        label: '24hour',
        timeConfig: {
          windowSize: 86400000
        },
        expected: 7200000
      },
      {
        label: 'yesterday',
        timeConfig: {
          windowSize: 86400000
        },
        expected: 7200000
      },
      {
        label: 'two days ago',
        timeConfig: {
          windowSize: 86400000
        },
        expected: 7200000
      },
      {
        label: 'last 7 days',
        timeConfig: {
          windowSize: 604800000
        },
        expected: 50400000
      },
      {
        label: 'previous week',
        timeConfig: {
          windowSize: 604800000
        },
        expected: 50400000
      },
      {
        label: '59minutes',
        timeConfig: {
          windowSize: 3540000
        },
        expected: 300000
      },
      {
        label: '5 days, 8h, and 45min',
        timeConfig: {
          windowSize: 463500000
        },
        expected: 39600000
      },
      {
        label: '7 days and 1min',
        timeConfig: {
          windowSize: 604852000
        },
        expected: 50400000
      }
    ];

    expectations.forEach(({ timeConfig, expected, label }) => {
      it(`should return ${expected}ms for a time frame of ${label}`, () => {
        expect(getSparkChartGranularity(timeConfig)).toBe(expected);
        expect(timeConfig.windowSize / expected).toBeGreaterThanOrEqual(10);
        expect(timeConfig.windowSize / expected).toBeLessThanOrEqual(13);
      });
    });
  });
});
