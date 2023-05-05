/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  createLineWithThreshold,
  createLineWithAdaptiveBaseline,
  createLineWithBaselineAndOptionalPotentialProblem
} from 'in-alerting/components/Chart/renderer/Renderer';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertsPreviewLane from 'in-alerting/components/Chart/AlertsPreviewLane/AlertsPreviewLane';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { chartViewConfigPropType } from 'in-alerting/components/Chart/chartViewConfig';
import AlertingChartWrapper from 'in-alerting/components/Chart/AlertingChartWrapper';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { zeroFillAndClipMetric } from 'in-alerting/components/Chart/chartUtils';
import { getColorWithTransparency } from 'in-components/Chart/strokeColors';
import theme from 'in-themes';
import { t } from 'in-i18n';

const chartColors = [theme.lib.colors.lightBlue800, theme.lib.colors.red800];

const legendColors = [
  theme.lib.colors.lightBlue800,
  theme.lib.colors.red800,
  getColorWithTransparency(theme.lib.colors.red800).c50
];

export default function AlertingChart({
  alertConfigWithFormModel,
  viewConfig,
  blueprintConfig,
  alertsPreviewEnabled,
  numeratorTagFilterExpression,
  enrichedTagFilterExpression,
  canReload,
  eventBasedAdaptiveBaseline,
  highlight,
  setMetricResultPrecision
}) {
  const { granularity, rule, threshold, timeThreshold, includeInternal, includeSynthetic } = alertConfigWithFormModel;

  if (!idValidTimeThreshold(timeThreshold)) {
    return null;
  }

  const metricName = blueprintConfig.getMetricName(rule);
  const metricChartGranularity = granularity;
  const formatter = blueprintConfig.getMetricFormat(metricName);
  const aggregation = blueprintConfig.getAggregation(rule);
  const metricLabel = blueprintConfig.getMetricLabel(metricName);
  const renderer = getRendererBasedOnThresholdType(threshold, highlight, granularity, eventBasedAdaptiveBaseline);

  // only apply zero filling to count metrics
  const requiresZeroFilling = aggregation === 'SUM';

  return (
    <AlertingChartWrapper
      renderPreChartContent={props => {
        if (!alertsPreviewEnabled) return;

        const alertsPreviewQuery = getAlertsPreviewQuery({
          enrichedTagFilterExpression,
          includeInternal,
          includeSynthetic,
          timeConfig: viewConfig.timeConfig,
          metricName,
          numeratorTagFilterExpression,
          aggregation,
          granularity,
          threshold,
          timeThreshold
        });

        return (
          <MarkerLanesPresenter {...props}>
            <AlertsPreviewLane
              getAlertsPreview={blueprintConfig.getAlertsPreviewRequest(metricName)}
              alertsPreviewConfiguration={alertsPreviewQuery}
            />
          </MarkerLanesPresenter>
        );
      }}
      thresholdType={threshold.type}
      timeConfig={viewConfig.timeConfig}
      granularity={metricChartGranularity}
      getMetric={blueprintConfig.getMetricsRequest(metricName)}
      postProcessMetric={requiresZeroFilling && zeroFillAndClipMetric}
      metricsConfiguration={getMetricsConfiguration()}
      y1={getY1()}
      canReload={canReload}
      nonInteractive
      setMetricResultPrecision={setMetricResultPrecision}
      customHeight={182}
    />
  );

  function getY1() {
    return {
      colors: chartColors,
      metricIds: [metricName, 'threshold'],
      // i18n: Violations does not need to be translated, it is an internal name
      excludedLabelsFromTooltip: ['Violations', highlight?.label].filter(Boolean),
      nonToggleableSeries: enhanceNonToggleableSeries(metricName, highlight),
      labels: enhanceLabels(metricLabel, highlight),
      tooltipFormatter: value => (value < 0 || value === null ? valueMissingPlaceholder : formatter.detailed(value)),
      formatter: value => formatter.detailed(value),
      renderer,
      icons: {
        types: ['lib_line_chart', 'lib_threshold', 'lib_actions_stop', 'lib_actions_stop'],
        colors: [...legendColors, highlight?.color[0]].filter(Boolean)
      },
      thresholdGranularity: granularity,
      lineWidth: 1.75,

      // used as additional data:

      threshold: threshold.value,
      operator: threshold.operator,
      sensitivity: threshold.deviationFactor,
      baseline: threshold.baseline,
      eventBasedAdaptiveBaseline,
      getMax: computeMax
    };
  }

  function computeMax(metricsMaxValue) {
    const fromTime = Date.now() - viewConfig.timeConfig.windowSize;
    if (threshold.type === STATIC_THRESHOLD) {
      return threshold.value >= metricsMaxValue ? Math.max(metricsMaxValue, threshold.value * 1.2) : metricsMaxValue;
    } else if (threshold.type === ADAPTIVE_BASELINE) {
      return getMaxForAdaptiveBaselineChart({
        metricsMaxValue,
        operator: threshold.operator,
        fromTime,
        baseline: threshold.baseline,
        baselineEntriesFromMetadata: eventBasedAdaptiveBaseline,
        sensitivity: threshold.deviationFactor
      });
    }

    // Fallback to HISTORIC_BASELINE
    return getMaxForBaselineChart({
      metricsMaxValue,
      operator: threshold.operator,
      baseline: threshold.baseline,
      sensitivity: threshold.deviationFactor,
      fromTime
    });
  }

  function getMetricsConfiguration() {
    return {
      tagFilterExpression: enrichedTagFilterExpression,
      includeInternal,
      includeSynthetic,
      timeConfig: viewConfig.timeConfig,
      metrics: {
        [metricName]: {
          metric: metricName,
          granularity: metricChartGranularity,
          aggregation,
          numeratorTagFilterExpression
        }
      }
    };
  }
}

function idValidTimeThreshold(timeThreshold) {
  if (
    (timeThreshold?.users !== undefined && !timeThreshold.users) ||
    (timeThreshold?.userPercentage !== undefined && !timeThreshold.userPercentage) ||
    (timeThreshold?.requests !== undefined && !timeThreshold?.requests)
  ) {
    return false;
  }
  return true;
}

function getRendererBasedOnThresholdType(threshold, highlight, granularity, eventBasedAdaptiveBaseline) {
  switch (threshold.type) {
    case STATIC_THRESHOLD:
      return createLineWithThreshold(threshold.operator, threshold.value);
    case HISTORIC_BASELINE:
      return createLineWithBaselineAndOptionalPotentialProblem(threshold, granularity, highlight);
    default:
      return createLineWithAdaptiveBaseline(threshold, granularity, eventBasedAdaptiveBaseline);
  }
}

function getAlertsPreviewQuery({
  timeConfig,
  enrichedTagFilterExpression,
  includeInternal,
  includeSynthetic,
  metricName,
  numeratorTagFilterExpression,
  aggregation,
  granularity,
  threshold,
  timeThreshold
}) {
  if (shouldRequestAlertsPreview(threshold)) {
    return {
      tagFilterExpression: enrichedTagFilterExpression,
      includeInternal,
      includeSynthetic,
      timeConfig,
      timeThreshold,
      threshold,
      granularity, // to request clustered alert preview results
      metrics: {
        alerts: {
          metric: metricName,
          aggregation,
          granularity,
          numeratorTagFilterExpression
        }
      }
    };
  }
  return null;
}

function shouldRequestAlertsPreview(threshold) {
  if (threshold.type === 'staticThreshold') {
    return threshold.value != null;
  }
  return threshold.baseline;
}

function enhanceLabels(label, highlight) {
  const labels = [
    label,
    t('in-alerting:components.chart.alertingChartLabelThreshold'),
    t('in-alerting:components.chart.alertingChartLabelViolations')
  ];

  if (highlight) {
    labels.push(highlight.label);
  }

  return labels;
}

function enhanceNonToggleableSeries(metricName, highlight) {
  const labels = new Map([
    ['threshold', null],
    ['alerts', null],
    // i18n: Violations does not need to be translated, it is an internal name
    ['Violations', null],
    [metricName, null]
  ]);

  if (highlight) {
    labels.set(highlight.label, null);
  }

  return labels;
}

function getMaxForBaselineChart({ metricsMaxValue, operator, baseline, sensitivity, fromTime }) {
  const opSign = isGreaterOperator(operator) ? 1 : -1;
  const overallMaxValue = (baseline || [])
    .filter(v => !fromTime || fromTime < v[0])
    .map(v => v[1] + opSign * v[2] * sensitivity)
    .reduce((prevMax, computedMax) => (prevMax > computedMax ? prevMax : computedMax), metricsMaxValue);

  return overallMaxValue * 1.1;
}

function getMaxForAdaptiveBaselineChart({
  metricsMaxValue,
  operator,
  fromTime,
  baseline,
  baselineEntriesFromMetadata,
  sensitivity
}) {
  const eventBasedAdaptiveBaseline = baselineEntriesFromMetadata ?? [];

  if (eventBasedAdaptiveBaseline.length === 0) {
    return getMaxForBaselineChart({
      metricsMaxValue,
      operator,
      fromTime,
      baseline,
      sensitivity
    });
  }

  const opSign = isGreaterOperator(operator) ? 1 : -1;

  const overallMaxValue = eventBasedAdaptiveBaseline
    .map(keyValue => keyValue[1] + opSign * sensitivity)
    .reduce((prevMax, computedMax) => (prevMax > computedMax ? prevMax : computedMax), metricsMaxValue);

  return overallMaxValue * 1.1;
}

AlertingChart.propTypes = {
  viewConfig: chartViewConfigPropType.isRequired,
  alertConfigWithFormModel: PropTypes.object.isRequired,
  blueprintConfig: PropTypes.object.isRequired,
  alertsPreviewEnabled: PropTypes.bool,
  canReload: PropTypes.bool,
  numeratorTagFilterExpression: PropTypes.object,
  enrichedTagFilters: PropTypes.array,
  enrichedTagFilterExpression: PropTypes.object,
  eventBasedAdaptiveBaseline: PropTypes.array,

  /**
   * Allows to place a highlight area on the alert chart.
   * Needs to be supported by the selected chart renderer.
   * See: in-alerting/components/Chart/renderer/lineWithBaselineAndPotentialProblem
   *
   * area.start is the start x coordinate (in the metrics x range)
   * area.end is the end x coordinate (in the metrics x range)
   * color is an array of color strings. Index 0 being the highlights fill color
   * and index 1 being its border color.
   */
  highlight: PropTypes.shape({
    area: PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired
    }),
    color: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.string.isRequired
  }),
  setMetricResultPrecision: PropTypes.func
};
