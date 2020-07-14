import React from 'react';

import {
  getSmoothedMetricTooltipContent,
  legendColors,
  smoothMetrics,
  enhanceNonToggleableSeries,
  enhaceLabels
} from 'in-new-components/Alerting/utils/chartUtil';
import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import { getApplicationIdTagFilter } from 'in-applications/alerting/tagFilterUtils';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { percentage } from 'in-services/formatters/number';

export default function getErrorRateChartConfig({
  viewConfig,
  granularity,
  threshold,
  tagFilters,
  applicationId,
  boundaryScope,
  timeThreshold,
  alertsPreviewEnabled = false
}) {
  const tagFiltersWithApplicationId = [...tagFilters, getApplicationIdTagFilter({ applicationId, boundaryScope })];
  const metricChartGranularity = Math.max(granularity, viewConfig.minChartMetricGranularity);

  return {
    y1: {
      metricIds: ['errors', 'threshold'],
      excludedLabelsFromTooltip: ['Violations'],
      nonToggleableSeries: enhanceNonToggleableSeries(
        'errors',
        getSmoothedMetricTooltipContent(viewConfig.smoothMetric)
      ),
      labels: enhaceLabels(getMetricLabel('errorRate', 'errors'), viewConfig.smoothMetric),
      formatter: percentage.detailed,
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
        metricNames: ['errors'],
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

function getMetricConfiguration({ tagFilters, timeConfig, granularity }) {
  return {
    timeConfig,
    tagFilters,
    metrics: {
      errors: {
        metric: 'errors',
        granularity: granularity,
        aggregation: 'MEAN'
      }
    }
  };
}

function getAlertsPreviewConfiguration({ timeConfig, tagFilters, granularity, threshold, timeThreshold }) {
  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters: tagFilters,
      timeThreshold,
      threshold,
      granularity, // to request clustered alert preview results
      metrics: {
        alerts: {
          metric: 'errors',
          aggregation: 'MEAN',
          granularity
        }
      }
    };
  }

  return null;
}
