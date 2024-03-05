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
  if (result.data && result.data[0].values) {
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
export function getLogMetricsConfig(metrics: UnifiedMetricConfigurations) {
  const newMetrics = cloneDeep(metrics) as Record<string, Mutable<UnifiedMetricConfiguration>>;
  for (const [key] of Object.entries(newMetrics)) {
    newMetrics[key].granularity = newMetrics[key].timeConfig.windowSize;
    if (key === 'comparison') {
      const newTimeConfig = cloneDeep(newMetrics.comparison.timeConfig) as Mutable<TimeConfig>;
      const to = newMetrics.comparison.timeConfig.to;
      const now = Date.now();
      const offset = newMetrics.comparison.timeShift.offset;
      const toWithOffset = (to ?? now) + offset;

      newTimeConfig.to = toWithOffset;
      newTimeConfig.focusedMoment = toWithOffset;

      newMetrics.comparison.timeConfig = newTimeConfig;
    }

    if (newMetrics[key].timeConfig.autoRefresh) {
      const newTimeConfig = cloneDeep(newMetrics[key].timeConfig) as Mutable<TimeConfig>;

      newTimeConfig.to = null;
      newTimeConfig.focusedMoment = null;
      newMetrics[key].timeConfig = newTimeConfig;
    }

    newMetrics[key].granularity = newMetrics[key].timeConfig.windowSize;
  }

  return newMetrics;
}
