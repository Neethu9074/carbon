import React from 'react';

import {
  enhanceNonToggleableSeries,
  getSmoothedMetricTooltipContent,
  enhaceLabels,
  legendColors,
  smoothMetrics
} from 'in-new-components/Alerting/utils/chartUtil';
import getWebsiteRateMetricAlertsPreview from '../subscriptions/getWebsiteRateMetricAlertsPreview';
import getWebsiteMetricAlertsPreview from '../subscriptions/getWebsiteMetricAlertsPreview';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import getWebsiteRateMetric from '../subscriptions/getWebsiteRateMetric';
import getWebsiteMetrics from '../../subscriptions/getWebsiteMetrics';
import { number, percentage } from 'in-services/formatters/number';
import { statusCodeCount, statusCodeRate } from '../constants';
import { getWebsiteIdTagFilter } from './chartConfigUtil';
import { getMetricLabel } from '../form/ruleFormData';

export default function getStatusCodeChartConfig({
  metricName,
  viewConfig,
  threshold,
  granularity,
  numeratorFilter,
  timeThreshold,
  tagFilters,
  websiteId,
  alertsPreviewEnabled = false
}) {
  const metricChartGranularity = Math.max(granularity, viewConfig.minChartMetricGranularity);
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];

  return {
    y1: {
      metricIds: ['statusCode', 'threshold'],
      excludedLabelsFromTooltip: ['Violations'],
      nonToggleableSeries: enhanceNonToggleableSeries(
        'statusCode',
        getSmoothedMetricTooltipContent(viewConfig.smoothMetric)
      ),
      labels: enhaceLabels(getMetricLabel('statusCode', metricName), viewConfig.smoothMetric),
      formatter: metricName === statusCodeCount ? number.forcedCompact : percentage.detailed,
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
          ? Math.max(
              metricsMaxValue,
              (metricName === statusCodeCount ? Math.trunc(threshold.value) : threshold.value) * 1.2
            )
          : metricsMaxValue;
      }
    },
    config: {
      timeConfig: viewConfig.timeConfig,
      granularity: metricChartGranularity,
      thresholdType: threshold.type,
      getMetric: metricConfig => getMetric(metricName, metricConfig),
      mutateMetrics: {
        doMutate: viewConfig.smoothMetric,
        metricNames: ['statusCode'],
        mutate: smoothMetrics
      },
      metricsConfiguration: getMetricConfiguration({
        metric: metricName,
        tagFilters: tagFiltersWithWebsiteId,
        numeratorFilter,
        timeConfig: viewConfig.timeConfig,
        granularity: metricChartGranularity
      }),
      renderPreChartContent: props => {
        if (!alertsPreviewEnabled) return;

        const alertsPreviewConfiguration = getAlertsPreviewConfiguration({
          timeConfig: viewConfig.timeConfig,
          tagFilters: tagFiltersWithWebsiteId,
          metric: metricName,
          granularity,
          numeratorFilter,
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
  if (metricName === 'specificStatusCodeRate') {
    return getWebsiteRateMetric(metricConfig);
  }
  return getWebsiteMetrics(metricConfig);
}

function getMetricConfiguration({ metric, numeratorFilter, tagFilters, timeConfig, granularity }) {
  return {
    timeConfig,
    tagFilters: metric === statusCodeCount ? [...tagFilters, numeratorFilter] : tagFilters,
    metrics: {
      statusCode: getMetricConfig({ metricName: metric, granularity, numeratorFilter })
    }
  };
}

function getMetricConfig({ metricName, granularity, numeratorFilter = null }) {
  const metricConfigs = {
    ['specificStatusCodeRate']: {
      metric: 'specificStatusCodeRate',
      granularity: granularity,
      aggregation: 'MEAN',
      numeratorFilter
    },
    ['httpxxx']: {
      metric: 'httpxxx',
      granularity: granularity,
      aggregation: 'SUM'
    }
  };
  return metricConfigs[metricName];
}

function getAlertsPreview(metricName) {
  if (metricName === 'specificStatusCodeRate') {
    return getWebsiteRateMetricAlertsPreview;
  }
  return getWebsiteMetricAlertsPreview;
}

function getAlertsPreviewConfiguration({
  timeConfig,
  tagFilters,
  metric,
  granularity,
  numeratorFilter,
  threshold,
  timeThreshold
}) {
  const alertsConfig = {
    metric,
    aggregation: metric === statusCodeCount ? 'SUM' : 'MEAN',
    granularity
  };

  if (metric === statusCodeRate) {
    alertsConfig.numeratorFilter = numeratorFilter;
  }

  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters: metric === statusCodeCount ? [...tagFilters, numeratorFilter] : tagFilters,
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
