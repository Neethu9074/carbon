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
      const firstDataPointXPos = config.scales.xBackBuffer.getRange(firstDataPoint[0]);
      const lastDataPointXPos = config.scales.xBackBuffer.getRange(lastDataPoint[0]);

      config.backBufferCtx.beginPath();
      config.backBufferCtx.moveTo(firstDataPointXPos, scale.getRange(firstDataPoint[1]));

      for (let i = 1; i < block.length; i++) {
        const dataPoint = block[i];
        const xPos = config.scales.xBackBuffer.getRange(dataPoint[0]);
        const yPos = scale.getRange(dataPoint[1]);
        config.backBufferCtx.lineTo(xPos, yPos);
      }

      config.backBufferCtx.strokeStyle = axis.colors100[index];
      config.backBufferCtx.lineWidth = 2;
      config.backBufferCtx.stroke();
      config.backBufferCtx.lineTo(lastDataPointXPos, config.height - config.timeAxisHeight);
      config.backBufferCtx.lineTo(firstDataPointXPos, config.height - config.timeAxisHeight);

      config.backBufferCtx.closePath();
      config.backBufferCtx.fillStyle = axis.colors[index];
      config.backBufferCtx.fill();
    }
  }
};
