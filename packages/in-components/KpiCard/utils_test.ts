/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getLogMetricsConfig, transformLogsResult, UnifiedMetricConfigurations } from 'in-components/KpiCard/utils';
import { Result, TimeConfig } from '@instana/types';
import { minutes } from 'in-services/time';
import { pendingResult } from 'in-services/fixedObjects';
import { Config } from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { UnifiedMetricConfiguration } from 'in-types';
import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';

const windowSizeMillis = minutes.toMillis(60);

export const baseTimeConfig: TimeConfig = {
  to: Date.now(),
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
  time: Date.now(),
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
  time: Date.now(),
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
  timeShift: {offset: 0}
}

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
    const config: Config<UnifiedMetricConfiguration> = { ...baseConfig, metricConfiguration: { ...baseConfig.metricConfiguration, aggregation: 'PER_SECOND' } };

    const transformedResult = transformLogsResult(baseResult, config, baseTimeConfig);

    const expectedResult = {
      ...baseResult,
      data: [
        {
          id: baseResult.data?.[0].id,
          values: [
            [ 1708880400000, 626172 / windowSizeMillis * 1000 ]
          ]
        }
      ]
    };
    expect(transformedResult).toEqual(expectedResult);
  });
});

const oneHourInMillis = 1000 * 60 * 60;
describe('getLogMetricsConfig', () => {
  const now = Date.now();

  it('initializes and applies basic transformations without time shift', () => {
    const inputMetrics: UnifiedMetricConfigurations = {
      metric1: {
        ...metricConfigurationBase,
        timeConfig: { ...baseTimeConfig, windowSize: 300 },
      },
    };
    const expected = {
      metric1: {
        ...metricConfigurationBase,
        granularity: 300,
        timeConfig: { ...baseTimeConfig, windowSize: 300 },
      },
    };
    expect(getLogMetricsConfig(inputMetrics)).toEqual(expected);
  });

  it('applies time shift correctly to the comparison metric', () => {
    const inputMetrics = {
      comparison: {
        ...metricConfigurationBase,
        timeConfig: { to: now, windowSize: windowSizeMillis, autoRefresh: false, focusedMoment: now },
        timeShift: { offset: oneHourInMillis } //1 hour,
      },
    };
    const expectedToWithOffset = now + oneHourInMillis;
    const result = getLogMetricsConfig(inputMetrics);
    expect(result.comparison.timeConfig.to).toBe(expectedToWithOffset);
    expect(result.comparison.timeConfig.focusedMoment).toBe(expectedToWithOffset);
  });

  it('handles autoRefresh by setting to and focusedMoment to null', () => {
    const inputMetrics = {
      metricAutoRefresh: {
        ...metricConfigurationBase,
        timeConfig: { autoRefresh: true, windowSize: 300, to: null, focusedMoment:null },
      },
    };
    const result = getLogMetricsConfig(inputMetrics);
    expect(result.metricAutoRefresh.timeConfig.to).toBeNull();
    expect(result.metricAutoRefresh.timeConfig.focusedMoment).toBeNull();
  });

  it('handles null to value and time shift', () => {
    const inputMetrics = {
      comparison: {
        ...metricConfigurationBase,
        timeConfig: { to: null, focusedMoment: null, windowSize: windowSizeMillis, autoRefresh: false },
        timeShift: { offset: oneHourInMillis }, // 1 hour
      },
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
        timeConfig: { ...baseTimeConfig, windowSize: windowSizeMillis },
      },
      comparison: {
        ...metricConfigurationBase,
        timeConfig: { ...baseTimeConfig, to: now, windowSize: windowSizeMillis },
        timeShift: { offset: oneHourInMillis },
      },
      metricAutoRefresh: {
        ...metricConfigurationBase,
        timeConfig: { ...baseTimeConfig, autoRefresh: true, windowSize: windowSizeMillis },
      },
    };
    const result = getLogMetricsConfig(inputMetrics);

    expect(result.metric1.granularity).toBe(windowSizeMillis);
    expect(result.comparison.timeConfig.to).toBe(now + oneHourInMillis);
    expect(result.metricAutoRefresh.timeConfig.to).toBeNull();
  });
});

