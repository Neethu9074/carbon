/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  findMinMaxMetricValues,
  findMinMetricValue
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
