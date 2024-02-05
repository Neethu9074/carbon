/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { useObservable } from '@instana/hooks';

import ResultAwareBigNumberKpiCard, {
  Config,
  ConfigWithCompanionMetric,
  ConfigWithStaticCompanion,
  isConfigWithCompanionMetric
} from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { getTimeConfigBasedOnMetricConfiguration } from 'in-custom-dashboards/widgets/_shared/lastTimeConfig';
import { hasActiveTimeShift, translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import { getLogMetricsConfig } from 'in-components/KpiCard/utils';
import { MetricResult, Result, UnifiedMetricConfiguration } from 'in-types';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { IconAction } from 'in-components/KpiCard/KpiCard';
import { FormatterFn } from 'in-stores/metric/formatters';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { useLogsPolling } from 'in-components/KpiCard/useLogsPolling';

export const metricKey = 'bigNumber';
export const companionMetricKey = 'companion';
export const comparisonMetricKey = 'comparison';

export interface BigNumberKpiCardProps {
  title: string;
  formatter: FormatterFn;
  companionFormatter?: FormatterFn;
  useMaxAvailableHeight?: boolean;
  iconAction?: IconAction;
  config:
    | Config<UnifiedMetricConfiguration>
    | ConfigWithCompanionMetric<UnifiedMetricConfiguration>
    | ConfigWithStaticCompanion<UnifiedMetricConfiguration>;
  actions?: ReactNode;
  dragHandle?: ReactNode;
  raw?: boolean;
  isInModal?: boolean;
}

export default function BigNumberKpiCard({
  title,
  formatter,
  companionFormatter,
  useMaxAvailableHeight,
  iconAction,
  config,
  actions,
  isInModal,
  dragHandle,
  raw
}: BigNumberKpiCardProps) {
  const timeConfig = useTimeConfig();
  const usedTimeConfig = getTimeConfigBasedOnMetricConfiguration(config.metricConfiguration, timeConfig);

  const metricDefaults = {
    timeShift: {
      offset: 0
    },
    resultType: 'SINGLE_NUMBER'
  } as const;

  let logsMetricsConfig: { granularity?: number } = {};

  let metrics: { [index: string]: UnifiedMetricConfiguration } = {
    [metricKey]: {
      // @ts-expect-error The types require an additional timeConfig to be set, but that does not reflect the actual capabilities of the component and likely also not legacy usage
      timeConfig: usedTimeConfig,
      ...config.metricConfiguration,
      ...config.tagFilters,
      ...metricDefaults,
      ...logsMetricsConfig
    }
  };

  //if (hasActiveTimeShift(config.metricConfiguration.timeShift) && config.metricConfiguration.source !== "LOG") {
  if (hasActiveTimeShift(config.metricConfiguration.timeShift)) {
    metrics[comparisonMetricKey] = {
      // @ts-expect-error The types require an additional timeConfig to be set, but that does not reflect the actual capabilities of the component and likely also not legacy usage
      timeConfig: usedTimeConfig,
      ...config.metricConfiguration,
      ...metricDefaults,
      timeShift: translateOffsetToTimeShiftConfig(config.metricConfiguration.timeShift, timeConfig)
    };
  } else if (isConfigWithCompanionMetric(config)) {
    metrics[companionMetricKey] = {
      // @ts-expect-error The types require an additional timeConfig to be set, but that does not reflect the actual capabilities of the component and likely also not legacy usage
      timeConfig,
      ...metricDefaults,
      ...config.companionMetricConfiguration
    };
  }

  if (config.metricConfiguration.source === 'LOG') {
    metrics = getLogMetricsConfig(metrics);
  }

  let result: Result<MetricResult[]> =
    useObservable(() => getUnifiedMetrics({ metrics }), [config, timeConfig, config.metricConfiguration.timeShift]) ??
    pendingResult;

  const logsResult = useLogsPolling({ metrics: metrics, timeConfig: timeConfig, config: config }) ?? pendingResult;

  const isLogsPolling = config.metricConfiguration.source === 'LOG' && timeConfig.autoRefresh;

  if (isLogsPolling) {
    result = logsResult;
  }

  return (
    <ResultAwareBigNumberKpiCard
      title={title}
      result={result}
      formatter={formatter}
      companionFormatter={companionFormatter}
      useMaxAvailableHeight={useMaxAvailableHeight}
      isInModal={isInModal}
      iconAction={iconAction}
      config={config}
      actions={
        dragHandle || actions ? (
          <>
            {dragHandle}
            {actions}
          </>
        ) : undefined
      }
      raw={raw}
    />
  );
}
