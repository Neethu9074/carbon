import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import AlertsPreviewLane from 'in-components/Chart/markerLanes/AlertsPreviewLane/AlertsPreviewLane';
import { chartViewConfigPropType } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { switchQB1orQB2Helper } from 'in-new-components/Alerting/components/WithQB1orQB2';
import AlertingChartWrapper from 'in-new-components/Alerting/Chart/AlertingChartWrapper';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { isGreaterOperator } from 'in-new-components/Alerting/utils/alertUtils';
import { smoothMetrics } from 'in-new-components/Alerting/utils/chartUtil';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';

const chartColors = [
  theme.lib.colors.blue800,
  theme.lib.colors.red800,
  theme.lib.colors.lightBlue800,
  theme.lib.colors.pink800
];

const legendColors = [theme.lib.colors.blue800, theme.lib.colors.red800, theme.lib.colors.pink800_40];

export default function AlertingChart({
  alertConfig,
  viewConfig,
  blueprintConfig,
  alertsPreviewEnabled,
  numeratorFilter,
  enrichedTagFilters,
  enrichedTagFilterExpression,
  canReload
}) {
  const { granularity, threshold, timeThreshold, convertedTagFilterExpression } = alertConfig;

  const metricName = blueprintConfig.getMetricName(alertConfig.rule);
  const metricChartGranularity = Math.max(granularity, viewConfig.minChartMetricGranularity);
  const formatter = blueprintConfig.getMetricFormat(metricName);

  const aggregation = blueprintConfig.getAggregation(alertConfig.rule);
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
              timeConfig: viewConfig.timeConfig,
              ...switchQB1orQB2Helper(
                () => ({ tagFilters: enrichedTagFilters }),
                () => ({
                  tagFilterExpression: enrichedTagFilterExpression
                }),
                isQB2Config => isQB2Config(convertedTagFilterExpression)
              ),
              numeratorFilter,
              metricName,
              aggregation,
              granularity,
              threshold,
              timeThreshold,
              convertedTagFilterExpression
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
        timeConfig: viewConfig.timeConfig,
        ...switchQB1orQB2Helper(
          () => ({ tagFilters: enrichedTagFilters }),
          () => ({
            tagFilterExpression: enrichedTagFilterExpression
          }),
          isQB2Config => isQB2Config(convertedTagFilterExpression)
        ),
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
      convertedTagFilterExpression={convertedTagFilterExpression}
      canReload={canReload}
      nonInteractive
    />
  );
}

function getAlertsPreviewQuery({
  timeConfig,
  tagFilters,
  tagFilterExpression,
  metricName,
  numeratorFilter,
  aggregation,
  granularity,
  threshold,
  timeThreshold,
  convertedTagFilterExpression //QB2
}) {
  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      ...switchQB1orQB2Helper(
        () => ({ tagFilters }),
        () => ({ tagFilterExpression }),
        isQB2Config => isQB2Config(convertedTagFilterExpression)
      ),
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
  return [`${label}${smoothMetric ? '*' : ''}`, 'Threshold', 'Violations'];
}

function enhanceNonToggleableSeries(metricName, tooltipContent) {
  return new Map([
    ['threshold', null],
    ['alerts', null],
    ['Violations', null]
  ]).set(metricName, tooltipContent);
}

function getSmoothedMetricTooltipContent(isSmoothedMetric) {
  return isSmoothedMetric ? ['Smoothed metric'] : null;
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
  alertConfig: PropTypes.object.isRequired,
  blueprintConfig: PropTypes.object.isRequired,
  alertsPreviewEnabled: PropTypes.bool,
  canReload: PropTypes.bool,
  numeratorFilter: PropTypes.object,
  enrichedTagFilters: PropTypes.array,
  enrichedTagFilterExpression: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};
