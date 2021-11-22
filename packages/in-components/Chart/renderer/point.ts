/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const CIRCLE_ARC = 2 * Math.PI;

export default {
  render: ({ dataSeries, color, scale, config, minSpaceBetweenPoints = 0 }) => {
    let lastXPos;

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (!dataPoint) {
        continue;
      }

      const xPos = config.xScaleBackBuffer.getRange(dataPoint[0]);
      const yPos = scale.getRange(dataPoint[1]);

      if (!pointsAreTooCloseTogether(lastXPos, xPos)) {
        config.backBufferCtx.beginPath();
        drawPoint(config, xPos, yPos, color);
        config.backBufferCtx.fill();
      }

      lastXPos = xPos;
    }
    function pointsAreTooCloseTogether(x1, x2) {
      return x1 == null || x2 == null || x2 - x1 < minSpaceBetweenPoints;
    }
  }
};

export function drawPoint(config, xPos, yPos, color) {
  config.backBufferCtx.lineWidth = 1;
  config.backBufferCtx.arc(xPos - 2, yPos, 2, 0, CIRCLE_ARC);
  config.backBufferCtx.fillStyle = color;
}
