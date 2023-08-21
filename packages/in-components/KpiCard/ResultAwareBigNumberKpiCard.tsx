/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import { find } from 'lodash';

import { MetricResult, Result, TagFilter, TimeConfig, UnifiedMetricConfiguration } from '@instana/types';

import { getTimeShiftLabel, hasActiveTimeShift, translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import ResultAwareKpiCard from 'in-components/KpiCard/ResultAwareKpiCard';
import KpiCard, { IconAction } from 'in-components/KpiCard/KpiCard';
import Badge from 'in-custom-dashboards/widgets/BigNumber/Badge';
import { percentage } from 'in-services/formatters/number';
import { FormatterFn } from 'in-stores/metric/formatters';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

export const metricKey = 'bigNumber';
export const companionMetricKey = 'companion';
export const comparisonMetricKey = 'comparison';

export interface Config<METRIC_CONFIG extends UnifiedMetricConfiguration> {
  metricConfiguration: METRIC_CONFIG;
  formatter?: string;
  tagFilters?: TagFilter[];
  getColor?: (metricValue: number | Nullish) => string | undefined;
  comparisonIncreaseColor?: string;
  comparisonDecreaseColor?: string;
}

export interface ConfigWithCompanionMetric<METRIC_CONFIG extends UnifiedMetricConfiguration>
  extends Config<METRIC_CONFIG> {
  companionMetricConfiguration: UnifiedMetricConfiguration;
}

export interface ConfigWithStaticCompanion<METRIC_CONFIG extends UnifiedMetricConfiguration>
  extends Config<METRIC_CONFIG> {
  staticCompanionValue: ReactNode;
}

export interface ResultAwareBigNumberKpiCardProps<METRIC_CONFIG extends UnifiedMetricConfiguration> {
  title: string;
  formatter: FormatterFn;
  companionFormatter?: FormatterFn;
  useMaxAvailableHeight?: boolean;
  iconAction?: IconAction;
  config: Config<METRIC_CONFIG> | ConfigWithCompanionMetric<METRIC_CONFIG> | ConfigWithStaticCompanion<METRIC_CONFIG>;
  actions?: ReactNode;
  dragHandle?: ReactNode;
  result: Result<MetricResult[]>;
  raw?: boolean;
}

export function isConfigWithCompanionMetric<METRIC_CONFIG extends UnifiedMetricConfiguration>(
  config: Config<METRIC_CONFIG>
): config is ConfigWithCompanionMetric<METRIC_CONFIG> {
  return (config as ConfigWithCompanionMetric<METRIC_CONFIG>).companionMetricConfiguration != null;
}

export function isConfigWithStaticCompanion<METRIC_CONFIG extends UnifiedMetricConfiguration>(
  config: Config<METRIC_CONFIG>
): config is ConfigWithStaticCompanion<METRIC_CONFIG> {
  return 'staticCompanionValue' in config;
}

export default function ResultAwareBigNumberKpiCard<METRIC_CONFIG extends UnifiedMetricConfiguration>({
  title,
  formatter,
  companionFormatter,
  useMaxAvailableHeight,
  iconAction,
  config,
  actions,
  dragHandle,
  result,
  raw
}: ResultAwareBigNumberKpiCardProps<METRIC_CONFIG>) {
  const timeConfig = useTimeConfig();

  return (
    <ResultAwareKpiCard
      title={title}
      result={result}
      useMaxAvailableHeight={useMaxAvailableHeight}
      actions={
        dragHandle || actions ? (
          <>
            {dragHandle}
            {actions}
          </>
        ) : undefined
      }
      renderKpiCard={result =>
        renderKpiCard(
          result,
          config,
          formatter,
          title,
          timeConfig,
          companionFormatter,
          iconAction,
          actions,
          dragHandle,
          useMaxAvailableHeight,
          raw
        )
      }
    />
  );
}

export function renderKpiCard<METRIC_CONFIG extends UnifiedMetricConfiguration>(
  result: Result<MetricResult[]>,
  config: Config<METRIC_CONFIG> | ConfigWithCompanionMetric<METRIC_CONFIG> | ConfigWithStaticCompanion<METRIC_CONFIG>,
  formatter: FormatterFn,
  title: string,
  timeConfig: TimeConfig,
  companionFormatter: FormatterFn | undefined,
  iconAction: IconAction | undefined,
  actions: ReactNode,
  dragHandle: ReactNode,
  useMaxAvailableHeight: boolean | undefined,
  raw: boolean | undefined
) {
  let value = null;
  const dataPoint = find(result.data, ({ id }) => id === metricKey);
  if (dataPoint?.values?.length === 1) {
    value = dataPoint.values[0][1];
  }

  // We are using the [0] selector as in this aspect we assume multiple results have the same value
  // Example Mean Latency receive a "Companion", which we assume have the same resultPrecision as it's parent.
  const resultPrecisions = result?.data?.map(elem => elem.resultPrecisionDetails?.resultPrecision)[0];

  let companionValue = undefined;
  if (hasActiveTimeShift(config.metricConfiguration.timeShift)) {
    companionValue = renderTimeShiftValue(config, result, formatter, value, timeConfig);
  } else if (isConfigWithCompanionMetric(config)) {
    companionValue = renderCompanionValue(result, companionFormatter as FormatterFn);
  } else if (isConfigWithStaticCompanion(config)) {
    companionValue = config.staticCompanionValue;
  }

  return (
    <KpiCard
      title={title}
      value={value}
      renderValue={formatter}
      color={config.getColor?.(value)}
      useMaxAvailableHeight={useMaxAvailableHeight}
      actions={
        dragHandle || actions ? (
          <>
            {dragHandle}
            {actions}
          </>
        ) : undefined
      }
      companionValue={companionValue}
      iconAction={iconAction}
      resultPrecision={resultPrecisions}
      raw={raw}
    />
  );
}

function renderCompanionValue(result: Result<MetricResult[]>, companionFormatter: FormatterFn) {
  const dataPoint = find(result.data, ({ id }) => id === companionMetricKey);
  if (dataPoint?.values?.length === 1) {
    return companionFormatter(dataPoint.values[0][1]);
  }
  return null;
}

function renderTimeShiftValue<METRIC_CONFIG extends UnifiedMetricConfiguration>(
  config: Config<METRIC_CONFIG> | ConfigWithCompanionMetric<METRIC_CONFIG>,
  result: Result<MetricResult[]>,
  formatter: FormatterFn,
  value: number | null,
  timeConfig: TimeConfig
) {
  if (!hasActiveTimeShift(config.metricConfiguration.timeShift) || value == null) {
    return null;
  }

  let comparisonValue;
  const dataPoint = find(result.data, ({ id }) => id === comparisonMetricKey);
  if (dataPoint?.values?.length === 1) {
    comparisonValue = dataPoint.values[0][1];
  }

  if (comparisonValue == null) {
    return null;
  }

  let colorId = blue.id;
  if (value > comparisonValue) {
    colorId = config.comparisonIncreaseColor ?? blue.id;
  } else if (value < comparisonValue) {
    colorId = config.comparisonDecreaseColor ?? blue.id;
  }

  const difference = comparisonValue === 0 ? (value === 0 ? 0 : value / Math.abs(value)) : value / comparisonValue - 1;

  let formattedDifference = percentage.detailed(difference);
  if (difference > 0) {
    // force a + sign in front to highlight positive changes
    formattedDifference = `+${formattedDifference}`;
  }

  const timeShiftConfig = translateOffsetToTimeShiftConfig(config.metricConfiguration.timeShift, timeConfig);
  const tooltip = t('in-components:kpiCard.tooltipComparedToTimeShift', {
    timeShift: getTimeShiftLabel(timeShiftConfig).toLowerCase(),
    comparisonValue: formatter(comparisonValue)
  });

  return (
    <Tooltip content={tooltip}>
      <Badge colorId={colorId}>{formattedDifference}</Badge>
    </Tooltip>
  );
}
