/// <reference path="../../typings/tsd.d.ts" />

import {expect} from 'chai';
import Database from './Database';

describe('worker.Database', () => {

  let db;

  beforeEach(() => {
    db = new Database();
  });

  describe('getUnion', () => {

    it('should combine values from multiple time series', () => {
      addPoints(3);
      const union = db.getUnion(['a', 'b', 'c'], 0, 2);
      expect(union).to.deep.equal([
        [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}],
        [{x: 1, y: 10}, {x: 1, y: 11}, {x: 1, y: 12}],
        [{x: 2, y: 20}, {x: 2, y: 22}, {x: 2, y: 24}]
      ]);
    });

    it('should extract subsets of data', () => {
      addPoints(10);
      const union = db.getUnion(['a', 'b', 'c'], 5, 7);
      expect(union).to.deep.equal([
        [{x: 5, y: 50}, {x: 5, y: 55}, {x: 5, y: 60}],
        [{x: 6, y: 60}, {x: 6, y: 66}, {x: 6, y: 72}],
        [{x: 7, y: 70}, {x: 7, y: 77}, {x: 7, y: 84}]
      ]);
    });

    it('should retain timestamps with incomplete values', () => {
      db.addPoint('a', 1, 10);
      db.addPoint('b', 1, 11);
      db.addPoint('b', 2, 20);
      db.addPoint('a', 3, 30);
      db.addPoint('b', 3, 31);
      db.addPoint('a', 4, 42);

      const union = db.getUnion(['a', 'b'], 0, 5);
      expect(union).to.deep.equal([
        [{x: 1, y: 10}, {x: 1, y: 11}],
        [{x: 2, y: undefined}, {x: 2, y: 20}],
        [{x: 3, y: 30}, {x: 3, y: 31}],
        [{x: 4, y: 42}, {x: 4, y: undefined}]
      ]);
    });

    it('should support series with no data points', () => {
      db.addPoint('a', 1, 10);
      db.addPoint('a', 2, 30);

      const union = db.getUnion(['a', 'b'], 0, 5);
      expect(union).to.deep.equal([
        [{x: 1, y: 10}, {x: 1, y: undefined}],
        [{x: 2, y: 30}, {x: 2, y: undefined}]
      ]);
    });
  });

  function addPoints(n) {
    for (let i = 0; i < n; i++) {
      db.addPoint('a', i, i * 10);
      db.addPoint('b', i, i * 11);
      db.addPoint('c', i, i * 12);
    }
  }
});
