/* eslint-env mocha, node */

import jest from 'jest-mock';
import expect from 'expect';

import { render } from './LineChart';

describe('in-new-components/LatencyDistributionBase10Chart/components/LineChart', () => {
  it('should catch breaking changes in line.render', () => {
    const canvasContextMock = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
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

    expect(canvasContextMock.beginPath).toHaveBeenCalled();
    expect(canvasContextMock.moveTo).toHaveBeenCalledWith(0, 0);
    expect(canvasContextMock.lineTo).toHaveBeenNthCalledWith(1, 10, 50);
    expect(canvasContextMock.lineTo).toHaveBeenNthCalledWith(2, 20, 15);
    expect(canvasContextMock.strokeStyle).toBe(color);
    expect(canvasContextMock.stroke).toHaveBeenCalled();
  });
});
