/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { renderStaticThresholdLineAndBackgrounds } from 'in-alerting/components/Chart/renderer/lineWithThreshold';
import { getBaselineValue } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import line from 'in-components/Chart/renderer/line';
import { hexToRGBA } from 'in-themes/utils';
import theme from 'in-themes';

export default {
  render: ({ axis, colors50, colors100, scale, config, metrics }) => {
    const metric = metrics[0];

    renderBaselineOrStaticThreshold(metric, axis, config, scale, colors50, colors100);

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

function renderHighlight(y, height, config) {
  const {
    highlight: {
      area: { start, end },
      color
    }
  } = config.y1;

  if (start && end) {
    config.backBufferCtx.save();
    const startX = config.xScaleBackBuffer.getRange(start);
    const endX = config.xScaleBackBuffer.getRange(end);
    config.backBufferCtx.fillStyle = color[0];
    config.backBufferCtx.strokeStyle = color[1];
    config.backBufferCtx.lineWidth = 0.5;
    config.backBufferCtx.fillRect(startX, y, endX - startX, height);
    [startX, endX].forEach(x => {
      config.backBufferCtx.beginPath();
      config.backBufferCtx.moveTo(x, y);
      config.backBufferCtx.lineTo(x, y + height);
      config.backBufferCtx.stroke();
    });
    config.backBufferCtx.restore();
  }
}

// grey out portion of background for which no metric data is available
function renderMetricUnavailableIndicator(y, height, xPosEnd, lastAvailableMetricTimestamp, config) {
  config.backBufferCtx.save();
  config.backBufferCtx.fillStyle = hexToRGBA(theme.lib.colors.N600Light, 0.15);
  const xStart = config.xScaleBackBuffer.getRange(lastAvailableMetricTimestamp);
  config.backBufferCtx.fillRect(xStart, y, xPosEnd - xStart, height);
  config.backBufferCtx.restore();
}

function renderBackground(xStart, xEnd, yStart, timebasePoints, fillStyle, scale, config) {
  config.backBufferCtx.save();
  config.backBufferCtx.fillStyle = fillStyle;
  config.backBufferCtx.beginPath();
  config.backBufferCtx.moveTo(xStart, scale.getRange(timebasePoints[0][1]));

  drawLineGraph(timebasePoints.length, config, timebasePoints, scale);
  config.backBufferCtx.lineTo(xEnd, yStart);
  config.backBufferCtx.lineTo(xStart, yStart);
  config.backBufferCtx.closePath();
  config.backBufferCtx.fill();
  config.backBufferCtx.restore();
}

function renderBaselineOrStaticThreshold(metric, axis, config, scale, colors50, colors100) {
  const baseline = config.y1.baseline;
  if (!baseline || baseline.length === 0) {
    renderStaticThresholdLineAndBackgrounds(config, scale, colors100, colors50);
  }
  const thresholdLineWidth = config.y1.thresholdLineWidth;
  const thresholdGranularity = config.y1.thresholdGranularity;
  const timeConfig = config.timeConfig;
  const baselineWindowSize = (timeConfig.windowSize / thresholdGranularity) * thresholdGranularity;
  const chartFrom = timeConfig.to - baselineWindowSize;

  const chartHeight = scale.getRangeFrom();
  const thresholdColor = colors100[1];
  const lastAvailableMetricTimestamp = metric[metric.length - 1][0];
  const oneSidedThresholdInTimeframe = [];

  const markerPaneHeight = config.markerPaneHeight;
  const graphAreaHeight = chartHeight - markerPaneHeight;

  if (baseline && baseline.length > 0) {
    renderBaseline(
      chartFrom,
      baselineWindowSize,
      thresholdGranularity,
      baseline,
      oneSidedThresholdInTimeframe,
      config,
      chartHeight,
      colors50,
      scale,
      markerPaneHeight
    );
  }

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

  const len = oneSidedThresholdInTimeframe.length;
  if (len > 0) {
    const xPosEnd = config.xScaleBackBuffer.getRange(oneSidedThresholdInTimeframe[len - 1][0]);

    renderMetricUnavailableIndicator(markerPaneHeight, graphAreaHeight, xPosEnd, lastAvailableMetricTimestamp, config);
  }

  renderHighlight(markerPaneHeight, graphAreaHeight, config);
}

function renderBaseline(
  chartFrom,
  baselineWindowSize,
  thresholdGranularity,
  baseline,
  oneSidedThresholdInTimeframe,
  config,
  chartHeight,
  colors50,
  scale,
  markerPaneHeight
) {
  const chartTo = chartFrom + baselineWindowSize;
  const alrightColor = colors50[0];
  const violationColor = colors50[1];

  const sensitivity = config.y1.sensitivity;
  const isGreaterOp = config.y1.operator === undefined || isGreaterOperator(config.y1.operator);

  for (let timestamp = chartFrom; timestamp <= chartTo; timestamp += thresholdGranularity) {
    const thresholdValue = getBaselineValue(timestamp, baseline, sensitivity, thresholdGranularity, isGreaterOp);
    oneSidedThresholdInTimeframe.push([timestamp, thresholdValue]);
  }

  // Backgrounds
  const len = oneSidedThresholdInTimeframe.length;
  const xPosStart = config.xScaleBackBuffer.getRange(oneSidedThresholdInTimeframe[0][0]);
  const xPosEnd = config.xScaleBackBuffer.getRange(oneSidedThresholdInTimeframe[len - 1][0]);

  renderBackground(
    xPosStart,
    xPosEnd,
    chartHeight,
    oneSidedThresholdInTimeframe,
    isGreaterOp ? alrightColor : violationColor,
    scale,
    config
  );

  renderBackground(
    xPosStart,
    xPosEnd,
    markerPaneHeight,
    oneSidedThresholdInTimeframe,
    isGreaterOp ? violationColor : alrightColor,
    scale,
    config
  );
}
