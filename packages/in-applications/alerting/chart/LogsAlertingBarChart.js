import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { number } from 'in-services/formatters/number';

export default function LogsAlertingBarChart({
  applicationId,
  logMessage,
  logMessageOperator,
  logLevel,
  timeConfig,
  tagFilters,
  granularity,
  threshold,
  timeThreshold,
  alertsPreviewEnabled
}) {
  const thresholdValue = threshold.value;
  const tagFiltersWithApplicationId = [
    ...tagFilters,
    ...getRequiredTagFilters(applicationId, logMessage, logMessageOperator, logLevel)
  ];
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
        formatter: number.forcedCompact,
        labels: [getMetricLabel('logs', 'calls'), 'Threshold', 'Expected Range', 'Violations'],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        metricIds: ['logs', 'threshold'],
        nonToggleableSeries: new Map([['logs', null], ['threshold', null]])
      }}
      getMetric={getApplicationMetrics}
      getAlertsPreview={getApplicationMetricsAlertPreview}
      metricsConfiguration={getMetricConfiguration(tagFiltersWithApplicationId, timeConfig, granularity)}
      alertMetricConfiguration={getAlertsConfiguration(
        timeConfig,
        tagFiltersWithApplicationId,
        granularity,
        threshold,
        timeThreshold
      )}
      thresholdType={threshold.type}
      alertsPreviewEnabled={alertsPreviewEnabled}
    />
  );
}

LogsAlertingBarChart.propTypes = {
  applicationId: PropTypes.string.isRequired,
  logMessage: PropTypes.string.isRequired,
  logMessageOperator: PropTypes.string.isRequired,
  logLevel: PropTypes.string.isRequired,
  granularity: PropTypes.number.isRequired,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.object.isRequired,
  timeThreshold: PropTypes.object.isRequired,
  timeConfig: PropTypes.object.isRequired,
  alertsPreviewEnabled: PropTypes.bool
};

function getMetricConfiguration(tagFilters, timeConfig, granularity) {
  return {
    timeConfig,
    tagFilters,
    metrics: {
      logs: {
        metric: 'calls',
        granularity: granularity,
        aggregation: 'MEAN'
      }
    }
  };
}

function getRequiredTagFilters(applicationId, logMessage, logMessageOperator, logLevel) {
  const tagFilters = [];
  tagFilters.push(createStringTagFilter('application.id', 'EQUALS', applicationId));
  tagFilters.push(createStringTagFilter('log.message', logMessageOperator, logMessage));
  if (logLevel !== 'ANY') {
    tagFilters.push(createStringTagFilter('log.level', 'EQUALS', logLevel));
  }
  return tagFilters;
}

function createStringTagFilter(name, operator, stringValue) {
  return {
    name,
    operator,
    stringValue
  };
}

function getAlertsConfiguration(timeConfig, tagFilters, granularity, threshold, timeThreshold) {
  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters: tagFilters,
      timeThreshold,
      threshold,
      granularity, // local alerts/chart granularity
      metrics: {
        alerts: {
          metric: 'calls',
          aggregation: 'MEAN',
          granularity // global metric granularity
        }
      }
    };
  }

  return null;
}
