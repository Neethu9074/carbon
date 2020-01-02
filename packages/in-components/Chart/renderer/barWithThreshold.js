import invariant from 'invariant';

import bar from 'in-components/Chart/renderer/bar';

export default {
  render: ({ axis, colors, scale, config, metrics }) => {
    validateProps(config, colors);
    const xScale = config.scales.xBackBuffer;
    const yScale = config.scales.y1;
    const chartHeight = scale.getRangeFrom();
    const chartWidth = xScale.getRangeTo();
    const threshold = yScale.getRangeFrom() - yScale.getRange(config.y1.threshold);
    const thresholdColor = colors[1];
    const alrightColor = colors[2];
    const violationColor = colors[3];
    const isGreaterOp = isGreaterOperator(config.y1.operator);

    // historical data
    bar.render({ axis, dataSeries: metrics[0], color: colors[0], scale, config });

    // Background above line
    config.backBufferCtx.fillStyle = isGreaterOp ? violationColor : alrightColor;
    config.backBufferCtx.globalAlpha = 0.25;
    config.backBufferCtx.fillRect(0, 0, chartWidth, chartHeight - threshold);

    // Background below line
    config.backBufferCtx.fillStyle = isGreaterOp ? alrightColor : violationColor;
    config.backBufferCtx.globalAlpha = 0.25;
    config.backBufferCtx.fillRect(0, chartHeight - threshold, chartWidth, threshold);

    // Movable line
    config.backBufferCtx.beginPath();
    config.backBufferCtx.globalAlpha = 1;
    config.backBufferCtx.moveTo(0, chartHeight - threshold);
    config.backBufferCtx.setLineDash([8, 2]);
    config.backBufferCtx.lineWidth = 1.5;
    config.backBufferCtx.strokeStyle = thresholdColor;
    config.backBufferCtx.lineTo(chartWidth, chartHeight - threshold);
    config.backBufferCtx.stroke();

    config.backBufferCtx.globalAlpha = 1;
  },
  enrich: (config, axis) => {
    axis.valuesDependOnEachOther = true;
  }
};

function isGreaterOperator(operator) {
  return operator === '>=' || operator === '>';
}

function validateProps(config, colors) {
  if (__DEV__) {
    invariant(
      Number(config.y1.threshold) >= 0,
      'Property "threshold" is missing in config. Example: y1={{ threshold, colors:[], ... }}'
    );
    invariant(colors.length === 4, `The chart need 4 colors. You provided only #${colors.length} colors.`);
  }
}
