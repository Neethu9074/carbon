/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { addDays, addMonths } from 'date-fns';

import { isOnSameDay } from 'in-services/util/date';

describe('in-services/util/date', () => {
  describe('isOnSameDay', () => {
    it('same time should return true', () => {
      const time = new Date().getTime();
      expect(isOnSameDay(time, time)).toEqual(true);
    });

    it('same day different time should return true', () => {
      const time1 = new Date().getTime();
      const time2 = new Date().setHours(12, 33);
      expect(isOnSameDay(time1, time2)).toEqual(true);
    });

    it('different days should return false', () => {
      const time1 = new Date().getTime();
      const time2 = addDays(time1, 1).getTime();
      expect(isOnSameDay(time1, time2)).toEqual(false);

      const time3 = addMonths(time1, 1).getTime();
      expect(isOnSameDay(time1, time3)).toEqual(false);
    });
  });
});
