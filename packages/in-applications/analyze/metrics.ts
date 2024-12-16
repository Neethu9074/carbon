/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error needs migration
import { newTimeMetric, wrapToDiscardNegativeValues } from 'in-analyze/metricDefinitionHelpers';
import { millis, number, percentage } from 'in-services/formatters/number';
import getTraceGroups from 'in-applications/subscriptions/getTraceGroups';
import getCallGroups from 'in-applications/subscriptions/getCallGroups';
import getTraces from 'in-applications/subscriptions/getTraces';
import getCalls from 'in-applications/subscriptions/getCalls';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { entityTypes } from 'in-analyze/applicationFilter';
import { isNotBlank } from 'in-services/util/string';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

export const CALLS = 'CALLS';
export const TRACES = 'TRACES';

export const defaultMetrics = [
  { metric: 'latency', aggregation: 'MEAN' },
  { metric: 'errors', aggregation: 'MEAN' }
];

const calls = {
  metric: 'calls',
  label: t('in-applications:analyze.calls'),
  formatter: wrapToDiscardNegativeValues(number.forcedCompact),
  supportedAggregations: ['SUM', 'PER_SECOND'],
  min: 0,
  preferredRenderer: Renderer.stackedBar,
  unfoldAggregations: false
};

const errorRate = {
  metric: 'errors',
  label: t('in-applications:analyze.errorRateLabel'),
  formatter: percentage,
  supportedAggregations: ['MEAN'],
  preferredRenderer: Renderer.stackedBar,
  min: 0,
  category: t('in-applications:analyze.errorRateCategory')
};

const erroneousCalls = {
  metric: 'erroneousCalls',
  label: t('in-applications:analyze.erroneousCallsLabel'),
  category: t('in-applications:analyze.erroneousCallsCategory'),
  formatter: wrapToDiscardNegativeValues(number.forcedCompact),
  supportedAggregations: ['SUM', 'PER_SECOND'],
  min: 0,
  preferredRenderer: Renderer.stackedBar,
  unfoldAggregations: false
};

const latency = {
  ...newTimeMetric({
    metric: 'latency',
    label: t('in-applications:labelLatency'),
    category: t('in-applications:labelLatency')
  }),
  unfoldAggregations: true
};

export const availableMetrics = [calls, latency, erroneousCalls, errorRate];

export const isPotentialProblemsSupportedByMetric = (metric: string) => ['calls', 'latency', 'errors'].includes(metric);

export const chartMetricKey = (metric: string, aggregation: string) => `${metric}_${aggregation}`;
export const sparkChartMetricKey = (metric: string, aggregation: string) => `${metric}_${aggregation}_Spark`;
export const aggregateMetricKey = (metric: string, aggregation: string) => `${metric}_${aggregation}_Agg`;

export const getMetricAndAggregationFromMetricKey = (key: string | Nullish) => {
  if (isNotBlank(key)) {
    const [metric, aggregation] = key!.split('_');
    return [{ metric: metric, aggregation: aggregation }];
  }
  return null;
};

export const getTypeTextByCount = (type: string, count: number) => {
  switch (type) {
    case 'call':
      return t('in-applications:analyze.typeCall', { count: count });
    case 'trace':
      return t('in-applications:analyze.typeTrace', { count: count });
    default:
      return '';
  }
};

export const dataSourceConstants = {
  calls: {
    metricKey: 'calls_SUM_Agg',
    metricLabel: t('in-applications:analyze.metricLabel', { count: 1 }),
    metricsLabel: t('in-applications:analyze.metricLabel', { count: 2 }),
    type: 'call',
    name: t('in-applications:labelCall'),
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
        aggregations: ['MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX', 'MEAN', 'SUM']
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
    metricCatalogSupportedMetrics: {
      calls: ['SUM', 'PER_SECOND'],
      latency: ['P25', 'P50', 'P95', 'SUM', 'P75', 'P90', 'P98', 'P99', 'MEAN', 'MIN', 'MAX'],
      erroneousCalls: ['SUM', 'PER_SECOND'],
      errors: ['MEAN']
    },
    metricCatalogSupportedChartableMetrics: {
      calls: ['SUM', 'PER_SECOND'],
      latency: ['P25', 'P50', 'P95', 'SUM', 'P75', 'P90', 'P98', 'P99', 'MEAN', 'MIN', 'MAX', 'DISTRIBUTION'],
      erroneousCalls: ['SUM', 'PER_SECOND'],
      errors: ['MEAN'],
      'call.metric': ['SUM', 'MEAN', 'MIN', 'MAX'],
      'call.meta_metrics': ['SUM', 'MIN', 'MEAN', 'MAX']
    },
    supportedCustomMetrics: ['call.metric', 'call.meta_metrics'],
    latencyTag: 'call.latency',
    getData: getCalls,
    getGroupData: getCallGroups,
    traceIdName: 'traceId'
  },
  traces: {
    metricKey: 'traces_SUM_Agg',
    metricLabel: t('in-applications:analyze.traceLabel', { count: 1 }),
    metricsLabel: t('in-applications:analyze.traceLabel', { count: 2 }),
    type: 'trace',
    name: t('in-applications:labelTrace'),
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
        aggregations: ['MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX', 'MEAN', 'SUM']
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
    metricCatalogSupportedMetrics: {
      traces: ['SUM'],
      latency: ['P25', 'P50', 'P95', 'SUM', 'P75', 'P90', 'P98', 'P99', 'MEAN', 'MIN', 'MAX'],
      erroneousCalls: ['SUM'],
      errors: ['MEAN']
    },
    latencyTag: 'trace.latency',
    getData: getTraces,
    getGroupData: getTraceGroups,
    traceIdName: 'id'
  }
};
