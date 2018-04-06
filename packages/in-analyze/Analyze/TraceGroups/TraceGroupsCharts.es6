import React, { Fragment } from 'react';
import { withState } from 'recompose';

import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { millis } from 'in-services/formatters/number';
import Button from 'in-new-components/Button';
import theme from 'in-themes';

import locals from './TraceGroupsCharts.mless';

export default withState('selectedChart', 'setSelectedChart', 'calls')(TraceGroupCharts);

const chartDefinitions = {
  calls: {
    y1: {
      renderer: Renderer.line,
      labels: ['Calls'],
      metricIds: ['calls']
    },
    getMetrics: granularity => ({
      calls: {
        metric: 'calls',
        granularity,
        aggregation: 'SUM'
      }
    })
  },
  errors: {
    y1: {
      renderer: Renderer.line,
      labels: ['Errors'],
      metricIds: ['errors']
    },
    getMetrics: granularity => ({
      errors: {
        metric: 'errors',
        granularity,
        aggregation: 'MEAN'
      }
    })
  },
  latency: {
    y1: {
      renderer: Renderer.line,
      labels: ['Latency'],
      metricIds: ['latency'],
      colors: [theme.app20Chart.strokeColors100[2]],
      formatter: {
        compact: millis.detailed,
        detailed: millis.detailed
      },
      min: 0
    },
    getMetrics: granularity => ({
      latency: {
        metric: 'latency',
        granularity,
        aggregation: 'MEAN'
      }
    })
  }
};

function TraceGroupCharts({ filter, selectedChart, setSelectedChart }) {
  const { applicationId, serviceId, endpointId, timeframe } = filter;
  const granularity = getChartGranularity(timeframe);

  const chartDefinition = chartDefinitions[selectedChart];

  return (
    <Fragment>
      <div className={locals.chartSelector}>
        <ChartSelectButton
          chartId="calls"
          label="Calls"
          activeChartId={selectedChart}
          setSelectedChart={setSelectedChart}
        />
        <ChartSelectButton
          chartId="errors"
          label="Errors"
          activeChartId={selectedChart}
          setSelectedChart={setSelectedChart}
        />
        <ChartSelectButton
          chartId="latency"
          label="Latency"
          activeChartId={selectedChart}
          setSelectedChart={setSelectedChart}
        />
      </div>

      <ChartWrapper
        timeframe={timeframe}
        y1={chartDefinition.y1}
        metricsConfiguration={{
          filter: {
            timeframe,
            endpoint: endpointId,
            application: applicationId,
            service: serviceId
          },
          metrics: chartDefinition.getMetrics(granularity)
        }}
      />

      <div className={locals.whitespace} />
    </Fragment>
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
