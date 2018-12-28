import { intersection, find } from 'lodash';
import { withState } from 'recompose';
import React from 'react';

import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import Chart from 'in-components/Chart/ChartReactComponent';
import ButtonGroup from 'in-new-components/ButtonGroup';
import { identity } from 'in-services/util/function';

import locals from './GroupMetricsChart.mless';

export default withState('selectedChart', 'setSelectedChart', null)(GroupMetricsChart);

function GroupMetricsChart({
  items,
  groupColors,
  time,
  selectedChart,
  setSelectedChart,
  chartDefinitions,
  timeConfig,
  groupNameProcessor
}) {
  if (!items || items.length === 0) {
    // the errors and progress information of this chart will be rendered by the call group table, no need to
    // render them twice.
    return null;
  }

  const metricsAvailableForPresentation = intersection(Object.keys(items[0].metrics), chartDefinitions.map(d => d.key));

  if (metricsAvailableForPresentation.length === 0) {
    // no chart metrics found, just omit the charts element.
    return null;
  }

  const chartDefinitionsAvailableForPresentation = chartDefinitions.filter(
    d => metricsAvailableForPresentation.indexOf(d.key) !== -1
  );

  selectedChart = selectedChart || chartDefinitionsAvailableForPresentation[0].key;
  let chartDefinition = find(chartDefinitions, d => d.key === selectedChart);
  if (!chartDefinition) {
    chartDefinition = chartDefinitionsAvailableForPresentation[0];
    selectedChart = chartDefinition.key;
  }

  // Render chart selector and chart.
  return (
    <div className={locals.charts}>
      <div className={locals.buttonGroup}>
        <ButtonGroup
          buttonPropsList={chartDefinitionsAvailableForPresentation.map(({ label, key }) => ({
            text: label,
            key,
            onClick: () => setSelectedChart(key)
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
  groupNameProcessor = identity
}) {
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
