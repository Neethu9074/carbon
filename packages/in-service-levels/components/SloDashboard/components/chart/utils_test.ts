/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  findMinMaxMetricValues,
  findMinMetricValue,
  invertSyntheticPercentageMetrics
} from 'in-service-levels/components/SloDashboard/components/chart/utils';
import { MetricDataSeries } from 'in-components/Chart/types';

describe('findMinMaxMetricValues', () => {
  it('Should calculate max and min with positive values', () => {
    // Given
    const input: MetricDataSeries = [
      [1, 10],
      [2, 20],
      [3, 30],
      [4, 40]
    ];
    // When
    const result = findMinMaxMetricValues(input);
    // Then
    expect(result).toEqual({ min: 10, max: 40 });
  });

  it('Should calculate max and min in a single value Case', () => {
    // Given
    const input: MetricDataSeries = [[1, 15]];
    // When
    const result = findMinMaxMetricValues(input);
    // Then
    expect(result).toEqual({ min: 15, max: 15 });
  });

  it('Should calculate max and min for mixed positive and negative values', () => {
    // Given
    const input: MetricDataSeries = [
      [1, -10],
      [2, -5],
      [3, 0],
      [4, 5]
    ];
    // When
    const result = findMinMaxMetricValues(input);
    // Then
    expect(result).toEqual({ min: -10, max: 5 });
  });

  it('Should calculate max and min when all values are the Same', () => {
    // Given
    const input: MetricDataSeries = [
      [1, 20],
      [2, 20],
      [3, 20]
    ];
    // When
    const result = findMinMaxMetricValues(input);
    // Then
    expect(result).toEqual({ min: 20, max: 20 });
  });

  it('Should calculate max and min for all negative values', () => {
    // Given
    const input: MetricDataSeries = [
      [1, -20],
      [2, -120],
      [3, -40]
    ];
    // When
    const result = findMinMaxMetricValues(input);
    // Then
    expect(result).toEqual({ min: -120, max: -20 });
  });
});

describe('findMinMetricValue', () => {
  it('Should calculate min for one positive value', () => {
    // Given
    const input: MetricDataSeries = [[1, 5]];

    // When
    const result = findMinMetricValue(input);

    // Then
    expect(result).toEqual(5);
  });

  it('Should calculate min for two positive values', () => {
    // Given
    const input: MetricDataSeries = [
      [1, 100],
      [2, 5]
    ];

    // When
    const result = findMinMetricValue(input);

    // Then
    expect(result).toEqual(5);
  });

  it('Should calculate min for three positive values', () => {
    // Given
    const input: MetricDataSeries = [
      [1, 100],
      [2, 5],
      [3, 250]
    ];

    // When
    const result = findMinMetricValue(input);

    // Then
    expect(result).toEqual(5);
  });

  it('Should calculate min for 3 mixed values', () => {
    // Given
    const input: MetricDataSeries = [
      [1, -20],
      [2, 5],
      [3, -100]
    ];

    // When
    const result = findMinMetricValue(input);

    // Then
    expect(result).toEqual(-100);
  });

  it('Should calculate min for 5 mixed values', () => {
    // Given
    const input: MetricDataSeries = [
      [1, 99],
      [2, -5],
      [3, -100],
      [4, 500],
      [5, -55]
    ];

    // When
    const result = findMinMetricValue(input);

    // Then
    expect(result).toEqual(-100);
  });
});

describe('invertSyntheticPercentageMetrics', () => {
  it('Should return correct inverted metrics for 5 mixed values', () => {
    // Given
    const input: MetricDataSeries[] = [
      [
        [1, 0.5],
        [2, 0],
        [3, 0.25],
        [4, 0.4],
        [5, 1]
      ]
    ];

    // When
    const result = invertSyntheticPercentageMetrics(input);

    // Then
    expect(result).toStrictEqual([
      [
        [1, 0.5],
        [2, 1],
        [3, 0.75],
        [4, 0.6],
        [5, 0]
      ]
    ]);
  });

  it('Should return correct inverted metrics for 10 mixed values', () => {
    // Given
    const input: MetricDataSeries[] = [
      [
        [1, 0.66],
        [2, 0],
        [3, 0.75],
        [4, 0.33],
        [5, 1],
        [6, 0.1],
        [7, 0.99],
        [8, 0.79],
        [9, 0.75],
        [10, 0.22]
      ]
    ];

    // When
    const result = invertSyntheticPercentageMetrics(input);

    // Then
    expect(result).toStrictEqual([
      [
        [1, 0.34],
        [2, 1],
        [3, 0.25],
        [4, 0.67],
        [5, 0],
        [6, 0.9],
        [7, 0.01],
        [8, 0.21],
        [9, 0.25],
        [10, 0.78]
      ]
    ]);
  });
});
