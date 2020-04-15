import PropTypes from 'prop-types';
import React from 'react';

import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import { boundaryScopePropType } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import { getApplicationIdTagFilter, getLogLevelTagFilters } from 'in-applications/alerting/tagFilterUtils';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { number } from 'in-services/formatters/number';
import theme from 'in-themes';

export default function LogsAlertingBarChart({
  applicationId,
  boundaryScope,
  logMessage,
  logMessageOperator,
  logLevel,
  timeConfig,
  tagFilters,
  granularity,
  threshold,
  timeThreshold,
  alertsPreviewEnabled,
  canReload
}) {
  const thresholdValue = threshold.value;
  const tagFiltersWithApplicationId = [
    ...tagFilters,
    ...getRequiredTagFilters({ applicationId, logMessage, logMessageOperator, logLevel, boundaryScope })
  ];
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
  alertsPreviewEnabled: PropTypes.bool,
  applicationId: PropTypes.string.isRequired,
  boundaryScope: boundaryScopePropType.isRequired,
  canReload: PropTypes.bool,
  granularity: PropTypes.number.isRequired,
  logLevel: PropTypes.string.isRequired,
  logMessage: PropTypes.string.isRequired,
  logMessageOperator: PropTypes.string.isRequired,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.object.isRequired,
  timeConfig: PropTypes.object.isRequired,
  timeThreshold: PropTypes.object.isRequired
};

function getMetricConfiguration(tagFilters, timeConfig, granularity) {
  return {
    timeConfig,
    tagFilters,
    metrics: {
      logs: {
        metric: 'calls',
        granularity: granularity,
        aggregation: 'SUM'
      }
    }
  };
}

function getRequiredTagFilters({ applicationId, logMessage, logMessageOperator, logLevel, boundaryScope }) {
  return [
    getApplicationIdTagFilter({ applicationId, boundaryScope }),
    ...getLogLevelTagFilters(logMessage, logMessageOperator, logLevel)
  ];
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
          aggregation: 'SUM',
          granularity // global metric granularity
        }
      }
    };
  }

  return null;
}
