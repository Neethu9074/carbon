/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import { parseAggregation } from 'in-infrastructure/util/aggregation';

describe('parseAggregation', () => {
  const timeAggregationStandard: string[] = ['MEAN', 'MIN', 'P25', 'P50', 'P75', 'P90', 'P95', 'P98', 'P99', 'MAX'];
  const timeAggregationSum: string[] = ['MEAN', 'MIN', 'MAX', 'SUM', 'PER_SECOND', 'INCREASE'];
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

  test.each(timeAggregationStandard)(
    'parses valid mean cross series aggregation with %s time aggregation',
    timeAggregation => {
      const result = parseAggregation(timeAggregation, timeAggregation);
      expect(result).toEqual({ type: 'STANDARD', timeAggregation });
    }
  );

  test.each(timeAggregationSum)(
    'parses valid sum cross series aggregation with %s time aggregation',
    timeAggregation => {
      const result = parseAggregation(timeAggregation, 'SUM');
      expect(result).toEqual({ type: 'SUM', timeAggregation });
    }
  );

  test.each(timeAggregationDistinctCount)(
    'parses valid distinct count cross series aggregation with %s time aggregation',
    timeAggregation => {
      const result = parseAggregation(timeAggregation, 'DISTINCT_COUNT');
      expect(result).toEqual({ type: 'DISTINCT_COUNT', timeAggregation });
    }
  );

  test.each(timeAggregationDistinctCount)('favoring distinct count', timeAggregation => {
    const result = parseAggregation(timeAggregation, 'DISTINCT_COUNT', undefined, true);
    expect(result.type).toEqual('DISTINCT_COUNT');
  });

  test.each(timeAggregationStandard)('favoring standard', timeAggregation => {
    const result = parseAggregation(timeAggregation, timeAggregation, undefined, true);
    expect(result.type).toEqual('STANDARD');
  });

  test.each(timeAggregationSum)('favoring sum', timeAggregation => {
    const result = parseAggregation(timeAggregation, 'SUM', undefined, true);
    expect(result.type).toEqual('SUM');
  });

  test.each(['SUM', 'MEAN', 'DISTINCT_COUNT'])(
    'parses invalid time aggregation for %s cross series',
    crossSeriesAggregation => {
      const result = parseAggregation('INVALID', crossSeriesAggregation);
      expect(result).toEqual({ type: 'STANDARD', timeAggregation: 'MEAN' });
    }
  );

  test('parses mean time aggregation on sum with restricted allowedCrossSeriesAggregation', () => {
    const result = parseAggregation('MEAN', 'SUM', ['MEAN']);
    expect(result).toEqual({ type: 'STANDARD', timeAggregation: 'MEAN' });
  });

  test('parses sum time aggregation on mean cross series, but prefer time aggregtation forces cross series sum', () => {
    const result = parseAggregation('SUM', 'MEAN', undefined, false);
    expect(result).toEqual({ type: 'SUM', timeAggregation: 'SUM' });
  });

  test('parses p90 time aggregation on sum cross series, but prefer cross series aggregtation', () => {
    const result = parseAggregation('P90', 'SUM', undefined, true);
    expect(result).toEqual({ type: 'SUM', timeAggregation: 'SUM' });
  });

  test('parses invalid crossSeriesAggregation with allowed allowedCrossSeriesAggregation', () => {
    const result = parseAggregation('MEAN', 'INVALID', ['INVALID']);
    expect(result).toEqual({ type: 'STANDARD', timeAggregation: 'MEAN' });
  });

  test('parses invalid crossSeriesAggregation with custom allowedCrossSeriesAggregation', () => {
    const customAllowedCrossSeriesAggregation = ['MEAN', 'CUSTOM'];
    const result = parseAggregation('MEAN', 'INVALID', customAllowedCrossSeriesAggregation);
    expect(result).toEqual({ type: 'STANDARD', timeAggregation: 'MEAN' });
  });
});
