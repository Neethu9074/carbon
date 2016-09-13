/* eslint-env mocha */
import proxyquire from 'proxyquire';
import {expect} from 'chai';

import {parseDateTime} from 'in-services/formatters/date';
import {resetStoreRegistry} from 'in-stores/store';

describe('in-components/timeline/components/DatePicker/datePickerStore', () => {

  let mod;

  beforeEach(() => {
    resetStoreRegistry();
    mod = proxyquire('./datePickerStore', {});
  });

  describe('validateTime', () => {
    it('must identify valid times at left border', () => {
      const time = parseDateTime('2016-05-24 15:30:20').getTime();
      const from = parseDateTime('2016-05-24 15:30:20').getTime();
      const to =   parseDateTime('2016-05-24 15:40:20').getTime();
      expect(mod.validateTime(time, from, to)).to.deep.equal({
        date: true,
        time: true
      });
    });

    it('must identify valid times at right border', () => {
      const time = parseDateTime('2016-05-24 15:40:20').getTime();
      const from = parseDateTime('2016-05-24 15:30:20').getTime();
      const to =   parseDateTime('2016-05-24 15:40:20').getTime();
      expect(mod.validateTime(time, from, to)).to.deep.equal({
        date: true,
        time: true
      });
    });

    it('must identify valid times in the middle by time', () => {
      const time = parseDateTime('2016-05-24 15:35:20').getTime();
      const from = parseDateTime('2016-05-24 15:30:20').getTime();
      const to =   parseDateTime('2016-05-24 15:40:20').getTime();
      expect(mod.validateTime(time, from, to)).to.deep.equal({
        date: true,
        time: true
      });
    });

    it('must identify valid times in the middle by date', () => {
      const time = parseDateTime('2016-05-25 15:30:20').getTime();
      const from = parseDateTime('2016-05-24 15:30:20').getTime();
      const to =   parseDateTime('2016-05-26 15:30:20').getTime();
      expect(mod.validateTime(time, from, to)).to.deep.equal({
        date: true,
        time: true
      });
    });

    it('must identify invalid times before left border by date', () => {
      const time = parseDateTime('2016-05-23 15:30:20').getTime();
      const from = parseDateTime('2016-05-24 15:30:20').getTime();
      const to =   parseDateTime('2016-05-24 15:40:20').getTime();
      expect(mod.validateTime(time, from, to)).to.deep.equal({
        date: false,
        time: true
      });
    });

    it('must identify invalid times before left border by time', () => {
      const time = parseDateTime('2016-05-24 15:20:20').getTime();
      const from = parseDateTime('2016-05-24 15:30:20').getTime();
      const to =   parseDateTime('2016-05-24 15:40:20').getTime();
      expect(mod.validateTime(time, from, to)).to.deep.equal({
        date: true,
        time: false
      });
    });

    it('must identify invalid times after right border by date', () => {
      const time = parseDateTime('2016-05-25 15:30:20').getTime();
      const from = parseDateTime('2016-05-24 15:30:20').getTime();
      const to =   parseDateTime('2016-05-24 15:40:20').getTime();
      expect(mod.validateTime(time, from, to)).to.deep.equal({
        date: false,
        time: true
      });
    });

    it('must identify invalid times after right border by time', () => {
      const time = parseDateTime('2016-05-24 15:41:20').getTime();
      const from = parseDateTime('2016-05-24 15:30:20').getTime();
      const to =   parseDateTime('2016-05-24 15:40:20').getTime();
      expect(mod.validateTime(time, from, to)).to.deep.equal({
        date: true,
        time: false
      });
    });
  });
});
