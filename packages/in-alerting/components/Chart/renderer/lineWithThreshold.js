/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import invariant from 'invariant';

import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { smoothMetrics } from 'in-alerting/smart-alerts/components/utils/chartUtil';
import line from 'in-components/Chart/renderer/line';

export default {
  render: ({ colors100, colors50, scale, config, metrics }) => {
    validateProps(config);
    const backBufferCtx = config.backBufferCtx;
    const xScale = config.xScaleBackBuffer;
    const yScale = config.scales.y1;
    const chartHeight = scale.getRangeFrom();
    const chartWidth = xScale.getRangeTo();
    const thresholdLineWidth = config.y1.thresholdLineWidth;
    const threshold = yScale.getRangeFrom() - yScale.getRange(config.y1.threshold);
    const thresholdColor = colors100[1];
    const alrightColor = colors50[0];
    const violationColor = colors50[1];
    const isGreaterOp = config.y1.operator === undefined || isGreaterOperator(config.y1.operator);
    const markerPaneHeight = config.markerPaneHeight;

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

    // historical data
    line.render({
      dataSeries: config.withMetricSmoothing ? smoothMetrics(metrics[0]) : metrics[0],
      color: colors100[0],
      scale,
      config
    });
  },
  enrich: (config, axis) => {
    axis.valuesDependOnEachOther = true;
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
