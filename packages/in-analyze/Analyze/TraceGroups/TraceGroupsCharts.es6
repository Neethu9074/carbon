import React, { Fragment } from 'react';
import { withState } from 'recompose';

import TraceGroupsChartWrapper from 'in-analyze/Analyze/TraceGroups/TraceGroupsChartWrapper';
import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { millis } from 'in-services/formatters/number';
import Button from 'in-new-components/Button';

import locals from './TraceGroupsCharts.mless';

export const MAX_TRACE_GROUP_CHARTS = 8;

export default withState('selectedChart', 'setSelectedChart', 'calls')(TraceGroupCharts);

const chartDefinitions = {
  calls: {
    y1: {
      renderer: Renderer.line,
      metricIds: ['calls']
    },
    getMetricsDefinitions: granularity => ({
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
      metricIds: ['errors']
    },
    getMetricsDefinitions: granularity => ({
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
      metricIds: ['latency'],
      formatter: {
        compact: millis.detailed,
        detailed: millis.detailed
      },
      min: 0
    },
    getMetricsDefinitions: granularity => ({
      latency: {
        metric: 'latency',
        granularity,
        aggregation: 'MEAN'
      }
    })
  }
};

function TraceGroupCharts({
                            items,
                            errors,
                            progress,
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

      {/* load chart data only for the top 8 groups for performance reasons */}
      <TraceGroupsChartWrapper
        groups={items.slice(0, MAX_TRACE_GROUP_CHARTS).map(group => group.name)}
        traceGroupColors={traceGroupColors}
        timeframe={timeframe}
        y1={chartDefinition.y1}
        metricsConfiguration={{
          filter: {
            timeframe,
            application: applicationId,
            service: serviceId,
            endpoint: endpointId
          },
          metrics: chartDefinition.getMetricsDefinitions(granularity)
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
