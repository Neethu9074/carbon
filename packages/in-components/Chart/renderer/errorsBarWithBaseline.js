import invariant from 'invariant';

import bar from 'in-components/Chart/renderer/bar';

export default {
  render: ({ axis, dataSeries, colors, scale, config }) => {
    validateProps(config, colors);

    const xScale = config.scales.xBackBuffer;
    const yScale = config.scales.y1;
    const chartHeight = scale.getRangeFrom();
    const chartWidth = xScale.getDomainTo();
    const threshold = yScale.getRangeFrom() - yScale.getRange(config.y1.threshold);

    // historical data
    bar.render({ axis, dataSeries, color: colors[0], scale, config });

    // Background above line
    config.backBufferCtx.fillStyle = colors[1];
    config.backBufferCtx.globalAlpha = 0.25;
    config.backBufferCtx.fillRect(0, 0, chartWidth, chartHeight - threshold);

    // Background below line
    config.backBufferCtx.fillStyle = colors[3];
    config.backBufferCtx.globalAlpha = 0.25;
    config.backBufferCtx.fillRect(0, chartHeight - threshold, chartWidth, threshold);

    // Movable line
    config.backBufferCtx.beginPath();
    config.backBufferCtx.globalAlpha = 1;
    config.backBufferCtx.moveTo(0, chartHeight - threshold);
    config.backBufferCtx.setLineDash([8, 2]);
    config.backBufferCtx.lineWidth = 1.5;
    config.backBufferCtx.strokeStyle = colors[2];
    config.backBufferCtx.lineTo(chartWidth, chartHeight - threshold);
    config.backBufferCtx.stroke();

    config.backBufferCtx.globalAlpha = 1;
  }
};

function validateProps(config, colors) {
  if (__DEV__) {
    invariant(
      Number(config.y1.threshold) >= 0,
      'Property "threshold" is missing in config. Example: y1={{ threshold, colors:[], ... }}'
    );
    invariant(colors.length === 4, `The chart need 4 colors. You provided only #${colors.length} colors.`);
  }
}
