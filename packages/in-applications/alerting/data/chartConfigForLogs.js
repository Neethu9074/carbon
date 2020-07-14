import React from 'react';

import {
  getSmoothedMetricTooltipContent,
  legendColors,
  smoothMetrics,
  enhanceNonToggleableSeries,
  enhaceLabels
} from 'in-new-components/Alerting/utils/chartUtil';
import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import { getApplicationIdTagFilter, getLogLevelTagFilters } from 'in-applications/alerting/tagFilterUtils';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { number } from 'in-services/formatters/number';

export default function getLogsChartConfig({
  viewConfig,
  granularity,
  threshold,
  tagFilters,
  applicationId,
  boundaryScope,
  timeThreshold,
  logMessage,
  logMessageOperator,
  logLevel,
  alertsPreviewEnabled = false
}) {
  const tagFiltersWithApplicationId = [
    ...tagFilters,
    ...getRequiredTagFilters({
      applicationId,
      logMessage,
      logMessageOperator,
      logLevel,
      boundaryScope
    })
  ];
  const metricChartGranularity = Math.max(granularity, viewConfig.minChartMetricGranularity);

  return {
    y1: {
      metricIds: ['logs', 'threshold'],
      excludedLabelsFromTooltip: ['Violations'],
      nonToggleableSeries: enhanceNonToggleableSeries('logs', getSmoothedMetricTooltipContent(viewConfig.smoothMetric)),
      labels: enhaceLabels(getMetricLabel('logs', 'calls'), viewConfig.smoothMetric),
      formatter: number.forcedCompact,
      renderer: viewConfig.smoothMetric ? Renderer.lineWithThreshold : Renderer.barWithThreshold,
      icons: {
        types: [viewConfig.smoothMetric ? 'lib_line_chart' : 'lib_bar_chart', 'lib_threshold', 'lib_actions_stop'],
        colors: legendColors
      },
      thresholdGranularity: granularity,
      lineWidth: 1,
      threshold: threshold.value,
      operator: threshold.operator,
      getMax: metricsMaxValue => {
        return threshold.value >= metricsMaxValue ? Math.max(metricsMaxValue, threshold.value * 1.2) : metricsMaxValue;
      }
    },
    config: {
      thresholdType: threshold.type,
      mutateMetrics: {
        doMutate: viewConfig.smoothMetric,
        metricNames: ['logs'],
        mutate: smoothMetrics
      },
      timeConfig: viewConfig.timeConfig,
      granularity: metricChartGranularity,
      getMetric: getApplicationMetrics,
      metricsConfiguration: getMetricConfiguration({
        tagFilters: tagFiltersWithApplicationId,
        timeConfig: viewConfig.timeConfig,
        granularity: metricChartGranularity
      }),
      renderPreChartContent: props => {
        if (!alertsPreviewEnabled) return;

        const alertsPreviewConfiguration = getAlertsPreviewConfiguration({
          timeConfig: viewConfig.timeConfig,
          tagFilters: tagFiltersWithApplicationId,
          granularity,
          threshold,
          timeThreshold
        });

        return (
          alertsPreviewConfiguration && (
            <MarkerLanesPresenter
              {...props}
              getAlertsPreview={getApplicationMetricsAlertPreview}
              alertsPreviewConfiguration={alertsPreviewConfiguration}
              isClustered
            >
              <SmartAlertMarkerLane />
            </MarkerLanesPresenter>
          )
        );
      }
    }
  };
}

function getRequiredTagFilters({ applicationId, logMessage, logMessageOperator, logLevel, boundaryScope }) {
  return [
    getApplicationIdTagFilter({ applicationId, boundaryScope }),
    ...getLogLevelTagFilters(logMessage, logMessageOperator, logLevel)
  ];
}

function getMetricConfiguration({ tagFilters, timeConfig, granularity }) {
  return {
    timeConfig,
    tagFilters,
    metrics: {
      logs: {
        metric: 'calls',
        granularity: granularity,
        aggregation: 'SUM'
      }
    }
  };
}

function getAlertsPreviewConfiguration({ timeConfig, tagFilters, granularity, threshold, timeThreshold }) {
  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters,
      timeThreshold,
      threshold,
      granularity, // to request clustered alert preview results
      metrics: {
        alerts: {
          metric: 'calls',
          aggregation: 'SUM',
          granularity
        }
      }
    };
  }

  return null;
}
