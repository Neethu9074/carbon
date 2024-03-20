/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MetricSource } from '@instana/types/typeDefinitions';
import { AggregationType } from '@instana/types';

import {
  bytesCompact,
  bytesDetailed,
  defaultFormatter,
  Formatter,
  latencyDetailed,
  numberCompact,
  percentageCompact,
  percentageDetailed,
  perSecondDetailed,
  publicFormatters
} from 'in-stores/metric/formatters';

function getApplicationMetricFormatter(metric: string, aggregation: AggregationType): Formatter[] {
  if (metric === 'calls' || metric === 'erroneousCalls') {
    if (aggregation === 'PER_SECOND') {
      return [perSecondDetailed];
    }
    return [defaultFormatter, numberCompact];
  } else if (metric === 'latency') {
    return [latencyDetailed];
  } else if (metric === 'errors') {
    return [percentageDetailed, percentageCompact];
  }
  return publicFormatters;
}

export function getFormatter(source: MetricSource, metric: string, aggregation: AggregationType): Formatter[] {
  switch (source) {
    case 'APPLICATION':
      return getApplicationMetricFormatter(metric, aggregation);
    case 'SYNTHETICS':
      return getSyntheticMetricFormatter(metric);
    case 'LOG':
      return getLogFormatter(aggregation);
  }
  return publicFormatters;
}

function getSyntheticMetricFormatter(metric: string): Formatter[] {
  if (metric === 'id' || metric === 'location_id') {
    return [numberCompact];
  } else if (metric === 'response_time') {
    return [latencyDetailed];
  } else if (metric === 'status') {
    return [percentageDetailed, percentageCompact];
  } else if (metric === 'response_size') {
    return [bytesCompact, bytesDetailed];
  }
  return publicFormatters;
}

const logFormattersByAggregation: Partial<Record<AggregationType, Formatter[]>> = {
  PER_SECOND: [perSecondDetailed],
  SUM: [numberCompact]
};

function getLogFormatter(aggregation: AggregationType) {
  return logFormattersByAggregation[aggregation] || [defaultFormatter];
}
