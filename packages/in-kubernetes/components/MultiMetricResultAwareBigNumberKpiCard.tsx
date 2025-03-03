/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode } from 'react';
import { find } from 'lodash';

import { InfraMetricConfiguration, MetricResult, Result, TagFilter, TimeConfig } from '@instana/types';

import MultiMetricKpiCard, { KpiCardIconAction } from 'in-kubernetes/components/MultiMetricKpiCard';
import MultiMetricResultAwareKpiCard from 'in-kubernetes/components/MultiMetricResultAwareKpiCard';
import { getTimeShiftLabel, translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import Badge from 'in-custom-dashboards/widgets/BigNumber/Badge';
import { percentage } from 'in-services/formatters/number';
import { FormatterFn } from 'in-stores/metric/formatters';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export const metricKey = 'bigNumber';
export const companionMetricKey = 'companion';
export const comparisonMetricKey = 'comparison';

export interface Config {
  metricConfiguration: InfraMetricConfiguration;
  formatter?: string;
  tagFilters?: TagFilter[];
  comparisonIncreaseColor: string;
  comparisonDecreaseColor: string;
}

export interface ConfigWithCompanionMetric extends Config {
  companionMetricConfiguration: InfraMetricConfiguration;
}

export interface MultiResultAwareBigNumberKpiCardProps {
  title: string;
  formatter: Array<FormatterFn>;
  companionFormatter?: FormatterFn;
  useMaxAvailableHeight?: boolean;
  iconAction?: KpiCardIconAction;
  config: Array<Config | ConfigWithCompanionMetric>;
  actions?: ReactNode;
  dragHandle?: ReactNode;
  result: Array<Result<MetricResult[]>>;
  raw?: boolean;
}

export function isConfigWithCompanionMetric(
  config: Config | ConfigWithCompanionMetric
): config is ConfigWithCompanionMetric {
  return (config as ConfigWithCompanionMetric).companionMetricConfiguration != null;
}

export default function MultiMetricResultAwareBigNumberKpiCard({
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
}: MultiResultAwareBigNumberKpiCardProps) {
  const timeConfig = useTimeConfig();

  return (
    <MultiMetricResultAwareKpiCard
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

export function renderKpiCard(
  result: Array<Result<MetricResult[]>>,
  config: Array<Config | ConfigWithCompanionMetric>,
  formatter: Array<FormatterFn>,
  title: string,
  timeConfig: TimeConfig,
  companionFormatter: FormatterFn | undefined,
  iconAction: KpiCardIconAction | undefined,
  actions: ReactNode,
  dragHandle: ReactNode,
  useMaxAvailableHeight: boolean | undefined,
  raw: boolean | undefined
) {
  var formattedValue: Array<string | undefined | null> = [];
  var requestValue = null;
  result.forEach((result, index) => {
    const dataPoint = find(result.data, ({ id }) => id === metricKey);
    if (dataPoint?.values?.length === 1) {
      let value = dataPoint.values[0][1];
      if (index === 0) {
        requestValue = value;
      }
      if (value != null) {
        formattedValue.push(formatter[index](value));
      }
    } else {
      formattedValue.push(null);
    }
  });

  // We are using the [0] selector as in this aspect we assume multiple results have the same value
  // Example Mean Latency receive a "Companion", which we assume have the same resultPrecision as it's parent.
  const resultPrecisions = result[0]?.data?.map(elem => elem.resultPrecisionDetails?.resultPrecision)[0];
  var companionValue;

  if (config[0].metricConfiguration?.timeShift) {
    companionValue = renderTimeShiftValue(config[0], result[0], formatter, requestValue, timeConfig);
  } else {
    companionValue = renderCompanionValue(result[0], companionFormatter as FormatterFn);
  }

  return (
    <MultiMetricKpiCard
      title={title}
      value={formattedValue}
      timeshift={config[0].metricConfiguration.timeShift.offset}
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

function renderTimeShiftValue(
  config: Config | ConfigWithCompanionMetric,
  result: Result<MetricResult[]>,
  formatter: Array<FormatterFn>,
  value: number | null,
  timeConfig: TimeConfig
) {
  const timeShift = config.metricConfiguration.timeShift.offset;
  if (timeShift === 0 || value == null) {
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
    colorId = config.comparisonIncreaseColor;
  } else if (value < comparisonValue) {
    colorId = config.comparisonDecreaseColor;
  }
  const difference = comparisonValue === 0 ? (value === 0 ? 0 : value / Math.abs(value)) : value / comparisonValue - 1;
  let formattedDifference = percentage.detailed(difference);
  if (difference > 0) {
    // force a + sign in front to highlight positive changes
    formattedDifference = `+${formattedDifference}`;
  }

  const timeShiftConfig = translateOffsetToTimeShiftConfig(timeShift, timeConfig);
  const tooltip = t('in-components:kpiCard.tooltipComparedToTimeShift', {
    timeShift: getTimeShiftLabel(timeShiftConfig).toLowerCase(),
    comparisonValue: formatter[0](comparisonValue)
  });

  return (
    <Tooltip content={tooltip}>
      <Badge colorId={colorId}>{formattedDifference}</Badge>
    </Tooltip>
  );
}
