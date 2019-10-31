import { drawPoint } from 'in-components/Chart/renderer/point';
export default {
  render: ({ dataSeries, color, scale, config }) => {
    config.backBufferCtx.beginPath();

    let previousDataPoint;
    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (!dataPoint) {
        continue;
      }
      const nextDataPoint = dataSeries[i + 1];
      const xPos = config.scales.xBackBuffer.getRange(dataPoint[0]);
      const yPos = scale.getRange(dataPoint[1]);

      if (distanceBetweenDataPointsIsTooBig(dataPoint, previousDataPoint)) {
        config.backBufferCtx.moveTo(xPos, yPos);
      } else {
        config.backBufferCtx.lineTo(xPos, yPos);
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

    config.backBufferCtx.strokeStyle = color;
    config.backBufferCtx.lineWidth = 2;
    config.backBufferCtx.stroke();

    function distanceBetweenDataPointsIsTooBig(a, b) {
      return !a || !b || a[0] - b[0] > config.maxDistanceBetweenDatapointsInMillis;
    }
  }
};
