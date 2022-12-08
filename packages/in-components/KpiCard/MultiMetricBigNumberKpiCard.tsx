/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import MultiMetricResultAwareBigNumberKpiCard, {
  Config,
  ConfigWithCompanionMetric,
  isConfigWithCompanionMetric
} from 'in-components/KpiCard/MultiMetricResultAwareBigNumberKpiCard';
import { MetricResult, Result, UnifiedMetricConfigurationUnion } from 'in-types';
import { GetBigNumberKpiCardResult } from 'in-components/KpiCard/KpiHelper';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import { IconAction } from 'in-components/KpiCard/KpiCard';
import { FormatterFn } from 'in-stores/metric/formatters';
import useTimeConfig from 'in-hooks/useTimeConfig';

export const metricKey = 'bigNumber';
export const companionMetricKey = 'companion';
export const comparisonMetricKey = 'comparison';

export interface MultiMetricsKpiCardProps {
  title: string;
  formatter: Array<FormatterFn>;
  companionFormatter?: FormatterFn;
  useMaxAvailableHeight?: boolean;
  iconAction?: IconAction;
  config: Array<Config | ConfigWithCompanionMetric>;
  actions?: ReactNode;
  dragHandle?: ReactNode;
  raw?: boolean;
}

export default function MultiMetricBigNumberKpiCard({
  title,
  formatter,
  companionFormatter,
  useMaxAvailableHeight,
  iconAction,
  config,
  actions,
  dragHandle,
  raw
}: MultiMetricsKpiCardProps) {
  const timeConfig = useTimeConfig();

  const metricDefaults = {
    timeShift: {
      offset: 0
    },
    timeConfig,
    resultType: 'SINGLE_NUMBER'
  } as const;
  var resultArray: Array<Result<MetricResult[]>> = [];
  var metricArray: Array<{ [index: string]: UnifiedMetricConfigurationUnion }> = [];
  for (var i = 0; i < config.length; i++) {
    var metrics: { [index: string]: UnifiedMetricConfigurationUnion } = {
      [metricKey]: {
        ...config[i].metricConfiguration,
        ...config[i].tagFilters,
        ...metricDefaults
      }
    };
    // var config = null;
    if (config[i].metricConfiguration.timeShift) {
      metrics[comparisonMetricKey] = {
        ...config[i].metricConfiguration,
        ...metricDefaults,
        timeShift: translateOffsetToTimeShiftConfig(config[i].metricConfiguration.timeShift, timeConfig)
      };
    } else if (isConfigWithCompanionMetric(config[i])) {
      let conf = config[i] as ConfigWithCompanionMetric;
      metrics[companionMetricKey] = {
        ...metricDefaults,
        ...conf.companionMetricConfiguration
      };
    }

    metricArray.push(metrics);
    let configObj = config[i] as Config | ConfigWithCompanionMetric;
    resultArray.push(GetBigNumberKpiCardResult({ config: configObj }));
  }

  return (
    <MultiMetricResultAwareBigNumberKpiCard
      title={title}
      result={resultArray}
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
        ) : (
          undefined
        )
      }
      raw={raw}
    />
  );
}
