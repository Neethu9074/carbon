/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { prometheusDeltaCountersSumEnabled } from 'in-services/featureFlags';
import { InfraMetricQuery } from 'in-types';

interface ExploreQuery {
  readonly metrics?: { [index: string]: InfraMetricQuery };
  readonly type?: string;
}

export function convertExploreQueryWithPrometheusCounterIncreaseToDeltaSum<Q extends ExploreQuery>(query: Q): Q {
  if (prometheusDeltaCountersSumEnabled && query && query.type === 'prometheus' && query.metrics) {
    return {
      ...query,
      metrics: Object.entries(query.metrics).reduce((acc, [key, value]) => {
        acc[key] = convertInfraMetricQueryWithPrometheusCounterIncreaseToDeltaSum(value);
        return acc;
      }, {} as { [index: string]: InfraMetricQuery })
    };
  }
  return query;
}

function convertInfraMetricQueryWithPrometheusCounterIncreaseToDeltaSum(
  metricQuery: InfraMetricQuery
): InfraMetricQuery {
  if (metricQuery.metric.startsWith('metrics.counters') && metricQuery.aggregation == 'INCREASE') {
    return {
      ...metricQuery,
      metric: metricQuery.metric.replace('metrics.counters', 'metrics.delta_counters'),
      aggregation: 'SUM'
    };
  }
  return metricQuery;
}
