/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { calculateYScaleBuffer } from 'in-service-levels/components/Shared/SloErrorBudgetChart';
import { MetricDataPoint } from 'in-components/Chart/types';

describe('calculateYScaleBuffer', () => {
  it('should correctly calculate yMin and yMax for positive metrics below a range of 100', () => {
    // Given
    const data: MetricDataPoint[] = [
      [1622556000000, 50],
      [1622559600000, 90],
      [1622569600000, 70],
      [1622549600000, 100]
    ];
    // When
    const result = calculateYScaleBuffer([data]);
    // Then
    expect(result.yMin).toBe(40);
    expect(result.yMax).toBe(110);
  });

  it('should correctly calculate yMin and yMax for positive metrics above a range of 100', () => {
    // Given
    const data: MetricDataPoint[] = [
      [1622556000000, 100],
      [1622559600000, 250],
      [1622569600000, 350],
      [1622549600000, 400]
    ];
    // When
    const result = calculateYScaleBuffer([data]);
    // Then
    expect(result.yMin).toBe(70);
    expect(result.yMax).toBe(430);
  });

  it('should correctly calculate yMin and yMax for negative metrics above a range of 100', () => {
    // Given
    const data: MetricDataPoint[] = [
      [1622556000000, -300],
      [1622559600000, -150],
      [1622569600000, -50],
      [1622549600000, -10]
    ];
    // When
    const result = calculateYScaleBuffer([data]);
    // Then
    expect(result.yMin).toBe(-300);
    expect(result.yMax).toBe(19);
  });

  it('should correctly calculate yMin and yMax for a combination of positive and negative values', () => {
    // Given
    const data: MetricDataPoint[] = [
      [1622556000000, 200],
      [1622559600000, -150],
      [1622569600000, 50],
      [1622549600000, -350]
    ];
    // When
    const result = calculateYScaleBuffer([data]);
    // Then
    expect(result.yMin).toBe(-350);
    expect(result.yMax).toBe(255);
  });

  it('yMin should be 0 if min is 0', () => {
    // Given
    const data: MetricDataPoint[] = [
      [1622556000000, 10],
      [1622559600000, 20],
      [1622559600000, 0],
      [1622559600000, 8]
    ];
    // When
    const result = calculateYScaleBuffer([data]);
    // Then
    expect(result.yMin).toBe(0);
    expect(result.yMax).toBe(30);
  });

  it('yMin must be min with some buffer when the range(difference between max and min) is exactly 0', () => {
    // Given
    const data: MetricDataPoint[] = [
      [1622556000000, 200],
      [1622559600000, 200],
      [1622569600000, 200],
      [1622549600000, 200]
    ];
    // When
    const result = calculateYScaleBuffer([data]);
    // Then

    expect(result.yMin).toBe(190);
    expect(result.yMax).toBe(210);
  });
});
