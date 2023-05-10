/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TimeConfig } from '@instana/types';

import {
  calculateAvailableErrorBudget,
  calculateSeverity,
  calculateSloGranularity,
  calculateTimeRemaining,
  formatSloStatus
} from 'in-service-levels/utils';
import { days, hours, minutes } from 'in-services/time';

describe('in-service-levels/utils', () => {
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

  describe('formatSloStatus', () => {
    it('should return undefined for sloStatus and sloTarget if status is undefined', () => {
      // Given
      const status = undefined;
      const target = 1;

      // When
      const { sloStatus, sloTarget } = formatSloStatus({ status, target });

      // Then
      expect(sloStatus).toBeUndefined();
      expect(sloTarget).toBeUndefined();
    });

    it('should return undefined for sloStatus and sloTarget if target is undefined', () => {
      // Given
      const status = 1;
      const target = undefined;

      // When
      const { sloStatus, sloTarget } = formatSloStatus({ status, target });

      // Then
      expect(sloStatus).toBeUndefined();
      expect(sloTarget).toBeUndefined();
    });

    it.each`
      expectedTarget | expectedStatus | target        | status
      ${'100.00%'}   | ${'100.00%'}   | ${1}          | ${1}
      ${'99.888%'}   | ${'99.9911%'}  | ${0.99888}    | ${0.999911}
      ${'99.9995%'}  | ${'99.9996%'}  | ${0.999995}   | ${0.999996}
      ${'99.9999%'}  | ${'100.00%'}   | ${0.999999}   | ${1}
      ${'100.00%'}   | ${'100.00%'}   | ${0.99999995} | ${1}
      ${'300.00%'}   | ${'299.95%'}   | ${3}          | ${2.99948}
    `(
      'should return sloTarged of $expectedTarget and sloStatus of $expectedStatus if target $target and status $status',
      ({ expectedTarget, expectedStatus, status, target }) => {
        expect(formatSloStatus({ status, target })).toEqual(
          expect.objectContaining({ sloStatus: expectedStatus, sloTarget: expectedTarget })
        );
      }
    );
  });

  describe('calculateSloGranularity', () => {
    jest.useFakeTimers();
    jest.setSystemTime(days.toMillis(5));

    it('returns one minute if the timeframe is within the last 24 hours and the window-size is less than a day', () => {
      // Given
      const timeConfig: TimeConfig = {
        to: Date.now(),
        windowSize: hours.toMillis(2),
        autoRefresh: false
      };

      // When
      const actual = calculateSloGranularity(timeConfig);

      // Then
      expect(actual).toEqual(minutes.toMillis(1));
    });

    it('returns one hour if the timeframe is within the last 24 hours and the window-size is larger than a day', () => {
      // Given
      const timeConfig: TimeConfig = {
        to: Date.now(),
        windowSize: hours.toMillis(30),
        autoRefresh: false
      };

      // When
      const actual = calculateSloGranularity(timeConfig);

      // Then
      expect(actual).toEqual(hours.toMillis(1));
    });

    it('returns one hour if the timeframe is outside the last 24 hours', () => {
      // Given
      const timeConfig: TimeConfig = {
        to: days.toMillis(3),
        windowSize: hours.toMillis(2),
        autoRefresh: false
      };

      // When
      const actual = calculateSloGranularity(timeConfig);

      // Then
      expect(actual).toEqual(hours.toMillis(1));
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

  describe('calculateTimeRemaining', () => {
    jest.useFakeTimers();
    it.each`
      expectedRemaining     | now                                      | to
      ${days.toMillis(3)}   | ${days.toMillis(2)}                      | ${days.toMillis(5)}
      ${hours.toMillis(12)} | ${days.toMillis(1) + hours.toMillis(12)} | ${days.toMillis(2)}
    `('calculates a difference of %s between %s and %s', ({ now, to, expectedRemaining }) => {
      // Given
      jest.setSystemTime(now);
      const timeConfig = { to, autoRefresh: false, windowSize: 0 };

      // When
      const remaining = calculateTimeRemaining(timeConfig);

      // Then
      expect(remaining).toEqual(expectedRemaining);
    });
  });
});
