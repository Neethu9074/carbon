/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertsPreviewLane from 'in-components/Chart/markerLanes/AlertsPreviewLane/AlertsPreviewLane';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { chartViewConfigPropType } from 'in-alerting/components/Chart/chartViewConfig';
import AlertingChartWrapper from 'in-alerting/components/Chart/AlertingChartWrapper';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { smoothMetrics } from 'in-alerting/smart-alerts/components/utils/chartUtil';
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
  canReload
}) {
  const { granularity, rule, threshold, timeThreshold, includeInternal, includeSynthetic } = alertConfigWithFormModel;

  const metricName = blueprintConfig.getMetricName(rule);
  const metricChartGranularity = Math.max(granularity, viewConfig.minChartMetricGranularity);
  const formatter = blueprintConfig.getMetricFormat(metricName);

  const aggregation = blueprintConfig.getAggregation(rule);
  const metricLabel = blueprintConfig.getMetricLabel(metricName);
  const isStaticThreshold = threshold.type === 'staticThreshold';

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
      metricsConfiguration={{
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
        }
      }}
      y1={{
        colors: chartColors,
        metricIds: [metricName, 'threshold'],
        excludedLabelsFromTooltip: ['Violations'],
        nonToggleableSeries: enhanceNonToggleableSeries(
          metricName,
          getSmoothedMetricTooltipContent(viewConfig.smoothMetric)
        ),
        labels: enhanceLabels(metricLabel, viewConfig.smoothMetric),
        tooltipFormatter: value => (value < 0 ? valueMissingPlaceholder : formatter.detailed(value)),
        renderer: isStaticThreshold ? Renderer.lineWithThreshold : Renderer.lineWithBaseline,
        icons: {
          types: ['lib_line_chart', 'lib_threshold', 'lib_actions_stop'],
          colors: legendColors
        },
        thresholdGranularity: granularity,
        lineWidth: 1.75,
        thresholdLineWidth: 1,
        threshold: threshold.value,
        operator: threshold.operator,
        sensitivity: threshold.deviationFactor,
        baseline: threshold.baseline,
        getMax: metricsMaxValue => {
          if (isStaticThreshold) {
            return threshold.value >= metricsMaxValue
              ? Math.max(metricsMaxValue, threshold.value * 1.2)
              : metricsMaxValue;
          }
          return getMaxForBaselineChart({
            metricsMaxValue,
            operator: threshold.operator,
            baseline: threshold.baseline,
            sensitivity: threshold.deviationFactor
          });
        }
      }}
      canReload={canReload}
      nonInteractive
    />
  );
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

function enhanceLabels(label, smoothMetric) {
  return [
    `${label}${smoothMetric ? '*' : ''}`,
    t('in-alerting:components.chart.alertingChartLabelThreshold'),
    t('in-alerting:components.chart.alertingChartLabelViolations')
  ];
}

function enhanceNonToggleableSeries(metricName, tooltipContent) {
  return new Map([
    ['threshold', null],
    ['alerts', null],
    ['Violations', null]
  ]).set(metricName, tooltipContent);
}

function getSmoothedMetricTooltipContent(isSmoothedMetric) {
  return isSmoothedMetric ? [t('in-alerting:components.chart.alertingChartTooltipSmoothedMetric')] : null;
}

function getMaxForBaselineChart({ metricsMaxValue, operator, baseline, sensitivity }) {
  const opSign = isGreaterOperator(operator) ? 1 : -1;
  const overallMaxValue = (baseline || [])
    .map(v => v[1] + opSign * v[2] * sensitivity)
    .reduce((a, b) => (a > b ? a : b), metricsMaxValue);
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
  enrichedTagFilterExpression: PropTypes.object
};
