import { newTimeMetric, newNumberMetric } from 'in-analyze/metricDefinitionHelpers';
import { callClickedTracker, traceClickedTracker } from 'in-analyze/tracker';
import { number, percentage, millis } from 'in-services/formatters/number';
import getTraceGroups from 'in-subscription/application/getTraceGroups';
import getCallGroups from 'in-subscription/application/getCallGroups';
import getTraces from 'in-subscription/application/getTraces';
import Renderer from 'in-components/Chart/renderer/Renderer';
import getCalls from 'in-subscription/application/getCalls';
import { entityTypes } from 'in-analyze/applicationFilter';

export const CALLS = 'CALLS';
export const TRACES = 'TRACES';

export const defaultMetrics = [
  { metric: 'latency', aggregation: 'MEAN' },
  { metric: 'errors', aggregation: 'MEAN' }
];

const calls = newNumberMetric({ metric: 'calls', label: 'Calls' });

const errorRate = {
  metric: 'errors',
  label: 'Erroneous Calls (rate)',
  formatter: percentage,
  supportedAggregations: ['MEAN'],
  preferredRenderer: Renderer.stackedBar,
  min: 0,
  category: 'Erroneous Calls'
};

const erroneousCalls = newNumberMetric({
  metric: 'erroneousCalls',
  label: 'Erroneous Calls (count)',
  category: 'Erroneous Calls'
});

const latency = {
  ...newTimeMetric({ metric: 'latency', label: 'Latency', category: 'Latency' }),
  unfoldAggregations: true
};

export const availableMetrics = [calls, latency, erroneousCalls, errorRate];

export const chartMetricKey = (metric, aggregation) => `${metric}_${aggregation}`;
export const sparkChartMetricKey = (metric, aggregation) => `${metric}_${aggregation}_Spark`;
export const aggregateMetricKey = (metric, aggregation) => `${metric}_${aggregation}_Agg`;

export const getMetricAndAggregationFromMetricKey = key => {
  if (key != null) {
    const [metric, aggregation] = key.split('_');
    return [{ metric: metric, aggregation: aggregation }];
  }
  return null;
};

export const dataSourceConstants = {
  calls: {
    metricKey: 'calls_SUM_Agg',
    metricLabel: 'Call',
    metricsLabel: 'Calls',
    type: 'call',
    backendDataSource: CALLS,
    sumMetric: {
      calls_SUM_Agg: {
        metric: 'calls',
        aggregation: 'SUM'
      }
    },
    fixedMetrics: [{ metric: 'calls', aggregation: 'SUM' }],
    defaultMetrics: [
      { metric: 'latency', aggregation: 'MEAN' },
      { metric: 'errors', aggregation: 'MEAN' }
    ],
    defaultOrderByGroups: {
      by: 'calls_SUM_Agg',
      direction: 'DESC'
    },
    defaultGrouping: {
      groupbyTag: 'endpoint.name',
      groupbyTagEntity: entityTypes.DESTINATION
    },
    defaultCharts: [{ metric: 'latency', aggregation: 'DISTRIBUTION' }],
    fixedMetricConfiguration: {
      calls: { formatter: number.compact, label: 'Calls', type: 'count', aggregations: ['SUM'] }
    },
    metricConfiguration: {
      latency: {
        formatter: millis.forcedCompactOnMs.detailed,
        label: 'Latency',
        type: 'time',
        aggregations: ['MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX', 'MEAN']
      },
      errors: { formatter: percentage.detailed, label: 'Erroneous Calls Rate', type: 'rate', aggregations: ['MEAN'] },
      erroneousCalls: { formatter: number.compact, label: 'Erroneous Calls', type: 'count', aggregations: ['SUM'] }
    },
    latencyTag: 'call.latency',
    getData: getCalls,
    getGroupData: getCallGroups,
    clickedTracker: callClickedTracker
  },
  traces: {
    metricKey: 'traces_SUM_Agg',
    metricLabel: 'Trace',
    metricsLabel: 'Traces',
    type: 'trace',
    backendDataSource: TRACES,
    sumMetric: {
      traces_SUM_Agg: {
        metric: 'traces',
        aggregation: 'SUM'
      }
    },
    fixedMetrics: [{ metric: 'traces', aggregation: 'SUM' }],
    defaultMetrics: [
      { metric: 'latency', aggregation: 'MEAN' },
      { metric: 'errors', aggregation: 'MEAN' }
    ],
    defaultOrderByGroups: {
      by: 'traces_SUM_Agg',
      direction: 'DESC'
    },
    defaultGrouping: {
      groupbyTag: 'trace.endpoint.name'
    },
    defaultCharts: [{ metric: 'latency', aggregation: 'DISTRIBUTION' }],
    fixedMetricConfiguration: {
      traces: { formatter: number.compact, label: 'Traces', type: 'count', aggregations: ['SUM'] }
    },
    metricConfiguration: {
      latency: {
        formatter: millis.forcedCompactOnMs.detailed,
        label: 'Latency',
        type: 'time',
        aggregations: ['MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX', 'MEAN']
      },
      errors: {
        formatter: percentage.detailed,
        label: 'Erroneous Traces Rate',
        type: 'rate',
        aggregations: ['MEAN']
      },
      erroneousCalls: { formatter: number.compact, label: 'Erroneous Traces', type: 'count', aggregations: ['SUM'] }
    },
    latencyTag: 'trace.latency',
    getData: getTraces,
    getGroupData: getTraceGroups,
    clickedTracker: traceClickedTracker
  }
};
