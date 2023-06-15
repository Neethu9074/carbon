/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { calculateAvailableErrorBudget, calculateSeverity } from 'in-service-levels/utils/math';

describe('in-service-levels/utils/math', () => {
  describe('calculateSeverity', () => {
    it('returns 0 if the status is higher than the target', () => {
      // Given
      const status = 0.999;
      const target = 0.9;

      // When
      const severity = calculateSeverity({ status, target });

      // Then
      expect(severity).toEqual(0);
    });

    it('returns 0 if the status is equal to the target', () => {
      // Given
      const status = 0.9;
      const target = 0.9;

      // When
      const severity = calculateSeverity({ status, target });

      // Then
      expect(severity).toEqual(0);
    });

    it('returns 10 if the status is lower than the target', () => {
      // Given
      const status = 0.89;
      const target = 0.9;

      // When
      const severity = calculateSeverity({ status, target });

      // Then
      expect(severity).toEqual(10);
    });
  });

  describe('calculateAvailableErrorBudget', () => {
    it.each([
      [1440, 1],
      [7200, 5]
    ])('returns %s minutes for %s days', (expected, duration) => {
      // Given
      const target = 0;

      // When
      const budget = calculateAvailableErrorBudget({ duration, durationUnit: 'day' }, target);

      // Then
      expect(budget).toEqual(expected);
    });

    it.each([
      [10080, 1],
      [30240, 3]
    ])('returns %s minutes for %s weeks', (expected, duration) => {
      // Given
      const target = 0;

      // When
      const budget = calculateAvailableErrorBudget({ duration, durationUnit: 'week' }, target);

      // Then
      expect(budget).toEqual(expected);
    });

    it.each([
      [43200, 1],
      [86400, 2]
    ])('returns %s minutes for %s months', (expected, duration) => {
      // Given
      const target = 0;

      // When
      const budget = calculateAvailableErrorBudget({ duration, durationUnit: 'month' }, target);

      // Then
      expect(budget).toEqual(expected);
    });

    it('rounds the available budget to the minute', () => {
      // Given
      const target = 0;
      const duration = 0.81;
      const durationUnit = 'day';

      // When
      const budget = calculateAvailableErrorBudget({ duration, durationUnit }, target);

      // Then
      expect(budget).toEqual(1166);
    });

    it('applies the target to the amount of minutes in the timeWindow', () => {
      // Given
      const target = 0.9;
      const duration = 1;
      const durationUnit = 'day';

      // When
      const budget = calculateAvailableErrorBudget({ duration, durationUnit }, target);

      // Then
      expect(budget).toEqual(144);
    });
  });
});
