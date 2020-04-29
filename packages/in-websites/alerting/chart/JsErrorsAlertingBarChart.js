import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import getWebsiteRateMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteRateMetricAlertsPreview';
import getWebsiteMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteMetricAlertsPreview';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import { alertingMetricsGranularity } from 'in-new-components/Alerting/utils/timeConfigUtils';
import getWebsiteRateMetric from 'in-websites/alerting/subscriptions/getWebsiteRateMetric';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-websites/alerting/form/ruleFormData';
import { alertTypes } from 'in-websites/alerting/data/blueprintConfig';
import { errorCount, errorRate } from 'in-websites/alerting/constants';
import { percentage, number } from 'in-services/formatters/number';

export default function JsErrorsAlertingBarChart({
  websiteId,
  timeConfig,
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
  return (
    <AlertingBarChartWrapper
      alignLegendToLeftSideOfChart
      releaseMarkersDisabled
      timeConfig={timeConfig}
      granularity={granularity}
      canReload={canReload}
      y1={{
        threshold: thresholdValue,
        operator: threshold.operator,
        getMax: metricsMaxValue => {
          return thresholdValue >= metricsMaxValue
            ? Math.max(metricsMaxValue, (metricName === errorCount ? Math.trunc(thresholdValue) : thresholdValue) * 1.2)
            : metricsMaxValue;
        },
        colors: [
          theme.lib.colors.blue800,
          theme.lib.colors.red800,
          theme.lib.colors.lightBlue800,
          theme.lib.colors.pink800
        ],
        icons: {
          types: ['lib_bar_chart', 'lib_threshold', 'lib_actions_stop', 'lib_actions_stop'],
          colors: [
            theme.lib.colors.blue800,
            theme.lib.colors.red800,
            theme.lib.colors.lightBlue800,
            theme.lib.colors.pink800
          ]
        },
        renderer: Renderer.barWithThreshold,
        formatter: metricName === errorCount ? number.forcedCompact : percentage.detailed,
        labels: [getMetricLabel(alertTypes.specificJsError, metricName), 'Threshold', 'Expected Range', 'Violations'],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        metricIds: ['errors', 'threshold'],
        nonToggleableSeries: new Map([
          ['errors', null],
          ['threshold', null],
          ['alerts', null],
          ['Expected Range', null],
          ['Violations', null]
        ])
      }}
      getMetric={metricConfig => getMetric(metricName, metricConfig)}
      getAlertsPreview={metricConfig => getAlertsPreview(metricName, metricConfig)}
      metricsConfiguration={getMetricConfiguration(
        websiteId,
        metricName,
        errorFilter,
        tagFiltersWithWebsiteId,
        timeConfig,
        granularity
      )}
      alertMetricConfiguration={getAlertsConfiguration(
        timeConfig,
        tagFiltersWithWebsiteId,
        metricName,
        granularity,
        errorFilter,
        threshold,
        timeThreshold
      )}
      thresholdType={threshold.type}
      alertsPreviewEnabled={alertsPreviewEnabled}
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
  timeConfig: PropTypes.object.isRequired,
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

function getAlertsPreview(metricName, metricConfig) {
  if (metricName === errorRate) {
    return getWebsiteRateMetricAlertsPreview(metricConfig);
  }
  return getWebsiteMetricAlertsPreview(metricConfig);
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

function getAlertsConfiguration(timeConfig, tagFilters, metric, granularity, errorFilter, threshold, timeThreshold) {
  const alertsConfig = {
    metric,
    aggregation: metric === errorCount ? 'SUM' : 'MEAN',
    granularity: alertingMetricsGranularity // global metric granularity
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
      granularity, // local alerts/chart granularity
      metrics: {
        alerts: alertsConfig
      }
    };
  } else {
    return null;
  }
}
