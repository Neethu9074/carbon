/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroFillMetric } from 'in-alerting/components/Chart/chartUtils';

const granularity = 1000;
const timeConfig = { to: 12345, windowSize: 10000, autoRefresh: false };

describe('in-alerting/components/Chart/chartUtils', () => {
  describe('zeroFillMetric', () => {
    it('should fully fill empty metric', () => {
      const metricData = [];
      expect(zeroFillMetric(metricData, timeConfig, granularity)).toStrictEqual([
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
      expect(zeroFillMetric(metricData, timeConfig, granularity)).toStrictEqual([
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
      expect(zeroFillMetric(metricData, timeConfig, granularity)).toStrictEqual([
        [3000, 1],
        [4000, 2],
        [5000, 3],
        [6000, 4],
        [7000, 5],
        [8000, 6],
        [9000, 7],
        [10000, 8],
        [11000, 9]
      ]);
    });
  });
});
