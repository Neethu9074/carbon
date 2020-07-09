import { find, union, intersection } from 'lodash';
import React from 'react';

import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
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
  selectedChart,
  onChange,
  chartDefinitions,
  timeConfig,
  groupNameProcessor,
  focusedMetric,
  customChartRenderers = []
}) {
  if (!items || !time) {
    // the errors and progress information of this chart will be rendered by the call group table, no need to
    // render them twice.
    return null;
  }

  // auto refresh mode is not supported in analyze.
  timeConfig = {
    to: time,
    focusedMoment: time,
    autoRefresh: false,
    windowSize: timeConfig.windowSize
  };
  const metricsKeys = Object.keys(items[0].metrics);
  const chartDefinitionKeys = chartDefinitions.map(d => d.key);
  const metricsAvailableForPresentation = intersection(metricsKeys, chartDefinitionKeys);
  const customChartRendererKeys = customChartRenderers.map(d => d.key);

  const supportedMetricKeys = union(metricsAvailableForPresentation, customChartRendererKeys);
  if (supportedMetricKeys.length === 0) {
    // no metrics to show
    return null;
  }
  if (!focusedMetric || !supportedMetricKeys.includes(focusedMetric)) {
    focusedMetric = supportedMetricKeys[0];
  }

  const chartDefinitionsAvailableForPresentation = chartDefinitions.filter(
    def => supportedMetricKeys.indexOf(def.key) !== -1
  );

  selectedChart = selectedChart || chartDefinitionsAvailableForPresentation[0].key;
  let chartDefinition = find(chartDefinitionsAvailableForPresentation, d => d.key === selectedChart);
  if (!chartDefinition) {
    chartDefinition = chartDefinitionsAvailableForPresentation[0];
    selectedChart = chartDefinition.key;
  }

  if (focusedMetric) {
    const chartToDisplay = chartDefinitionsAvailableForPresentation.filter(chart => chart.key.includes(focusedMetric));
    selectedChart =
      chartToDisplay.length !== 0 ? chartToDisplay[0].key : chartDefinitionsAvailableForPresentation[0].key;
  }

  // Render chart selector and chart.
  return (
    <div className={locals.charts}>
      <div className={locals.buttonGroup}>
        <ButtonGroup
          buttonPropsList={chartDefinitionsAvailableForPresentation.map(({ label, key }) => ({
            text: label,
            key,
            onClick: () => onChange({ focusedMetric: key })
          }))}
          activeKey={selectedChart}
        />
      </div>

      <ChartElement
        groups={items.slice(0, 5)}
        groupColors={groupColors}
        time={time}
        timeConfig={timeConfig}
        selectedChart={selectedChart}
        chartDefinitions={chartDefinitionsAvailableForPresentation}
        groupNameProcessor={groupNameProcessor}
        focusedMetric={focusedMetric}
        customChartRenderers={customChartRenderers}
      />

      <div className={locals.whitespace} />
    </div>
  );
}

function ChartElement({
  groups,
  groupColors,
  timeConfig,
  time,
  selectedChart,
  chartDefinitions,
  groupNameProcessor = identity,
  customChartRenderers,
  focusedMetric
}) {
  const customChartRenderer = find(customChartRenderers, renderer => renderer.key === focusedMetric);
  if (customChartRenderer) {
    return customChartRenderer.render();
  }

  if (groups.length === 0) {
    return <NoDataAvailable height={189} icon={'lib_bar_chart'} text={'No data to display'} />;
  }

  const chartDefinition = find(chartDefinitions, d => d.key === selectedChart);

  const chartTimeConfig = getResolvedTimeConfig(timeConfig, time);
  const granularity = getChartGranularity(timeConfig);
  const groupNames = groups.map(group => groupNameProcessor(group.name));
  const y1 = {
    labels: groupNames,
    renderer: chartDefinition.renderer,
    formatter: chartDefinition.formatter,
    colors: groupColors,
    metrics: groups.map(group => group.metrics[selectedChart]),
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
