/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { addDays, addMonths, addWeeks, subDays, subWeeks } from 'date-fns';
import { renderHook } from '@testing-library/react-hooks';

import { FixedTimeWindow, RollingTimeWindow, TimeConfig } from '@instana/types';

import useSloWindowTimeConfig from 'in-service-levels/hooks/useSloWindowTimeConfig';
import uTC from 'in-hooks/useTimeConfig';
import { days } from 'in-services/time';

jest.mock('in-hooks/useTimeConfig');
const useTimeConfig = uTC as jest.MockedFunction<typeof uTC>;

describe('in-service-levels/hooks/useSloWindowTimeConfig', () => {
  jest.useFakeTimers();
  jest.setSystemTime(addMonths(0, 6));

  describe('for timeWindow type rolling', () => {
    it('creates a fixed timeConfiguration', () => {
      // Given
      const timeConfig: TimeConfig = {
        to: Date.now(),
        windowSize: days.toMillis(1),
        autoRefresh: false
      };
      const timeWindow: RollingTimeWindow = {
        type: 'rolling',
        duration: 1,
        durationUnit: 'day',
        timezone: 'UTC'
      };
      useTimeConfig.mockReturnValue(timeConfig);

      // When
      const { result } = renderHook(() => useSloWindowTimeConfig(timeWindow));

      // Then
      expect(result.current).toEqual(
        expect.objectContaining({
          to: Date.now(),
          windowSize: days.toMillis(1)
        })
      );
    });

    it('creates a timeConfig with a window size of 2 days to now for a timeWindow of two days', () => {
      // Given
      const timeConfig: TimeConfig = {
        to: Date.now(),
        windowSize: days.toMillis(1),
        autoRefresh: false
      };
      const timeWindow: RollingTimeWindow = {
        type: 'rolling',
        duration: 2,
        durationUnit: 'day',
        timezone: 'UTC'
      };
      useTimeConfig.mockReturnValue(timeConfig);

      // When
      const { result } = renderHook(() => useSloWindowTimeConfig(timeWindow));

      // Then
      expect(result.current).toEqual(
        expect.objectContaining({
          to: Date.now(),
          windowSize: days.toMillis(2)
        })
      );
    });

    it('creates a timeConfig with a window size of 3 weeks to now for a timeWindow of three weeks', () => {
      // Given
      const timeConfig: TimeConfig = {
        to: Date.now(),
        windowSize: days.toMillis(1),
        autoRefresh: false
      };
      const timeWindow: RollingTimeWindow = {
        type: 'rolling',
        duration: 3,
        durationUnit: 'week',
        timezone: 'UTC'
      };
      useTimeConfig.mockReturnValue(timeConfig);

      // When
      const { result } = renderHook(() => useSloWindowTimeConfig(timeWindow));

      // Then
      expect(result.current).toEqual(
        expect.objectContaining({
          to: Date.now(),
          windowSize: days.toMillis(7) * 3
        })
      );
    });

    it('creates a timeConfig with a window size of 30 days to now for a timeWindow of 1 month', () => {
      // Given
      const timeConfig: TimeConfig = {
        to: Date.now(),
        windowSize: days.toMillis(1),
        autoRefresh: false
      };
      const timeWindow: RollingTimeWindow = {
        type: 'rolling',
        duration: 1,
        durationUnit: 'month',
        timezone: 'UTC'
      };
      useTimeConfig.mockReturnValue(timeConfig);

      // When
      const { result } = renderHook(() => useSloWindowTimeConfig(timeWindow));

      // Then
      expect(result.current).toEqual(
        expect.objectContaining({
          to: Date.now(),
          windowSize: days.toMillis(30)
        })
      );
    });

    it('ends the created timeConfig on the to timestamp of the given timeConfig', () => {
      // Given
      const timeConfig: TimeConfig = {
        to: subWeeks(Date.now(), 1).getTime(),
        windowSize: days.toMillis(1),
        autoRefresh: false
      };
      const timeWindow: RollingTimeWindow = {
        type: 'rolling',
        duration: 1,
        durationUnit: 'week',
        timezone: 'UTC'
      };
      useTimeConfig.mockReturnValue(timeConfig);

      // When
      const { result } = renderHook(() => useSloWindowTimeConfig(timeWindow));

      // Then
      expect(result.current).toEqual(
        expect.objectContaining({
          to: subWeeks(Date.now(), 1).getTime(),
          windowSize: days.toMillis(7)
        })
      );
    });
  });

  describe('for timeWindow type fixed', () => {
    it('creates a fixed timeConfig', () => {
      // Given
      const timeConfig: TimeConfig = {
        to: Date.now(),
        windowSize: days.toMillis(1),
        autoRefresh: false
      };
      const timeWindow: FixedTimeWindow = {
        type: 'fixed',
        duration: 1,
        durationUnit: 'day',
        startTimestamp: Date.now(),
        timezone: 'UTC'
      };
      useTimeConfig.mockReturnValue(timeConfig);

      // When
      const { result } = renderHook(() => useSloWindowTimeConfig(timeWindow));

      // Then
      expect(result.current).toEqual(
        expect.objectContaining({
          to: addDays(Date.now(), 1).getTime(),
          windowSize: days.toMillis(1)
        })
      );
    });

    it('creates a timeConfig with a window size of 2 days ending 2 days from the start date for a duration of 2 days starting now', () => {
      // Given
      const timeConfig: TimeConfig = {
        to: Date.now(),
        windowSize: days.toMillis(1),
        autoRefresh: false
      };
      const timeWindow: FixedTimeWindow = {
        type: 'fixed',
        duration: 2,
        durationUnit: 'day',
        startTimestamp: Date.now(),
        timezone: 'UTC'
      };
      useTimeConfig.mockReturnValue(timeConfig);

      // When
      const { result } = renderHook(() => useSloWindowTimeConfig(timeWindow));

      // Then
      expect(result.current).toEqual(
        expect.objectContaining({
          to: addDays(Date.now(), 2).getTime(),
          windowSize: days.toMillis(2)
        })
      );
    });

    it('creates a timeConfig with a window size of 3 weeks ending 3 weeks from the start date for a duration of 3 weeks starting now', () => {
      // Given
      const timeConfig: TimeConfig = {
        to: Date.now(),
        windowSize: days.toMillis(1),
        autoRefresh: false
      };
      const timeWindow: FixedTimeWindow = {
        type: 'fixed',
        duration: 3,
        durationUnit: 'week',
        startTimestamp: Date.now(),
        timezone: 'UTC'
      };
      useTimeConfig.mockReturnValue(timeConfig);

      // When
      const { result } = renderHook(() => useSloWindowTimeConfig(timeWindow));

      // Then
      expect(result.current).toEqual(
        expect.objectContaining({
          to: addWeeks(Date.now(), 3).getTime(),
          windowSize: days.toMillis(7 * 3)
        })
      );
    });

    it.each([
      [28, '2023-02-15T12:00:00Z'],
      [30, '2023-04-15T12:00:00Z']
    ])(
      'creates a timeConfig with a window size of %d days for a duration of 1 month starting now when now is %s',
      (expectedDays, now) => {
        // Given
        jest.setSystemTime(new Date(now));
        const timeConfig: TimeConfig = {
          to: Date.now(),
          windowSize: days.toMillis(1),
          autoRefresh: false
        };
        const timeWindow: FixedTimeWindow = {
          type: 'fixed',
          duration: 1,
          durationUnit: 'month',
          startTimestamp: Date.now(),
          timezone: 'UTC'
        };
        useTimeConfig.mockReturnValue(timeConfig);

        // When
        const { result } = renderHook(() => useSloWindowTimeConfig(timeWindow));

        // Then
        expect(result.current).toEqual(
          expect.objectContaining({
            to: addDays(Date.now(), expectedDays).getTime(),
            windowSize: days.toMillis(expectedDays)
          })
        );
      }
    );

    it('calculates the to timestamp of the timeConfig in a tumbling fashion from the startTimestamp if the startTimestamp is further in the past than one time window', () => {
      // Given
      const startTimestamp = subWeeks(subDays(Date.now(), 1), 4).getTime();
      const timeConfig: TimeConfig = {
        to: Date.now(),
        windowSize: days.toMillis(1),
        autoRefresh: false
      };
      const timeWindow: FixedTimeWindow = {
        type: 'fixed',
        duration: 1,
        durationUnit: 'week',
        startTimestamp,
        timezone: 'UTC'
      };
      useTimeConfig.mockReturnValue(timeConfig);

      // When
      const { result } = renderHook(() => useSloWindowTimeConfig(timeWindow));

      // Then
      expect(result.current).toEqual(
        expect.objectContaining({
          to: addDays(Date.now(), 6).getTime(),
          windowSize: days.toMillis(7)
        })
      );
    });

    it('pick the corresponding time window iteration between startTimestamp and now when both the startTimestamp and the timeConfig are in the past', () => {
      // Given
      const startTimestamp = subWeeks(subDays(Date.now(), 1), 4).getTime();
      const timeConfig: TimeConfig = {
        to: subWeeks(Date.now(), 2).getTime(),
        windowSize: days.toMillis(1),
        autoRefresh: false
      };
      const timeWindow: FixedTimeWindow = {
        type: 'fixed',
        duration: 1,
        durationUnit: 'week',
        startTimestamp,
        timezone: 'UTC'
      };
      useTimeConfig.mockReturnValue(timeConfig);

      // When
      const { result } = renderHook(() => useSloWindowTimeConfig(timeWindow));

      // Then
      expect(result.current).toEqual(
        expect.objectContaining({
          to: addDays(subWeeks(Date.now(), 2), 6).getTime(),
          windowSize: days.toMillis(7)
        })
      );
    });
  });
});
