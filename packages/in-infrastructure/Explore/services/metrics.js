import { just } from 'reactive-observables';

import { percentageZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import getAvailableMetrics from 'in-infrastructure/subscriptions/getAvailableMetrics';
import { valueWithFormatterToReadableString } from 'in-services/formatters/number';
import { hasError, isLoading } from 'in-services/util/result';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';

export function fromUrlMetrics({ urlMetrics, availableMetrics }) {
  const selectedMetrics = urlMetrics
    .map(({ metric, aggregation }) => {
      const metricDescription = findMetric(availableMetrics, metric);
      return metricDescription && { aggregation, ...metricDescription };
    })
    .filter(Boolean);

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

const DEFAULT_AGGREGATIONS = ['MEAN', 'SUM', 'MAX', 'P50', 'P90', 'P95', 'P99', 'DISTINCT_COUNT'];

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
          aggregations: DEFAULT_AGGREGATIONS
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
        formatter: percentageZeroDecimalPlaces,
        isKpi: true,
        aggregations: DEFAULT_AGGREGATIONS
      },
      {
        label: 'Memory Free',
        metric: 'memory.free',
        formatter: bytesTwoDecimalPlaces,
        isKpi: true,
        aggregations: DEFAULT_AGGREGATIONS
      }
    ];
  }

  return getKpiDefinitions(type).map(kpi => ({ isKpi: true, aggregations: DEFAULT_AGGREGATIONS, ...kpi }));
}

export function setAggregation(metrics, aggregation) {
  return metrics.map(metric => ({ ...metric, aggregation }));
}

function findMetric(allMetrics, metricName) {
  return allMetrics.find(m => m.metric === metricName);
}
