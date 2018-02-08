const CIRCLE_ARC = 2 * Math.PI;

export default {
  render: ({ dataSeries, color, scale, config }) => {
    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      const xPos = config.scales.x.getRange(dataPoint[0]);
      const yPos = scale.getRange(dataPoint[1]);

      config.ctx.beginPath();
      config.ctx.lineWidth = 1;
      config.ctx.arc(xPos, yPos, 2, 0, CIRCLE_ARC);
      config.ctx.fillStyle = color;
      config.ctx.fill();
    }
  }
};
