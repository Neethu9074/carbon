/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha, node */

import { expect } from 'chai';
import sinon from 'sinon';

import { render } from './LineChart';

describe('in-new-components/LatencyDistributionBase10Chart/components/LineChart', () => {
  it('should catch breaking changes in line.render', () => {
    const canvasContextMock = {
      beginPath: sinon.spy(),
      moveTo: sinon.spy(),
      lineTo: sinon.spy(),
      stroke: sinon.spy(),
      strokeStyle: null
    };

    const bucketWidth = 10;
    const color = 'blue';

    render(
      [
        [0, 0],
        [bucketWidth, 50],
        [2 * bucketWidth, 15]
      ],
      color,
      canvasContextMock,
      bucketWidth
    );

    expect(canvasContextMock.beginPath).to.have.been.calledWith();
    expect(canvasContextMock.moveTo).to.have.been.calledWith(0, 0);
    expect(canvasContextMock.lineTo).to.have.been.calledWith(10, 50);
    expect(canvasContextMock.lineTo).to.have.been.calledWith(20, 15);
    expect(canvasContextMock.strokeStyle).to.equal(color);
    expect(canvasContextMock.stroke).to.have.been.calledWith();
  });
});
