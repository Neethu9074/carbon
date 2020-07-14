import React from 'react';

import {
  legendColors,
  getSmoothedMetricTooltipContent,
  enhanceNonToggleableSeries,
  enhaceLabels,
  getMaxSlownessChart,
  smoothMetrics
} from 'in-new-components/Alerting/utils/chartUtil';
import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import { getApplicationIdTagFilter } from 'in-applications/alerting/tagFilterUtils';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { millis } from 'in-services/formatters/number';

export default function getSlownessChartConfig({
  applicationId,
  boundaryScope,
  aggregation,
  viewConfig,
  tagFilters,
  granularity,
  threshold,
  timeThreshold,
  sensitivity,
  alertsPreviewEnabled = false
}) {
  const tagFiltersWithApplicationId = [...tagFilters, getApplicationIdTagFilter({ applicationId, boundaryScope })];
  const metricChartGranularity = Math.max(granularity, viewConfig.minChartMetricGranularity);

  return {
    y1: {
      metricIds: ['latency', 'threshold'],
      excludedLabelsFromTooltip: ['Violations'],
      nonToggleableSeries: enhanceNonToggleableSeries(
        'latency',
        getSmoothedMetricTooltipContent(viewConfig.smoothMetric)
      ),
      labels: enhaceLabels(getMetricLabel('slowness', 'latency'), viewConfig.smoothMetric),
      formatter: millis.forcedFixedCompact,
      renderer: getRenderer({ thresholdType: threshold.type, smoothMetric: viewConfig.smoothMetric }),
      icons: {
        types: [viewConfig.smoothMetric ? 'lib_line_chart' : 'lib_bar_chart', 'lib_threshold', 'lib_actions_stop'],
        colors: legendColors
      },
      thresholdGranularity: granularity,
      lineWidth: 1,
      threshold: threshold.value,
      operator: threshold.operator,
      sensitivity,
      baseline: threshold.baseline,
      getMax: metricsMaxValue => getMaxSlownessChart({ metricsMaxValue, baseline: threshold.baseline, sensitivity })
    },
    config: {
      thresholdType: threshold.type,
      mutateMetrics: {
        doMutate: viewConfig.smoothMetric,
        metricNames: ['latency'],
        mutate: smoothMetrics
      },
      timeConfig: viewConfig.timeConfig,
      granularity: metricChartGranularity,
      getMetric: getApplicationMetrics,
      metricsConfiguration: {
        timeConfig: viewConfig.timeConfig,
        tagFilters: tagFiltersWithApplicationId,
        metrics: {
          latency: {
            metric: 'latency',
            granularity: metricChartGranularity,
            aggregation
          }
        }
      },
      renderPreChartContent: props => {
        if (!alertsPreviewEnabled) return;

        const alertsPreviewConfiguration = getAlertsPreviewConfiguration({
          timeConfig: viewConfig.timeConfig,
          tagFilters: tagFiltersWithApplicationId,
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

function getRenderer({ thresholdType, smoothMetric }) {
  if (thresholdType === 'staticThreshold') {
    return smoothMetric ? Renderer.lineWithThreshold : Renderer.barWithThreshold;
  } else {
    return smoothMetric ? Renderer.lineWithBaseline : Renderer.barWithBaseline;
  }
}

function getAlertsPreviewConfiguration({ timeConfig, tagFilters, aggregation, granularity, threshold, timeThreshold }) {
  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters,
      timeThreshold,
      threshold,
      granularity, // to request clustered alert preview results
      metrics: {
        alerts: {
          metric: 'latency',
          aggregation,
          granularity
        }
      }
    };
  }

  return null;
}
