import React from 'react';

import {
  getSmoothedMetricTooltipContent,
  legendColors,
  smoothMetrics,
  enhanceNonToggleableSeries,
  enhaceLabels
} from 'in-new-components/Alerting/utils/chartUtil';
import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import { getApplicationIdTagFilter, getStatusCodeTagFilter } from 'in-applications/alerting/tagFilterUtils';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { number } from 'in-services/formatters/number';

export default function getStatusCodeChartConfig({
  viewConfig,
  granularity,
  threshold,
  tagFilters,
  applicationId,
  boundaryScope,
  timeThreshold,
  statusCodeStart,
  statusCodeEnd,
  alertsPreviewEnabled = false
}) {
  const tagFiltersWithApplicationId = [
    ...tagFilters,
    getApplicationIdTagFilter({ applicationId, boundaryScope }),
    ...getStatusCodeTagFilter(statusCodeStart, statusCodeEnd)
  ];
  const metricChartGranularity = Math.max(granularity, viewConfig.minChartMetricGranularity);

  return {
    y1: {
      metricIds: ['statusCode', 'threshold'],
      excludedLabelsFromTooltip: ['Violations'],
      nonToggleableSeries: enhanceNonToggleableSeries(
        'statusCode',
        getSmoothedMetricTooltipContent(viewConfig.smoothMetric)
      ),
      labels: enhaceLabels(getMetricLabel('statusCode', 'calls'), viewConfig.smoothMetric),
      formatter: number.forcedCompact,
      renderer: viewConfig.smoothMetric ? Renderer.lineWithThreshold : Renderer.barWithThreshold,
      icons: {
        types: ['lib_bar_chart', 'lib_threshold', 'lib_actions_stop'],
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
        metricNames: ['statusCode'],
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
      statusCode: {
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
      granularity,
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
