import PropTypes from 'prop-types';
import React from 'react';

import {
  chartColors,
  legendColors,
  smoothMetrics,
  getSmoothedMetricTooltipContent
} from 'in-new-components/Alerting/utils/chartUtil';
import getWebsiteRateMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteRateMetricAlertsPreview';
import getWebsiteMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteMetricAlertsPreview';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import getWebsiteRateMetric from 'in-websites/alerting/subscriptions/getWebsiteRateMetric';
import { chartViewConfigPropType } from 'in-new-components/Alerting/Chart/chartViewConfig';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-websites/alerting/form/ruleFormData';
import { alertTypes } from 'in-websites/alerting/data/blueprintConfig';
import { errorCount, errorRate } from 'in-websites/alerting/constants';
import { percentage, number } from 'in-services/formatters/number';

export default function JsErrorsAlertingBarChart({
  websiteId,
  viewConfig,
  tagFilters,
  errorFilter,
  metricName,
  granularity,
  threshold,
  timeThreshold,
  alertsPreviewEnabled,
  canReload
}) {
  const thresholdValue = threshold.value;
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  const { timeConfig, minChartMetricGranularity, smoothMetric } = viewConfig;

  const metricChartGranularity = Math.max(granularity, minChartMetricGranularity);

  return (
    <AlertingBarChartWrapper
      renderPreChartContent={props => {
        if (!alertsPreviewEnabled) return;
        const alertsPreviewConfiguration = getAlertsPreviewConfiguration(
          timeConfig,
          tagFiltersWithWebsiteId,
          metricName,
          granularity,
          errorFilter,
          threshold,
          timeThreshold
        );
        return (
          alertsPreviewConfiguration && (
            <MarkerLanesPresenter
              {...props}
              getAlertsPreview={getAlertsPreview(metricName)}
              alertsPreviewConfiguration={alertsPreviewConfiguration}
              isClustered
            >
              <SmartAlertMarkerLane />
            </MarkerLanesPresenter>
          )
        );
      }}
      timeConfig={timeConfig}
      granularity={metricChartGranularity}
      canReload={canReload}
      y1={{
        threshold: thresholdValue,
        operator: threshold.operator,
        thresholdGranularity: granularity,
        getMax: metricsMaxValue => {
          return thresholdValue >= metricsMaxValue
            ? Math.max(metricsMaxValue, (metricName === errorCount ? Math.trunc(thresholdValue) : thresholdValue) * 1.2)
            : metricsMaxValue;
        },
        colors: chartColors,
        icons: {
          types: [smoothMetric ? 'lib_line_chart' : 'lib_bar_chart', 'lib_threshold', 'lib_actions_stop'],
          colors: legendColors
        },
        renderer: smoothMetric ? Renderer.lineWithThreshold : Renderer.barWithThreshold,
        formatter: metricName === errorCount ? number.forcedCompact : percentage.detailed,
        labels: [
          `${getMetricLabel(alertTypes.specificJsError, metricName)}${smoothMetric ? '*' : ''}`,
          'Threshold',
          'Violations'
        ],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        metricIds: ['errors', 'threshold'],
        nonToggleableSeries: new Map([
          ['errors', getSmoothedMetricTooltipContent(smoothMetric)],
          ['threshold', null],
          ['alerts', null],
          ['Violations', null]
        ])
      }}
      getMetric={metricConfig => getMetric(metricName, metricConfig)}
      metricsConfiguration={getMetricConfiguration(
        websiteId,
        metricName,
        errorFilter,
        tagFiltersWithWebsiteId,
        timeConfig,
        metricChartGranularity
      )}
      thresholdType={threshold.type}
      mutateMetrics={{
        doMutate: smoothMetric,
        metricNames: ['errors'],
        mutate: smoothMetrics
      }}
    />
  );
}

JsErrorsAlertingBarChart.propTypes = {
  errorFilter: PropTypes.object.isRequired,
  threshold: PropTypes.object.isRequired,
  timeThreshold: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  metricName: PropTypes.string.isRequired,
  tagFilters: PropTypes.array.isRequired,
  viewConfig: chartViewConfigPropType.isRequired,
  websiteId: PropTypes.string.isRequired,
  alertsPreviewEnabled: PropTypes.bool,
  canReload: PropTypes.bool
};

function getMetric(metricName, metricConfig) {
  if (metricName === errorRate) {
    return getWebsiteRateMetric(metricConfig);
  }
  return getWebsiteMetrics(metricConfig);
}

function getAlertsPreview(metricName) {
  if (metricName === errorRate) {
    return getWebsiteRateMetricAlertsPreview;
  }
  return getWebsiteMetricAlertsPreview;
}

function getMetricConfiguration(websiteId, metric, errorFilter, tagFilters, timeConfig, granularity) {
  return {
    timeConfig,
    tagFilters: metric === errorCount ? [...tagFilters, errorFilter] : tagFilters,
    metrics: {
      errors: getMetricConfig(metric, granularity, errorFilter)
    }
  };
}

function getMetricConfig(metricName, granularity, errorFilter = null) {
  const metricConfigs = {
    [errorRate]: {
      metric: errorRate,
      granularity: granularity,
      aggregation: 'MEAN',
      numeratorFilter: errorFilter
    },
    [errorCount]: {
      metric: errorCount,
      granularity: granularity,
      aggregation: 'SUM'
    }
  };
  return metricConfigs[metricName];
}

function getWebsiteIdTagFilter(websiteId) {
  return {
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: websiteId
  };
}

function getAlertsPreviewConfiguration(
  timeConfig,
  tagFilters,
  metric,
  granularity,
  errorFilter,
  threshold,
  timeThreshold
) {
  const alertsConfig = {
    metric,
    aggregation: metric === errorCount ? 'SUM' : 'MEAN',
    granularity
  };

  if (metric === errorRate) {
    alertsConfig.numeratorFilter = errorFilter;
  }

  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters: metric === errorCount ? [...tagFilters, errorFilter] : tagFilters,
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
