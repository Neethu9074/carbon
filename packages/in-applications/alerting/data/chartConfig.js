import React from 'react';

import {
  legendColors,
  getSmoothedMetricTooltipContent,
  enhanceNonToggleableSeries,
  enhaceLabels,
  getMaxForBaselineChart,
  smoothMetrics
} from 'in-new-components/Alerting/utils/chartUtil';
import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import { getEnrichedTagFilters } from 'in-applications/alerting/tagFilterUtils';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { millis } from 'in-services/formatters/number';

export default function getChartConfig({ alertConfig, viewConfig, blueprintConfig, alertsPreviewEnabled = false }) {
  const {
    granularity,
    threshold,
    timeThreshold,
    rule: { alertType }
  } = alertConfig;
  const aggregation = blueprintConfig.aggregation ?? alertConfig.rule.aggregation;
  const isStaticThreshold = threshold.type === 'staticThreshold';
  const enrichedTagFilters = getEnrichedTagFilters(alertConfig);
  const metricChartGranularity = Math.max(granularity, viewConfig.minChartMetricGranularity);
  return {
    y1: {
      metricIds: [blueprintConfig.metric, 'threshold'],
      excludedLabelsFromTooltip: ['Violations'],
      nonToggleableSeries: enhanceNonToggleableSeries(
        blueprintConfig.metric,
        getSmoothedMetricTooltipContent(viewConfig.smoothMetric)
      ),
      labels: enhaceLabels(getMetricLabel(alertType, blueprintConfig.metric), viewConfig.smoothMetric),
      formatter: millis.forcedFixedCompact,
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
    },
    config: {
      thresholdType: threshold.type,
      mutateMetrics: {
        doMutate: viewConfig.smoothMetric,
        metricNames: [blueprintConfig.metric],
        mutate: smoothMetrics
      },
      timeConfig: viewConfig.timeConfig,
      granularity: metricChartGranularity,
      getMetric: getApplicationMetrics,
      metricsConfiguration: {
        timeConfig: viewConfig.timeConfig,
        tagFilters: enrichedTagFilters,
        metrics: {
          [blueprintConfig.metric]: {
            metric: blueprintConfig.metric,
            granularity: metricChartGranularity,
            aggregation
          }
        }
      },
      renderPreChartContent: props => {
        if (!alertsPreviewEnabled) return;

        const alertsPreviewConfiguration = getAlertsPreviewConfiguration({
          timeConfig: viewConfig.timeConfig,
          tagFilters: enrichedTagFilters,
          metric: blueprintConfig.metric,
          aggregation,
          granularity,
          threshold,
          timeThreshold
        });

        return (
          <MarkerLanesPresenter
            {...props}
            getAlertsPreview={getApplicationMetricsAlertPreview}
            alertsPreviewConfiguration={alertsPreviewConfiguration}
            isClustered
          >
            <SmartAlertMarkerLane />
          </MarkerLanesPresenter>
        );
      }
    }
  };
}

function getRenderer(isStaticThreshold, smoothMetric) {
  if (isStaticThreshold) {
    return smoothMetric ? Renderer.lineWithThreshold : Renderer.barWithThreshold;
  } else {
    return smoothMetric ? Renderer.lineWithBaseline : Renderer.barWithBaseline;
  }
}

function getAlertsPreviewConfiguration({
  timeConfig,
  tagFilters,
  metric,
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
          metric,
          aggregation,
          granularity
        }
      }
    };
  }

  return null;
}
