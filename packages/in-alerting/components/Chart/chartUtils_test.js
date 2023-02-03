/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { adjustTimestamp, zeroFillAndClipMetric } from 'in-alerting/components/Chart/chartUtils';

const granularity = 1000;
const adjustedTo = 12345;
const adjustedTimeWindow = 10 * granularity;

describe('in-alerting/components/Chart/chartUtils', () => {
  describe('zeroFillMetric', () => {
    it('should fully fill empty metric', () => {
      const metricData = [];
      expect(zeroFillAndClipMetric(metricData, granularity, adjustedTo, adjustedTimeWindow)).toStrictEqual([
        [2000, 0],
        [3000, 0],
        [4000, 0],
        [5000, 0],
        [6000, 0],
        [7000, 0],
        [8000, 0],
        [9000, 0],
        [10000, 0],
        [11000, 0]
      ]);
    });

    it('should fill single value metric', () => {
      const metricData = [[5000, 123]];
      expect(zeroFillAndClipMetric(metricData, granularity, adjustedTo, adjustedTimeWindow)).toStrictEqual([
        [2000, 0],
        [3000, 0],
        [4000, 0],
        [5000, 123],
        [6000, 0],
        [7000, 0],
        [8000, 0],
        [9000, 0],
        [10000, 0],
        [11000, 0]
      ]);
    });

    it('should not modify fully defined metric', () => {
      const metricData = [
        [2000, 10],
        [3000, 1],
        [4000, 2],
        [5000, 3],
        [6000, 4],
        [7000, 5],
        [8000, 6],
        [9000, 7],
        [10000, 8],
        [11000, 9]
      ];
      expect(zeroFillAndClipMetric(metricData, granularity, adjustedTo, adjustedTimeWindow)).toStrictEqual([
        ...metricData
      ]);
    });

    it('align to-time with respect to granularity and compute from-Time using respective aligned to-time and window-size', () => {
      const metricData = [
        [1644102000000, 2012],
        [1644103200000, 2032],
        [1644104400000, 2056],
        [1644105600000, 1973],
        [1644106800000, 1953],
        [1644108000000, 1894],
        [1644109200000, 1872],
        [1644110400000, 2010]
      ];
      const granularity = 1200000;

      expect(zeroFillAndClipMetric(metricData, granularity, 1644112914343, 10800000)).toStrictEqual([
        ...metricData,
        [1644111600000, 0]
      ]);
    });

    it('should not zero fill future values', () => {
      const granularity = 600000;
      const adjustedTimeWindow = 10 * granularity;
      // Please note that there is a minimal chance of flakiness as this NOW timestamp might differ to the one used inside the
      // zeroFillAndClipMetric() function. In case you ever see this test-case failing, please give @eng-alerting a friendly ping.
      const alignedNow = adjustTimestamp(Date.now(), granularity);
      const adjustedTo = alignedNow + 5 * granularity;
      const metricData = [
        [alignedNow - 3 * granularity, 123],
        [alignedNow - 2 * granularity, 234]
      ];
      expect(zeroFillAndClipMetric(metricData, granularity, adjustedTo, adjustedTimeWindow)).toStrictEqual([
        [alignedNow - 5 * granularity, 0],
        [alignedNow - 4 * granularity, 0],
        [alignedNow - 3 * granularity, 123],
        [alignedNow - 2 * granularity, 234],
        [alignedNow - granularity, 0]
      ]);
    });

    it('should properly zero fill and clip incomplete metric values', () => {
      const granularity = 600000;
      const adjustedTimeWindow = 10 * granularity;
      const alignedNow = adjustTimestamp(Date.now(), granularity);
      const adjustedTo = alignedNow + 5 * granularity;
      const metricData = [
        [alignedNow - 3 * granularity, 9999],
        [alignedNow - 2 * granularity, 8888],
        [alignedNow - granularity, 7777],
        [alignedNow, 1] // this is a partial bucket in the backend's response due using a timeframe ranging into the future
      ];
      expect(zeroFillAndClipMetric(metricData, granularity, adjustedTo, adjustedTimeWindow)).toStrictEqual([
        [alignedNow - 5 * granularity, 0],
        [alignedNow - 4 * granularity, 0],
        [alignedNow - 3 * granularity, 9999],
        [alignedNow - 2 * granularity, 8888],
        [alignedNow - granularity, 7777]
      ]);
    });
  });
});
