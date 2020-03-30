import { find } from 'lodash';
import React from 'react';

import { renderer as availableRenderers, defaultRenderer } from 'in-custom-dashboards/widgets/Chart/renderer';
import { formatters, defaultFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import { extendWindowSizeOnLiveMode, getChartGranularity } from 'in-applications/metrics';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ config }) => ({
  timeConfig: timeConfig$,
  result: timeConfig$.map(extendWindowSizeOnLiveMode).flatMap(timeConfig => {
    const granularity = getChartGranularity(timeConfig);

    const metrics = {};

    config.y1.metrics.forEach(
      (metricConfiguration, i) =>
        (metrics[getMetricId('y1', i)] = {
          ...metricConfiguration,
          resultType: config.type,
          granularity,
          timeConfig,
          timeShift: translateOffsetToTimeShiftConfig(metricConfiguration.timeShift, timeConfig)
        })
    );

    config.y2.metrics.forEach(
      (metricConfiguration, i) =>
        (metrics[getMetricId('y2', i)] = {
          ...metricConfiguration,
          resultType: config.type,
          granularity,
          timeConfig,
          timeShift: translateOffsetToTimeShiftConfig(metricConfiguration.timeShift, timeConfig)
        })
    );

    return getUnifiedMetrics({ metrics });
  })
}))(ChartWidget);

function ChartWidget({ result, actions, config, title, timeConfig, customHeight, isPreview }) {
  // Transform result data structure into the structure expected by the chart
  if (result && result.data) {
    result = {
      ...result,
      data: result.data.reduce((agg, { id, values }) => {
        agg[id] = values;
        return agg;
      }, {})
    };
  }

  return (
    <ChartWrapper
      cardTitle={title}
      cardUseMaxAvailableHeight={!isPreview}
      cardHeader={actions}
      timeConfig={timeConfig}
      y1={toAxisConfiguration('y1', config.y1)}
      y2={toAxisConfiguration('y2', config.y2)}
      metricsConfiguration={toMetricsConfiguration(config)}
      result={result}
      customHeight={customHeight}
    />
  );
}

function toAxisConfiguration(name, axis) {
  if (axis.metrics.length === 0) {
    return;
  }

  return {
    renderer: (find(availableRenderers, ({ id }) => id === axis.renderer) || defaultRenderer).renderer,
    formatter: (find(formatters, ({ id }) => id === axis.formatter) || defaultFormatter).formatter,
    labels: axis.metrics.map(({ label }) => label),
    metricIds: axis.metrics.map((definition, i) => getMetricId(name, i)),
    min: axis.min,
    max: axis.max
  };
}

function getMetricId(axis, index) {
  return `${axis}-${index}`;
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

  return metricsConfiguration;
}
