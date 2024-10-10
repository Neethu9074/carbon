/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { drawPoint } from 'in-components/Chart/renderer/point';

export default {
  render: ({ dataSeries, color, scale, config, metricId }) => {
    const { y1, backBufferCtx, xScaleBackBuffer, maxDistanceBetweenDatapointsInMillis } = config;

    if (!dataSeries) return;

    backBufferCtx.beginPath();
    const lineWidth = y1?.lineWidth ?? 2;

    let previousDataPoint;

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (!dataPoint) {
        continue;
      }
      const nextDataPoint = dataSeries[i + 1];
      const xPos = xScaleBackBuffer.getRange(dataPoint[0]);
      const yPos = scale.getRange(dataPoint[1]);

      if (distanceBetweenDataPointsIsTooBig(dataPoint, previousDataPoint)) {
        backBufferCtx.moveTo(xPos, yPos);
      } else {
        backBufferCtx.lineTo(xPos, yPos);
      }

      if (
        (!previousDataPoint && !nextDataPoint) ||
        (distanceBetweenDataPointsIsTooBig(nextDataPoint, dataPoint) &&
          distanceBetweenDataPointsIsTooBig(dataPoint, previousDataPoint))
      ) {
        drawPoint(config, xPos, yPos, color);
      }

      previousDataPoint = dataPoint;
    }

    backBufferCtx.strokeStyle = color;
    backBufferCtx.lineWidth = lineWidth;
    backBufferCtx.stroke();

    /**
     * @return {boolean} false only if the timestamps (the first item of the tuples `a`,`b`) are close enough.
     * in any other case it returns `true`: When `a` or `b` are `undefined` or
     * either `a` or `b` are `undefined` or do not contain a number as its timestamp as its first entry.
     */
    function distanceBetweenDataPointsIsTooBig(a, b) {
      return (
        !a ||
        !b ||
        a[0] - b[0] > (y1?.distanceBetweenDatapointsInMillis?.[metricId] ?? maxDistanceBetweenDatapointsInMillis)
      );
    }
  }
};
