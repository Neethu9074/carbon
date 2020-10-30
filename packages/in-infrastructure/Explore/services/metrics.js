import { just } from 'reactive-observables';

import { valueWithFormatterToReadableString, numberFormatterToFormatterType } from 'in-services/formatters/number';
import { percentageZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import getAvailableMetrics from 'in-infrastructure/subscriptions/getAvailableMetrics';
import { granularityForBeeInstantMetrics } from 'in-stores/metric/beeInstant';
import { hasError, isLoading } from 'in-services/util/result';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';

export function fromUrlMetrics({ urlMetrics, availableMetrics }) {
  const countByName = {};
  const selectedMetrics = urlMetrics
    .map(({ metric, aggregation }) => {
      countByName[metric] = (countByName[metric] || 0) + 1;
      const metricDescription = findMetric(availableMetrics, metric);
      return metricDescription && { aggregation, ...metricDescription };
    })
    .filter(Boolean)
    .map(metric => ({
      ...metric,
      fullyQualifiedLabel: countByName[metric.metric] == 1 ? metric.label : `${metric.label} (${metric.aggregation})`
    }));

  if (selectedMetrics.length == 0) {
    return setAggregation(
      availableMetrics.filter(m => m.isKpi),
      'MEAN'
    );
  }

  return selectedMetrics;
}

export function toUrlMetrics({ metrics }) {
  return metrics.map(({ metric, aggregation }) => ({ metric, aggregation }));
}

const DEFAULT_AGGREGATIONS = ['MEAN', 'SUM', 'MAX', 'MIN', 'P50', 'P90', 'P95', 'P99', 'DISTINCT_COUNT'];

export function getMetrics({ timeConfig, tagFilterExpression, type }) {
  if (!type) {
    return just([]);
  }

  if (!timeConfig || !tagFilterExpression) {
    return just(getKpis(type));
  }

  return getAvailableMetrics({
    filter: {
      timeConfig,
      tagFilterExpression
    },
    type
  })
    .map(result => {
      if (isLoading(result) || hasError(result)) {
        return [];
      }

      return result.data.metrics.map(({ id, label, format }) => {
        const formatter = v => valueWithFormatterToReadableString(v, format);
        return {
          metric: id,
          label,
          formatter,
          aggregations: DEFAULT_AGGREGATIONS,
          percentageMetric: format === 'PERCENTAGE'
        };
      });
    })
    .startWith([])
    .map(allMetrics => {
      const kpis = getKpis(type);
      const kpiNames = kpis.map(kpi => kpi.metric);
      return kpis.concat(allMetrics.filter(({ metric }) => !kpiNames.includes(metric)));
    });
}

export function getKpis(type) {
  if (!type) {
    return [];
  }

  // hack for beeinstant not having derived metrics at the moment
  if (type === 'host') {
    return [
      {
        label: 'CPU (user)',
        metric: 'cpu.user',
        formatter: percentageZeroDecimalPlaces
      },
      {
        label: 'Memory Free',
        metric: 'memory.free',
        formatter: bytesTwoDecimalPlaces
      }
    ].map(createKpi);
  }

  return getKpiDefinitions(type).map(createKpi);
}

function createKpi(kpiDefinition) {
  return {
    isKpi: true,
    aggregations: DEFAULT_AGGREGATIONS,
    percentageMetric: numberFormatterToFormatterType(kpiDefinition.formatter) === 'PERCENTAGE',
    ...kpiDefinition
  };
}

export function setAggregation(metrics, aggregation) {
  return metrics.map(metric => ({ ...metric, aggregation }));
}

function findMetric(allMetrics, metricName) {
  return allMetrics.find(m => m.metric === metricName);
}

export function getGranularity(timeConfig) {
  const dataPoints = 10;

  return granularityForBeeInstantMetrics(timeConfig.windowSize / dataPoints, timeConfig);
}

export function average(series) {
  if (!series) {
    return undefined;
  }

  const { count, sum } = series.reduce(
    ({ count, sum }, metric) => ({
      count: count + 1,
      sum: sum + metric[1]
    }),
    {
      count: 0,
      sum: 0
    }
  );

  return sum / count;
}

export function getMetricKey(metric, aggregation) {
  return metric + '.' + aggregation;
}
