/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { timeDisplayTopFormat, timeDisplayBottomFormat, formatExact } from 'in-new-components/time/timeframeFormatter';

describe('in-new-components/time/timeframeFormatter', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers(1519297047052);
  });

  afterEach(() => {
    clock.restore();
  });
  describe('timeDisplayTopFormat', () => {
    it('must format live time modes', () => {
      expect(timeDisplayTopFormat({ autoRefresh: true, to: null, windowSize: 60000 })).to.equal('Feb 22');
      expect(timeDisplayTopFormat({ autoRefresh: true, to: null, windowSize: 120000 })).to.equal('Feb 22');
      expect(timeDisplayTopFormat({ autoRefresh: true, to: null, windowSize: 3600000 })).to.equal('Feb 22');
      expect(timeDisplayTopFormat({ autoRefresh: true, to: null, windowSize: 3662000 })).to.equal('Feb 22');
      expect(timeDisplayTopFormat({ autoRefresh: true, to: null, windowSize: 86400000 })).to.equal('Starting Feb 21');
    });

    it('must format time with no "to" value on same day', () => {
      expect(timeDisplayTopFormat({ to: null, windowSize: 8500000 })).to.equal('Feb 22');
    });

    it('must format time with no "to" value on different days', () => {
      expect(timeDisplayTopFormat({ to: null, windowSize: 123400000 })).to.equal('1d 10h 16m');
    });

    it('must format custom time modes on same day', () => {
      expect(timeDisplayTopFormat({ to: 1519297047052, windowSize: 8500000 })).to.equal('2h 21m - Feb 22');
    });

    it('must format custom time modes on different days', () => {
      expect(timeDisplayTopFormat({ to: 1519297047052, windowSize: 123400000 })).to.equal('1d 10h 16m');
    });
  });

  describe('timeDisplayBottomFormat', () => {
    it('must format live time modes', () => {
      expect(timeDisplayBottomFormat({ autoRefresh: true, to: null, windowSize: 60000 })).to.equal('Last minute');
      expect(timeDisplayBottomFormat({ autoRefresh: true, to: null, windowSize: 120000 })).to.equal('Last 2 minutes');
      expect(timeDisplayBottomFormat({ autoRefresh: true, to: null, windowSize: 3600000 })).to.equal('Last hour');
      expect(timeDisplayBottomFormat({ autoRefresh: true, to: null, windowSize: 3662000 })).to.equal(
        'Last 1 hour 1 minute'
      );
      expect(timeDisplayBottomFormat({ autoRefresh: true, to: null, windowSize: 86400000 })).to.equal('Last 24 hours');
    });

    it('must format time with no "to" value on same day', () => {
      expect(timeDisplayBottomFormat({ to: null, windowSize: 8500000 })).to.equal('Last 2 hours 21 minutes');
    });

    it('must format time with no "to" value on different days', () => {
      expect(timeDisplayBottomFormat({ to: null, windowSize: 123400000 })).to.equal('Feb 21 - Feb 22');
    });

    it('must format custom time modes on same day', () => {
      expect(timeDisplayBottomFormat({ to: 1519297047052, windowSize: 8500000 })).to.equal('09:35:47 - 11:57:27');
    });

    it('must format custom time modes on different days', () => {
      expect(timeDisplayBottomFormat({ to: 1519297047052, windowSize: 123400000 })).to.equal('Feb 21 - Feb 22');
    });
  });

  describe('formatExact', () => {
    it('must format custom time modes on same day', () => {
      expect(formatExact({ to: 1600777638000, windowSize: 21600000 })).to.equal('Sep 22 08:27:18 - 14:27:18 (6h)');
    });

    it('must format custom time modes on different days', () => {
      expect(formatExact({ to: 1600777662000, windowSize: 86400000 })).to.equal(
        'Sep 21 14:27:42 - Sep 22 14:27:42 (1d)'
      );
    });
  });
});
