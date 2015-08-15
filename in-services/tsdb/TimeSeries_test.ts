/// <reference path="../../typings/all.d.ts" />

import {expect} from 'chai';
import TimeSeries from './TimeSeries';

describe('tsdb.TimeSeries', () => {

  const id = 'testTimeSeriesId';
  let ts: TimeSeries<number>;

  beforeEach(() => {
    ts = new TimeSeries<number>(id);
  });

  describe('id', () => {
    it('should expose an id property', () => {
      expect(ts.id).to.equal(id);
    });
  });

  describe('data points', () => {
    it('should add points', () => {
      ts.addPoint(42, 5);
      expect(ts.times).to.deep.equal([42]);
      expect(ts.values).to.deep.equal([5]);
    });

    it('should use insertion sort', () => {
      ts.addPoint(42, 2);
      ts.addPoint(41, 3);
      ts.addPoint(43, 1);
      expect(ts.times).to.deep.equal([41, 42, 43]);
      expect(ts.values).to.deep.equal([3, 2, 1]);
    });
  });

});
