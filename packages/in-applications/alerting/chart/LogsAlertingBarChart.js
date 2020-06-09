import PropTypes from 'prop-types';
import React from 'react';

import {
  chartColors,
  legendColors,
  smoothMetrics,
  getSmoothedMetricTooltipContent
} from 'in-new-components/Alerting/utils/chartUtil';
import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import { boundaryScopePropType } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import { getApplicationIdTagFilter, getLogLevelTagFilters } from 'in-applications/alerting/tagFilterUtils';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import { shouldSmoothMetric } from 'in-new-components/Alerting/utils/timeConfigUtils';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { number } from 'in-services/formatters/number';

export default function LogsAlertingBarChart({
  applicationId,
  boundaryScope,
  logMessage,
  logMessageOperator,
  logLevel,
  timeConfig,
  tagFilters,
  granularity,
  minChartMetricGranularity = 0,
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
  const _shouldSmoothMetric = shouldSmoothMetric(timeConfig.windowSize);

  const metricChartGranularity = Math.max(granularity, minChartMetricGranularity);

  return (
    <AlertingBarChartWrapper
      releaseMarkersDisabled
      timeConfig={timeConfig}
      granularity={metricChartGranularity}
      canReload={canReload}
      y1={{
        threshold: thresholdValue,
        operator: threshold.operator,
        thresholdGranularity: granularity,
        getMax: metricsMaxValue => {
          return thresholdValue >= metricsMaxValue ? Math.max(metricsMaxValue, thresholdValue * 1.2) : metricsMaxValue;
        },
        colors: chartColors,
        icons: {
          types: ['lib_bar_chart', 'lib_threshold', 'lib_actions_stop'],
          colors: legendColors
        },
        renderer: _shouldSmoothMetric ? Renderer.barWithThreshold : Renderer.lineWithThreshold,
        formatter: number.forcedCompact,
        labels: [`${getMetricLabel('logs', 'calls')}${_shouldSmoothMetric ? '' : '*'}`, 'Threshold', 'Violations'],
        excludedLabelsFromTooltip: ['Violations'],
        metricIds: ['logs', 'threshold'],
        nonToggleableSeries: new Map([
          ['logs', getSmoothedMetricTooltipContent(_shouldSmoothMetric)],
          ['threshold', null],
          ['alerts', null],
          ['Violations', null]
        ])
      }}
      getMetric={getApplicationMetrics}
      getAlertsPreview={getApplicationMetricsAlertPreview}
      metricsConfiguration={getMetricConfiguration(tagFiltersWithApplicationId, timeConfig, metricChartGranularity)}
      alertsPreviewConfiguration={getAlertsPreviewConfiguration(
        timeConfig,
        tagFiltersWithApplicationId,
        granularity,
        threshold,
        timeThreshold
      )}
      thresholdType={threshold.type}
      alertsPreviewEnabled={alertsPreviewEnabled}
      mutateMetrics={{
        doMutate: !_shouldSmoothMetric,
        metricNames: ['logs'],
        mutate: smoothMetrics
      }}
    />
  );
}

LogsAlertingBarChart.propTypes = {
  alertsPreviewEnabled: PropTypes.bool,
  applicationId: PropTypes.string.isRequired,
  boundaryScope: boundaryScopePropType.isRequired,
  canReload: PropTypes.bool,
  granularity: PropTypes.number.isRequired,
  minChartMetricGranularity: PropTypes.number,
  logLevel: PropTypes.string.isRequired,
  logMessage: PropTypes.string.isRequired,
  logMessageOperator: PropTypes.string.isRequired,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.object.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
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

function getAlertsPreviewConfiguration(timeConfig, tagFilters, granularity, threshold, timeThreshold) {
  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters,
      timeThreshold,
      threshold,
      granularity, // to request clustered alert preview results
      metrics: {
        alerts: {
          metric: 'calls',
          aggregation: 'SUM',
          granularity
        }
      }
    };
  }

  return null;
}
