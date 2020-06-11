import { intersection, find } from 'lodash';
import React from 'react';

import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import getLatencyDistributionBase10 from 'in-subscription/application/getLatencyDistributionBase10';
import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import { aggregationLabels } from 'in-stores/metric/metric';
import ButtonGroup from 'in-new-components/ButtonGroup';
import { number } from 'in-services/formatters/number';
import { identity } from 'in-services/util/function';

import locals from './GroupMetricsChart.mless';

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
  filters
}) {
  if (!items || items.length === 0 || !time) {
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

  const metricsAvailableForPresentation = intersection(Object.keys(items[0].metrics), chartDefinitions.map(d => d.key))
    //Include charts based on selected metrics and distribution of calls
    .concat('calls_DISTRIBUTION');

  const chartDefinitionsAvailableForPresentation = chartDefinitions.filter(
    d => metricsAvailableForPresentation.indexOf(d.key) !== -1
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
        filters={filters}
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
  filters
}) {
  const chartDefinition = find(chartDefinitions, d => d.key === selectedChart);

  if (chartDefinition.aggregation === 'DISTRIBUTION') {
    return (
      <LatencyDistributionBase10Chart
        subscription={getLatencyDistributionBase10({
          maxLatencyBuckets: 80,
          filter: filters
        })}
        chartDefinition={chartDefinition}
      />
    );
  }
  return (
    <TimeChart
      timeConfig={timeConfig}
      time={time}
      groups={groups}
      groupNameProcessor={groupNameProcessor}
      groupColors={groupColors}
      chartDefinition={chartDefinition}
      selectedChart={selectedChart}
    />
  );
}

function TimeChart({ timeConfig, time, groups, groupNameProcessor, groupColors, chartDefinition, selectedChart }) {
  const granularity = getChartGranularity(timeConfig);
  const groupNames = groups.map(group => groupNameProcessor(group.name));
  const chartTimeConfig = getResolvedTimeConfig(timeConfig, time);
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
