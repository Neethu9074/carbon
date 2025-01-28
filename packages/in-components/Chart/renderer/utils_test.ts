/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

// @ts-expect-error import { drawCircleWithLine } from 'in-components/Chart/renderer/utils';
import { drawCircleWithLine } from 'in-components/Chart/renderer/utils';

describe('in-components/Chart/renderer/utils', () => {
  it('draws a circle with a line', () => {
    // Given
    let renderingContext = {
      beginPath: jest.fn(),
      stroke: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      arc: jest.fn(),
      strokeStyle: null,
      lineWidth: null
    };

    const xPos = 10;
    const yPos = 10;

    const config = { height: 100, timeAxisHeight: 10 };

    const circleStyle = 'blue';
    const lineStyle = 'lightblue';

    // When
    drawCircleWithLine({ renderingContext, config, xPos, yPos, circleStyle, lineStyle });

    // Then
    expect(renderingContext.beginPath).toHaveBeenCalledTimes(2);
    expect(renderingContext.stroke).toHaveBeenCalledTimes(2);
    expect(renderingContext.moveTo).toHaveBeenNthCalledWith(1, 8, 12);
    expect(renderingContext.lineTo).toHaveBeenCalledWith(8, 90);
    expect(renderingContext.moveTo).toHaveBeenNthCalledWith(2, 10, 10);
    expect(renderingContext.arc).toHaveBeenCalledWith(8, 10, 2, 0, 2 * Math.PI);
    expect(renderingContext.strokeStyle).toBe(circleStyle);
    expect(renderingContext.lineWidth).toBe(2);
  });
});
