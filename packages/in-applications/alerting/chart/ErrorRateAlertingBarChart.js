import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { percentage } from 'in-services/formatters/number';

export default function ErrorRateAlertingBarChart({
  applicationId,
  timeConfig,
  tagFilters,
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
          return thresholdValue >= metricsMaxValue ? Math.max(metricsMaxValue, thresholdValue * 1.2) : metricsMaxValue;
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
        formatter: percentage.detailed,
        labels: ['Historical data', 'Threshold', 'Expected Range', 'Violations'],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        metricIds: ['errors', 'threshold'],
        nonToggleableSeries: new Map([['errors', null], ['threshold', null]])
      }}
      getMetric={getApplicationMetrics}
      metricsConfiguration={getMetricConfiguration(applicationId, metricName, tagFilters, timeConfig, granularity)}
      alertMetricConfiguration={getAlertsConfiguration(
        timeConfig,
        [...tagFilters, getApplicationIdTagFilter(applicationId)],
        metricName,
        granularity,
        threshold,
        timeThreshold
      )}
      thresholdType={threshold.type}
      alertsPreviewEnabled={alertsPreviewEnabled}
    />
  );
}

ErrorRateAlertingBarChart.propTypes = {
  granularity: PropTypes.number.isRequired,
  metricName: PropTypes.string.isRequired,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.object.isRequired,
  timeThreshold: PropTypes.object.isRequired,
  timeConfig: PropTypes.object.isRequired,
  applicationId: PropTypes.string.isRequired,
  alertsPreviewEnabled: PropTypes.bool
};

function getMetricConfiguration(websiteId, metric, tagFilters, timeConfig, granularity) {
  const tagFiltersWithWebsiteId = [...tagFilters, getApplicationIdTagFilter(websiteId)];

  return {
    timeConfig,
    tagFilters: tagFiltersWithWebsiteId,
    metrics: {
      errors: getMetricConfig(metric, granularity)
    }
  };
}

function getMetricConfig(metricName, granularity) {
  const metricConfigs = {
    errors: {
      metric: 'errors',
      granularity: granularity,
      aggregation: 'MEAN'
    }
  };
  return metricConfigs[metricName];
}

function getApplicationIdTagFilter(websiteId) {
  return {
    name: 'application.id',
    operator: 'EQUALS',
    stringValue: websiteId
  };
}

function getAlertsConfiguration(timeConfig, tagFilters, metric, granularity, threshold, timeThreshold) {
  const alertsConfig = {
    metric,
    aggregation: 'MEAN',
    granularity // global metric granularity
  };

  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters: tagFilters,
      timeThreshold,
      threshold,
      granularity, // local alerts/chart granularity
      metrics: {
        alerts: alertsConfig
      }
    };
  }

  return null;
}
