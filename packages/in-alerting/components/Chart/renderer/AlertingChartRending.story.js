/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  createLineWithThreshold,
  createLineWithAdaptiveBaseline,
  createLineWithBaselineAndOptionalPotentialProblem
} from 'in-alerting/components/Chart/renderer/Renderer';
import { generateMetrics, fixedTimestamp, generateBaselineForMetric } from 'in-test/util/generateMetrics';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { hexToRGBA } from 'in-services/formatters/color';
import { minutes } from 'in-services/time';
import { useTheme } from 'in-themes';
import oldTheme from 'in-themes';
import { t } from 'in-i18n';

const oneSecond = 1000;
const oneMinute = oneSecond * 60;
const oneHour = oneMinute * 60;
const oneDay = oneHour * 24;

const metricsBarWithBaseline = [generateMetrics(40, 100, oneDay / 6)];

const baselineBarWithBaseline = generateBaselineForMetric(
  metricsBarWithBaseline[0],
  10 * oneMinute,
  8.0,
  10.0,
  3.0
).map((metric, idx) => [metricsBarWithBaseline[0][idx][0], metric[1], metric[2]]);

const baselineBarWithBaselineWithGaps = baselineBarWithBaseline
  .slice(0, 1)
  .concat(baselineBarWithBaseline.slice(10, 11))
  .concat(baselineBarWithBaseline.slice(19));

const granularity = 10 * oneMinute;

const historicThreshold = {
  baseline: baselineBarWithBaseline,
  sensitivity: 2,
  deviationFactor: 2,
  operator: '>=',
  labels: ['Latency', 'Threshold', 'Violations'],
  thresholdGranularity: minutes.toMillis(10)
};

// see PotentialProblemsChart
const highlightColor = oldTheme.lib.colors.chart.strokeColors100[3];
const highlight = {
  area: {
    key: 'some highlight',
    start: baselineBarWithBaseline[4][0],
    end: baselineBarWithBaseline[8][0]
  },
  color: [hexToRGBA(highlightColor, 0.25), highlightColor],
  label: t('in-alerting:potentialProblems.titlePotentialProblem')
};

export function BaselinesWithGaps() {
  const adaptiveBaseline = {
    baseline: baselineBarWithBaselineWithGaps,
    deviationFactor: 2,
    operator: '>=',
    thresholdType: ADAPTIVE_BASELINE
  };

  return (
    <>
      <h1>Historic Baseline without high-light</h1>
      <Chart renderer={createLineWithBaselineAndOptionalPotentialProblem(historicThreshold, granularity)} />
      <h1>Historic Baseline with a high-light</h1>
      <Chart renderer={createLineWithBaselineAndOptionalPotentialProblem(historicThreshold, granularity, highlight)} />
      <h1>Adaptive Baseline</h1>
      <Chart renderer={createLineWithAdaptiveBaseline(adaptiveBaseline, granularity, [])} />
      <h1>Static threshold</h1>
      <Chart renderer={createLineWithThreshold('>', 30)} />
      <h1>Static threshold without value</h1>
      <Chart renderer={createLineWithThreshold('>', null)} />
    </>
  );
}

function Chart({ renderer }) {
  const theme = useTheme();
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
        granularity,
        y1: {
          metricIds: ['latency', 'threshold'],
          excludedLabelsFromTooltip: ['Violations'],
          icons: {
            types: ['lib_line_chart', 'lib_threshold', 'lib_actions_stop', 'lib_actions_stop'],
            colors: ['#17A1E6', '#FF4040', '#ffe2e2']
          },
          getMax: metricsMaxValue => metricsMaxValue * 1.4,
          colors: [
            theme.ids.color.option.blue['400'],
            theme.ids.color.option.red['500'],
            theme.ids.color.option.orange['500']
          ],
          renderer,
          metrics: metricsBarWithBaseline,
          labels: ['Latency', 'Threshold', 'Violations']
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
