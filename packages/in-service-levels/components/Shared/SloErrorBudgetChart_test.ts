/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { calculateYScaleBuffer } from 'in-service-levels/components/Shared/SloErrorBudgetChart';
import { MetricDataPoint } from 'in-components/Chart/types';

describe('calculateYScaleBuffer', () => {
  it('should correctly calculate yMin and yMax for positive values with a short range', () => {
    // Given
    const data: MetricDataPoint[] = [
      [1622556000000, 100],
      [1622559600000, 150]
    ];
    // When
    const result = calculateYScaleBuffer([data]);
    // Then
    expect(result.yMin).toBe(90);
    expect(result.yMax).toBe(160);
  });

  it('should correctly calculate yMin and yMax for positive values with a large range', () => {
    // Given
    const data: MetricDataPoint[] = [
      [1622556000000, 100],
      [1622559600000, 250]
    ];
    // When
    const result = calculateYScaleBuffer([data]);
    // Then
    expect(result.yMin).toBe(85);
    expect(result.yMax).toBe(265);
  });

  it('should correctly calculate yMin and yMax for negative values with a large range', () => {
    // Given
    const data: MetricDataPoint[] = [
      [1622556000000, -100],
      [1622559600000, -150]
    ];
    // When
    const result = calculateYScaleBuffer([data]);
    // Then
    expect(result.yMin).toBe(-150);
    expect(result.yMax).toBe(-90);
  });

  it('yMin should be 0 if min is 0', () => {
    // Given
    const data: MetricDataPoint[] = [
      [1622556000000, 10],
      [1622559600000, 0]
    ];
    // When
    const result = calculateYScaleBuffer([data]);
    // Then
    expect(result.yMin).toBe(0);
    expect(result.yMax).toBe(20);
  });

  it('yMin must be the highest -y value if min is negative', () => {
    // Given
    const data: MetricDataPoint[] = [
      [1622556000000, 200],
      [1622559600000, -150]
    ];
    // When
    const result = calculateYScaleBuffer([data]);
    // Then
    expect(result.yMin).toBe(-150);
    expect(result.yMax).toBe(235);
  });

  it('should handle a case where range is too small', () => {
    // Given
    const data: MetricDataPoint[] = [
      [1622556000000, 200],
      [1622559600000, 205]
    ];
    // When
    const result = calculateYScaleBuffer([data]);
    // Then

    expect(result.yMin).toBe(190);
    expect(result.yMax).toBe(215);
  });
});
