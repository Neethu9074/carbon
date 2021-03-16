/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';

import {
  formatDate,
  formatTime,
  formatTimeWithoutSeconds,
  formatDateTime,
  formatDurationAccurately
} from 'in-services/formatters/date';

describe('in-services/formatters/date', () => {
  describe('formatTime', () => {
    it('should return millis as time of day', () => {
      expect(formatTime(1467276721092)).to.equal('10:52:01');
    });

    it('should return null on null input', () => {
      expect(formatTime(null)).to.equal(null);
    });
  });

  describe('formatTimeWithoutSeconds', () => {
    it('should return millis as time of day', () => {
      expect(formatTimeWithoutSeconds(1467276721092)).to.equal('10:52');
    });

    it('should return null on null input', () => {
      expect(formatTimeWithoutSeconds(null)).to.equal(null);
    });
  });

  describe('formatDate', () => {
    it('should return millis as date', () => {
      expect(formatDate(1467276721092)).to.equal('2016-06-30');
    });

    it('should return return null on null input', () => {
      expect(formatDate(null)).to.equal(null);
    });
  });

  describe('formatDateTime', () => {
    it('should return millis as date and time ', () => {
      expect(formatDateTime(1467276721092)).to.equal('2016-06-30 10:52:01');
    });

    it('should return return null on null input', () => {
      expect(formatDateTime(null)).to.equal(null);
    });
  });

  describe('formatDurationAccurately', () => {
    it('must format down to the second', () => {
      expect(formatDurationAccurately(60000, 1000)).to.equal('1m');
      expect(formatDurationAccurately(60500, 1000)).to.equal('1m');
      expect(formatDurationAccurately(61000, 1000)).to.equal('1m 1s');
      expect(formatDurationAccurately(62000, 1000)).to.equal('1m 2s');
      expect(formatDurationAccurately(62200, 1000)).to.equal('1m 2s');
    });

    it('must format larger dates', () => {
      expect(formatDurationAccurately(6179465599, 1000)).to.equal('2mo 10d 18h 16m 41s');
    });

    it('must ignore small times', () => {
      expect(formatDurationAccurately(6179465599, 60000)).to.equal('2mo 10d 18h 16m');
    });
  });
});
