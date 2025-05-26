/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

jest.mock('in-services/featureFlags', () => ({
  apMetricsDeltaFetchingEnabled: true
}));

import {
  GetSingleUnifiedMetricQuery,
  prepareCache,
  splitQueryForDeltaFetching,
  UnifiedMetricsResult
} from 'in-subscription/getUnifiedMetrics';
import { ApplicationMetricConfiguration, InfraMetricConfiguration, Result } from 'in-types';
import { error, success } from 'in-services/util/result';

describe('in-subscription/getUnifiedMetrics', () => {
  describe('splitQueryForDeltaFetching', () => {
    const metrics: ApplicationMetricConfiguration = {
      dataSource: 'CALLS',
      queryPrecision: 'APPROXIMATE',
      includeSynthetic: false,
      metric: 'calls',
      timeShift: { offset: 0 },
      aggregation: 'SUM',
      source: 'APPLICATION',
      includeInternal: false,
      resultType: 'TIME_SERIES',
      granularity: 5000,
      timeConfig: {
        to: null,
        windowSize: 300000,
        autoRefresh: true
      }
    };

    it('should split a getUnifiedMetrics query for APPLICATION data if autoRefresh is enabled', () => {
      const query: GetSingleUnifiedMetricQuery = {
        metricId: 'y1-0',
        metricConfig: metrics
      };
      const result = splitQueryForDeltaFetching(query);
      expect(result).toMatchObject({
        fullRequest: {
          metrics: {
            'y1-0': {
              ...metrics,
              timeConfig: {
                to: null,
                windowSize: metrics.timeConfig.windowSize,
                autoRefresh: false
              }
            }
          }
        },
        deltaRequest: {
          metrics: {
            'y1-0': {
              ...metrics,
              timeConfig: {
                to: null,
                windowSize: expect.any(Number),
                autoRefresh: true
              }
            }
          }
        },
        requestedWindowSize: 300000
      });
    });

    it('should use one minute plus one bucket as delta window size', () => {
      const query: GetSingleUnifiedMetricQuery = {
        metricId: 'y1-0',
        metricConfig: metrics
      };
      const result = splitQueryForDeltaFetching(query);
      expect(result).toMatchObject({
        fullRequest: expect.any(Object),
        deltaRequest: expect.any(Object)
      });
      expect(result?.deltaRequest.metrics['y1-0'].timeConfig.windowSize).toStrictEqual(65000);
    });

    it('should request a minimum of 3 buckets as delta window size', () => {
      const query: GetSingleUnifiedMetricQuery = {
        metricId: 'y1-0',
        metricConfig: {
          ...metrics,
          granularity: 40000
        }
      };
      const result = splitQueryForDeltaFetching(query);
      expect(result).toMatchObject({
        fullRequest: expect.any(Object),
        deltaRequest: expect.any(Object)
      });
      expect(result?.deltaRequest.metrics['y1-0'].timeConfig.windowSize).toStrictEqual(120000);
    });

    it('should not split a getUnifiedMetrics query if the feature flag is disabled', async () => {
      jest.resetModules();
      jest.doMock('in-services/featureFlags', () => ({
        apMetricsDeltaFetchingEnabled: false
      }));

      const { splitQueryForDeltaFetching } = await import('in-subscription/getUnifiedMetrics');
      const query: GetSingleUnifiedMetricQuery = {
        metricId: 'y1-0',
        metricConfig: metrics
      };
      expect(splitQueryForDeltaFetching(query)).toBe(null);
    });

    it('should not split a getUnifiedMetrics query for non-application metrics', () => {
      const infraMetrics: InfraMetricConfiguration = {
        regex: false,
        source: 'INFRASTRUCTURE_METRICS',
        metric: 'calls',
        tagFilterExpression: { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] },
        timeShift: { offset: 0 },
        aggregation: 'SUM',
        resultType: 'TIME_SERIES',
        granularity: 5000,
        timeConfig: metrics.timeConfig
      };
      const query: GetSingleUnifiedMetricQuery = {
        metricId: 'y1-0',
        metricConfig: infraMetrics
      };
      expect(splitQueryForDeltaFetching(query)).toBe(null);
    });

    it('should not split a getUnifiedMetrics query if autoRefresh is disabled', () => {
      const query: GetSingleUnifiedMetricQuery = {
        metricId: 'y1-0',
        metricConfig: {
          ...metrics,
          timeConfig: {
            to: null,
            windowSize: 300000,
            autoRefresh: false
          }
        }
      };
      expect(splitQueryForDeltaFetching(query)).toBe(null);
    });

    it('should not split a getUnifiedMetrics query that has no granularity', () => {
      const query: GetSingleUnifiedMetricQuery = {
        metricId: 'y1-0',
        metricConfig: {
          ...metrics,
          granularity: undefined
        }
      };
      expect(splitQueryForDeltaFetching(query)).toBe(null);
    });

    it('should not split a getUnifiedMetrics the delta window size is not smaller than the original window size', () => {
      const query: GetSingleUnifiedMetricQuery = {
        metricId: 'y1-0',
        metricConfig: {
          ...metrics,
          granularity: 200000
        }
      };
      expect(splitQueryForDeltaFetching(query)).toBe(null);
    });
  });

  describe('cache handling', () => {
    const initialData = [
      [10, 5],
      [20, 2],
      [30, 4],
      [40, 7],
      [50, 1]
    ];
    const id = 'y1-0';
    const initialMetrics: UnifiedMetricsResult[] = [{ id, values: initialData }];

    it('passes on results without data', () => {
      const { replaceCacheWithFullData: replace, updateCacheWithDeltaData: update } = prepareCache(40);
      const errorResult = error([{ code: 'TIMEOUT', message: 'Test error' }]) as Result<UnifiedMetricsResult[]>;
      expect(replace(errorResult)).toBe(errorResult);
      expect(update(errorResult)).toBe(errorResult);
    });

    it('uses full metrics to fill the cache', () => {
      const { replaceCacheWithFullData: replace } = prepareCache(40);
      expect(replace(success(initialMetrics))).toHaveProperty('data', [{ id, values: initialData }]);
    });

    it('appends metrics with later timestamps to the end', () => {
      const { replaceCacheWithFullData: replace, updateCacheWithDeltaData: update } = prepareCache(40);
      expect(replace(success(initialMetrics))).toHaveProperty('data');

      const firstDelta = [
        [60, 9],
        [70, 4]
      ];
      expect(update(success([{ id, values: firstDelta }]))).toHaveProperty('data', [
        expect.objectContaining({
          values: [[30, 4], [40, 7], [50, 1], ...firstDelta]
        })
      ]);
      // there can be gaps in the timestamps between newest cached data and earliest delta
      const secondDelta = [
        [100, 42],
        [110, 42]
      ];
      expect(update(success([{ id, values: secondDelta }]))).toHaveProperty('data', [
        expect.objectContaining({
          // elements are deleted from start to retain a time range of 40
          values: [[70, 4], ...secondDelta]
        })
      ]);
      // if the gap is too big (all cached data older than "last new data - expected window size"),
      // the entire cache is replaced
      const unexpectedDelta = [
        [200, 1],
        [210, 2]
      ];
      expect(update(success([{ id, values: unexpectedDelta }]))).toHaveProperty('data', [
        expect.objectContaining({
          values: unexpectedDelta
        })
      ]);
    });

    it('replaces metrics after the first new timestamp', () => {
      const { replaceCacheWithFullData: replace, updateCacheWithDeltaData: update } = prepareCache(40);
      expect(replace(success(initialMetrics))).toHaveProperty('data');

      const firstDelta = [
        [30, 9],
        [40, 4],
        [50, 1],
        [60, 9]
      ];
      expect(update(success([{ id, values: firstDelta }]))).toHaveProperty('data', [
        expect.objectContaining({
          values: [[20, 2], ...firstDelta]
        })
      ]);
      // non-aligned timestamps shouldn't happen, but we can deal with them -- old value for 60 will be deleted
      const secondDelta = [
        [55, 8],
        [65, 7]
      ];
      expect(update(success([{ id, values: secondDelta }]))).toHaveProperty('data', [
        expect.objectContaining({
          values: [[30, 9], [40, 4], [50, 1], ...secondDelta]
        })
      ]);
    });

    it('refreshes the cache when new full data is received', () => {
      const { replaceCacheWithFullData: replace, updateCacheWithDeltaData: update } = prepareCache(40);
      expect(replace(success(initialMetrics))).toHaveProperty('data');

      const firstDelta = [[60, 9]];
      expect(update(success([{ id, values: firstDelta }]))).toHaveProperty('data', [
        expect.objectContaining({
          values: [...initialData.slice(1), ...firstDelta]
        })
      ]);
      const newFullData = [
        [110, 3],
        [120, 7],
        [130, 6],
        [140, 1],
        [150, 5]
      ];
      expect(replace(success([{ id, values: newFullData }]))).toHaveProperty('data', [
        expect.objectContaining({
          values: newFullData
        })
      ]);
    });

    it('overrides the returned window size for delta data', () => {
      const { replaceCacheWithFullData: replace, updateCacheWithDeltaData: update } = prepareCache(40);
      expect(replace(success(initialMetrics))).toHaveProperty('data');

      const firstDelta = [
        [60, 9],
        [70, 4]
      ];
      const time = Date.now();
      const resultWithWindowInfo = {
        ...success([
          {
            id,
            adjustedTimeframe: { windowSize: 10, to: time },
            values: firstDelta
          }
        ]),
        adjustedWindowSize: 10
      };
      expect(update(resultWithWindowInfo)).toMatchObject({
        adjustedWindowSize: 40,
        data: [
          expect.objectContaining({
            id,
            adjustedTimeframe: { windowSize: 40, to: time }
          })
        ]
      });
    });

    it('uses the adjusted timeframe from the full metrics for the cache window size', () => {
      // initial (requested) cache window size is 40, first response reduces it to 20
      const { replaceCacheWithFullData: replace, updateCacheWithDeltaData: update } = prepareCache(40);
      const initialData = [
        [30, 4],
        [40, 7],
        [50, 1]
      ];
      const initialMetrics: UnifiedMetricsResult[] = [
        {
          id,
          adjustedTimeframe: { windowSize: 20, to: Date.now() },
          values: initialData
        }
      ];
      expect(replace(success(initialMetrics))).toHaveProperty('data');

      const firstDelta = [
        [60, 9],
        [70, 4]
      ];
      expect(update(success([{ id, values: firstDelta }]))).toHaveProperty('data', [
        expect.objectContaining({
          values: [[50, 1], ...firstDelta]
        })
      ]);
    });
  });
});
