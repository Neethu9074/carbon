import point from 'in-components/Chart/renderer/point';

export default {
  render: params => {
    const { dataSeries, color, scale, config } = params;

    config.ctx.beginPath();

    let previousDataPoint = dataSeries[0];
    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      const xPos = config.scales.x.getRange(dataPoint[0]);
      const yPos = scale.getRange(dataPoint[1]);

      if (distanceToPreviousDataPointIsToBig(dataPoint, previousDataPoint)) {
        config.ctx.moveTo(xPos, yPos);
      } else {
        config.ctx.lineTo(xPos, yPos);
      }

      previousDataPoint = dataPoint;
    }

    config.ctx.strokeStyle = color;
    config.ctx.lineWidth = 2;
    config.ctx.stroke();

    // we want to highlight the exact datapoints when drawing lines to show where they exactly are.
    point.render(params);

    function distanceToPreviousDataPointIsToBig(dataPoint, previousDataPoint) {
      return dataPoint[0] - previousDataPoint[0] > config.maxDistanceBetweenDatapointsInMillis;
    }
  }
};
