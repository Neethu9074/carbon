/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { useObservable } from '@instana/hooks';

import ResultAwareBigNumberKpiCard, {
  Config,
  ConfigWithCompanionMetric,
  isConfigWithCompanionMetric
} from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { hasActiveTimeShift, translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import { MetricResult, Result, UnifiedMetricConfigurationUnion } from 'in-types';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { IconAction } from 'in-components/KpiCard/KpiCard';
import { FormatterFn } from 'in-stores/metric/formatters';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export const metricKey = 'bigNumber';
export const companionMetricKey = 'companion';
export const comparisonMetricKey = 'comparison';

export interface BigNumberKpiCardProps {
  title: string;
  formatter: FormatterFn;
  companionFormatter?: FormatterFn;
  useMaxAvailableHeight?: boolean;
  iconAction?: IconAction;
  config: Config | ConfigWithCompanionMetric;
  actions?: ReactNode;
  dragHandle?: ReactNode;
  raw?: boolean;
}

export default function BigNumberKpiCard({
  title,
  formatter,
  companionFormatter,
  useMaxAvailableHeight,
  iconAction,
  config,
  actions,
  dragHandle,
  raw
}: BigNumberKpiCardProps) {
  const timeConfig = useTimeConfig();

  const metricDefaults = {
    timeShift: {
      offset: 0
    },
    resultType: 'SINGLE_NUMBER'
  } as const;

  const metrics: { [index: string]: UnifiedMetricConfigurationUnion } = {
    [metricKey]: {
      // @ts-expect-error The types require an additional timeConfig to be set, but that does not reflect the actual capabilities of the component and likely also not legacy usage
      timeConfig,
      ...config.metricConfiguration,
      ...config.tagFilters,
      ...metricDefaults
    }
  };

  if (hasActiveTimeShift(config.metricConfiguration.timeShift)) {
    metrics[comparisonMetricKey] = {
      // @ts-expect-error The types require an additional timeConfig to be set, but that does not reflect the actual capabilities of the component and likely also not legacy usage
      timeConfig,
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

  const result: Result<MetricResult[]> =
    useObservable(() => getUnifiedMetrics({ metrics }), [config, timeConfig, config.metricConfiguration.timeShift]) ??
    pendingResult;

  return (
    <ResultAwareBigNumberKpiCard
      title={title}
      result={result}
      formatter={formatter}
      companionFormatter={companionFormatter}
      useMaxAvailableHeight={useMaxAvailableHeight}
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
