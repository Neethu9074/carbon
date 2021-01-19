/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import moment from 'moment';
import { expect } from 'chai';

import { isOnSameDay } from 'in-services/util/date';

describe('in-services/util/date', () => {
  describe('isOnSameDay', () => {
    it('same time should return true', () => {
      const time = moment().valueOf();
      expect(isOnSameDay(time, time)).to.equal(true);
    });

    it('same day different time should return true', () => {
      const time1 = moment().valueOf();
      const time2 = moment()
        .hour(12)
        .minute(33)
        .valueOf();
      expect(isOnSameDay(time1, time2)).to.equal(true);
    });

    it('different days should return false', () => {
      const time1 = moment().valueOf();
      const time2 = moment()
        .add(1, 'days')
        .valueOf();
      expect(isOnSameDay(time1, time2)).to.equal(false);

      const time3 = moment()
        .add(1, 'months')
        .valueOf();
      expect(isOnSameDay(time1, time3)).to.equal(false);
    });
  });
});
