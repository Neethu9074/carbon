/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { drawCircleWithLine } from 'in-components/Chart/renderer/utils';

export default {
  render: ({ dataSeries, colors, colors100, index, scale, config, axis, metricId }) => {
    const blocks = config.calculateBlocks(dataSeries, axis?.distanceBetweenDatapointsInMillis?.[metricId]);

    for (let i = 0; i < blocks.length; i++) {
      drawBlock(blocks[i]);
    }

    function drawBlock(block) {
      const firstDataPoint = block[0];
      const lastDataPoint = block[block.length - 1];
      const firstDataPointXPos = config.xScaleBackBuffer.getRange(firstDataPoint[0]);
      const lastDataPointXPos = config.xScaleBackBuffer.getRange(lastDataPoint[0]);

      const strokeStyle = colors100[index];
      const fillStyle = colors[index];

      if (block.length === 1) {
        // a block with a lone data point
        const { xPos, yPos } = getPosition(config, firstDataPoint, scale);
        drawCircleWithLine({
          renderingContext: config.backBufferCtx,
          config,
          xPos,
          yPos,
          circleStyle: strokeStyle,
          lineStyle: fillStyle
        });
      } else {
        config.backBufferCtx.beginPath();
        config.backBufferCtx.moveTo(firstDataPointXPos, scale.getRange(firstDataPoint[1]));
        for (let i = 1; i < block.length; i++) {
          const dataPoint = block[i];
          if (!dataPoint) {
            continue;
          }

          const { xPos, yPos } = getPosition(config, dataPoint, scale);
          config.backBufferCtx.lineTo(xPos, yPos);
        }

        config.backBufferCtx.strokeStyle = strokeStyle;
        config.backBufferCtx.lineWidth = 2;
        config.backBufferCtx.stroke();
        config.backBufferCtx.lineTo(lastDataPointXPos, config.height - config.timeAxisHeight);
        config.backBufferCtx.lineTo(firstDataPointXPos, config.height - config.timeAxisHeight);

        config.backBufferCtx.closePath();
        config.backBufferCtx.fillStyle = fillStyle;
        config.backBufferCtx.fill();
      }
    }
  }
};

function getPosition(config, dataPoint, scale) {
  const xPos = config.xScaleBackBuffer.getRange(dataPoint[0]);
  const yPos = scale.getRange(dataPoint[1]);
  return { xPos, yPos };
}
