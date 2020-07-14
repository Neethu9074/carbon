import React from 'react';

import {
  enhanceNonToggleableSeries,
  getSmoothedMetricTooltipContent,
  enhaceLabels,
  legendColors,
  smoothMetrics
} from 'in-new-components/Alerting/utils/chartUtil';
import getWebsiteRateMetricAlertsPreview from '../subscriptions/getWebsiteRateMetricAlertsPreview';
import getWebsiteRateMetric from 'in-websites/alerting/subscriptions/getWebsiteRateMetric';
import getWebsiteMetricAlertsPreview from '../subscriptions/getWebsiteMetricAlertsPreview';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import { getWebsiteIdTagFilter } from 'in-websites/alerting/data/chartConfigUtil';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-websites/alerting/form/ruleFormData';
import { number, percentage } from 'in-services/formatters/number';
import { errorRate, errorCount } from '../constants';

export default function getJsErrorsChartConfig({
  metricName,
  viewConfig,
  threshold,
  granularity,
  tagFilters,
  websiteId,
  errorFilter,
  timeThreshold,
  alertsPreviewEnabled = false
}) {
  const metricChartGranularity = Math.max(granularity, viewConfig.minChartMetricGranularity);
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];

  return {
    y1: {
      metricIds: ['errors', 'threshold'],
      excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
      nonToggleableSeries: enhanceNonToggleableSeries(
        'errors',
        getSmoothedMetricTooltipContent(viewConfig.smoothMetric)
      ),
      labels: enhaceLabels(getMetricLabel('specificJsError', metricName), viewConfig.smoothMetric),
      formatter: metricName === 'errors' ? number.forcedCompact : percentage.detailed,
      renderer: viewConfig.smoothMetric ? Renderer.lineWithThreshold : Renderer.barWithThreshold,
      icons: {
        types: [viewConfig.smoothMetric ? 'lib_line_chart' : 'lib_bar_chart', 'lib_threshold', 'lib_actions_stop'],
        colors: legendColors
      },
      threshold: threshold.value,
      operator: threshold.operator,
      thresholdGranularity: granularity,
      getMax: metricsMaxValue => {
        return threshold.value >= metricsMaxValue
          ? Math.max(metricsMaxValue, (metricName === 'errors' ? Math.trunc(threshold.value) : threshold.value) * 1.2)
          : metricsMaxValue;
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
      getMetric: metricConfig => getMetric(metricName, metricConfig),
      metricsConfiguration: getMetricConfiguration({
        metricName,
        errorFilter,
        tagFilters: tagFiltersWithWebsiteId,
        timeConfig: viewConfig.timeConfig,
        granularity: metricChartGranularity
      }),
      renderPreChartContent: props => {
        if (!alertsPreviewEnabled) return;
        const alertsPreviewConfiguration = getAlertsPreviewConfiguration({
          timeConfig: viewConfig.timeConfig,
          tagFilters: tagFiltersWithWebsiteId,
          metricName,
          granularity,
          errorFilter,
          threshold,
          timeThreshold
        });
        return (
          <MarkerLanesPresenter
            {...props}
            getAlertsPreview={getAlertsPreview(metricName)}
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

function getMetric(metricName, metricConfig) {
  if (metricName === 'specificJsErrorRate') {
    return getWebsiteRateMetric(metricConfig);
  }
  return getWebsiteMetrics(metricConfig);
}

function getMetricConfiguration({ metricName, errorFilter, tagFilters, timeConfig, granularity }) {
  return {
    timeConfig,
    tagFilters: metricName === 'errors' ? [...tagFilters, errorFilter] : tagFilters,
    metrics: {
      errors: getMetricConfig({ metricName, granularity, errorFilter })
    }
  };
}

function getMetricConfig({ metricName, granularity, errorFilter = null }) {
  const metricConfigs = {
    ['specificJsErrorRate']: {
      metric: 'specificJsErrorRate',
      granularity: granularity,
      aggregation: 'MEAN',
      numeratorFilter: errorFilter
    },
    ['errors']: {
      metric: 'errors',
      granularity: granularity,
      aggregation: 'SUM'
    }
  };
  return metricConfigs[metricName];
}

function getAlertsPreview(metricName) {
  if (metricName === errorRate) {
    return getWebsiteRateMetricAlertsPreview;
  }
  return getWebsiteMetricAlertsPreview;
}

function getAlertsPreviewConfiguration({
  timeConfig,
  tagFilters,
  metricName,
  granularity,
  errorFilter,
  threshold,
  timeThreshold
}) {
  const alertsConfig = {
    metric: metricName,
    aggregation: metricName === errorCount ? 'SUM' : 'MEAN',
    granularity
  };

  if (metricName === errorRate) {
    alertsConfig.numeratorFilter = errorFilter;
  }

  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters: metricName === errorCount ? [...tagFilters, errorFilter] : tagFilters,
      timeThreshold,
      threshold,
      granularity, // to request clustered alert preview results
      metrics: {
        alerts: alertsConfig
      }
    };
  } else {
    return null;
  }
}
