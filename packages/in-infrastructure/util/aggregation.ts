/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
export type Aggregation = CrossSeriesSumAggregation | StandardAggregation | CrossSeriesDistinctCountAggregation;

export interface CrossSeriesSumAggregation {
  type: 'SUM';
  timeAggregation: TimeAggregationSum;
}
export interface StandardAggregation {
  type: 'STANDARD';
  timeAggregation: TimeAggregationStandard;
}
export interface CrossSeriesDistinctCountAggregation {
  type: 'DISTINCT_COUNT';
  timeAggregation: TimeAggregationDistinctCount;
}

const crossSeries: string[] = [
  'MEAN',
  'MIN',
  'P25',
  'P50',
  'P75',
  'P90',
  'P95',
  'P98',
  'P99',
  'MAX',
  'SUM',
  'DISTINCT_COUNT'
];
type CrossSeriesAggregation = (typeof crossSeries)[number];
function parseCrossSeriesAggregation(
  value?: string,
  allowedCrossSeriesAggregation?: CrossSeriesAggregation[]
): CrossSeriesAggregation | undefined {
  if (!allowedCrossSeriesAggregation || allowedCrossSeriesAggregation.length === 0) {
    return crossSeries.find(validName => validName === value);
  }
  return allowedCrossSeriesAggregation.find(validName => validName === value);
}

const timeAggregationSum: string[] = ['MIN', 'MAX', 'SUM', 'PER_SECOND', 'INCREASE'];
type TimeAggregationSum = (typeof timeAggregationSum)[number];
export function parseTimeAggregationSum(value?: string): TimeAggregationSum | undefined {
  return timeAggregationSum.find(validName => validName === value);
}

const timeAggregationStandard: string[] = ['MEAN', 'MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX'];
type TimeAggregationStandard = (typeof timeAggregationStandard)[number];
export function parseTimeAggregationStandard(value?: string): TimeAggregationStandard | undefined {
  return timeAggregationStandard.find(validName => validName === value);
}

const timeAggregationDistinctCount: string[] = [
  'MEAN',
  'MIN',
  'P25',
  'P50',
  'P75',
  'P90',
  'P95',
  'P98',
  'P99',
  'MAX',
  'SUM',
  'INCREASE',
  'RATE'
];
type TimeAggregationDistinctCount = (typeof timeAggregationDistinctCount)[number];
function parseTimeAggregationDistinctCount(value?: string): TimeAggregationDistinctCount | undefined {
  return timeAggregationDistinctCount.find(validName => validName === value);
}

/**
 * Parses time and cross series aggregation and returns a valid couple for time and cross series aggregation.
 * Not all time aggregations apply to all cross series aggregation and this method will try to find the best fit
 * favorCrossSeriesAggregation flag helps define a strategy in case there is no fit and
 * either time aggregation or cross series aggregation must be adjusted.
 *
 *
 * @param internalTimeAggregation time aggregation to set
 * @param internalCrossSeriesAggregation cross series aggregation to set
 * @param allowedCrossSeriesAggregation list of allowed cross series aggregations
 * @param favorCrossSeriesAggregation true when changing only cross series aggregation, false when changing only time aggregation
 * @returns valid couple of time aggregation and cross series aggregation
 */
export function parseAggregation(
  internalTimeAggregation?: string,
  internalCrossSeriesAggregation?: string,
  allowedCrossSeriesAggregation?: string[],
  favorCrossSeriesAggregation: boolean = false
): Aggregation {
  let crossSeriesAggregation =
    parseCrossSeriesAggregation(internalCrossSeriesAggregation, allowedCrossSeriesAggregation) ?? 'MEAN';
  const timeAggStandard = parseTimeAggregationStandard(internalTimeAggregation);
  const timeAggSum = parseTimeAggregationSum(internalTimeAggregation);
  const timeAggDistinctCount = parseTimeAggregationDistinctCount(internalTimeAggregation);

  if (crossSeriesAggregation === 'SUM' && (timeAggSum || favorCrossSeriesAggregation)) {
    return {
      type: 'SUM',
      timeAggregation: timeAggSum ?? 'SUM'
    };
  }
  if (crossSeriesAggregation === 'DISTINCT_COUNT' && (timeAggDistinctCount || favorCrossSeriesAggregation)) {
    return {
      type: 'DISTINCT_COUNT',
      timeAggregation: timeAggDistinctCount ?? 'MEAN'
    };
  }
  if (timeAggregationStandard.includes(crossSeriesAggregation) && (timeAggStandard || favorCrossSeriesAggregation)) {
    return {
      type: 'STANDARD',
      timeAggregation: timeAggStandard ?? 'MEAN'
    };
  }
  if (timeAggStandard) {
    return {
      type: 'STANDARD',
      timeAggregation: timeAggStandard
    };
  }
  if (timeAggSum) {
    return {
      type: 'SUM',
      timeAggregation: timeAggSum
    };
  }
  if (timeAggDistinctCount) {
    return {
      type: 'DISTINCT_COUNT',
      timeAggregation: timeAggDistinctCount
    };
  }
  return {
    type: 'STANDARD',
    timeAggregation: 'MEAN'
  };
}

export function getCrossSeriesAggregation(aggregation: Aggregation) {
  switch (aggregation.type) {
    case 'STANDARD':
      return aggregation.timeAggregation !== 'SUM' ? aggregation.timeAggregation : 'MEAN';
    case 'SUM':
      return 'SUM';
    case 'DISTINCT_COUNT':
      return 'DISTINCT_COUNT';
  }
}
