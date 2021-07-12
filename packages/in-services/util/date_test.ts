/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import moment from 'moment';

import { isOnSameDay } from 'in-services/util/date';

describe('in-services/util/date', () => {
  describe('isOnSameDay', () => {
    it('same time should return true', () => {
      const time = moment().valueOf();
      expect(isOnSameDay(time, time)).toEqual(true);
    });

    it('same day different time should return true', () => {
      const time1 = moment().valueOf();
      const time2 = moment()
        .hour(12)
        .minute(33)
        .valueOf();
      expect(isOnSameDay(time1, time2)).toEqual(true);
    });

    it('different days should return false', () => {
      const time1 = moment().valueOf();
      const time2 = moment()
        .add(1, 'days')
        .valueOf();
      expect(isOnSameDay(time1, time2)).toEqual(false);

      const time3 = moment()
        .add(1, 'months')
        .valueOf();
      expect(isOnSameDay(time1, time3)).toEqual(false);
    });
  });
});
