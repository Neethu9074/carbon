import React, { Fragment } from 'react';
import { withState } from 'recompose';

import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
import { millis, percentage } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import ButtonGroup from 'in-components/ButtonGroup';
import Button from 'in-new-components/Button';

import locals from './TraceGroupsCharts.mless';

export default withState('selectedChart', 'setSelectedChart', 'latencyChartData')(TraceGroupCharts);

function TraceGroupCharts({
  items,
  errors,
  progress,
  time,
  filter,
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
    <div className={locals.traceGroupsCharts}>
      <ButtonGroup horizontal className={locals.chartSelector}>
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
      </ButtonGroup>

      <TraceGroupsChartElement
        traceGroups={items}
        traceGroupColors={traceGroupColors}
        timeConfig={filter.timeConfig}
        time={time}
        selectedChart={selectedChart}
      />
      <div className={locals.whitespace} />
    </div>
  );
}

function ChartSelectButton({ chartId, label, activeChartId, setSelectedChart }) {
  return (
    <Button
      size="compact"
      kind={chartId === activeChartId ? 'primary' : 'secondary'}
      onClick={() => setSelectedChart(chartId)}
      className={locals.chartSelectButton}
    >
      {label}
    </Button>
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

function TraceGroupsChartElement({ traceGroups, traceGroupColors, timeConfig, time, selectedChart }) {
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

  return <Chart timeConfig={chartTimeConfig} y1={y1} granularity={granularity} renderLegend={false} />;
}
