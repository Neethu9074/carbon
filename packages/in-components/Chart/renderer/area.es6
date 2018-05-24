export default {
  render: ({ dataSeries, axis, index, scale, config }) => {
    const blocks = config.calculateBlocks(dataSeries);

    for (let i = 0; i < blocks.length; i++) {
      drawBlock(blocks[i]);
    }

    function drawBlock(block) {
      if (block.length === 0) {
        return;
      }

      const firstDataPoint = block[0];
      const lastDataPoint = block[block.length - 1];
      const firstDataPointXPos = config.scales.x.getRange(firstDataPoint[0]);
      const lastDataPointXPos = config.scales.x.getRange(lastDataPoint[0]);

      config.ctx.beginPath();
      config.ctx.moveTo(firstDataPointXPos, scale.getRange(firstDataPoint[1]));

      for (let i = 1; i < block.length; i++) {
        const dataPoint = block[i];
        const xPos = config.scales.x.getRange(dataPoint[0]);
        const yPos = scale.getRange(dataPoint[1]);
        config.ctx.lineTo(xPos, yPos);
      }

      config.ctx.strokeStyle = axis.colors100[index];
      config.ctx.lineWidth = 2;
      config.ctx.stroke();
      config.ctx.lineTo(lastDataPointXPos, config.height);
      config.ctx.lineTo(firstDataPointXPos, config.height);

      config.ctx.closePath();
      config.ctx.fillStyle = axis.colors[index];
      config.ctx.fill();
    }
  }
};
