/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { themes } from '@instana/design-tokens';

import {
  createLineWithThreshold,
  createLineWithAdaptiveBaseline,
  createLineWithBaselineAndOptionalPotentialProblem,
  createLineWithMultiStaticThreshold,
  createLineWithMultiHistoricBaselineAndOptionalPotentialProblem,
  createLineWithMultiAdaptiveBaseline
} from 'in-alerting/components/Chart/renderer/Renderer';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { WARNING_SEVERITY, CRITICAL_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { getMetricFormatter } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import AlertsPreviewLane from 'in-alerting/components/Chart/AlertsPreviewLane/AlertsPreviewLane';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { chartViewConfigPropType } from 'in-alerting/components/Chart/chartViewConfig';
import AlertingChartWrapper from 'in-alerting/components/Chart/AlertingChartWrapper';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { zeroFillAndClipMetric } from 'in-alerting/components/Chart/chartUtils';
import { getColorWithTransparency } from 'in-components/Chart/strokeColors';
import { carbonAlert, carbonCategorical } from 'in-themes/chartColors';
import { lighten } from 'in-services/formatters/color';
import { t } from 'in-i18n';

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
  setMetricResultPrecision,
  isTearSheet,
  isMultiThresholdEnabled
}) {
  const { granularity, timeThreshold, includeInternal, includeSynthetic } = alertConfigWithFormModel;

  const rule = isMultiThresholdEnabled ? alertConfigWithFormModel?.rules[0]?.rule : alertConfigWithFormModel?.rule;

  const threshold = getAvailableThreshold(alertConfigWithFormModel, isMultiThresholdEnabled);
  const metricName = blueprintConfig.getMetricName(rule);
  const metricChartGranularity = granularity;
  const formatter = blueprintConfig.getMetricFormat(metricName);
  const aggregation = blueprintConfig.getAggregation(rule);
  const metricLabel = blueprintConfig.getMetricLabel(metricName);
  const renderer = getAppropriateRenderer(
    isMultiThresholdEnabled,
    alertConfigWithFormModel,
    highlight,
    granularity,
    eventBasedAdaptiveBaseline,
    viewConfig.timeConfig
  );

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
          threshold: isMultiThresholdEnabled
            ? { ...threshold, operator: getThresholdOperator(alertConfigWithFormModel, isMultiThresholdEnabled) }
            : threshold,
          timeThreshold
        });

        return (
          <MarkerLanesPresenter {...props}>
            <AlertsPreviewLane
              getAlertsPreview={blueprintConfig.getAlertsPreviewRequest(metricName)}
              alertsPreviewConfiguration={alertsPreviewQuery}
              resultMetricKey="alerts"
              isTearSheet={isTearSheet}
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
      y1={getAppropriateY1(
        isMultiThresholdEnabled,
        alertConfigWithFormModel,
        metricName,
        highlight,
        metricLabel,
        formatter,
        renderer,
        granularity,
        eventBasedAdaptiveBaseline,
        viewConfig
      )}
      canReload={canReload}
      nonInteractive
      setMetricResultPrecision={setMetricResultPrecision}
      customHeight={182}
      isMultiThresholdEnabled={isMultiThresholdEnabled}
    />
  );

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

export function getY1(
  metricName,
  highlight,
  metricLabel,
  formatter,
  renderer,
  granularity,
  threshold,
  operator,
  eventBasedAdaptiveBaseline,
  viewConfig,
  thresholdColor = carbonAlert.red60,
  displayPredictions = false
) {
  let chartColors = [carbonCategorical.cyan50, thresholdColor];
  let metricIds = [metricName, 'threshold'];
  let legendColors = [carbonCategorical.cyan50, thresholdColor, getColorWithTransparency(thresholdColor).c50];
  let iconTypes = ['lib_legend_line_chart', 'lib_legend_threshold', 'lib_actions_stop', 'lib_actions_stop'];

  let excludedLabelsFromLegend = [];

  // If we want to show predictions in the chart, we must set the 'chartColors', 'legendColors', and 'iconTypes' for the predictions, lower and upper bounds.
  if (displayPredictions) {
    chartColors = [
      ...chartColors,
      '',
      themes.default.ids.color.option['deep-purple'][500],
      lighten(carbonAlert.purple50, 0.4),
      lighten(carbonAlert.purple50, 0.4)
    ];
    metricIds = [...metricIds, 'violations', 'predictions', 'lowerBound', 'upperBound'];
    legendColors = [...legendColors, themes.default.ids.color.option['deep-purple'][500]];

    //We don't need lower and upper bounds displayed in the legends area for predictions, so it's added to excludedLabelsFromLegend and removed from legends.
    excludedLabelsFromLegend = [
      t('in-alerting:components.chart.alertingChartLabelLowerBound'),
      t('in-alerting:components.chart.alertingChartLabelUpperBound')
    ];

    // There are only three icons required for smart alerts, the last icon, 'lib_actions_stop,' is added to `iconTypes` for potential problems but is not displayed in alerting charts. However, when predictions are included in smart alerts, we must display 'lib_legend_line_chart' as the fourth icon for legends, so removing the last icon from iconTypes ('lib_actions_stop') and replacing it with the prediction-appropriate icon.
    iconTypes.pop();
    iconTypes = [...iconTypes, 'lib_legend_line_chart'];
  }

  return {
    colors: chartColors,
    metricIds: metricIds,
    // i18n: Violations does not need to be translated, it is an internal name
    excludedLabelsFromTooltip: ['Violations', highlight?.label].filter(Boolean),
    nonToggleableSeries: enhanceNonToggleableSeries(metricName, highlight),
    labels: enhanceLabels(metricLabel, highlight, displayPredictions),
    excludedLabelsFromLegend: excludedLabelsFromLegend,
    tooltipFormatter: value => (value < 0 || value === null ? valueMissingPlaceholder : formatter.detailed(value)),
    formatter: value => formatter.detailed(value),
    renderer,
    icons: {
      types: iconTypes,
      colors: [...legendColors, highlight?.color[0]].filter(Boolean)
    },
    thresholdGranularity: granularity,
    lineWidth: 1.75,

    // used as additional data:

    threshold: threshold.value,
    operator: operator,
    sensitivity: threshold.deviationFactor,
    baseline: threshold.baseline,
    eventBasedAdaptiveBaseline,
    getMax: computeMax,
    displayPredictions
  };

  function computeMax(metricsMaxValue) {
    const fromTime = Date.now() - viewConfig.timeConfig.windowSize;
    if (threshold.type === STATIC_THRESHOLD) {
      return threshold.value >= metricsMaxValue ? Math.max(metricsMaxValue, threshold.value * 1.2) : metricsMaxValue;
    } else if (threshold.type === ADAPTIVE_BASELINE) {
      return getMaxForAdaptiveBaselineChart({
        metricsMaxValue,
        operator: operator,
        fromTime,
        baseline: threshold.baseline,
        baselineEntriesFromMetadata: eventBasedAdaptiveBaseline,
        sensitivity: threshold.deviationFactor
      });
    }

    // Fallback to HISTORIC_BASELINE
    return getMaxForBaselineChart({
      metricsMaxValue,
      operator: operator,
      baseline: threshold.baseline,
      sensitivity: threshold.deviationFactor,
      fromTime
    });
  }
}

export function getY1ForMultiThreshold(
  metricName,
  metricLabel,
  formatter,
  renderer,
  granularity,
  operator,
  warningThreshold,
  criticalThreshold,
  eventBasedAdaptiveBaseline,
  viewConfig,
  displayPredictions = false
) {
  let metricIds = [metricName];
  let chartColors = [carbonCategorical.cyan50];
  let legendColors = [carbonCategorical.cyan50];
  let iconTypes = ['lib_legend_line_chart'];
  let labels = [metricLabel];

  if (!isEmptyThreshold(warningThreshold)) {
    metricIds.push('warningThreshold');
    chartColors.push(carbonCategorical.yellow50);
    labels.push(t('in-alerting:components.chart.alertingChartLabelWarningThreshold'));
    iconTypes.push('lib_legend_threshold');
    legendColors.push(carbonCategorical.yellow50);
  }

  if (!isEmptyThreshold(criticalThreshold)) {
    metricIds.push('criticalThreshold');
    chartColors.push(carbonCategorical.red50);
    labels.push(t('in-alerting:components.chart.alertingChartLabelCriticalThreshold'));
    iconTypes.push('lib_legend_threshold');
    legendColors.push(carbonCategorical.red50);
  }

  if (metricIds.indexOf('warningThreshold') > -1) {
    labels.push(t('in-alerting:components.chart.alertingChartLabelWarningViolations'));
    iconTypes.push('lib_actions_stop');
    legendColors.push(getColorWithTransparency(carbonCategorical.yellow50).c50);
  }

  if (metricIds.indexOf('criticalThreshold') > -1) {
    labels.push(t('in-alerting:components.chart.alertingChartLabelCriticalViolations'));
    iconTypes.push('lib_actions_stop');
    legendColors.push(getColorWithTransparency(carbonCategorical.red50).c50);
  }

  let excludedLabelsFromLegend = [];
  if (displayPredictions) {
    chartColors.push(
      '',
      themes.default.ids.color.option['deep-purple'][500],
      lighten(carbonAlert.purple50, 0.4),
      lighten(carbonAlert.purple50, 0.4)
    );
    metricIds.push('violations', 'predictions', 'lowerBound', 'upperBound');
    legendColors.push(themes.default.ids.color.option['deep-purple'][500]);
    labels.push(
      t('in-alerting:components.chart.alertingChartLabelForecast'),
      t('in-alerting:components.chart.alertingChartLabelLowerBound'),
      t('in-alerting:components.chart.alertingChartLabelUpperBound')
    );
    excludedLabelsFromLegend.push(
      t('in-alerting:components.chart.alertingChartLabelLowerBound'),
      t('in-alerting:components.chart.alertingChartLabelUpperBound')
    );
    iconTypes.push('lib_legend_line_chart');
  }
  return {
    colors: chartColors,
    metricIds: metricIds,
    excludedLabelsFromTooltip: [
      t('in-alerting:components.chart.alertingChartLabelWarningViolations'),
      t('in-alerting:components.chart.alertingChartLabelCriticalViolations')
    ],
    nonToggleableSeries: new Map([
      [metricName, null],
      ['warningThreshold', null],
      ['criticalThreshold', null]
    ]),
    labels,
    excludedLabelsFromLegend: excludedLabelsFromLegend,
    tooltipFormatter: value => {
      if (value < 0 || value === null) return valueMissingPlaceholder;
      return getMetricFormatter(value, formatter);
    },
    formatter: value => getMetricFormatter(value, formatter),
    renderer,
    icons: {
      types: iconTypes,
      colors: legendColors
    },
    thresholdGranularity: granularity,
    lineWidth: 1.75,

    // used as additional data:
    operator: operator,
    warningThresholdValue: warningThreshold,
    criticalThresholdValue: criticalThreshold,
    eventBasedAdaptiveBaseline,
    getMax: computeMax
  };

  function computeMax(metricsMaxValue) {
    const definedThresholdType = warningThreshold?.type ?? criticalThreshold?.type;

    switch (definedThresholdType) {
      case STATIC_THRESHOLD: {
        const maxThresholdValue = Math.max(warningThreshold?.value ?? 0, criticalThreshold?.value ?? 0);
        return maxThresholdValue >= metricsMaxValue
          ? Math.max(metricsMaxValue, maxThresholdValue * 1.2)
          : metricsMaxValue;
      }

      case HISTORIC_BASELINE: {
        return getMaxForBaselineChartMultiThreshold(
          metricsMaxValue,
          operator,
          criticalThreshold?.baseline ?? warningThreshold?.baseline,
          warningThreshold?.deviationFactor ?? 0,
          criticalThreshold?.deviationFactor ?? 0
        );
      }

      case ADAPTIVE_BASELINE: {
        return getMaxForAdaptiveBaselineChartMultiThreshold(
          metricsMaxValue,
          eventBasedAdaptiveBaseline,
          operator,
          criticalThreshold?.baseline ?? warningThreshold?.baseline,
          warningThreshold?.deviationFactor ?? 0,
          criticalThreshold?.deviationFactor ?? 0
        );
      }

      default:
        return metricsMaxValue;
    }
  }
}

function getMaxForAdaptiveBaselineChartMultiThreshold(
  metricsMaxValue,
  baselineEntriesFromMetadata,
  operator,
  baseline,
  warningSensitivity,
  criticalSensitivity
) {
  if (baselineEntriesFromMetadata === undefined) {
    return getMaxForBaselineChartMultiThreshold(
      metricsMaxValue,
      operator,
      baseline,
      warningSensitivity,
      criticalSensitivity
    );
  }

  // baselineEntriesFromMetadata is an array of tuples, where each tuple contains:
  // [timestamp, warningValue, criticalValue].
  const overallMaxValue = baselineEntriesFromMetadata
    .flatMap(baselineEntry => [baselineEntry[1], baselineEntry[2]])
    .reduce((max, current) => Math.max(max, current), metricsMaxValue);
  return overallMaxValue * 1.1;
}

function getMaxForBaselineChartMultiThreshold(
  metricsMaxValue,
  operator,
  baseline,
  warningSensitivity,
  criticalSensitivity
) {
  const opSign = isGreaterOperator(operator) ? 1 : -1;
  const overallMaxValue = (baseline || [])
    .flatMap(baselineEntry => [
      baselineEntry[1] + opSign * baselineEntry[2] * warningSensitivity,
      baselineEntry[1] + opSign * baselineEntry[2] * criticalSensitivity
    ])
    .reduce((max, current) => Math.max(max, current), metricsMaxValue);

  return overallMaxValue * 1.1;
}

function isValidTimeThreshold(timeThreshold) {
  if (
    (timeThreshold?.users !== undefined && !timeThreshold.users) ||
    (timeThreshold?.userPercentage !== undefined && !timeThreshold.userPercentage) ||
    (timeThreshold?.requests !== undefined && !timeThreshold?.requests)
  ) {
    return false;
  }
  return true;
}

function getBothThresholdsForMultiThreshold(alertConfigWithFormModel) {
  const thresholdsMap = alertConfigWithFormModel.rules[0].thresholds;
  const warningThreshold = thresholdsMap[WARNING_SEVERITY];
  const criticalThreshold = thresholdsMap[CRITICAL_SEVERITY];
  return { warningThreshold, criticalThreshold };
}

function getAvailableThreshold(alertConfigWithFormModel, isMultiThresholdEnabled) {
  if (isMultiThresholdEnabled) {
    const { warningThreshold, criticalThreshold } = getBothThresholdsForMultiThreshold(alertConfigWithFormModel);
    return !isEmptyThreshold(warningThreshold) ? warningThreshold : criticalThreshold;
  } else {
    return alertConfigWithFormModel.threshold;
  }
}

function getAppropriateY1(
  isMultiThresholdEnabled,
  alertConfigWithFormModel,
  metricName,
  highlight,
  metricLabel,
  formatter,
  renderer,
  granularity,
  eventBasedAdaptiveBaseline,
  viewConfig
) {
  const thresholdOperator = getThresholdOperator(alertConfigWithFormModel, isMultiThresholdEnabled);

  if (isMultiThresholdEnabled) {
    const { warningThreshold, criticalThreshold } = getBothThresholdsForMultiThreshold(alertConfigWithFormModel);
    return getY1ForMultiThreshold(
      metricName,
      metricLabel,
      formatter,
      renderer,
      granularity,
      thresholdOperator,
      warningThreshold,
      criticalThreshold,
      eventBasedAdaptiveBaseline,
      viewConfig
    );
  }
  return getY1(
    metricName,
    highlight,
    metricLabel,
    formatter,
    renderer,
    granularity,
    alertConfigWithFormModel.threshold,
    thresholdOperator,
    eventBasedAdaptiveBaseline,
    viewConfig
  );
}

function getAppropriateRenderer(
  isMultiThresholdEnabled,
  alertConfigWithFormModel,
  highlight,
  granularity,
  eventBasedAdaptiveBaseline,
  timeConfig,
  displayPredictions = false
) {
  const thresholdOperator = getThresholdOperator(alertConfigWithFormModel, isMultiThresholdEnabled);
  if (isMultiThresholdEnabled) {
    const { warningThreshold, criticalThreshold } = getBothThresholdsForMultiThreshold(alertConfigWithFormModel);
    return getRendererBasedOnThresholdTypeForMultiThreshold(
      thresholdOperator,
      warningThreshold,
      criticalThreshold,
      highlight,
      granularity,
      eventBasedAdaptiveBaseline,
      timeConfig,
      displayPredictions
    );
  }
  return getRendererBasedOnThresholdType(
    thresholdOperator,
    alertConfigWithFormModel.threshold,
    highlight,
    granularity,
    eventBasedAdaptiveBaseline,
    displayPredictions
  );
}

function getThresholdOperator(alertConfigWithFormModel, isMultiThresholdEnabled) {
  return isMultiThresholdEnabled
    ? alertConfigWithFormModel.rules[0].thresholdOperator
    : alertConfigWithFormModel.threshold.operator;
}

export function getRendererBasedOnThresholdType(
  thresholdOperator,
  threshold,
  highlight,
  granularity,
  eventBasedAdaptiveBaseline,
  displayPredictions = false
) {
  switch (threshold.type) {
    case STATIC_THRESHOLD:
      return createLineWithThreshold(thresholdOperator, threshold.value, displayPredictions);
    case HISTORIC_BASELINE:
      return createLineWithBaselineAndOptionalPotentialProblem(thresholdOperator, threshold, granularity, highlight);
    default:
      return createLineWithAdaptiveBaseline(thresholdOperator, threshold, granularity, eventBasedAdaptiveBaseline);
  }
}
export function getRendererBasedOnThresholdTypeForMultiThreshold(
  operator,
  warningThreshold,
  criticalThreshold,
  highlight,
  granularity,
  eventBasedAdaptiveBaseline,
  timeConfig,
  displayPredictions = false
) {
  const definedThresholdType = warningThreshold?.type ? warningThreshold.type : criticalThreshold.type;
  switch (definedThresholdType) {
    case STATIC_THRESHOLD: {
      return createLineWithMultiStaticThreshold(
        operator,
        warningThreshold?.value,
        criticalThreshold?.value,
        displayPredictions
      );
    }
    case HISTORIC_BASELINE: {
      return createLineWithMultiHistoricBaselineAndOptionalPotentialProblem(
        operator,
        warningThreshold,
        criticalThreshold,
        granularity,
        highlight
      );
    }
    default:
      return createLineWithMultiAdaptiveBaseline(
        operator,
        warningThreshold,
        criticalThreshold,
        granularity,
        eventBasedAdaptiveBaseline,
        timeConfig
      );
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
    //  validate if timeThreshold to prevent websocket error
    if (!isValidTimeThreshold(timeThreshold)) {
      return null;
    }

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
  return threshold.type && threshold.deviationFactor && threshold.baseline;
}

function enhanceLabels(label, highlight, displayPredictions) {
  const labels = [
    label,
    t('in-alerting:components.chart.alertingChartLabelThreshold'),
    t('in-alerting:components.chart.alertingChartLabelViolations')
  ];

  if (displayPredictions) {
    labels.push(
      t('in-alerting:components.chart.alertingChartLabelForecast'),
      t('in-alerting:components.chart.alertingChartLabelLowerBound'),
      t('in-alerting:components.chart.alertingChartLabelUpperBound')
    );
  }

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
    [metricName, null],
    ['predictions', null]
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

export function isEmptyThreshold(threshold) {
  return (
    threshold === undefined ||
    threshold === null ||
    (typeof threshold === 'object' &&
      (threshold.deviationFactor === undefined || threshold.deviationFactor === null) &&
      (threshold.value === undefined || threshold.value === null))
  );
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
  setMetricResultPrecision: PropTypes.func,
  isTearSheet: PropTypes.bool,
  isMultiThresholdEnabled: PropTypes.bool.isRequired
};
