import { withState } from 'recompose';
import React from 'react';

import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { millis, percentage } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import ButtonGroup from 'in-new-components/ButtonGroup';

import locals from './GroupMetricsChart.mless';

export default withState('selectedChart', 'setSelectedChart', 'latency')(GroupMetricsChart);

function GroupMetricsChart({ items, errors, progress, time, filters, groupColors, selectedChart, setSelectedChart }) {
  if (errors.length > 0 || progress.loading) {
    // the errors and progress information of this chart will be rendered by the call group table, no need to
    // render them twice.
    return null;
  } else if (!items || items.length === 0 || !items[0].metrics.latency) {
    // No groups found or no chart metrics found, just omit the charts element.
    return null;
  }

  const { countMetricText, countMetricKey } = getConfigByDataSource(filters.get('dataSource'));
  const groups = items.slice(0, 5);

  // Render chart selector and chart.
  return (
    <div className={locals.charts}>
      <div className={locals.buttonGroup}>
        <ButtonGroup
          buttonPropsList={[
            { text: 'Latency', key: 'latency', onClick: () => setSelectedChart('latency') },
            { text: countMetricText, key: countMetricKey, onClick: () => setSelectedChart(countMetricKey) },
            { text: 'Error Rate', key: 'errors', onClick: () => setSelectedChart('errors') }
          ]}
          activeKey={selectedChart}
        />
      </div>

      <ChartElement
        groups={groups}
        groupColors={groupColors}
        timeConfig={filters.get('timeConfig')}
        time={time}
        selectedChart={selectedChart}
      />
      <div className={locals.whitespace} />
    </div>
  );
}

const chartDefinitions = {
  calls: {
    renderer: Renderer.line,
    aggregation: 'SUM'
  },
  traces: {
    renderer: Renderer.line,
    aggregation: 'SUM'
  },
  errors: {
    renderer: Renderer.line,
    aggregation: 'MEAN',
    formatter: percentage
  },
  latency: {
    renderer: Renderer.line,
    formatter: millis.fixed,
    min: 0
  }
};

function ChartElement({ groups, groupColors, timeConfig, time, selectedChart }) {
  const chartDefinition = chartDefinitions[selectedChart];

  const chartTimeConfig = getResolvedTimeConfig(timeConfig, time);
  const granularity = getChartGranularity(timeConfig);
  const groupNames = groups.map(group => group.name);
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
