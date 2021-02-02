/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { newTimeMetric, newNumberMetric } from 'in-analyze/metricDefinitionHelpers';
import { callClickedTracker, traceClickedTracker } from 'in-analyze/tracker';
import { number, percentage, millis } from 'in-services/formatters/number';
import getTraceGroups from 'in-subscription/application/getTraceGroups';
import getCallGroups from 'in-subscription/application/getCallGroups';
import getTraces from 'in-subscription/application/getTraces';
import Renderer from 'in-components/Chart/renderer/Renderer';
import getCalls from 'in-subscription/application/getCalls';
import { entityTypes } from 'in-analyze/applicationFilter';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export const CALLS = 'CALLS';
export const TRACES = 'TRACES';

export const defaultMetrics = [
  { metric: 'latency', aggregation: 'MEAN' },
  { metric: 'errors', aggregation: 'MEAN' }
];

const calls = newNumberMetric({ metric: 'calls', label: 'Calls' });

const errorRate = {
  metric: 'errors',
  label: t('in-applications:analyze.errorRateLabel'),
  formatter: percentage,
  supportedAggregations: ['MEAN'],
  preferredRenderer: Renderer.stackedBar,
  min: 0,
  category: t('in-applications:analyze.errorRateCategory')
};

const erroneousCalls = newNumberMetric({
  metric: 'erroneousCalls',
  label: t('in-applications:analyze.erroneousCallsLabel'),
  category: t('in-applications:analyze.erroneousCallsCategory')
});

const latency = {
  ...newTimeMetric({
    metric: 'latency',
    label: t('in-applications:labelLatency'),
    category: t('in-applications:labelLatency')
  }),
  unfoldAggregations: true
};

export const availableMetrics = [calls, latency, erroneousCalls, errorRate];

export const chartMetricKey = (metric, aggregation) => `${metric}_${aggregation}`;
export const sparkChartMetricKey = (metric, aggregation) => `${metric}_${aggregation}_Spark`;
export const aggregateMetricKey = (metric, aggregation) => `${metric}_${aggregation}_Agg`;

export const getMetricAndAggregationFromMetricKey = key => {
  if (isNotBlank(key)) {
    const [metric, aggregation] = key.split('_');
    return [{ metric: metric, aggregation: aggregation }];
  }
  return null;
};

export const dataSourceConstants = {
  calls: {
    metricKey: 'calls_SUM_Agg',
    metricLabel: t('in-applications:analyze.metricLabel', { count: 1 }),
    metricsLabel: t('in-applications:analyze.metricLabel', { count: 2 }),
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
      calls: { formatter: number.compact, label: t('in-applications:labelCalls'), type: 'count', aggregations: ['SUM'] }
    },
    metricConfiguration: {
      latency: {
        formatter: millis.forcedCompactOnMs.detailed,
        label: t('in-applications:labelLatency'),
        type: 'time',
        aggregations: ['MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX', 'MEAN']
      },
      errors: {
        formatter: percentage.detailed,
        label: t('in-applications:analyze.errorMetricLabel'),
        type: 'rate',
        aggregations: ['MEAN']
      },
      erroneousCalls: {
        formatter: number.compact,
        label: t('in-applications:analyze.erroneousCallsCategory'),
        type: 'count',
        aggregations: ['SUM']
      }
    },
    latencyTag: 'call.latency',
    getData: getCalls,
    getGroupData: getCallGroups,
    clickedTracker: callClickedTracker
  },
  traces: {
    metricKey: 'traces_SUM_Agg',
    metricLabel: t('in-applications:analyze.traceLabel', { count: 1 }),
    metricsLabel: t('in-applications:analyze.traceLabel', { count: 2 }),
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
      traces: {
        formatter: number.compact,
        label: t('in-applications:labelTraces'),
        type: 'count',
        aggregations: ['SUM']
      }
    },
    metricConfiguration: {
      latency: {
        formatter: millis.forcedCompactOnMs.detailed,
        label: t('in-applications:labelLatency'),
        type: 'time',
        aggregations: ['MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX', 'MEAN']
      },
      errors: {
        formatter: percentage.detailed,
        label: t('in-applications:analyze.erroneousTraceRate'),
        type: 'rate',
        aggregations: ['MEAN']
      },
      erroneousCalls: {
        formatter: number.compact,
        label: t('in-applications:analyze.erroneousTrace'),
        type: 'count',
        aggregations: ['SUM']
      }
    },
    latencyTag: 'trace.latency',
    getData: getTraces,
    getGroupData: getTraceGroups,
    clickedTracker: traceClickedTracker
  }
};
