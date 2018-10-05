import React, { Fragment } from 'react';
import { withState } from 'recompose';

import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import { millis, percentage } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import ButtonGroup from 'in-new-components/ButtonGroup';

import locals from './GroupMetricsChart.mless';

export default withState('selectedChart', 'setSelectedChart', 'latency')(GroupMetricsChart);

function GroupMetricsChart({
  isTracesDataSource,
  items,
  errors,
  progress,
  time,
  filters,
  groupColors,
  selectedChart,
  setSelectedChart
}) {
  if (errors.length > 0) {
    // the errors of this loading stage will be rendered by the call group table, no need to render them twice.
    return null;
  } else if (progress.loading) {
    return (
      <Fragment>
        <HorizontalIndicator progress={progress} />
        <div className={locals.whitespace} />
      </Fragment>
    );
  } else if (!items || items.length === 0 || !items[0].metrics.latency) {
    // No groups found or no chart metrics found, just omit the charts element.
    return null;
  }

  const countMetricText = isTracesDataSource ? 'Traces' : 'Calls';
  const countMetricKey = isTracesDataSource ? 'traces' : 'calls';

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
        groups={items}
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
