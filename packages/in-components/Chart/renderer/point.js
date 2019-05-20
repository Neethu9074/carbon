const CIRCLE_ARC = 2 * Math.PI;

export default {
  render: ({ dataSeries, color, scale, config, minSpaceBetweenPoints = 0 }) => {
    let lastXPos = config.scales.xBackBuffer.getRange(dataSeries[0][0]);

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      const xPos = config.scales.xBackBuffer.getRange(dataPoint[0]);
      const yPos = scale.getRange(dataPoint[1]);

      if (!pointsAreTooCloseTogether(lastXPos, xPos)) {
        config.backBufferCtx.beginPath();
        config.backBufferCtx.lineWidth = 1;
        config.backBufferCtx.arc(xPos, yPos, 2, 0, CIRCLE_ARC);
        config.backBufferCtx.fillStyle = color;
        config.backBufferCtx.fill();
      }

      lastXPos = xPos;
    }
    function pointsAreTooCloseTogether(x1, x2) {
      return x2 - x1 < minSpaceBetweenPoints;
    }
  }
};
