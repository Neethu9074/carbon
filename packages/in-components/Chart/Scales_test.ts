/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getMinMaxValueForDataSeries } from 'in-components/Chart/Scales';
import { MetricDataSeries } from 'in-components/Chart/types';

describe('in-components/Chart/Scales.ts', () => {
  it('should return minValue: 0 and maxValue: 1 for an empty data series', () => {
    // Given
    const dataSeries: MetricDataSeries = [];

    // When
    const result = getMinMaxValueForDataSeries(dataSeries);

    // Then
    expect(result).toEqual({ minValue: 0, maxValue: 1 });
  });

  it('should return correct minValue and maxValue for multiple data points', () => {
    // Given
    const dataSeries: MetricDataSeries = [
      [0, 2],
      [1, 10],
      [2, 5]
    ];

    // When
    const result = getMinMaxValueForDataSeries(dataSeries);

    // Then
    expect(result).toEqual({ minValue: 2, maxValue: 10 });
  });

  it('should return the same minValue and maxValue when all data points are equal', () => {
    // Given
    const dataSeries: MetricDataSeries = [
      [0, 7],
      [1, 7],
      [2, 7]
    ];

    // When
    const result = getMinMaxValueForDataSeries(dataSeries);

    // Then
    expect(result).toEqual({ minValue: 7, maxValue: 7 });
  });

  it('should handle data series with negative values correctly', () => {
    // Given
    const dataSeries: MetricDataSeries = [
      [0, -5],
      [1, -10],
      [2, 0]
    ];

    // When
    const result = getMinMaxValueForDataSeries(dataSeries);

    // Then
    expect(result).toEqual({ minValue: -10, maxValue: 0 });
  });

  it('should return correct minValue and maxValue for mixed positive and negative values', () => {
    // Given
    const dataSeries: MetricDataSeries = [
      [0, -3],
      [1, 5],
      [2, 7],
      [3, -1]
    ];

    // When
    const result = getMinMaxValueForDataSeries(dataSeries);

    // Then
    expect(result).toEqual({ minValue: -3, maxValue: 7 });
  });
});
