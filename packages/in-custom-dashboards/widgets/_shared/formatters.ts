/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { uniq } from 'lodash';

import { MetricSource, AggregationType } from '@instana/types';

import {
  bytesCompact,
  bytesDetailed,
  defaultFormatter,
  Formatter,
  latencyDetailed,
  millisCompact,
  millisDetailed,
  numberCompact,
  percentageCompact,
  percentageDetailed,
  perSecondDetailed,
  publicFormatters
} from 'in-stores/metric/formatters';
import { BaseUnit } from 'in-stores/metric/units';

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

export function getFormatter(
  source: MetricSource,
  metric: string,
  aggregation: AggregationType,
  baseUnit?: BaseUnit
): Formatter[] {
  switch (source) {
    case 'APPLICATION':
      return getApplicationMetricFormatter(metric, aggregation);
    case 'SYNTHETICS':
      return getSyntheticMetricFormatter(metric);
    case 'LOG':
      return getLogFormatter(aggregation);
    case 'INFRASTRUCTURE_METRICS':
      return baseUnit ? getInfrastructureMetricFormatter(baseUnit) : publicFormatters;
    case 'SLO':
      return getSloMetricFormatter(metric);
    case 'BUSINESS_METRICS':
      return getCustomUnitFormatter();
  }
  return publicFormatters;
}

export function getCommonFormatterForUnits(...baseUnits: BaseUnit[]): Formatter[] {
  return uniq(baseUnits).length === 1
    ? getInfrastructureMetricFormatter(baseUnits[0])
    : getInfrastructureMetricFormatter('NUMBER');
}

export function getInfrastructureMetricFormatter(baseUnit?: BaseUnit): Formatter[] {
  switch (baseUnit) {
    case 'NUMBER':
      return [defaultFormatter, numberCompact];
    case 'PERCENTAGE':
      return [percentageDetailed, percentageCompact];
    case 'TIME':
      return [millisDetailed, millisCompact];
    case 'SIZE':
      return [bytesDetailed, bytesCompact];
    case 'RATE':
      return [perSecondDetailed];
    default:
      return [];
  }
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

function getSloMetricFormatter(metric: string): Formatter[] {
  if (metric === 'STATUS') {
    return [percentageDetailed, percentageCompact];
  } else if (metric === 'ERROR_BUDGET_REMAINING') {
    return [numberCompact];
  }
  return publicFormatters;
}

function getCustomUnitFormatter(): Formatter[] {
  return [defaultFormatter, numberCompact];
}

const logFormattersByAggregation: Partial<Record<AggregationType, Formatter[]>> = {
  PER_SECOND: [perSecondDetailed, numberCompact],
  SUM: [numberCompact]
};

function getLogFormatter(aggregation: AggregationType) {
  return logFormattersByAggregation[aggregation] || [defaultFormatter];
}

export function convertToPercent(value: number) {
  return value * 100;
}
