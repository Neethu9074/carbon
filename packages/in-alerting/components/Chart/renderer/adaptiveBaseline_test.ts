/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { updateThresholdPointsIfRequired } from 'in-alerting/components/Chart/renderer/adaptiveBaseline';
import { allowedMultiplesOfRollupSizeMissingInCharts } from 'in-services/featureFlags';
import { DataSeries } from 'in-components/Chart/renderer/types';
import { minutes } from 'in-services/time';

describe('in-alerting/components/Chart/renderer/lineWithAdaptiveBaseline', () => {
  describe('Should update threshold points if it is too far from neighbouring points', () => {
    const oneMinute = minutes.toMillis(1);
    const thresholdGranularity = 10 * oneMinute;
    const halfBucket = 0.5 * thresholdGranularity;
    const fixedDistance = thresholdGranularity * allowedMultiplesOfRollupSizeMissingInCharts + 15 * oneMinute;

    it('should update singular data point at start', () => {
      const t1 = 1627257600000;
      const t2 = t1 + fixedDistance;
      const t3 = t2 + 10 * oneMinute;

      const baseline: DataSeries = [
        [t1, 105.5],
        [t2, 115.5],
        [t3, 125.5]
      ];

      const expected: DataSeries = [
        [t1 - halfBucket, 105.5],
        [t1 + halfBucket, 105.5],
        [t2, 115.5],
        [t3, 125.5]
      ];

      expect(updateThresholdPointsIfRequired(baseline, thresholdGranularity)).toStrictEqual(expected);
    });

    it('should update singular data point at end', () => {
      const t1 = 1627257600000;
      const t2 = t1 + 10 * oneMinute;
      const t3 = t2 + fixedDistance;

      const baseline: DataSeries = [
        [t1, 105.5],
        [t2, 115.5],
        [t3, 125.5]
      ];

      const expected = [
        [t1, 105.5],
        [t2, 115.5],
        [t3 - halfBucket, 125.5],
        [t3 + halfBucket, 125.5]
      ];

      expect(updateThresholdPointsIfRequired(baseline, thresholdGranularity)).toStrictEqual(expected);
    });

    it('should update singular data point at middle', () => {
      const t1 = 1627254000000;
      const t2 = t1 + 10 * oneMinute;
      const t3 = t2 + fixedDistance;
      const t4 = t3 + fixedDistance;
      const t5 = t4 + 10 * oneMinute;

      const baseline: DataSeries = [
        [t1, 95.5],
        [t2, 95.5],
        [t3, 105.5],
        [t4, 125.5],
        [t5, 125.5]
      ];

      const expected: DataSeries = [
        [t1, 95.5],
        [t2, 95.5],
        [t3 - halfBucket, 105.5],
        [t3 + halfBucket, 105.5],
        [t4, 125.5],
        [t5, 125.5]
      ];

      expect(updateThresholdPointsIfRequired(baseline, thresholdGranularity)).toStrictEqual(expected);
    });

    it('should filter-out point before start time', () => {
      const t1 = 1627254000000;
      const t2 = t1 + 10 * oneMinute;
      const t3 = t2 + 10 * oneMinute;

      const startTime = t1 + oneMinute;

      const baseline: DataSeries = [
        [t1, 95.5],
        [t2, 95.5],
        [t3, 105.5]
      ];

      const expected: DataSeries = [
        [t2, 95.5],
        [t3, 105.5]
      ];

      expect(updateThresholdPointsIfRequired(baseline, thresholdGranularity, startTime)).toStrictEqual(expected);
    });
  });
});
