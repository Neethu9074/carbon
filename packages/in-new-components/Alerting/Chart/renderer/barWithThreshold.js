import invariant from 'invariant';

import { isGreaterOperator } from 'in-websites/alerting/alertConfigUtil';
import bar from 'in-components/Chart/renderer/bar';

export default {
  render: ({ axis, colors, scale, config, metrics }) => {
    validateProps(config);
    const backBufferCtx = config.backBufferCtx;
    const xScale = config.scales.xBackBuffer;
    const yScale = config.scales.y1;
    const chartHeight = scale.getRangeFrom();
    const chartWidth = xScale.getRangeTo();
    const threshold = yScale.getRangeFrom() - yScale.getRange(config.y1.threshold);
    const thresholdColor = colors[1];
    const alrightColor = colors[2];
    const violationColor = colors[3];
    const isGreaterOp = config.y1.operator === undefined || isGreaterOperator(config.y1.operator);
    const markerPaneHeight = config.markerPaneHeight;

    // historical data
    bar.render({ axis, dataSeries: metrics[0], color: colors[0], scale, config });

    backBufferCtx.save();
    // Background above line
    backBufferCtx.fillStyle = isGreaterOp ? violationColor : alrightColor;
    backBufferCtx.globalAlpha = 0.25;
    backBufferCtx.fillRect(0, markerPaneHeight, chartWidth, chartHeight - threshold - markerPaneHeight);

    // Background below line
    backBufferCtx.fillStyle = isGreaterOp ? alrightColor : violationColor;
    backBufferCtx.globalAlpha = 0.25;
    backBufferCtx.fillRect(0, chartHeight - threshold, chartWidth, threshold);

    // Movable line
    backBufferCtx.beginPath();
    backBufferCtx.globalAlpha = 1;
    backBufferCtx.moveTo(0, chartHeight - threshold);
    backBufferCtx.setLineDash([8, 2]);
    backBufferCtx.lineWidth = 1.5;
    backBufferCtx.strokeStyle = thresholdColor;
    backBufferCtx.lineTo(chartWidth, chartHeight - threshold);
    backBufferCtx.stroke();
    backBufferCtx.restore();
  },
  enrich: (config, axis) => {
    axis.valuesDependOnEachOther = true;
    bar.enrich(config, axis);
  }
};

function validateProps(config) {
  if (__DEV__) {
    invariant(
      Number(config.y1.threshold) >= 0,
      'Property "threshold" is missing in config. Example: y1={{ threshold, colors:[], ... }}'
    );
  }
}
