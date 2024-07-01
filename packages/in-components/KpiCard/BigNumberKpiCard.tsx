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
import { MetricResult, Result, UnifiedMetricConfigurationUnion, TagFilterExpressionElementUnion } from 'in-types';
import { getTimeConfigBasedOnMetricConfiguration } from 'in-custom-dashboards/widgets/_shared/lastTimeConfig';
import { hasActiveTimeShift, translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import { ThresholdFn } from 'in-custom-dashboards/widgets/_shared/threshold';
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
  config:
    | Config<UnifiedMetricConfigurationUnion>
    | ConfigWithCompanionMetric<UnifiedMetricConfigurationUnion>
    | ConfigWithStaticCompanion<UnifiedMetricConfigurationUnion>;
  actions?: ReactNode;
  dragHandle?: ReactNode;
  raw?: boolean;
  isInModal?: boolean;
  thresholdFn?: ThresholdFn;
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
  thresholdFn,
  dragHandle,
  raw
}: BigNumberKpiCardProps) {
  const timeConfig = useTimeConfig();
  const usedTimeConfig = getTimeConfigBasedOnMetricConfiguration(config.metricConfiguration, timeConfig);

  const metricDefaults = {
    timeShift: {
      offset: 0
    },
    resultType: 'SINGLE_NUMBER',
    timeConfig: usedTimeConfig
  } as const;

  let metrics: { [index: string]: UnifiedMetricConfigurationUnion } = {
    [metricKey]: {
      ...config.metricConfiguration,
      ...metricDefaults,
      tagFilterExpression: {
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: config.tagFilters as TagFilterExpressionElementUnion[]
      }
    } as UnifiedMetricConfigurationUnion
  };

  if (hasActiveTimeShift(config.metricConfiguration.timeShift)) {
    metrics[comparisonMetricKey] = {
      ...config.metricConfiguration,
      ...metricDefaults,
      timeShift: translateOffsetToTimeShiftConfig(config.metricConfiguration.timeShift, timeConfig)
    };
  } else if (isConfigWithCompanionMetric(config)) {
    metrics[companionMetricKey] = {
      ...config.companionMetricConfiguration,
      ...metricDefaults
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
      thresholdFn={thresholdFn}
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
