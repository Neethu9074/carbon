/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { days, hours, minutes, seconds } from 'in-services/time';

describe('in-services/time', () => {
  describe('days', () => {
    it('should calculate days to millis', () => {
      for (let i = 0; i < 31; i++) {
        expect(days.toMillis(i)).toEqual(1000 * 60 * 60 * 24 * i);
        expect(days.toHours(i)).toEqual(24 * i);
      }
    });
  });

  describe('hours', () => {
    it('should calculate hours to millis', () => {
      for (let i = 0; i < 24; i++) {
        expect(hours.toMinutes(i)).toEqual(60 * i);
        expect(hours.toMillis(i)).toEqual(1000 * 60 * 60 * i);
      }
    });
  });

  describe('minutes', () => {
    it('should calculate minutes to millis', () => {
      for (let i = 0; i < 60; i++) {
        expect(minutes.toMillis(i)).toEqual(1000 * 60 * i);
      }
    });
  });

  describe('seconds', () => {
    it('should calculate seconds to millis', () => {
      for (let i = 0; i < 60; i++) {
        expect(seconds.toMillis(i)).toEqual(1000 * i);
      }
    });
  });
});
