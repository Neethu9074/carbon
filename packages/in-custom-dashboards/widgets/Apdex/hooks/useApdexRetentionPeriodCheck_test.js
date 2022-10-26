/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import useApdexRetentionPeriodCheck from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexRetentionPeriodCheck';
import { minutes, days } from 'in-services/time';

describe('in-custom-dashboards/widgets/Apdex/hooks/useApdexRetentionPeriodCheck', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });

  // last X (hours/days/weeks)
  describe('if the time config does not define a TO', () => {
    it('returns true if the windowSize is smaller than 90 days', () => {
      // Given
      const timeConfig = {
        windowSize: minutes.toMillis(120)
      };

      // When
      const actual = useApdexRetentionPeriodCheck(timeConfig);

      // Then
      expect(actual).toBe(true);
    });

    it('returns true if the windowSize is equal to 90 days', () => {
      // Given
      const timeConfig = {
        windowSize: days.toMillis(90)
      };

      // When
      const actual = useApdexRetentionPeriodCheck(timeConfig);

      // Then
      expect(actual).toBe(true);
    });

    it('returns false if the windowSize is greater than 90 days', () => {
      // Given
      const timeConfig = {
        windowSize: days.toMillis(90) + minutes.toMillis(1)
      };

      // When
      const actual = useApdexRetentionPeriodCheck(timeConfig);

      // Then
      expect(actual).toBe(false);
    });
  });

  describe('if the time config defines a TO', () => {
    it('returns true if the beginning of the timeWindow is less than 90 days ago from now', () => {
      // Given
      jest.setSystemTime(days.toMillis(100));
      const timeConfig = {
        windowSize: minutes.toMillis(120),
        to: days.toMillis(80)
      };

      // When
      const actual = useApdexRetentionPeriodCheck(timeConfig);

      // Then
      expect(actual).toBe(true);
    });

    it('returns true if the beginning of the timeWindow is exactly 90 days ago from now', () => {
      // Given
      jest.setSystemTime(days.toMillis(100));
      const timeConfig = {
        windowSize: days.toMillis(10),
        to: days.toMillis(20)
      };

      // When
      const actual = useApdexRetentionPeriodCheck(timeConfig);

      // Then
      expect(actual).toBe(true);
    });

    it('returns false if the beginning of the timeWindow is more than 90 days ago from now', () => {
      // Given
      jest.setSystemTime(days.toMillis(100));
      const timeConfig = {
        windowSize: days.toMillis(10),
        to: days.toMillis(20) - minutes.toMillis(1)
      };

      // When
      const actual = useApdexRetentionPeriodCheck(timeConfig);

      // Then
      expect(actual).toBe(false);
    });
  });
});
