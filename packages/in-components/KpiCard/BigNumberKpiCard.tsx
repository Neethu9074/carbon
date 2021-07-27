/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import { find } from 'lodash';

import { useObservable } from '@instana/hooks';

import { translateOffsetToTimeShiftConfig, getTimeShiftLabel } from 'in-stores/time/shifting';
import { MetricResult, Result, TimeConfig, UnifiedMetricConfiguration } from 'in-types';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import ResultAwareKpiCard from 'in-components/KpiCard/ResultAwareKpiCard';
import KpiCard, { IconAction } from 'in-components/KpiCard/KpiCard';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import Badge from 'in-custom-dashboards/widgets/BigNumber/Badge';
import { percentage } from 'in-services/formatters/number';
import { FormatterFn } from 'in-stores/metric/formatters';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export const metricKey = 'bigNumber';
export const companionMetricKey = 'companion';
export const comparisonMetricKey = 'comparison';

export interface Config {
  metricConfiguration: UnifiedMetricConfiguration & {
    timeShift: number;
  };
  companionMetricConfiguration: UnifiedMetricConfiguration;
  comparisonIncreaseColor: string;
  comparisonDecreaseColor: string;
  formatter?: string;
}

export interface BigNumberKpiCardProps {
  title: string;
  formatter: FormatterFn;
  companionFormatter?: FormatterFn;
  useMaxAvailableHeight?: boolean;
  iconAction?: IconAction;
  config: Config;
  actions?: ReactNode;
  dragHandle?: ReactNode;
}

export default function BigNumberKpiCard({
  title,
  formatter,
  companionFormatter,
  useMaxAvailableHeight,
  iconAction,
  config,
  actions,
  dragHandle
}: BigNumberKpiCardProps) {
  const timeConfig = useTimeConfig();

  const metricDefaults: Partial<UnifiedMetricConfiguration> = {
    timeShift: {
      offset: 0
    },
    timeConfig,
    resultType: 'SINGLE_NUMBER'
  };

  const metrics: { [index: string]: UnifiedMetricConfiguration } = {
    [metricKey]: {
      ...config.metricConfiguration,
      ...metricDefaults
    }
  };

  if (config.metricConfiguration.timeShift) {
    metrics[comparisonMetricKey] = {
      ...config.metricConfiguration,
      ...metricDefaults,
      timeShift: translateOffsetToTimeShiftConfig(config.metricConfiguration.timeShift, timeConfig)
    };
  } else if (config.companionMetricConfiguration != null) {
    metrics[companionMetricKey] = {
      ...metricDefaults,
      ...config.companionMetricConfiguration
    };
  }

  const result: Result<MetricResult[]> =
    useObservable(() => getUnifiedMetrics({ metrics }), [config, timeConfig, config.metricConfiguration.timeShift]) ??
    pendingResult;

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
        ) : (
          undefined
        )
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
          useMaxAvailableHeight
        )
      }
    />
  );
}

function renderKpiCard(
  result: Result<MetricResult[]>,
  config: Config,
  formatter: FormatterFn,
  title: string,
  timeConfig: TimeConfig,
  companionFormatter: FormatterFn | undefined,
  iconAction: IconAction | undefined,
  actions: ReactNode,
  dragHandle: ReactNode,
  useMaxAvailableHeight: boolean | undefined
) {
  let value = null;
  const dataPoint = find(result.data, ({ id }) => id === metricKey);
  if (dataPoint?.values?.length === 1) {
    value = dataPoint.values[0][1];
  }

  let formattedValue = null;
  if (value != null) {
    formattedValue = formatter(value);
  }

  return (
    <KpiCard
      title={title}
      value={formattedValue}
      useMaxAvailableHeight={useMaxAvailableHeight}
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
      companionValue={
        config.metricConfiguration.timeShift
          ? renderTimeShiftValue(config, result, formatter, value, timeConfig)
          : renderCompanionValue(result, companionFormatter as FormatterFn)
      }
      iconAction={iconAction}
    />
  );
}

function renderCompanionValue(result: Result<MetricResult[]>, companionFormatter: FormatterFn) {
  let value = null;
  const dataPoint = find(result.data, ({ id }) => id === companionMetricKey);
  if (dataPoint?.values?.length === 1) {
    value = dataPoint.values[0][1];
  }

  let formattedValue = null;
  if (value != null) {
    formattedValue = companionFormatter(value);
  }

  return formattedValue;
}

function renderTimeShiftValue(
  config: Config,
  result: Result<MetricResult[]>,
  formatter: FormatterFn,
  value: number | null,
  timeConfig: TimeConfig
) {
  const timeShift = config.metricConfiguration.timeShift as number;
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
    comparisonValue: formatter(comparisonValue)
  });

  return (
    <Tooltip content={tooltip}>
      <Badge colorId={colorId}>{formattedDifference}</Badge>
    </Tooltip>
  );
}
