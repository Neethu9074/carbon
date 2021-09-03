/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertsPreviewLane from 'in-components/Chart/markerLanes/AlertsPreviewLane/AlertsPreviewLane';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { chartViewConfigPropType } from 'in-alerting/components/Chart/chartViewConfig';
import AlertingChartWrapper from 'in-alerting/components/Chart/AlertingChartWrapper';
import { smoothMetrics } from 'in-alerting/smart-alerts/components/utils/chartUtil';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { getColorWithTransparency } from 'in-components/Chart/strokeColors';
import Renderer from 'in-alerting/components/Chart/renderer/Renderer';
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
  numeratorFilter,
  enrichedTagFilterExpression,
  canReload,
  rendererOverride,
  eventBasedAdaptiveBaseline,
  useApproximateQueryPrecisionForMetrics,
  highlight
}) {
  const { granularity, rule, threshold, timeThreshold, includeInternal, includeSynthetic } = alertConfigWithFormModel;

  const metricName = blueprintConfig.getMetricName(rule);
  const metricChartGranularity = Math.max(granularity, viewConfig.minChartMetricGranularity);
  const formatter = blueprintConfig.getMetricFormat(metricName);
  const aggregation = blueprintConfig.getAggregation(rule);
  const metricLabel = blueprintConfig.getMetricLabel(metricName);
  const renderer = rendererOverride || getRendererBasedOnThresholdType(threshold.type);

  return (
    <AlertingChartWrapper
      renderPreChartContent={props => {
        if (!alertsPreviewEnabled) return;

        return (
          <MarkerLanesPresenter
            {...props}
            getAlertsPreview={blueprintConfig.getAlertsPreviewRequest(metricName)}
            alertsPreviewConfiguration={getAlertsPreviewQuery({
              enrichedTagFilterExpression,
              includeInternal,
              includeSynthetic,
              timeConfig: viewConfig.timeConfig,
              metricName,
              numeratorFilter,
              aggregation,
              granularity,
              threshold,
              timeThreshold
            })}
          >
            <AlertsPreviewLane />
          </MarkerLanesPresenter>
        );
      }}
      thresholdType={threshold.type}
      mutateMetrics={{
        doMutate: viewConfig.smoothMetric,
        metricNames: [metricName],
        mutate: smoothMetrics
      }}
      timeConfig={viewConfig.timeConfig}
      granularity={metricChartGranularity}
      getMetric={blueprintConfig.getMetricsRequest(metricName)}
      metricsConfiguration={getMetricsConfiguration()}
      y1={getY1()}
      canReload={canReload}
      nonInteractive
    />
  );

  function getY1() {
    return {
      colors: chartColors,
      metricIds: [metricName, 'threshold'],
      excludedLabelsFromTooltip: ['Violations', highlight?.label].filter(Boolean),
      nonToggleableSeries: enhanceNonToggleableSeries(
        metricName,
        getSmoothedMetricTooltipContent(viewConfig.smoothMetric),
        highlight
      ),
      labels: enhanceLabels(metricLabel, viewConfig.smoothMetric, highlight),
      tooltipFormatter: value => (value < 0 ? valueMissingPlaceholder : formatter.detailed(value)),
      renderer,
      icons: {
        types: ['lib_line_chart', 'lib_threshold', 'lib_actions_stop', 'lib_actions_stop'],
        colors: [...legendColors, highlight?.color[0]].filter(Boolean)
      },
      thresholdGranularity: granularity,
      lineWidth: 1.75,
      thresholdLineWidth: 1,
      threshold: threshold.value,
      operator: threshold.operator,
      sensitivity: threshold.deviationFactor,
      baseline: threshold.baseline,
      eventBasedAdaptiveBaseline,
      highlight,
      getMax: computeMax
    };
  }

  function computeMax(metricsMaxValue) {
    if (threshold.type === STATIC_THRESHOLD) {
      return threshold.value >= metricsMaxValue ? Math.max(metricsMaxValue, threshold.value * 1.2) : metricsMaxValue;
    } else if (threshold.type === ADAPTIVE_BASELINE) {
      return getMaxForAdaptiveBaselineChart({
        metricsMaxValue,
        operator: threshold.operator,
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
      sensitivity: threshold.deviationFactor
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
          numeratorFilter
        }
      },
      // In positive scenario(when evaluations could be performed without sampled data in a given timeout period)
      // back-end uses FULL precision(PERCENT_100) even if we have passed APPROXIMATE queryPrecision. Otherwise it uses
      // PERCENT_10 or PERCENT_1. SamplingLevel would be identified using the clusterCapacity and the numCalls.
      // See https://github.com/instana/backend/blob/develop/appdata-reader/src/main/java/com/instana/application/datareader/service/RetentionAndMaxQueryTimeSamplingLevelChooser.java#L36-L47
      queryPrecision: useApproximateQueryPrecisionForMetrics ? 'APPROXIMATE' : 'FULL'
    };
  }
}

function getRendererBasedOnThresholdType(thresholdType) {
  if (thresholdType === STATIC_THRESHOLD) {
    return Renderer.lineWithThreshold;
  } else if (thresholdType === HISTORIC_BASELINE) {
    return Renderer.lineWithHistoricBaseline;
  } else {
    return Renderer.lineWithAdaptiveBaseline;
  }
}

function getAlertsPreviewQuery({
  timeConfig,
  enrichedTagFilterExpression,
  includeInternal,
  includeSynthetic,
  metricName,
  numeratorFilter,
  aggregation,
  granularity,
  threshold,
  timeThreshold
}) {
  if (threshold.baseline || typeof threshold.value === 'number') {
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
          numeratorFilter
        }
      }
    };
  }
  return null;
}

function enhanceLabels(label, smoothMetric, highlight) {
  const labels = [
    `${label}${smoothMetric ? '*' : ''}`,
    t('in-alerting:components.chart.alertingChartLabelThreshold'),
    t('in-alerting:components.chart.alertingChartLabelViolations')
  ];

  if (highlight) {
    labels.push(highlight.label);
  }

  return labels;
}

function enhanceNonToggleableSeries(metricName, tooltipContent, highlight) {
  const labels = new Map([
    ['threshold', null],
    ['alerts', null],
    ['Violations', null]
  ]).set(metricName, tooltipContent);

  if (highlight) {
    labels.set(highlight.label, null);
  }

  return labels;
}

function getSmoothedMetricTooltipContent(isSmoothedMetric) {
  return isSmoothedMetric ? [t('in-alerting:components.chart.alertingChartTooltipSmoothedMetric')] : null;
}

function getMaxForBaselineChart({ metricsMaxValue, operator, baseline, sensitivity }) {
  const opSign = isGreaterOperator(operator) ? 1 : -1;
  const overallMaxValue = (baseline || [])
    .map(v => v[1] + opSign * v[2] * sensitivity)
    .reduce((prevMax, computedMax) => (prevMax > computedMax ? prevMax : computedMax), metricsMaxValue);

  return overallMaxValue * 1.1;
}

function getMaxForAdaptiveBaselineChart({
  metricsMaxValue,
  operator,
  baseline,
  baselineEntriesFromMetadata,
  sensitivity
}) {
  const eventBasedAdaptiveBaseline = baselineEntriesFromMetadata ?? [];

  if (eventBasedAdaptiveBaseline.length === 0) {
    return getMaxForBaselineChart({ metricsMaxValue, operator, baseline, sensitivity });
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
  numeratorFilter: PropTypes.object,
  isQB1only: PropTypes.bool,
  enrichedTagFilters: PropTypes.array,
  enrichedTagFilterExpression: PropTypes.object,
  rendererOverride: PropTypes.object,
  eventBasedAdaptiveBaseline: PropTypes.array,
  useApproximateQueryPrecisionForMetrics: PropTypes.bool,

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
  })
};
