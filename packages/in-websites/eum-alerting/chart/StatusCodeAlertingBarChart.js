import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import getWebsiteRateMetricAlertsPreview from 'in-websites/eum-alerting/subscriptions/getWebsiteRateMetricAlertsPreview';
import getWebsiteMetricAlertsPreview from 'in-websites/eum-alerting/subscriptions/getWebsiteMetricAlertsPreview';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import getWebsiteRateMetric from 'in-websites/eum-alerting/subscriptions/getWebsiteRateMetric';
import { getMetricLabel } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { statusCodeCount, statusCodeRate } from 'in-websites/eum-alerting/constants';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { percentage, number } from 'in-services/formatters/number';

export default function StatusCodeAlertingBarChart({
  websiteId,
  timeConfig,
  tagFilters,
  numeratorFilter,
  metricName,
  granularity,
  threshold,
  timeThreshold,
  alertsPreviewEnabled
}) {
  const thresholdValue = threshold.value;
  return (
    <AlertingBarChartWrapper
      alignLegendToLeftSideOfChart
      releaseMarkersDisabled
      timeConfig={timeConfig}
      granularity={granularity}
      y1={{
        threshold: thresholdValue,
        operator: threshold.operator,
        getMax: metricsMaxValue => {
          return thresholdValue >= metricsMaxValue
            ? Math.max(
                metricsMaxValue,
                (metricName === statusCodeCount ? Math.trunc(thresholdValue) : thresholdValue) * 1.2
              )
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
        formatter: metricName === statusCodeCount ? number.forcedCompact : percentage.detailed,
        labels: [
          getMetricLabel(alertTypes.specificStatusCode, metricName),
          'Threshold',
          'Expected Range',
          'Violations'
        ],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        metricIds: ['statusCode', 'threshold'],
        nonToggleableSeries: new Map([['statusCode', null], ['threshold', null]])
      }}
      getMetric={metricConfig => getMetric(metricName, metricConfig)}
      getAlertsPreview={metricConfig => getAlertsPreview(metricName, metricConfig)}
      metricsConfiguration={getMetricConfiguration(
        websiteId,
        metricName,
        numeratorFilter,
        tagFilters,
        timeConfig,
        granularity
      )}
      alertMetricConfiguration={getAlertsConfiguration(
        timeConfig,
        [...tagFilters, getWebsiteIdTagFilter(websiteId)],
        metricName,
        granularity,
        numeratorFilter,
        threshold,
        timeThreshold
      )}
      thresholdType={threshold.type}
      alertsPreviewEnabled={alertsPreviewEnabled}
    />
  );
}

StatusCodeAlertingBarChart.propTypes = {
  websiteId: PropTypes.string.isRequired,
  numeratorFilter: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  metricName: PropTypes.string.isRequired,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.object.isRequired,
  timeThreshold: PropTypes.object.isRequired,
  timeConfig: PropTypes.object.isRequired,
  alertsPreviewEnabled: PropTypes.bool
};

function getMetric(metricName, metricConfig) {
  if (metricName === statusCodeRate) {
    return getWebsiteRateMetric(metricConfig);
  }
  return getWebsiteMetrics(metricConfig);
}

function getAlertsPreview(metricName, metricConfig) {
  if (metricName === statusCodeRate) {
    return getWebsiteRateMetricAlertsPreview(metricConfig);
  }
  return getWebsiteMetricAlertsPreview(metricConfig);
}

function getMetricConfiguration(websiteId, metric, numeratorFilter, tagFilters, timeConfig, granularity) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  return {
    timeConfig,
    tagFilters: metric === statusCodeCount ? [...tagFiltersWithWebsiteId, numeratorFilter] : tagFiltersWithWebsiteId,
    metrics: {
      statusCode: getMetricConfig(metric, granularity, numeratorFilter)
    }
  };
}

function getMetricConfig(metricName, granularity, numeratorFilter = null) {
  const metricConfigs = {
    [statusCodeRate]: {
      metric: statusCodeRate,
      granularity: granularity,
      aggregation: 'MEAN',
      numeratorFilter
    },
    [statusCodeCount]: {
      metric: statusCodeCount,
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

function getAlertsConfiguration(
  timeConfig,
  tagFilters,
  metric,
  granularity,
  numeratorFilter,
  threshold,
  timeThreshold
) {
  const alertsConfig = {
    metric,
    aggregation: metric === statusCodeCount ? 'SUM' : 'MEAN',
    granularity // global metric granularity
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
      granularity, // local alerts/chart granularity
      metrics: {
        alerts: alertsConfig
      }
    };
  } else {
    return null;
  }
}
