/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { generateMetrics, fixedTimestamp, generateBaselineForMetric } from '../util/generateMetrics';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertingRenderer from 'in-alerting/components/Chart/renderer/Renderer';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { minutes } from 'in-services/time';
import theme from 'in-themes';

const oneSecond = 1000;
const oneMinute = oneSecond * 60;
const oneHour = oneMinute * 60;
const oneDay = oneHour * 24;

export default {
  title: 'Organisms|AlertingChartRenderer',
  component: AlertingRenderer
};

const metricsBarWithBaseline = [generateMetrics(40, 100, oneDay / 6)];

const baselineBarWithBaseline = generateBaselineForMetric(
  metricsBarWithBaseline[0],
  10 * oneMinute,
  8.0,
  10.0,
  3.0
).map((metric, idx) => [metricsBarWithBaseline[0][idx][0], metric[1], metric[2]]);

export function BarWithBaselineWithGaps() {
  const baselineBarWithBaselineWithGaps = baselineBarWithBaseline
    .slice(1, 2)
    .concat(baselineBarWithBaseline.slice(12, 13))
    .concat(baselineBarWithBaseline.slice(23, 24));

  return (
    <ResultAwareChart
      result={{
        errors: [],
        progress: {
          loading: false
        }
      }}
      config={{
        timeConfig: generateTimeframe(oneDay / 6), // 4 hours
        granularity: 10 * oneMinute,
        y1: {
          metricIds: ['latency', 'threshold'],
          excludedLabelsFromTooltip: ['Violations'],
          icons: {
            types: ['lib_line_chart', 'lib_threshold', 'lib_actions_stop', 'lib_actions_stop'],
            colors: ['#17A1E6', '#FF4040', '#ffe2e2']
          },
          lineWidth: 1.75,
          thresholdLineWidth: 1,
          threshold: 0,
          sensitivity: 1,
          getMax: metricsMaxValue => {
            return metricsMaxValue * 1.4; // TODO include sensitivity and baseline as well, not just the max-metric-value
          },
          colors: [theme.lib.colors.lightBlue800, theme.lib.colors.red800, theme.lib.colors.orange800],
          renderer: AlertingRenderer.lineWithAdaptiveBaseline,
          metrics: metricsBarWithBaseline,
          baseline: baselineBarWithBaselineWithGaps,
          operator: '>=',
          thresholdType: ADAPTIVE_BASELINE,
          labels: ['Latency', 'Threshold', 'Violations'],
          thresholdGranularity: minutes.toMillis(10)
        }
      }}
    />
  );
}

function generateTimeframe(windowSize) {
  return {
    windowSize,
    to: fixedTimestamp
  };
}
