/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { themes } from '@instana/design-tokens';

import {
  createLineWithThreshold,
  createLineWithAdaptiveBaseline,
  createLineWithBaselineAndOptionalPotentialProblem,
  createLineWithMultiHistoricBaselineAndOptionalPotentialProblem
} from 'in-alerting/components/Chart/renderer/Renderer';
import {
  generateMetrics,
  fixedTimestamp,
  generateBaselineForMetric,
  getHardCodedRandomValue
} from 'in-test/util/generateMetrics';
import { chartColors, carbonAlert, carbonCategorical } from 'in-themes/chartColors';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getColorWithTransparency } from 'in-components/Chart/strokeColors';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { hexToRGBA } from 'in-services/formatters/color';
import { lighten } from 'in-services/formatters/color';
import { minutes } from 'in-services/time';
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

const warningHistoricThreshold = {
  baseline: baselineBarWithBaseline,
  sensitivity: 2,
  deviationFactor: 2,
  operator: '>=',
  labels: ['Latency', 'Threshold', 'Violations'],
  thresholdGranularity: minutes.toMillis(10)
};

const criticalHistoricThreshold = {
  baseline: baselineBarWithBaseline,
  sensitivity: 4,
  deviationFactor: 4,
  operator: '>=',
  labels: ['Latency', 'Threshold', 'Violations'],
  thresholdGranularity: minutes.toMillis(10)
};

// see PotentialProblemsChart
const highlightColor = chartColors.strokeColors100[3];
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
      <Chart
        renderer={createLineWithBaselineAndOptionalPotentialProblem(warningHistoricThreshold, granularity)}
        isMultithreshold={false}
      />
      <h1>Historic Baseline with a high-light</h1>
      <Chart
        renderer={createLineWithBaselineAndOptionalPotentialProblem(warningHistoricThreshold, granularity, highlight)}
        isMultithreshold={false}
      />
      <h1>Adaptive Baseline</h1>
      <Chart renderer={createLineWithAdaptiveBaseline(adaptiveBaseline, granularity, [])} isMultithreshold={false} />
      <h1>Static threshold</h1>
      <Chart renderer={createLineWithThreshold('>', 30)} isMultithreshold={false} />
      <h1>Static threshold without value</h1>
      <Chart renderer={createLineWithThreshold('>', null)} isMultithreshold={false} />
      <h1>Multi-historic baseline when only warning defined</h1>
      <Chart
        renderer={createLineWithMultiHistoricBaselineAndOptionalPotentialProblem(
          warningHistoricThreshold,
          undefined,
          granularity
        )}
        isMultithreshold
        definedThreshold={'justWarning'}
      />
      <h1>Multi-historic baseline when only critical defined</h1>
      <Chart
        renderer={createLineWithMultiHistoricBaselineAndOptionalPotentialProblem(
          undefined,
          criticalHistoricThreshold,
          granularity
        )}
        isMultithreshold
        definedThreshold={'justCritical'}
      />
      <h1>Multi-historic baseline when both threshold defined</h1>
      <Chart
        renderer={createLineWithMultiHistoricBaselineAndOptionalPotentialProblem(
          warningHistoricThreshold,
          criticalHistoricThreshold,
          granularity
        )}
        isMultithreshold
        definedThreshold={'bothDefined'}
      />
    </>
  );
}

function Chart({ renderer, isMultithreshold, definedThreshold }) {
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
        y1: getY1(isMultithreshold, renderer, definedThreshold)
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

export default {
  title: 'Alert chart rendering'
};

export function StaticThresholdWithPredictions() {
  return (
    <>
      <h1>Static threshold With Predictions</h1>
      <ChartPrediction renderer={createLineWithThreshold('>', 30, [], true)} />
    </>
  );
}

function findChartRenderData(metrics) {
  let time = metrics[metrics.length - 1][0];
  let predictionStart = metrics[metrics.length - 1][1];

  let predictions = [],
    lowerBound = [],
    upperBound = [];

  const windowSize = oneDay / 6;
  const granularity = windowSize / 20;

  for (let i = 0; i < 20; i++) {
    // to check overlap

    predictions.push([time, predictionStart]);
    lowerBound.push([time, predictionStart - 30]);
    upperBound.push([time, predictionStart + 30]);

    time = Math.floor((fixedTimestamp + (i + 1) * (windowSize / 20)) / granularity) * granularity;
    predictionStart = ((getHardCodedRandomValue(i) * 100 * 100) | 0) / 100;
  }

  return { metrics, predictions, lowerBound, upperBound };
}

function ChartPrediction({ renderer, isMetricOverlap }) {
  const { metrics, predictions, lowerBound, upperBound } = findChartRenderData(
    metricsBarWithBaseline[0],
    isMetricOverlap
  );

  return (
    <>
      <ResultAwareChart
        result={{
          errors: [],
          progress: {
            loading: false
          }
        }}
        config={{
          timeConfig: {
            windowSize: oneDay / 3,
            to: predictions[predictions.length - 1][0]
          },
          granularity,
          y1: {
            metricIds: ['cpu.used', 'threshold', 'violations', 'predictions', 'lowerBound', 'upperBound'],
            excludedLabelsFromTooltip: ['Violations'],
            icons: {
              types: ['lib_legend_line_chart', 'lib_legend_threshold', 'lib_actions_stop', 'lib_legend_line_chart'],
              colors: [
                carbonCategorical.cyan50,
                carbonAlert.red60,
                getColorWithTransparency(carbonAlert.red60).c50,
                themes.default.ids.color.option['deep-purple'][500]
              ]
            },
            excludedLabelsFromLegend: ['Lower Bound', 'Upper Bound'],
            getMax: metricsMaxValue => metricsMaxValue * 1.4,
            colors: [
              carbonCategorical.cyan50,
              carbonAlert.red60,
              lighten(carbonAlert.red60, 0.4),
              themes.default.ids.color.option['deep-purple'][500],
              lighten(carbonAlert.purple50, 0.3),
              lighten(carbonAlert.purple50, 0.3)
            ],
            renderer,
            metrics: [metrics, [], [], predictions, lowerBound, upperBound],
            labels: ['Latency', 'Threshold', 'Violations', 'Predictions', 'Lower Bound', 'Upper Bound'],
            displayPredictions: true
          }
        }}
      />
    </>
  );
}

function getY1(isMultithreshold, renderer, definedThreshold) {
  if (!isMultithreshold) {
    return {
      metricIds: ['latency', 'threshold'],
      excludedLabelsFromTooltip: ['Violations'],
      icons: {
        types: ['lib_legend_line_chart', 'lib_legend_threshold', 'lib_actions_stop', 'lib_actions_stop'],
        colors: [carbonCategorical.cyan50, carbonAlert.red60, getColorWithTransparency(carbonAlert.red60).c50]
      },
      getMax: metricsMaxValue => metricsMaxValue * 2,
      colors: [
        themes.default.ids.color.option.blue['400'],
        themes.default.ids.color.option.red['500'],
        themes.default.ids.color.option.orange['500']
      ],
      renderer,
      metrics: metricsBarWithBaseline,
      labels: ['Latency', 'Threshold', 'Violations']
    };
  }

  // Multi-threshold configuration
  switch (definedThreshold) {
    case 'justWarning':
      return {
        metricIds: ['latency', 'warningThreshold'],
        excludedLabelsFromTooltip: ['Violations'],
        icons: {
          types: ['lib_legend_line_chart', 'lib_legend_threshold', 'lib_legend_threshold', 'lib_actions_stop'],
          colors: [
            carbonCategorical.cyan50,
            carbonCategorical.yellow50,
            carbonCategorical.red50,
            getColorWithTransparency(carbonCategorical.red50).c50
          ]
        },
        getMax: metricsMaxValue => metricsMaxValue * 1.5,
        colors: [carbonCategorical.cyan50, carbonCategorical.yellow50],
        renderer,
        metrics: metricsBarWithBaseline,
        labels: ['Latency', 'Warning Threshold', 'Critical Threshold', 'Violations']
      };

    case 'justCritical':
      return {
        metricIds: ['latency', 'criticalThreshold'],
        excludedLabelsFromTooltip: ['Violations'],
        icons: {
          types: ['lib_legend_line_chart', 'lib_legend_threshold', 'lib_legend_threshold', 'lib_actions_stop'],
          colors: [
            carbonCategorical.cyan50,
            carbonCategorical.yellow50,
            carbonCategorical.red50,
            getColorWithTransparency(carbonCategorical.red50).c50
          ]
        },
        getMax: metricsMaxValue => metricsMaxValue * 1.5,
        colors: [carbonCategorical.cyan50, carbonCategorical.red50],
        renderer,
        metrics: metricsBarWithBaseline,
        labels: ['Latency', 'Warning Threshold', 'Critical Threshold', 'Violations']
      };

    case 'bothDefined':
      return {
        metricIds: ['latency', 'warningThreshold', 'criticalThreshold'],
        excludedLabelsFromTooltip: ['Violations'],
        icons: {
          types: ['lib_legend_line_chart', 'lib_legend_threshold', 'lib_legend_threshold', 'lib_actions_stop'],
          colors: [
            carbonCategorical.cyan50,
            carbonCategorical.yellow50,
            carbonCategorical.red50,
            getColorWithTransparency(carbonCategorical.red50).c50
          ]
        },
        getMax: metricsMaxValue => metricsMaxValue * 1.5,
        colors: [carbonCategorical.cyan50, carbonCategorical.yellow50, carbonCategorical.red50],
        renderer,
        metrics: metricsBarWithBaseline,
        labels: ['Latency', 'Warning Threshold', 'Critical Threshold', 'Violations']
      };
  }
}
