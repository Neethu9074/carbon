import { find } from 'lodash';
import React from 'react';

import { translateOffsetToTimeShiftConfig, getTimeShiftLabel } from 'in-stores/time/shifting';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import ResultAwareKpiCard from 'in-new-components/KpiCard/ResultAwareKpiCard';
import { defaultFormatter, formatters } from 'in-stores/metric/formatters';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import Badge from 'in-custom-dashboards/widgets/BigNumber/Badge';
import { percentage } from 'in-services/formatters/number';
import { pendingResult } from 'in-services/fixedObjects';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Tooltip from 'in-components/Tooltip';

const metricKey = 'bigNumber';
const comparisonMetricKey = 'comparison';

export default function BigNumber({ config, title, actions, dragHandle, isPreview }) {
  const timeConfig = useTimeConfig();

  const metrics = {
    [metricKey]: {
      ...config.metricConfiguration,
      timeShift: {
        offset: 0
      },
      timeConfig,
      granularity: null,
      resultType: 'SINGLE_NUMBER'
    }
  };

  if (config.metricConfiguration.timeShift !== 0) {
    metrics[comparisonMetricKey] = {
      ...config.metricConfiguration,
      timeConfig,
      timeShift: translateOffsetToTimeShiftConfig(config.metricConfiguration.timeShift, timeConfig),
      granularity: null,
      resultType: 'SINGLE_NUMBER'
    };
  }
  const result = useObservable(getUnifiedMetrics({ metrics }), [config, timeConfig]) ?? pendingResult;

  return (
    <ResultAwareKpiCard
      title={title}
      result={result}
      useMaxAvailableHeight={!isPreview}
      actions={
        <>
          {dragHandle}
          {actions}
        </>
      }
      renderKpiCard={result => renderKpiCard(result, config, title, actions, dragHandle, isPreview, timeConfig)}
    />
  );
}

function renderKpiCard(result, config, title, actions, dragHandle, isPreview, timeConfig) {
  let value = null;
  const dataPoint = find(result.data, ({ id }) => id === metricKey);
  if (dataPoint && dataPoint.values.length === 1) {
    value = dataPoint.values[0][1];
  }

  let formattedValue = null;
  const { formatter } = find(formatters, ({ id }) => id === config.formatter) || defaultFormatter;
  if (value != null) {
    formattedValue = formatter(value);
  }

  return (
    <KpiCard
      title={title}
      value={formattedValue}
      companionValue={renderCompanionValue(config, result, value, formatter, timeConfig)}
      useMaxAvailableHeight={!isPreview}
      actions={
        <>
          {dragHandle}
          {actions}
        </>
      }
    />
  );
}

function renderCompanionValue(config, result, value, formatter, timeConfig) {
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

  const timeShiftConfig = translateOffsetToTimeShiftConfig(config.metricConfiguration.timeShift, timeConfig);
  const tooltip = `Compared to ${getTimeShiftLabel(timeShiftConfig).toLowerCase()}: ${formatter(comparisonValue)}`;

  return (
    <Tooltip content={tooltip}>
      <Badge colorId={colorId}>{formattedDifference}</Badge>
    </Tooltip>
  );
}
