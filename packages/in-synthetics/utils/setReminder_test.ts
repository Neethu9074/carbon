/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  calculateNextOccurrence,
  setReminder,
  storedAlarmTimeOrNull,
  timeExpired
} from 'in-synthetics/utils/setReminders';

const localStorageKey = 'nextPopDialogReminderAfter';

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2023, 10));
});

afterAll(() => {
  jest.useRealTimers();
});

describe('pop-dialog-reminder', () => {
  describe('calculateNextOccurrence', () => {
    it('should return the current time plus the specified increment', () => {
      const increment = 1000;
      const expectedTime = Date.now() + increment;
      const nextOccurrence = calculateNextOccurrence(increment);
      expect(nextOccurrence).toBe(expectedTime);
    });
  });

  describe('setReminder', () => {
    it('should set the next reminder time in local storage', () => {
      const nextOccurrence = 1000;
      setReminder(nextOccurrence);
      const storedTime = storedAlarmTimeOrNull();
      expect(storedTime).toBe(nextOccurrence);
    });
  });

  describe('storedAlarmTimeOrNull', () => {
    beforeAll(() => {
      localStorage.removeItem(localStorageKey);
    });
    it('should return null if the next reminder time is not in local storage', () => {
      const storedTime = storedAlarmTimeOrNull();
      expect(storedTime).toBeNull();
    });

    it('should return null if the next reminder time is not a number', () => {
      localStorage.setItem(localStorageKey, 'not a number');
      const storedTime = storedAlarmTimeOrNull();
      expect(storedTime).toBeNaN();
    });
  });

  describe('timeExpired', () => {
    it('should return true if the next reminder time is in the past', () => {
      const nextOccurrence = Date.now() - 1000;
      setReminder(nextOccurrence);
      const expired = timeExpired();
      expect(expired).toBe(true);
    });

    it('should return false if the next reminder time is in the future', () => {
      const nextOccurrence = Date.now() + 1000;
      setReminder(nextOccurrence);
      const expired = timeExpired();
      expect(expired).toBe(false);
    });
  });
});
