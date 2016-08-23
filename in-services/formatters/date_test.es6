/* eslint-env mocha */
import {expect} from 'chai';

import {formatDate, formatTime, formatDateTime} from 'in-services/formatters/date';


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
});
