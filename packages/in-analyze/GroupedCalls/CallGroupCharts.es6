import React, { Fragment } from 'react';
import { withState } from 'recompose';

import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
import { millis, percentage } from 'in-services/formatters/number';
import { evaluateClassNames } from 'in-services/util/classnames';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';

import locals from './CallGroupCharts.mless';

export default withState('selectedChart', 'setSelectedChart', 'latencyChartData')(CallGroupCharts);

function CallGroupCharts({
  items,
  errors,
  progress,
  time,
  filters,
  traceGroupColors,
  selectedChart,
  setSelectedChart
}) {
  if (errors.length > 0) {
    // the errors of this loading stage will be rendered by the trace group table, no need to render them twice.
    return null;
  } else if (progress.loading) {
    return (
      <Fragment>
        <HorizontalIndicator progress={progress} />
        <div className={locals.whitespace} />
      </Fragment>
    );
  } else if (!items || items.length === 0) {
    // No groups found, just omit the charts element.
    return null;
  }

  // Render chart selector and chart.
  return (
    <div className={locals.charts}>
      <div className={locals.buttonGroup}>
        <ChartSelectButton
          chartId="latencyChartData"
          label="Latency"
          activeChartId={selectedChart}
          setSelectedChart={setSelectedChart}
        />
        <ChartSelectButton
          chartId="callsChartData"
          label="Calls"
          activeChartId={selectedChart}
          setSelectedChart={setSelectedChart}
        />
        <ChartSelectButton
          chartId="errorsChartData"
          label="Errors"
          activeChartId={selectedChart}
          setSelectedChart={setSelectedChart}
        />
      </div>

      <CallGroupChartElement
        traceGroups={items}
        traceGroupColors={traceGroupColors}
        timeConfig={filters.get('timeConfig')}
        time={time}
        selectedChart={selectedChart}
      />
      <div className={locals.whitespace} />
    </div>
  );
}

function ChartSelectButton({ chartId, label, setSelectedChart, activeChartId }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.chartSelectButton]: true,
        [locals.chartSelectedButton]: activeChartId === chartId
      })}
      onClick={() => setSelectedChart(chartId)}
    >
      {label}
    </div>
  );
}

const chartDefinitions = {
  callsChartData: {
    renderer: Renderer.line,
    aggregation: 'SUM'
  },
  errorsChartData: {
    renderer: Renderer.line,
    aggregation: 'MEAN',
    formatter: percentage
  },
  latencyChartData: {
    renderer: Renderer.line,
    formatter: millis,
    min: 0
  }
};

function CallGroupChartElement({ traceGroups, traceGroupColors, timeConfig, time, selectedChart }) {
  const chartDefinition = chartDefinitions[selectedChart];

  const chartTimeConfig = getResolvedTimeConfig(timeConfig, time);
  const granularity = getChartGranularity(timeConfig);
  const groupNames = traceGroups.map(group => group.name);
  const y1 = {
    labels: groupNames,
    renderer: chartDefinition.renderer,
    formatter: chartDefinition.formatter,
    colors: traceGroupColors,
    metrics: traceGroups.map(group => group.metrics[selectedChart]),
    aggregations: Array(traceGroups.length).fill(chartDefinition.aggregation),
    min: chartDefinition.min
  };

  return (
    <Chart
      timeConfig={chartTimeConfig}
      y1={y1}
      granularity={granularity}
      renderLegend={false}
      legendColorIndicatorShape="rect"
    />
  );
}
