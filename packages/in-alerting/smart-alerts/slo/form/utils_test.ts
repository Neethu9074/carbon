/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import {
  calculateTimeWindowInMilliseconds,
  getSloWithMinDurationTimeWindow
} from 'in-alerting/smart-alerts/slo/form/utils';
import { mockSlo1, mockSlo2, mockSlo3, mockSlo4 } from 'in-alerting/smart-alerts/slo/form/utilsTestMockData';

describe('Smart Alert Form Utils', () => {
  describe('getMinDurationTimeWindow works properly', () => {
    it('returns correct slo for 1 slo', () => {
      // Given
      const slo1: ServiceLevelObjectiveConfiguration = {
        ...mockSlo1,
        timeWindow: {
          type: 'fixed',
          duration: 2,
          durationUnit: 'week',
          startTimestamp: 1719340200000
        }
      };
      const slos = [slo1];

      // Then
      expect(getSloWithMinDurationTimeWindow(slos)).toBe(slo1);
    });

    it('returns correct slo for an array of 2 slos with time windows of 2 weeks and 1 week respectively', () => {
      // Given
      const slo1: ServiceLevelObjectiveConfiguration = {
        ...mockSlo1,
        timeWindow: {
          type: 'fixed',
          duration: 2,
          durationUnit: 'week',
          startTimestamp: 1719340200000
        }
      };
      const slo2: ServiceLevelObjectiveConfiguration = {
        ...mockSlo2,
        timeWindow: {
          type: 'fixed',
          duration: 1,
          durationUnit: 'week',
          startTimestamp: 1718143200000
        }
      };
      const slos = [slo1, slo2];

      // Then
      expect(getSloWithMinDurationTimeWindow(slos)).toBe(slo2);
    });

    it('returns correct slo for an array of 3 slos with time windows of 2 weeks, 1 week and 1 day respectively', () => {
      // Given
      const slo1: ServiceLevelObjectiveConfiguration = {
        ...mockSlo1,
        timeWindow: {
          type: 'fixed',
          duration: 2,
          durationUnit: 'week',
          startTimestamp: 1719340200000
        }
      };
      const slo2: ServiceLevelObjectiveConfiguration = {
        ...mockSlo2,
        timeWindow: {
          type: 'fixed',
          duration: 1,
          durationUnit: 'week',
          startTimestamp: 1718143200000
        }
      };
      const slo3: ServiceLevelObjectiveConfiguration = {
        ...mockSlo3,
        timeWindow: {
          type: 'fixed',
          duration: 1,
          durationUnit: 'day',
          startTimestamp: 1718143200000
        }
      };
      const slos = [slo1, slo2, slo3];

      // Then
      expect(getSloWithMinDurationTimeWindow(slos)).toBe(slo3);
    });

    it('returns correct slo for an array of 4 slos with time windows of 2 weeks, 1 minute, 1 day and 1 week respectively', () => {
      // Given
      const slo1: ServiceLevelObjectiveConfiguration = {
        ...mockSlo1,
        timeWindow: {
          type: 'fixed',
          duration: 2,
          durationUnit: 'week',
          startTimestamp: 1719340200000
        }
      };
      const slo2: ServiceLevelObjectiveConfiguration = {
        ...mockSlo2,
        timeWindow: {
          type: 'fixed',
          duration: 1,
          durationUnit: 'minute',
          startTimestamp: 1718143200000
        }
      };
      const slo3: ServiceLevelObjectiveConfiguration = {
        ...mockSlo3,
        timeWindow: {
          type: 'fixed',
          duration: 1,
          durationUnit: 'day',
          startTimestamp: 1718143200000
        }
      };
      const slo4: ServiceLevelObjectiveConfiguration = {
        ...mockSlo4,
        timeWindow: {
          type: 'fixed',
          duration: 1,
          durationUnit: 'week',
          startTimestamp: 1718143200000
        }
      };

      const slos = [slo1, slo2, slo3, slo4];
      // Then
      expect(getSloWithMinDurationTimeWindow(slos)).toBe(slo2);
    });

    it('returns correct slo for an array of 2 slos with time windows of 2 days and 1 week respectively', () => {
      // Given
      const slo1: ServiceLevelObjectiveConfiguration = {
        ...mockSlo1,
        timeWindow: {
          type: 'fixed',
          duration: 2,
          durationUnit: 'day',
          startTimestamp: 1719340200000
        }
      };
      const slo2: ServiceLevelObjectiveConfiguration = {
        ...mockSlo2,
        timeWindow: {
          type: 'fixed',
          duration: 1,
          durationUnit: 'week',
          startTimestamp: 1718143200000
        }
      };
      const slos = [slo1, slo2];

      // Then
      expect(getSloWithMinDurationTimeWindow(slos)).toBe(slo1);
    });

    it('returns undefined for an array without slos being passed', () => {
      // Given
      const slos: ServiceLevelObjectiveConfiguration[] = [];

      // Then
      expect(getSloWithMinDurationTimeWindow(slos)).toBe(undefined);
    });
  });

  describe('calculateTimeWindowInMilliseconds function works properly', () => {
    it('returns correct calculation for 4 milliseconds', () => {
      // Given
      const duration = 4;
      const durationUnit = 'millisecond';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(4);
    });

    it('returns correct calculation for 1 millisecond', () => {
      // Given
      const duration = 1;
      const durationUnit = 'millisecond';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(1);
    });

    it('returns correct calculation for 6 seconds', () => {
      // Given
      const duration = 6;
      const durationUnit = 'second';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(6000);
    });

    it('returns correct calculation for 40 seconds', () => {
      // Given
      const duration = 40;
      const durationUnit = 'second';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(40000);
    });

    it('returns correct calculation for 3 minutes', () => {
      // Given
      const duration = 3;
      const durationUnit = 'minute';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(180000);
    });

    it('returns correct calculation for 412 minutes', () => {
      // Given
      const duration = 412;
      const durationUnit = 'minute';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(24720000);
    });

    it('returns correct calculation for 2 hours', () => {
      // Given
      const duration = 2;
      const durationUnit = 'hour';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(7200000);
    });

    it('returns correct calculation for 176 hours', () => {
      // Given
      const duration = 176;
      const durationUnit = 'hour';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(633600000);
    });

    it('returns correct calculation for 3 days', () => {
      // Given
      const duration = 3;
      const durationUnit = 'day';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(259200000);
    });

    it('returns correct calculation for 20 days', () => {
      // Given
      const duration = 20;
      const durationUnit = 'day';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(1728000000);
    });

    it('returns correct calculation for 1 week', () => {
      // Given
      const duration = 1;
      const durationUnit = 'week';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(604800000);
    });

    it('returns correct calculation for 13 weeks', () => {
      // Given
      const duration = 13;
      const durationUnit = 'week';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(7862400000);
    });

    it('returns correct calculation for 1 month', () => {
      // Given
      const duration = 1;
      const durationUnit = 'month';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(2592000000);
    });

    it('returns correct calculation for 99 months', () => {
      // Given
      const duration = 99;
      const durationUnit = 'month';

      // Then
      expect(calculateTimeWindowInMilliseconds(duration, durationUnit)).toBe(256608000000);
    });
  });
});
