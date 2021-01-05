import invariant from 'invariant';

import { getBaselineValue } from 'in-new-components/Alerting/utils/baselineUtils';
import { isGreaterOperator } from 'in-new-components/Alerting/utils/alertUtils';
import line from 'in-components/Chart/renderer/line';

export default {
  render: ({ axis, colors50, colors100, scale, config, metrics }) => {
    validateProps(config);
    const metric = metrics[0];

    renderBaseline(axis, config, scale, colors50, colors100);

    // historical data
    line.render({ dataSeries: metric, color: colors100[0], scale, config });
  },
  enrich: (config, axis) => {
    axis.valuesDependOnEachOther = true;
  }
};

function drawLineGraph(len, config, oneSidedThresholdInTimeframe, scale) {
  for (let i = 0; i < len; ++i) {
    config.backBufferCtx.lineTo(
      config.xScaleBackBuffer.getRange(oneSidedThresholdInTimeframe[i][0]),
      scale.getRange(oneSidedThresholdInTimeframe[i][1])
    );
  }
}

function renderBaseline(axis, config, scale, colors50, colors100) {
  const baseline = config.y1.baseline;
  if (!baseline || baseline.length === 0) {
    return;
  }
  const sensitivity = config.y1.sensitivity;
  const thresholdLineWidth = config.y1.thresholdLineWidth;
  const thresholdGranularity = config.y1.thresholdGranularity;
  const timeConfig = config.timeConfig;
  const baselineWindowSize = (timeConfig.windowSize / thresholdGranularity) * thresholdGranularity;
  const chartFrom = timeConfig.to - baselineWindowSize;
  const chartTo = chartFrom + baselineWindowSize;

  const chartHeight = scale.getRangeFrom();
  const thresholdColor = colors100[1];
  const alrightColor = colors50[0];
  const violationColor = colors50[1];
  const isGreaterOp = config.y1.operator === undefined || isGreaterOperator(config.y1.operator);
  const oneSidedThresholdInTimeframe = [];

  for (let timestamp = chartFrom; timestamp <= chartTo; timestamp += thresholdGranularity) {
    const thresholdValue = getBaselineValue(timestamp, baseline, sensitivity, thresholdGranularity, isGreaterOp);
    oneSidedThresholdInTimeframe.push([timestamp, thresholdValue]);
  }

  // Backgrounds
  const len = oneSidedThresholdInTimeframe.length;
  const xPosStart = config.xScaleBackBuffer.getRange(oneSidedThresholdInTimeframe[0][0]);
  const xPosEnd = config.xScaleBackBuffer.getRange(oneSidedThresholdInTimeframe[len - 1][0]);
  const markerPaneHeight = config.markerPaneHeight;
  const yPosStart = scale.getRange(oneSidedThresholdInTimeframe[0][1]);

  config.backBufferCtx.save();

  // Background below line
  config.backBufferCtx.fillStyle = isGreaterOp ? alrightColor : violationColor;
  config.backBufferCtx.beginPath();
  config.backBufferCtx.moveTo(xPosStart, yPosStart);

  drawLineGraph(len, config, oneSidedThresholdInTimeframe, scale);
  config.backBufferCtx.lineTo(xPosEnd, chartHeight);
  config.backBufferCtx.lineTo(xPosStart, chartHeight);
  config.backBufferCtx.closePath();
  config.backBufferCtx.fill();

  // Background Above line
  config.backBufferCtx.fillStyle = isGreaterOp ? violationColor : alrightColor;
  config.backBufferCtx.beginPath();
  config.backBufferCtx.moveTo(xPosStart, yPosStart);
  drawLineGraph(len, config, oneSidedThresholdInTimeframe, scale);
  config.backBufferCtx.lineTo(xPosEnd, markerPaneHeight);
  config.backBufferCtx.lineTo(xPosStart, markerPaneHeight);
  config.backBufferCtx.closePath();
  config.backBufferCtx.fill();
  config.backBufferCtx.restore();

  // one-sided time-dependent threshold line
  config.backBufferCtx.save();
  config.backBufferCtx.lineWidth = thresholdLineWidth;
  line.render({
    dataSeries: oneSidedThresholdInTimeframe,
    color: thresholdColor,
    scale,
    config: {
      ...config,
      y1: {
        ...config.y1,
        lineWidth: thresholdLineWidth
      }
    }
  });
  config.backBufferCtx.restore();
}

function validateProps(config) {
  if (__DEV__) {
    invariant(
      Number(config.y1.sensitivity) >= 0,
      'Property "sensitivity" is missing in config. Example: y1={{ sensitivity, colors:[], ... }}'
    );
  }
}
