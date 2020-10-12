import { find } from 'lodash';
import React from 'react';

import { renderer as availableRenderers, defaultRenderer } from 'in-custom-dashboards/widgets/Chart/renderer';
import { extendWindowSizeOnLiveMode, getChartGranularity } from 'in-applications/metrics';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import { formatters, defaultFormatter } from 'in-stores/metric/formatters';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';

export default function UnifiedMetricsChart({
  config,
  title,
  cardHeader,
  customHeight,
  automaticallySize,
  shareMaxAxisDomain,
  reverseLegendOrder,
  reverseTooltipOrder,
  tooltipTimeFormatter,
  renderPostChartContent,
  cardUseMaxAvailableHeight
}) {
  const timeConfig = useTimeConfig();
  let result = useResultData(config, timeConfig) ?? pendingResult;

  // Transform result data structure into the structure expected by the chart
  if (result && result.data) {
    const y1Labels = result.data.filter(d => d.id.startsWith('y1')).map(d => d.label);
    const y2Labels = result.data.filter(d => d.id.startsWith('y2')).map(d => d.label);
    result = {
      ...result,
      data: result.data.reduce((agg, { id, values }) => {
        agg[id] = values;
        return agg;
      }, {})
    };
    if (y1Labels.length > 0 && !y1Labels.includes(undefined)) {
      //The labels object is required when displaying grouped results (each with their own label).
      result = {
        ...result,
        y1Labels: y1Labels
      };
    }
    if (y2Labels.length > 0 && !y2Labels.includes(undefined)) {
      //The labels object is required when displaying grouped results (each with their own label).
      result = {
        ...result,
        y2Labels: y2Labels
      };
    }
  }

  return (
    <ChartWrapper
      cardTitle={title}
      timeConfig={timeConfig}
      y1={toAxisConfiguration('y1', config.y1)}
      y2={toAxisConfiguration('y2', config.y2)}
      metricsConfiguration={toMetricsConfiguration(config)}
      primaryContextMenuAction={config.primaryContextMenuAction}
      additionalContextMenuButtons={config.additionalContextMenuButtons}
      result={result}
      granularity={config.granularity}
      // pass through props
      cardHeader={cardHeader}
      customHeight={customHeight}
      automaticallySize={automaticallySize}
      shareMaxAxisDomain={shareMaxAxisDomain}
      reverseLegendOrder={reverseLegendOrder}
      reverseTooltipOrder={reverseTooltipOrder}
      tooltipTimeFormatter={tooltipTimeFormatter}
      renderPostChartContent={renderPostChartContent}
      cardUseMaxAvailableHeight={cardUseMaxAvailableHeight}
    />
  );
}

function useResultData(config, timeConfig) {
  const timeConfigExtendedForLiveMode = extendWindowSizeOnLiveMode(timeConfig);
  const granularity = config.granularity ?? getChartGranularity(timeConfigExtendedForLiveMode);

  const metrics = {};

  config.y1.metrics.forEach(
    (metricConfiguration, i) =>
      (metrics[getMetricId('y1', i)] = {
        ...metricConfiguration,
        resultType: config.type,
        granularity,
        timeConfig: timeConfigExtendedForLiveMode,
        timeShift: translateOffsetToTimeShiftConfig(metricConfiguration.timeShift, timeConfigExtendedForLiveMode)
      })
  );

  config.y2.metrics.forEach(
    (metricConfiguration, i) =>
      (metrics[getMetricId('y2', i)] = {
        ...metricConfiguration,
        resultType: config.type,
        granularity,
        timeConfig: timeConfigExtendedForLiveMode,
        timeShift: translateOffsetToTimeShiftConfig(metricConfiguration.timeShift, timeConfigExtendedForLiveMode)
      })
  );

  return useObservable(getUnifiedMetrics({ metrics }), [timeConfig, config]);
}

function toAxisConfiguration(name, axis) {
  if (axis.metrics.length === 0) {
    return;
  }

  return {
    renderer: (find(availableRenderers, ({ id }) => id === axis.renderer) || defaultRenderer).renderer,
    formatter: (find(formatters, ({ id }) => id === axis.formatter) || defaultFormatter).formatter,
    tooltipFormatter: axis.tooltipFormatter,
    labels: axis.metrics.map(({ label }) => label),
    colors: axis.colors,
    metricIds: axis.metrics.map((definition, i) => getMetricId(name, i)),
    defaultDisabledMetrics: axis.metrics
      .map((m, i) => (m.defaultDisabled === true ? getMetricId(name, i) : null))
      .filter(Boolean),
    min: axis.min,
    max: axis.max,
    calculateStackDifferences: axis.calculateStackDifferences
  };
}

function getMetricId(axis, index) {
  return `${axis}-${index}`;
}

export function parseMetricId(metricId) {
  const [axis, index] = metricId.split('-');
  return { axis: axis, index: index };
}

function toMetricsConfiguration(config) {
  const metricsConfiguration = {
    metrics: {}
  };

  config.y1.metrics.forEach(
    ({ metric, aggregation, timeShift }, i) =>
      (metricsConfiguration.metrics[getMetricId('y1', i)] = {
        metric,
        aggregation,
        timeShift
      })
  );

  config.y2.metrics.forEach(
    ({ metric, aggregation, timeShift }, i) =>
      (metricsConfiguration.metrics[getMetricId('y2', i)] = {
        metric,
        aggregation,
        timeShift
      })
  );

  if (config.reverseOrder) {
    metricsConfiguration.reverseOrder = config.reverseOrder;
  }

  return metricsConfiguration;
}
