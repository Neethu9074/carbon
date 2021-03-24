/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import { find } from 'lodash';
import React from 'react';

import { translateOffsetToTimeShiftConfig, getTimeShiftLabel } from 'in-stores/time/shifting';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import ResultAwareKpiCard from 'in-new-components/KpiCard/ResultAwareKpiCard';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import Badge from 'in-custom-dashboards/widgets/BigNumber/Badge';
import { percentage } from 'in-services/formatters/number';
import { pendingResult } from 'in-services/fixedObjects';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

const metricKey = 'bigNumber';
const companionMetricKey = 'companion';
const comparisonMetricKey = 'comparison';

export default function BigNumberKpiCard({
  title,
  formatter,
  companionFormatter,
  useMaxAvailableHeight,
  iconAction,
  config,
  actions,
  dragHandle
}) {
  const timeConfig = useTimeConfig();

  const metricDefaults = {
    timeShift: {
      offset: 0
    },
    timeConfig,
    granularity: null,
    resultType: 'SINGLE_NUMBER'
  };

  const metrics = {
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

  const result =
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
          : renderCompanionValue(result, companionFormatter)
      }
      iconAction={iconAction}
    />
  );
}

function renderCompanionValue(result, companionFormatter) {
  let value = null;
  const dataPoint = find(result.data, ({ id }) => id === companionMetricKey);
  if (dataPoint && dataPoint.values.length === 1) {
    value = dataPoint.values[0][1];
  }

  let formattedValue = null;
  if (value != null) {
    formattedValue = companionFormatter(value);
  }

  return formattedValue;
}

function renderTimeShiftValue(config, result, formatter, value, timeConfig) {
  const timeShift = config.metricConfiguration.timeShift;
  if (timeShift === 0 || value == null) {
    return null;
  }

  let comparisonValue;
  const dataPoint = find(result.data, ({ id }) => id === comparisonMetricKey);
  if (dataPoint && dataPoint.values.length === 1) {
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
  const tooltip = t('in-new-components:kpiCard.tooltipComparedToTimeShift', {
    timeShift: getTimeShiftLabel(timeShiftConfig).toLowerCase(),
    comparisonValue: formatter(comparisonValue)
  });

  return (
    <Tooltip content={tooltip}>
      <Badge colorId={colorId}>{formattedDifference}</Badge>
    </Tooltip>
  );
}
