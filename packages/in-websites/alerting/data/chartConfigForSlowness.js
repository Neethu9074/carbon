import React from 'react';

import {
  enhanceNonToggleableSeries,
  getSmoothedMetricTooltipContent,
  enhaceLabels,
  legendColors,
  smoothMetrics,
  getMaxForBaselineChart
} from 'in-new-components/Alerting/utils/chartUtil';
import getWebsiteMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteMetricAlertsPreview';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import { getWebsiteIdTagFilter } from 'in-websites/alerting/data/chartConfigUtil';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-websites/alerting/form/ruleFormData';
import { millis } from 'in-services/formatters/number';

export default function getSlownessChartConfig({
  timeThreshold,
  threshold,
  sensitivity,
  granularity,
  viewConfig,
  aggregation,
  tagFilters,
  websiteId,
  alertsPreviewEnabled = false
}) {
  const enancedTagfilters = [getWebsiteIdTagFilter(websiteId), ...tagFilters];
  const metricChartGranularity = Math.max(granularity, viewConfig.minChartMetricGranularity);

  return {
    y1: {
      metricIds: ['onLoadTime', 'threshold'],
      excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
      nonToggleableSeries: enhanceNonToggleableSeries(
        'errors',
        getSmoothedMetricTooltipContent(viewConfig.smoothMetric)
      ),
      labels: enhaceLabels(getMetricLabel('slowness', 'onLoadTime'), viewConfig.smoothMetric),
      formatter: millis.forcedFixedCompact,
      renderer: getSlownessChartRenderer(threshold.type, viewConfig.smoothMetric),
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
      getMax: metricsMaxValue => getMaxForBaselineChart({ metricsMaxValue, baseline: threshold.baseline, sensitivity })
    },
    config: {
      thresholdType: threshold.type,
      mutateMetrics: {
        doMutate: viewConfig.smoothMetric,
        metricNames: ['onLoadTime'],
        mutate: smoothMetrics
      },
      timeConfig: viewConfig.timeConfig,
      granularity: metricChartGranularity,
      getMetric: getWebsiteMetrics,
      metricsConfiguration: {
        timeConfig: viewConfig.timeConfig,
        tagFilters: enancedTagfilters,
        metrics: {
          onLoadTime: {
            metric: 'onLoadTime',
            granularity: metricChartGranularity,
            aggregation
          }
        }
      },
      renderPreChartContent: props => {
        if (!alertsPreviewEnabled) return;
        const alertsPreviewConfiguration = getAlertsPreviewConfiguration({
          timeConfig: viewConfig.timeConfig,
          tagFilters: enancedTagfilters,
          aggregation,
          granularity,
          threshold,
          timeThreshold
        });
        return (
          <MarkerLanesPresenter
            {...props}
            alertsPreviewConfiguration={alertsPreviewConfiguration}
            getAlertsPreview={getWebsiteMetricAlertsPreview}
            isClustered
          >
            <SmartAlertMarkerLane />
          </MarkerLanesPresenter>
        );
      }
    }
  };
}

function getSlownessChartRenderer(thresholdType, smoothMetric) {
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
          metric: 'onLoadTime',
          aggregation,
          granularity
        }
      }
    };
  } else {
    return null;
  }
}
