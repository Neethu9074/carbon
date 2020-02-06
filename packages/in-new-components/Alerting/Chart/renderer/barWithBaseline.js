import invariant from 'invariant';

import { getBaselineValue, baselineGranularity } from 'in-websites/eum-alerting/chart/baselineUtils';
import line from 'in-components/Chart/renderer/line';
import bar from 'in-components/Chart/renderer/bar';

export default {
  render: ({ axis, colors, scale, config, metrics }) => {
    validateProps(config);
    const metric = metrics[0];

    // historical data
    bar.render({ axis, dataSeries: metric, color: colors[0], scale, config });

    renderBaseline(axis, metric, config, scale, colors);
  },
  enrich: (config, axis) => {
    axis.valuesDependOnEachOther = true;
    bar.enrich(config, axis);
  }
};

function drawLineGraph(len, config, upperThresholdInTimeframe, scale) {
  for (let i = 0; i < len; ++i) {
    config.backBufferCtx.lineTo(
      config.scales.xBackBuffer.getRange(upperThresholdInTimeframe[i][0]),
      scale.getRange(upperThresholdInTimeframe[i][1])
    );
  }
}

function renderBaseline(axis, metric, config, scale, colors) {
  const baseline = config.y1.baseline;

  if (!baseline || baseline.length === 0) {
    return;
  }

  const sensitivity = config.y1.sensitivity;
  const timeConfig = config.timeConfig;
  const baselineWindowSize = baseline.length * baselineGranularity;
  const chartFrom = timeConfig.to - (timeConfig.windowSize / baselineGranularity) * baselineGranularity;
  const chartTo = chartFrom + baselineWindowSize;
  const chartHeight = scale.getRangeFrom();
  const thresholdColor = colors[1];
  const alrightColor = colors[2];
  const violationColor = colors[3];
  const isGreaterOp = isGreaterOperator(config.y1.operator);

  const upperThresholdInTimeframe = [];
  for (let timestamp = chartFrom; timestamp <= chartTo; timestamp += baselineGranularity) {
    const thresholdValue = getBaselineValue(timestamp, baseline, sensitivity, isGreaterOp);
    upperThresholdInTimeframe.push([timestamp, thresholdValue]);
  }

  // Backgrounds
  const len = upperThresholdInTimeframe.length;
  const xPosStart = config.scales.xBackBuffer.getRange(upperThresholdInTimeframe[len - 1][0]);
  const yPosStart = scale.getRange(upperThresholdInTimeframe[len - 1][1]);

  // Background below line
  config.backBufferCtx.fillStyle = isGreaterOp ? alrightColor : violationColor;
  config.backBufferCtx.globalAlpha = 0.25;
  config.backBufferCtx.beginPath();
  config.backBufferCtx.moveTo(0, upperThresholdInTimeframe[0][0]);

  drawLineGraph(len, config, upperThresholdInTimeframe, scale);
  config.backBufferCtx.lineTo(xPosStart, chartHeight);
  config.backBufferCtx.lineTo(0, chartHeight);
  config.backBufferCtx.lineTo(0, chartHeight - yPosStart);
  config.backBufferCtx.lineTo(0, yPosStart);
  config.backBufferCtx.fill();

  // Background Above line
  config.backBufferCtx.fillStyle = isGreaterOp ? violationColor : alrightColor;
  config.backBufferCtx.beginPath();
  config.backBufferCtx.moveTo(0, upperThresholdInTimeframe[0][0]);

  drawLineGraph(len, config, upperThresholdInTimeframe, scale);
  config.backBufferCtx.lineTo(xPosStart, 0);
  config.backBufferCtx.lineTo(0, 0);
  config.backBufferCtx.lineTo(0, yPosStart);
  config.backBufferCtx.fill();

  config.backBufferCtx.globalAlpha = 1;

  // upper-baseline
  config.backBufferCtx.save();
  config.backBufferCtx.setLineDash([8, 2]);
  line.render({ axis, dataSeries: upperThresholdInTimeframe, color: thresholdColor, scale, config });
  config.backBufferCtx.restore();
}

function isGreaterOperator(operator) {
  return operator === '>=' || operator === '>';
}

function validateProps(config) {
  if (__DEV__) {
    invariant(
      Number(config.y1.sensitivity) >= 0,
      'Property "sensitivity" is missing in config. Example: y1={{ sensitivity, colors:[], ... }}'
    );
  }
}
