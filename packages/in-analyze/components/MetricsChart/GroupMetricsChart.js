/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { find } from 'lodash';
import React from 'react';

import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import { aggregationLabels } from 'in-stores/metric/metric';
import ButtonGroup from 'in-new-components/ButtonGroup';
import { number } from 'in-services/formatters/number';
import { identity } from 'in-services/util/function';

import locals from './MetricsChart.mless';

export default GroupMetricsChart;

function GroupMetricsChart({
  items,
  groupColors,
  time,
  onChange,
  chartDefinitions,
  timeConfig,
  groupNameProcessor,
  focusedMetric,
  customChartRenderers = []
}) {
  // auto refresh mode is not supported in analyze.
  timeConfig = {
    to: time,
    focusedMoment: time,
    autoRefresh: false,
    windowSize: timeConfig.windowSize
  };

  const chartDefinitionKeys = chartDefinitions.map(d => d.key);
  if (chartDefinitionKeys.length === 0) {
    // no metrics to show
    return null;
  }

  if (!focusedMetric || !chartDefinitionKeys.includes(focusedMetric)) {
    focusedMetric = chartDefinitionKeys[0];
  }

  // Render chart selector and chart.
  return (
    <div className={locals.charts}>
      <div className={locals.buttonGroup}>
        <ButtonGroup
          buttonPropsList={chartDefinitions.map(({ label, key }) => ({
            text: label,
            key,
            onClick: () => onChange({ focusedMetric: key })
          }))}
          activeKey={focusedMetric}
        />
      </div>

      <ChartElement
        items={items}
        groupColors={groupColors}
        time={time}
        timeConfig={timeConfig}
        focusedMetric={focusedMetric}
        chartDefinitions={chartDefinitions}
        groupNameProcessor={groupNameProcessor}
        customChartRenderers={customChartRenderers}
      />

      <div className={locals.whitespace} />
    </div>
  );
}

function ChartElement({
  items,
  groupColors,
  timeConfig,
  time,
  focusedMetric,
  chartDefinitions,
  groupNameProcessor = identity,
  customChartRenderers
}) {
  const customChartRenderer = find(customChartRenderers, renderer => renderer.key === focusedMetric);
  if (customChartRenderer) {
    return customChartRenderer.render();
  }

  if (!items || !time) {
    return <LoadingIndicator height={189} size="xxl" />;
  }

  const groups = items.slice(0, 5);
  if (groups.length === 0 || !groups[0]?.metrics || !groups[0]?.metrics[focusedMetric]) {
    return <NoDataAvailable height={189} icon={'lib_bar_chart'} text={'No data to display'} />;
  }

  const chartDefinition = find(chartDefinitions, d => d.key === focusedMetric);

  const chartTimeConfig = getResolvedTimeConfig(timeConfig, time);
  const granularity = getChartGranularity(timeConfig);
  const groupNames = groups.map(group => groupNameProcessor(group.name));
  const y1 = {
    labels: groupNames,
    renderer: chartDefinition.renderer,
    formatter: chartDefinition.formatter,
    colors: groupColors,
    metrics: groups.map(group => group.metrics[focusedMetric]),
    aggregations: Array(groups.length).fill(chartDefinition.aggregation),
    min: chartDefinition.min
  };

  return (
    <Chart
      timeConfig={chartTimeConfig}
      y1={y1}
      granularity={granularity}
      renderLegend={false}
      legendColorIndicatorShape="rect"
      restrictTooltipItemsTo={5}
    />
  );
}

export function metricsChartDefinitions(metrics, availableMetrics) {
  return metrics.map(({ metric, aggregation }) => {
    let label = `${metric} (${aggregation})`;
    let renderer = Renderer.line;
    let formatter = number;
    let min;

    const metricDefinition = find(availableMetrics, m => m.metric === metric);
    if (metricDefinition) {
      label = metricDefinition.label;
      renderer = metricDefinition.preferredRenderer;
      formatter = metricDefinition.formatter;
      min = metricDefinition.min;

      if (metricDefinition.supportedAggregations.length > 1) {
        label += ` (${aggregationLabels[aggregation]})`;
      }
    }

    return {
      label,
      key: `${metric}_${aggregation}`,
      renderer,
      aggregation,
      formatter,
      min
    };
  });
}
