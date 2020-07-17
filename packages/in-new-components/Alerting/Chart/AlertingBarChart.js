import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import { chartViewConfigPropType } from 'in-new-components/Alerting/Chart/chartViewConfig';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import { smoothMetrics } from 'in-new-components/Alerting/utils/chartUtil';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';

const chartColors = [
  theme.lib.colors.blue800,
  theme.lib.colors.red800,
  theme.lib.colors.lightBlue800,
  theme.lib.colors.pink800
];

const legendColors = [theme.lib.colors.blue800, theme.lib.colors.red800, theme.lib.colors.pink800_40];

export default function AlertingBarChart({
  alertConfig,
  viewConfig,
  blueprintConfig,
  alertsPreviewEnabled = false,
  canReload = false
}) {
  const { granularity, threshold, timeThreshold } = alertConfig;
  const aggregation = blueprintConfig.getAggregation(alertConfig.rule);
  const metricName = blueprintConfig.getMetricName(alertConfig.rule);
  const metricLabel = blueprintConfig.getMetricLabel(metricName);
  const isStaticThreshold = threshold.type === 'staticThreshold';
  const ruleTagFilters = blueprintConfig.getRuleTagFilters(alertConfig.rule);

  let numeratorFilter;
  let enrichedTagFilters;
  if (blueprintConfig.isCustomRateMetric(metricName)) {
    // at the moment, we only support a single numerator filter. All such blueprints have
    // a single rule-specific tag-filter only
    numeratorFilter = ruleTagFilters[0];
    enrichedTagFilters = [...alertConfig.tagFilters, blueprintConfig.getEntityTagFilter(alertConfig)];
  } else {
    enrichedTagFilters = [
      ...alertConfig.tagFilters,
      ...ruleTagFilters,
      blueprintConfig.getEntityTagFilter(alertConfig)
    ];
  }

  const metricChartGranularity = Math.max(granularity, viewConfig.minChartMetricGranularity);

  return (
    <AlertingBarChartWrapper
      renderPreChartContent={props => {
        if (!alertsPreviewEnabled) return;

        return (
          <MarkerLanesPresenter
            {...props}
            getAlertsPreview={blueprintConfig.getAlertsPreviewRequest(metricName)}
            alertsPreviewConfiguration={getAlertsPreviewQuery({
              timeConfig: viewConfig.timeConfig,
              tagFilters: enrichedTagFilters,
              numeratorFilter,
              metricName,
              aggregation,
              granularity,
              threshold,
              timeThreshold
            })}
          >
            <SmartAlertMarkerLane />
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
        tagFilters: enrichedTagFilters,
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
        formatter: blueprintConfig.getMetricFormat(metricName),
        renderer: getRenderer(isStaticThreshold, viewConfig.smoothMetric),
        icons: {
          types: [viewConfig.smoothMetric ? 'lib_line_chart' : 'lib_bar_chart', 'lib_threshold', 'lib_actions_stop'],
          colors: legendColors
        },
        thresholdGranularity: granularity,
        lineWidth: 1,
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

function getRenderer(isStaticThreshold, smoothMetric) {
  if (isStaticThreshold) {
    return smoothMetric ? Renderer.lineWithThreshold : Renderer.barWithThreshold;
  } else {
    return smoothMetric ? Renderer.lineWithBaseline : Renderer.barWithBaseline;
  }
}

function getAlertsPreviewQuery({
  timeConfig,
  tagFilters,
  metricName,
  numeratorFilter,
  aggregation,
  granularity,
  threshold,
  timeThreshold
}) {
  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters,
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
  return new Map([['threshold', null], ['alerts', null], ['Violations', null]]).set(metricName, tooltipContent);
}

function getSmoothedMetricTooltipContent(isSmoothedMetric) {
  return isSmoothedMetric ? ['Smoothed metric'] : null;
}

function getMaxForBaselineChart({ metricsMaxValue, baseline, sensitivity }) {
  let maxBaselineVal = 0;
  if (baseline) {
    for (let i = 0; i < baseline.length; ++i) {
      const currentBaseline = baseline[i][1] + baseline[i][2] * sensitivity;
      if (currentBaseline > maxBaselineVal) maxBaselineVal = currentBaseline;
    }
  }
  const overallMaxValue = (baseline || [])
    .map(v => v[1] + v[2] * sensitivity)
    .reduce((a, b) => (a > b ? a : b), metricsMaxValue);
  return overallMaxValue * 1.1;
}

AlertingBarChart.propTypes = {
  viewConfig: chartViewConfigPropType.isRequired,
  alertConfig: PropTypes.object.isRequired,
  blueprintConfig: PropTypes.object.isRequired,
  alertsPreviewEnabled: PropTypes.bool,
  canReload: PropTypes.bool
};
