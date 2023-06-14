/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TimeConfig } from '@instana/types';

import { calculateSloGranularity, calculateTimeRemaining } from 'in-service-levels/utils/time';
import { days, hours, minutes } from 'in-services/time/time';

describe('in-service-levels/utils/time', () => {
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
