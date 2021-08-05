/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getAdaptiveBaselineValue } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { allowedMultiplesOfRollupSizeMissingInCharts } from 'in-services/featureFlags';
import line from 'in-components/Chart/renderer/line';

export default {
  render: ({ axis, colors50, colors100, scale, config, metrics }) => {
    const metric = metrics[0];

    renderAdaptiveBaseline(axis, config, scale, colors50, colors100);

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

export function getThresholdInTimeframe(baselineEntriesFromMetadata, baseline, sensitivity, isGreaterOp) {
  const thresholdInTimeframe = [];
  const eventBasedAdaptiveBaseline = baselineEntriesFromMetadata ?? [];

  // NOTE: We are rendering adaptive baseline for 2 use-cases.
  // 1) In SA Dialogue via fetching the threshold suggestion
  // 2) In event details view using event metadata
  if (eventBasedAdaptiveBaseline.length === 0) {
    for (let [timestamp, baselineValue, deviationValue] of baseline) {
      const thresholdValue = getAdaptiveBaselineValue(baselineValue, deviationValue, sensitivity, isGreaterOp);
      thresholdInTimeframe.push([timestamp, thresholdValue]);
    }
  } else {
    for (const [timestamp, thresholdValue] of eventBasedAdaptiveBaseline) {
      thresholdInTimeframe.push([Number(timestamp), thresholdValue]);
    }
  }

  return thresholdInTimeframe;
}

function renderAdaptiveBaseline(axis, config, scale, colors50, colors100) {
  const { y1, xScaleBackBuffer, markerPaneHeight, backBufferCtx } = config;
  const { baseline, sensitivity, thresholdLineWidth, operator, eventBasedAdaptiveBaseline, thresholdGranularity } = y1;

  if ((baseline ?? []).length === 0 && (eventBasedAdaptiveBaseline ?? []).length === 0) {
    return;
  }

  const chartHeight = scale.getRangeFrom();
  const thresholdColor = colors100[1];
  const alrightColor = colors50[0];
  const violationColor = colors50[1];
  const isGreaterOp = operator === undefined || isGreaterOperator(operator);
  const thresholdInTimeframe = getThresholdInTimeframe(eventBasedAdaptiveBaseline, baseline, sensitivity, isGreaterOp);
  const oneSidedThresholdInTimeframe = updateThresholdPointsIfRequired(thresholdInTimeframe, thresholdGranularity);

  // Backgrounds
  const len = oneSidedThresholdInTimeframe.length;
  const xPosStart = xScaleBackBuffer.getRange(oneSidedThresholdInTimeframe[0][0]);
  const xPosEnd = xScaleBackBuffer.getRange(oneSidedThresholdInTimeframe[len - 1][0]);
  const yPosStart = scale.getRange(oneSidedThresholdInTimeframe[0][1]);

  backBufferCtx.save();

  // Background below line
  backBufferCtx.fillStyle = isGreaterOp ? alrightColor : violationColor;
  backBufferCtx.beginPath();
  backBufferCtx.moveTo(xPosStart, yPosStart);

  drawLineGraph(len, config, oneSidedThresholdInTimeframe, scale);
  backBufferCtx.lineTo(xPosEnd, chartHeight);
  backBufferCtx.lineTo(xPosStart, chartHeight);
  backBufferCtx.closePath();
  backBufferCtx.fill();

  // Background Above line
  backBufferCtx.fillStyle = isGreaterOp ? violationColor : alrightColor;
  backBufferCtx.beginPath();
  backBufferCtx.moveTo(xPosStart, yPosStart);
  drawLineGraph(len, config, oneSidedThresholdInTimeframe, scale);
  backBufferCtx.lineTo(xPosEnd, markerPaneHeight);
  backBufferCtx.lineTo(xPosStart, markerPaneHeight);
  backBufferCtx.closePath();
  backBufferCtx.fill();
  backBufferCtx.restore();

  // one-sided time-dependent threshold line
  backBufferCtx.save();
  backBufferCtx.lineWidth = thresholdLineWidth;
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

  backBufferCtx.restore();
}

function distanceBetweenThresholdPointsIsTooBig(next, current, thresholdGranularity) {
  return (
    !next ||
    !current ||
    Number(next[0]) - Number(current[0]) > thresholdGranularity * allowedMultiplesOfRollupSizeMissingInCharts
  );
}

/**
 * We are not passing maxDistanceBetweenDataPointsInMillis explicitly,
 * in our case granularity * allowedMultiplesOfRollupSizeMissingInCharts would be maxDistanceBetweenDataPointsInMillis
 */
export function updateThresholdPointsIfRequired(baseline, thresholdGranularity) {
  const result = [];
  const halfBucketInMillis = thresholdGranularity * 0.5;

  let previousThresholdPoint;

  for (let i = 0; i < baseline.length; i++) {
    const currentThresholdPoint = baseline[i];
    const nextThresholdPoint = baseline[i + 1];

    // As adaptive baseline might not be continuous, instead of rendering a dot we would render a tiny line
    // in the event details view so threshold is clearly visible to the user.
    if (
      distanceBetweenThresholdPointsIsTooBig(currentThresholdPoint, previousThresholdPoint, thresholdGranularity) &&
      distanceBetweenThresholdPointsIsTooBig(nextThresholdPoint, currentThresholdPoint, thresholdGranularity)
    ) {
      result.push(
        [Number(currentThresholdPoint[0]) - halfBucketInMillis, currentThresholdPoint[1]],
        [Number(currentThresholdPoint[0]) + halfBucketInMillis, currentThresholdPoint[1]]
      );
    } else {
      result.push(currentThresholdPoint);
    }

    previousThresholdPoint = currentThresholdPoint;
  }

  return result;
}
