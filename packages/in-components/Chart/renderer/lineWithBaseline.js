import invariant from 'invariant';

import line from 'in-components/Chart/renderer/line';

export default {
  render: ({ axis, colors, scale, config, metrics }) => {
    validateProps(config, colors);
    const baseline = config.y1.baseline;
    const metric = metrics[0];
    const metricFrom = metric[0][0];
    const baselineWindowSize = baseline[baseline.length - 1][0];
    const granularity = baselineWindowSize / (baseline.length - 1);
    const sensitivity = config.y1.sensitivity;

    const chartHeight = scale.getRangeFrom();

    // derive upper baseline-threshold
    const startIdx = Math.floor(metricFrom / granularity) % baseline.length;
    const upperThresholdInTimeframe = [];
    let idx = startIdx;
    for (let i = 0; i < baseline.length; ++i) {
      const baselineValue = baseline[idx][1];
      const deviationValue = sensitivity * baseline[idx][2];
      upperThresholdInTimeframe[i] = [metricFrom + i * granularity, baselineValue + deviationValue];
      idx = (idx + 1) % baseline.length;
    }

    // Backgrounds
    const len = upperThresholdInTimeframe.length;
    const xPosStart = config.scales.xBackBuffer.getRange(upperThresholdInTimeframe[len - 1][0]);
    const yPosStart = scale.getRange(upperThresholdInTimeframe[len - 1][1]);

    // config.backBufferCtx.lineJoin = 'round';

    // Background below line
    config.backBufferCtx.fillStyle = colors[3];
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
    config.backBufferCtx.fillStyle = colors[1];
    config.backBufferCtx.beginPath();
    config.backBufferCtx.moveTo(0, upperThresholdInTimeframe[0][0]);

    drawLineGraph(len, config, upperThresholdInTimeframe, scale);
    config.backBufferCtx.lineTo(xPosStart, 0);
    config.backBufferCtx.lineTo(0, 0);
    config.backBufferCtx.lineTo(0, yPosStart);
    config.backBufferCtx.fill();

    config.backBufferCtx.globalAlpha = 1;

    // historical data
    line.render({ axis, dataSeries: metric, color: colors[0], scale, config });

    // upper-baseline
    config.backBufferCtx.save();
    config.backBufferCtx.setLineDash([8, 2]);
    line.render({ axis, dataSeries: upperThresholdInTimeframe, color: colors[2], scale, config });
    config.backBufferCtx.restore();
  },
  enrich: (config, axis) => {
    axis.valuesDependOnEachOther = true;
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

function validateProps(config, colors) {
  if (__DEV__) {
    invariant(
      Number(config.y1.sensitivity) >= 0,
      'Property "sensitivity" is missing in config. Example: y1={{ sensitivity, colors:[], ... }}'
    );
    invariant(colors.length === 4, `The chart need 4 colors. You provided only #${colors.length} colors.`);
  }
}
