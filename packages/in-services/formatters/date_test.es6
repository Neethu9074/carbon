/* eslint-env mocha */
import { expect } from 'chai';

import {
  formatDate,
  formatTime,
  formatDateTime,
  formatDurationAccurately,
  formatStringToTime
} from 'in-services/formatters/date';

describe('in-services/formatters/date', () => {
  describe('formatTime', () => {
    it('should return millis as time of day', () => {
      expect(formatTime(1467276721092)).to.equal('10:52:01');
    });

    it('should return return null on null input', () => {
      expect(formatTime(null)).to.equal(null);
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

  describe('formatStringToTime', () => {
    it('must format time string correctly', () => {
      expect(formatStringToTime('9')).to.equal('09:00:00');
      expect(formatStringToTime('09:')).to.equal('09:00:00');
      expect(formatStringToTime('19')).to.equal('19:00:00');
      expect(formatStringToTime('9:1')).to.equal('09:01:00');
      expect(formatStringToTime('9:01')).to.equal('09:01:00');
      expect(formatStringToTime('9:10:1')).to.equal('09:10:01');
      expect(formatStringToTime('9:10:11')).to.equal('09:10:11');
      expect(formatStringToTime('yolo')).to.equal('yolo');
    });
  });
});
