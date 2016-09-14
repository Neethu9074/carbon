/* eslint-env mocha */

/* eslint-disable comma-style, no-sparse-arrays */

import {expect} from 'chai';

import createQueue from './queue';
import {column} from './testUtil';

describe('queue', () => {
  let queue;

  describe('loose', () => {
    beforeEach(() => {
      queue = createQueue({
        numberOfSeries: 2,
        requireExistenceInAllSeries: false
      });
    });

    it('must allow creation', () => {
      expect(queue.addDataPoint).to.be.a('function');
      expect(queue.get).to.be.a('function');
    });

    it('must bundle data points to columns', () => {
      queue.addDataPoint(1, [2, 5]);
      queue.addDataPoint(0, [2, 3]);
      expect(queue.get()).to.deep.equal([
        column([
          [2, 3],
          [2, 5]
        ])
      ]);
    });

    it('must add multiple data points at the same time', () => {
      queue.addDataPoints(1, [[2, 5], [4, 6]]);
      queue.addDataPoints(0, [[4, 5], [2, 3]]);
      expect(queue.get()).to.deep.equal([
        column([
          [2, 3],
          [2, 5]
        ]),
        column([
          [4, 5],
          [4, 6]
        ])
      ]);
    });

    it('must report columns with missing values', () => {
      queue.addDataPoint(1, [2, 5]);
      expect(queue.get()).to.deep.equal([
        column([
          ,
          [2, 5]
        ])
      ]);
    });

    it('must order the data columns', () => {
      queue.addDataPoint(1, [2, 5]);
      queue.addDataPoint(1, [1, 5]);
      queue.addDataPoint(0, [1, 3]);
      expect(queue.get()).to.deep.equal([
        column([
          [1, 3],
          [1, 5]
        ]),
        column([
          ,
          [2, 5]
        ])
      ]);
    });

    it('must not report data points in subsequent get calls', () => {
      queue.addDataPoint(1, [1, 5]);
      queue.addDataPoint(0, [1, 3]);
      expect(queue.get()).to.deep.equal([
        column([
          [1, 3],
          [1, 5]
        ])
      ]);

      queue.addDataPoint(1, [2, 42]);
      expect(queue.get()).to.deep.equal([
        column([
          ,
          [2, 42]
        ])
      ]);
    });
  });


  describe('strict', () => {
    beforeEach(() => {
      queue = createQueue({
        numberOfSeries: 2,
        requireExistenceInAllSeries: true
      });
    });

    it('must allow creation', () => {
      expect(queue.addDataPoint).to.be.a('function');
      expect(queue.get).to.be.a('function');
    });

    it('must bundle data points to columns', () => {
      queue.addDataPoint(1, [2, 5]);
      queue.addDataPoint(0, [2, 3]);
      expect(queue.get()).to.deep.equal([
        column([
          [2, 3],
          [2, 5]
        ])
      ]);
    });

    it('must not return data columns when data points are missing for the first series', () => {
      queue.addDataPoint(1, [2, 5]);
      expect(queue.get()).to.deep.equal([]);
    });

    it('must not return data columns when data points are missing for the last series', () => {
      queue.addDataPoint(0, [2, 3]);
      expect(queue.get()).to.deep.equal([]);
    });

    it('must return full columns in subsequent calls', () => {
      queue.addDataPoint(1, [2, 5]);
      queue.get();

      queue.addDataPoint(0, [2, 3]);

      expect(queue.get()).to.deep.equal([
        column([
          [2, 3],
          [2, 5]
        ])
      ]);
    });

    it('must return full columns in subsequent calls when the order is reversed', () => {
      queue.addDataPoint(0, [2, 3]);
      queue.get();

      queue.addDataPoint(1, [2, 5]);

      expect(queue.get()).to.deep.equal([
        column([
          [2, 3],
          [2, 5]
        ])
      ]);
    });

    it('must not return a processed data point multiple times', () => {
      queue.addDataPoint(1, [2, 5]);
      queue.addDataPoint(0, [2, 3]);
      queue.get();
      expect(queue.get()).to.deep.equal([]);
    });

    it('must return multiple data points immediately if possible', () => {
      queue.addDataPoint(0, [2, 3]);
      queue.addDataPoint(1, [2, 5]);
      queue.addDataPoint(0, [3, 4]);
      queue.addDataPoint(1, [3, 6]);

      expect(queue.get()).to.deep.equal([
        column([
          [2, 3],
          [2, 5]
        ]),
        column([
          [3, 4],
          [3, 6]
        ])
      ]);
    });

    it('must not mix up timestamps', () => {
      queue.addDataPoint(1, [2, 5]);
      queue.addDataPoint(0, [3, 3]);
      expect(queue.get()).to.deep.equal([]);
    });

    it('must add time property to columns', () => {
      queue.addDataPoint(0, [2, 3]);
      queue.addDataPoint(1, [2, 5]);
      expect(queue.get()[0].time).to.equal(2);
    });
  });
});
