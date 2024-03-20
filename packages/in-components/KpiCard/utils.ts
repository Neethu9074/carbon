/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { cloneDeep } from 'lodash';

import { MetricResult, Result, TimeConfig } from '@instana/types';

import {
  Config,
  ConfigWithCompanionMetric,
  ConfigWithStaticCompanion
} from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { Mutable, UnifiedMetricConfiguration } from 'in-types';
import { deepCopy } from 'in-services/util/object';

/** Transform the result to patch in data needed to make the existing component work with logging data **/
export function transformLogsResult(
  result: Result<MetricResult[]>,
  config:
    | Config<UnifiedMetricConfiguration>
    | ConfigWithCompanionMetric<UnifiedMetricConfiguration>
    | ConfigWithStaticCompanion<UnifiedMetricConfiguration>,
  timeConfig: TimeConfig
): Result<MetricResult[]> {
  let newResult = deepCopy(result);

  if ((result.data?.[0]?.values?.length ?? 0) > 1) {
    newResult = reduceResultValues(newResult);
  }

  if (config.metricConfiguration.aggregation === 'PER_SECOND') {
    newResult = transformToPerSecondAverage(newResult, timeConfig);
  }

  return newResult;
}

function reduceResultValues(result: Result<MetricResult[]>): Result<MetricResult[]> {
  if (result.data) {
    return {
      ...result,
      data: result.data.map(item => {
        if (item.values?.length && item.values.length > 0) {
          return {
            ...item,
            values: [
              item.values.reduce(
                (acc, curr) => {
                  acc[1] += curr[1];
                  return acc;
                },
                [item.values[0][0], 0]
              )
            ]
          };
        }
        return item;
      })
    };
  }
  return result;
}

function transformToPerSecondAverage(result: Result<MetricResult[]>, timeConfig: TimeConfig): Result<MetricResult[]> {
  if (result.data && result.data[0]?.values) {
    result.data?.forEach(item => {
      item.values?.forEach(value => {
        value[1] = (value[1] / timeConfig.windowSize) * 1000;
      });
    });
    return result;
  }
  return result;
}

export interface UnifiedMetricConfigurations {
  [p: string]: UnifiedMetricConfiguration;
}

/** Transform metrics time config for logs widgets with time shift since time shift is not supported **/
export function getLogMetricsConfig(
  metrics: UnifiedMetricConfigurations,
  widgetType: 'BigNumber' | 'Chart' = 'BigNumber'
) {
  const newMetrics = cloneDeep(metrics) as Record<string, Mutable<UnifiedMetricConfiguration>>;
  for (const [key] of Object.entries(newMetrics)) {
    if (newMetrics[key].source !== 'LOG') continue;
    const newTimeConfig = cloneDeep(newMetrics[key].timeConfig) as Mutable<TimeConfig>;
    const to = newMetrics[key].timeConfig.to;
    const now = Date.now();
    const offset = newMetrics[key].timeShift.offset;
    const toWithOffset = (to ?? now) + offset;

    if (key !== 'comparison') {
      newMetrics[key].timeShift = { offset: 0 };
    }

    newTimeConfig.to = toWithOffset;
    newTimeConfig.focusedMoment = toWithOffset;

    newMetrics[key].timeConfig = newTimeConfig;

    if (newMetrics[key].timeConfig.autoRefresh) {
      const newTimeConfig = cloneDeep(newMetrics[key].timeConfig) as Mutable<TimeConfig>;

      newTimeConfig.to = null;
      newTimeConfig.focusedMoment = null;
      newMetrics[key].timeConfig = newTimeConfig;
    }

    if (widgetType === 'BigNumber') {
      newMetrics[key].granularity = newMetrics[key].timeConfig.windowSize;
    }
  }

  return newMetrics;
}

export function transformToPerSecondAggregation(data: UnifiedMetricsResult[], metrics: UnifiedMetricConfigurations) {
  if (!data || !data.values) return [];

  return data.map(dataset => {
    const metricConfig = metrics[dataset.id] ?? {};
    const { source, aggregation } = metricConfig;
    const isLogsPerSecondMetric = source === 'LOG' && aggregation === 'PER_SECOND';

    if (dataset.values && isLogsPerSecondMetric) {
      return {
        ...dataset,
        values: toPerSecondAverage(dataset.values)
      };
    } else return dataset;
  });
}

function toPerSecondAverage(data: number[][]): number[][] {
  if (data.length < 2) return [];

  const timeDiffSeconds = (data[1][0] - data[0][0]) / 1000;

  if (timeDiffSeconds === 0) return [];

  return data.map(([timestamp, value]) => {
    const avgPerSecond = value / timeDiffSeconds;
    return [timestamp, avgPerSecond] as [number, number];
  });
}
