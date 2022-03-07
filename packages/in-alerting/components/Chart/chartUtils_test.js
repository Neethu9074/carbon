/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroFillMetric } from 'in-alerting/components/Chart/chartUtils';

const granularity = 1000;
const toTime = 12345;
const adjustedTimeWindow = 10000;

describe('in-alerting/components/Chart/chartUtils', () => {
  describe('zeroFillMetric', () => {
    it('should fully fill empty metric', () => {
      const metricData = [];
      expect(zeroFillMetric(metricData, granularity, toTime, adjustedTimeWindow)).toStrictEqual([
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
      expect(zeroFillMetric(metricData, granularity, toTime, adjustedTimeWindow)).toStrictEqual([
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
      expect(zeroFillMetric(metricData, granularity, toTime, adjustedTimeWindow)).toStrictEqual([...metricData]);
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

      expect(zeroFillMetric(metricData, granularity, 1644112914343, 10800000)).toStrictEqual([
        ...metricData,
        [1644111600000, 0]
      ]);
    });
  });
});
