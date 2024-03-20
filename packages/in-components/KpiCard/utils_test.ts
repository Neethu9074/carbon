/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Result, TimeConfig } from '@instana/types';

import { getLogMetricsConfig, transformLogsResult, UnifiedMetricConfigurations } from 'in-components/KpiCard/utils';
import { Config } from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { pendingResult } from 'in-services/fixedObjects';
import { UnifiedMetricConfiguration } from 'in-types';
import { minutes } from 'in-services/time';

const windowSizeMillis = minutes.toMillis(60);
const timestamp = Date.UTC(2022, 3, 1, 12, 31, 5);
const oneHourInMillis = 1000 * 60 * 60;

export const baseTimeConfig: TimeConfig = {
  to: timestamp,
  autoRefresh: false,
  windowSize: windowSizeMillis
};

export const baseConfig: Config<UnifiedMetricConfiguration> = {
  formatter: 'number.compact',
  metricConfiguration: {
    metric: 'logs_distribution',
    timeShift: { offset: 0 },
    timeConfig: baseTimeConfig,
    resultType: 'SINGLE_NUMBER',
    aggregation: 'SUM',
    source: 'LOG'
  }
};

const singeValueResult: Result<UnifiedMetricsResult[]> = {
  data: [
    {
      id: 'bigNumber',
      values: [[1708880400000, 184732]]
    }
  ],
  errors: [],
  time: timestamp,
  progress: {
    loading: false
  }
};

export const baseResult: Result<UnifiedMetricsResult[]> = {
  data: [
    {
      id: 'bigNumber',
      values: [
        [1708880400000, 184732],
        [1708884000000, 441440]
      ]
    }
  ],
  errors: [],
  time: timestamp,
  progress: {
    loading: false
  }
};

export const metricConfigurationBase: UnifiedMetricConfiguration = {
  timeConfig: baseTimeConfig,
  metric: 'logs_distribution',
  aggregation: 'SUM',
  source: 'LOG',
  resultType: 'SINGLE_NUMBER',
  timeShift: { offset: 0 }
};

export const metricsBase: UnifiedMetricConfigurations = {
  bigNumber: {
    timeConfig: {
      to: null,
      windowSize: 3600000,
      focusedMoment: null,
      autoRefresh: false
    },
    metric: 'logs_distribution',
    timeShift: {
      offset: 0
    },
    aggregation: 'SUM',
    source: 'LOG',
    resultType: 'SINGLE_NUMBER'
  },
  comparison: {
    timeConfig: {
      to: null,
      windowSize: 3600000,
      focusedMoment: null,
      autoRefresh: false
    },
    metric: 'logs_distribution',
    timeShift: {
      offset: -3600000
    },
    aggregation: 'SUM',
    source: 'LOG',
    resultType: 'SINGLE_NUMBER'
  }
};

describe('transformLogsResult', () => {
  it('should handle empty result data correctly', () => {
    const result = pendingResult;

    const transformedResult = transformLogsResult(result, baseConfig, baseTimeConfig);

    expect(transformedResult).toEqual(result);
  });

  it('should not modify result with single value in data', () => {
    const transformedResult = transformLogsResult(singeValueResult, baseConfig, baseTimeConfig);

    expect(transformedResult).toEqual(singeValueResult);
  });

  it('should reduce result values when multiple values present', () => {
    const transformedResult = transformLogsResult(baseResult, baseConfig, baseTimeConfig);

    const expectedResult = { ...baseResult, data: [{ id: 'bigNumber', values: [[1708880400000, 626172]] }] };
    expect(transformedResult).toEqual(expectedResult);
  });

  it('should transform to per-second averages with PER_SECOND aggregation', () => {
    const config: Config<UnifiedMetricConfiguration> = {
      ...baseConfig,
      metricConfiguration: { ...baseConfig.metricConfiguration, aggregation: 'PER_SECOND' }
    };

    const transformedResult = transformLogsResult(baseResult, config, baseTimeConfig);

    const expectedResult = {
      ...baseResult,
      data: [
        {
          id: baseResult.data?.[0].id,
          values: [[1708880400000, (626172 / windowSizeMillis) * 1000]]
        }
      ]
    };
    expect(transformedResult).toEqual(expectedResult);
  });
});

describe('getLogMetricsConfig', () => {
  it('initializes and applies basic transformations without timestamp shift', () => {
    const inputMetrics: UnifiedMetricConfigurations = {
      metric1: {
        ...metricConfigurationBase,
        timeConfig: { ...baseTimeConfig, windowSize: 300 }
      }
    };
    const expected = {
      metric1: {
        ...metricConfigurationBase,
        granularity: 300,
        timeConfig: { ...baseTimeConfig, windowSize: 300, focusedMoment: timestamp }
      }
    };
    expect(getLogMetricsConfig(inputMetrics)).toEqual(expected);
  });

  it('applies timestamp shift correctly to the comparison metric', () => {
    const inputMetrics = {
      comparison: {
        ...metricConfigurationBase,
        timeConfig: { to: timestamp, windowSize: windowSizeMillis, autoRefresh: false, focusedMoment: timestamp },
        timeShift: { offset: oneHourInMillis } //1 hour,
      }
    };
    const expectedToWithOffset = timestamp + oneHourInMillis;
    const result = getLogMetricsConfig(inputMetrics);
    expect(result.comparison.timeConfig.to).toBe(expectedToWithOffset);
    expect(result.comparison.timeConfig.focusedMoment).toBe(expectedToWithOffset);
  });

  it('handles autoRefresh by setting to and focusedMoment to null', () => {
    const inputMetrics = {
      metricAutoRefresh: {
        ...metricConfigurationBase,
        timeConfig: { autoRefresh: true, windowSize: 300, to: null, focusedMoment: null }
      }
    };
    const result = getLogMetricsConfig(inputMetrics);
    expect(result.metricAutoRefresh.timeConfig.to).toBeNull();
    expect(result.metricAutoRefresh.timeConfig.focusedMoment).toBeNull();
  });

  it('handles null to value and timestamp shift', () => {
    const inputMetrics = {
      comparison: {
        ...metricConfigurationBase,
        timeConfig: { to: null, focusedMoment: null, windowSize: windowSizeMillis, autoRefresh: false },
        timeShift: { offset: oneHourInMillis } // 1 hour
      }
    };
    const result = getLogMetricsConfig(inputMetrics);
    expect(result.comparison.timeConfig.to).not.toBeNull();
    expect(result.comparison.timeConfig.focusedMoment).not.toBeNull();
  });

  it('confirms original metrics object is not mutated', () => {
    const originalMetrics = JSON.parse(JSON.stringify(metricsBase)); // Deep copy
    getLogMetricsConfig(metricsBase);
    expect(metricsBase).toEqual(originalMetrics);
  });

  it('correctly handles multiple metrics, with and without comparison and autoRefresh', () => {
    const inputMetrics = {
      metric1: {
        ...metricConfigurationBase,
        timeConfig: { ...baseTimeConfig, windowSize: windowSizeMillis }
      },
      comparison: {
        ...metricConfigurationBase,
        timeConfig: { ...baseTimeConfig, to: timestamp, windowSize: windowSizeMillis },
        timeShift: { offset: oneHourInMillis }
      },
      metricAutoRefresh: {
        ...metricConfigurationBase,
        timeConfig: { ...baseTimeConfig, autoRefresh: true, windowSize: windowSizeMillis }
      }
    };
    const result = getLogMetricsConfig(inputMetrics);

    expect(result.metric1.granularity).toBe(windowSizeMillis);
    expect(result.comparison.timeConfig.to).toBe(timestamp + oneHourInMillis);
    expect(result.metricAutoRefresh.timeConfig.to).toBeNull();
  });
});
