const CIRCLE_ARC = 2 * Math.PI;

export default {
  render: ({ dataSeries, color, scale, config, minSpaceBetweenPoints = 0 }) => {
    let lastXPos = config.scales.x.getRange(dataSeries[0][0]);

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      const xPos = config.scales.x.getRange(dataPoint[0]);
      const yPos = scale.getRange(dataPoint[1]);

      if (!pointsAreTooCloseTogether(lastXPos, xPos)) {
        config.ctx.beginPath();
        config.ctx.lineWidth = 1;
        config.ctx.arc(xPos, yPos, 2, 0, CIRCLE_ARC);
        config.ctx.fillStyle = color;
        config.ctx.fill();
      }

      lastXPos = xPos;
    }
    function pointsAreTooCloseTogether(x1, x2) {
      return x2 - x1 < minSpaceBetweenPoints;
    }
  }
};
