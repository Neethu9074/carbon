/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { InfraMetricConfiguration, MetricResult, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  Config,
  ConfigWithCompanionMetric,
  isConfigWithCompanionMetric
} from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { pendingResult } from 'in-services/fixedObjects';

export const metricKey = 'bigNumber';
export const companionMetricKey = 'companion';
export const comparisonMetricKey = 'comparison';

export interface BigNumberKpiCardProps {
  config: Config<InfraMetricConfiguration> | ConfigWithCompanionMetric<InfraMetricConfiguration>;
}

export function GetBigNumberKpiCardResult({ config }: BigNumberKpiCardProps) {
  const timeConfig = config.metricConfiguration.timeConfig;

  const metricDefaults = {
    timeShift: {
      offset: 0
    },
    timeConfig,
    resultType: 'SINGLE_NUMBER'
  } as const;

  const metrics: { [index: string]: InfraMetricConfiguration } = {
    [metricKey]: {
      ...config.metricConfiguration,
      ...config.tagFilters,
      ...metricDefaults
    }
  };

  if (config.metricConfiguration.timeShift) {
    metrics[comparisonMetricKey] = {
      ...config.metricConfiguration,
      ...metricDefaults,
      timeShift: translateOffsetToTimeShiftConfig(config.metricConfiguration.timeShift, timeConfig)
    };
  } else if (isConfigWithCompanionMetric(config)) {
    metrics[companionMetricKey] = {
      ...metricDefaults,
      ...config.companionMetricConfiguration
    };
  }

  const result: Result<MetricResult[]> =
    useObservable(() => getUnifiedMetrics({ metrics }), [config, timeConfig, config.metricConfiguration.timeShift]) ??
    pendingResult;

  return result;
}
