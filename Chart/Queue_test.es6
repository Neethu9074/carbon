/*eslint-env mocha*/

'use strict';

import {expect} from 'chai';

import Queue from './Queue';

describe('Queue', () => {

  let queue;

  it('should queue up data points and return them when asked to', () => {
    queue = new Queue(3);
    queue.addDataPoint(1, {x: 3, y: 15});
    queue.addDataPoint(0, {x: 3, y: 5});
    queue.addDataPoint(2, {x: 3, y: 25});

    const newDataPoints = queue.get();

    expect(newDataPoints.length).to.equal(1);
    expect(newDataPoints[0][0].y).to.equal(5);
    expect(newDataPoints[0][1].y).to.equal(15);
    expect(newDataPoints[0][2].y).to.equal(25);
  });

  it('should not provide any data points when one of the series did not get a value', () => {
    queue = new Queue(2);
    queue.addDataPoint(1, {x: 3, y: 15});

    const newDataPoints = queue.get();

    expect(newDataPoints.length).to.equal(0);
  });

  it('should support multiple queued up data points', () => {
    queue = new Queue(2);
    queue.addDataPoint(1, {x: 3, y: 15});
    queue.addDataPoint(0, {x: 3, y: 5});
    queue.addDataPoint(1, {x: 4, y: 16});
    queue.addDataPoint(0, {x: 4, y: 6});

    const newDataPoints = queue.get();

    expect(newDataPoints.length).to.equal(2);
    expect(newDataPoints[0][0].y).to.equal(5);
    expect(newDataPoints[0][1].y).to.equal(15);
    expect(newDataPoints[1][0].y).to.equal(6);
    expect(newDataPoints[1][1].y).to.equal(16);
  });

  it('should not list the same data points multiple times', () => {
    queue = new Queue(2);
    queue.addDataPoint(1, {x: 3, y: 15});
    queue.addDataPoint(0, {x: 3, y: 5});

    expect(queue.get().length).to.equal(1);
    expect(queue.get().length).to.equal(0);
  });

});
