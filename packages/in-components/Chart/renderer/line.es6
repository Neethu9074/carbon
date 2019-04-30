export default {
  render: ({ dataSeries, color, scale, config }) => {
    config.backBufferCtx.beginPath();

    let previousDataPoint = dataSeries[0];
    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      const xPos = config.scales.xBackBuffer.getRange(dataPoint[0]);
      const yPos = scale.getRange(dataPoint[1]);

      if (distanceToPreviousDataPointIsToBig(dataPoint, previousDataPoint)) {
        config.backBufferCtx.moveTo(xPos, yPos);
      } else {
        config.backBufferCtx.lineTo(xPos, yPos);
      }

      previousDataPoint = dataPoint;
    }

    config.backBufferCtx.strokeStyle = color;
    config.backBufferCtx.lineWidth = 2;
    config.backBufferCtx.stroke();

    function distanceToPreviousDataPointIsToBig(dataPoint, previousDataPoint) {
      return dataPoint[0] - previousDataPoint[0] > config.maxDistanceBetweenDatapointsInMillis;
    }
  }
};
