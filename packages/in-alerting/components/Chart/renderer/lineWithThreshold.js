/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';

import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import line from 'in-components/Chart/renderer/line';

export default {
  render: ({ colors50, colors100, scale, config, metrics }) => {
    validateProps(config);
    const metric = metrics[0];

    renderStaticThresholdLineAndBackgrounds(config, scale, colors100, colors50);

    // historical data
    line.render({ dataSeries: metric, color: colors100[0], scale, config });
  },
  enrich: (config, axis) => {
    axis.valuesDependOnEachOther = true;
  }
};

export function renderStaticThresholdLineAndBackgrounds(config, scale, colors100, colors50) {
  const { backBufferCtx, markerPaneHeight, scales, xScaleBackBuffer, y1 } = config;
  const { operator, thresholdLineWidth } = y1;

  const yScale = scales.y1;
  const chartHeight = scale.getRangeFrom();
  const chartWidth = xScaleBackBuffer.getRangeTo();
  const threshold = yScale.getRangeFrom() - yScale.getRange(y1.threshold);
  const thresholdColor = colors100[1];
  const alrightColor = colors50[0];
  const violationColor = colors50[1];
  const isGreaterOp = operator === undefined || isGreaterOperator(operator);

  backBufferCtx.save();
  // Background above line
  backBufferCtx.fillStyle = isGreaterOp ? violationColor : alrightColor;
  backBufferCtx.fillRect(0, markerPaneHeight, chartWidth, chartHeight - threshold - markerPaneHeight);

  // Background below line
  backBufferCtx.fillStyle = isGreaterOp ? alrightColor : violationColor;
  backBufferCtx.fillRect(0, chartHeight - threshold, chartWidth, threshold);

  // Movable line
  backBufferCtx.beginPath();
  backBufferCtx.moveTo(0, chartHeight - threshold);
  backBufferCtx.lineWidth = thresholdLineWidth;
  backBufferCtx.strokeStyle = thresholdColor;
  backBufferCtx.lineTo(chartWidth, chartHeight - threshold);
  backBufferCtx.stroke();
  backBufferCtx.restore();
}

function validateProps(config) {
  if (__DEV__) {
    invariant(
      Number(config.y1.threshold) >= 0,
      'Property "threshold" is missing in config. Example: y1={{ threshold, colors:[], ... }}'
    );
  }
}
