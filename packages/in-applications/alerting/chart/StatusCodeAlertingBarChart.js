import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import { boundaryScopePropType } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import { getApplicationIdTagFilter, getStatusCodeTagFilter } from 'in-applications/alerting/tagFilterUtils';
import { getSmoothedMetricTooltipContent, smoothMetrics } from 'in-new-components/Alerting/utils/chartUtil';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import { chartViewConfigPropType } from 'in-new-components/Alerting/Chart/chartViewConfig';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { number } from 'in-services/formatters/number';

export default function StatusCodeAlertingBarChart({
  applicationId,
  statusCodeStart,
  statusCodeEnd,
  boundaryScope,
  viewConfig,
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
    getApplicationIdTagFilter({ applicationId, boundaryScope }),
    ...getStatusCodeTagFilter(statusCodeStart, statusCodeEnd)
  ];
  const { timeConfig, minChartMetricGranularity, smoothMetric } = viewConfig;

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
        colors: [
          theme.lib.colors.blue800,
          theme.lib.colors.red800,
          theme.lib.colors.lightBlue800,
          theme.lib.colors.pink800
        ],
        icons: {
          types: [
            smoothMetric ? 'lib_line_chart' : 'lib_bar_chart',
            'lib_threshold',
            'lib_actions_stop',
            'lib_actions_stop'
          ],
          colors: [
            theme.lib.colors.blue800,
            theme.lib.colors.red800,
            theme.lib.colors.lightBlue800,
            theme.lib.colors.pink800
          ]
        },
        renderer: Renderer.barWithThreshold,
        formatter: number.forcedCompact,
        labels: [
          `${getMetricLabel('statusCode', 'calls')}${smoothMetric ? '*' : ''}`,
          'Threshold',
          'Expected Range',
          'Violations'
        ],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        metricIds: ['statusCode', 'threshold'],
        nonToggleableSeries: new Map([
          ['statusCode', getSmoothedMetricTooltipContent(smoothMetric)],
          ['threshold', null],
          ['Expected Range', null],
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
        doMutate: smoothMetric,
        metricNames: ['statusCode'],
        mutate: smoothMetrics
      }}
    />
  );
}

StatusCodeAlertingBarChart.propTypes = {
  alertsPreviewEnabled: PropTypes.bool,
  applicationId: PropTypes.string.isRequired,
  statusCodeStart: PropTypes.number.isRequired,
  statusCodeEnd: PropTypes.number.isRequired,
  boundaryScope: boundaryScopePropType.isRequired,
  canReload: PropTypes.bool,
  granularity: PropTypes.number.isRequired,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.object.isRequired,
  viewConfig: chartViewConfigPropType.isRequired,
  timeThreshold: PropTypes.object.isRequired
};

function getMetricConfiguration(tagFilters, timeConfig, granularity) {
  return {
    timeConfig,
    tagFilters,
    metrics: {
      statusCode: {
        metric: 'calls',
        granularity: granularity,
        aggregation: 'SUM'
      }
    }
  };
}

function getAlertsPreviewConfiguration(timeConfig, tagFilters, granularity, threshold, timeThreshold) {
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
