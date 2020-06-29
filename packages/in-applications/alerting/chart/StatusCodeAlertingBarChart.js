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
import { getApplicationIdTagFilter, getStatusCodeTagFilter } from 'in-applications/alerting/tagFilterUtils';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import { chartViewConfigPropType } from 'in-new-components/Alerting/Chart/chartViewConfig';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { number } from 'in-services/formatters/number';

export default function StatusCodeAlertingBarChart({
  applicationId,
  boundaryScope,
  statusCodeStart,
  statusCodeEnd,
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
      renderPreChartContent={props => {
        if (!alertsPreviewEnabled) return;

        const alertsPreviewConfiguration = getAlertsPreviewConfiguration(
          timeConfig,
          tagFiltersWithApplicationId,
          granularity,
          threshold,
          timeThreshold
        );

        return (
          <MarkerLanesPresenter
            {...props}
            getAlertsPreview={getApplicationMetricsAlertPreview}
            alertsPreviewConfiguration={alertsPreviewConfiguration}
          >
            <SmartAlertMarkerLane />
          </MarkerLanesPresenter>
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
          return thresholdValue >= metricsMaxValue ? Math.max(metricsMaxValue, thresholdValue * 1.2) : metricsMaxValue;
        },
        colors: chartColors,
        icons: {
          types: ['lib_bar_chart', 'lib_threshold', 'lib_actions_stop'],
          colors: legendColors
        },
        renderer: smoothMetric ? Renderer.lineWithThreshold : Renderer.barWithThreshold,
        formatter: number.forcedCompact,
        labels: [`${getMetricLabel('statusCode', 'calls')}${smoothMetric ? '*' : ''}`, 'Threshold', 'Violations'],
        excludedLabelsFromTooltip: ['Violations'],
        metricIds: ['statusCode', 'threshold'],
        nonToggleableSeries: new Map([
          ['statusCode', getSmoothedMetricTooltipContent(smoothMetric)],
          ['threshold', null],
          ['Violations', null]
        ])
      }}
      getMetric={getApplicationMetrics}
      metricsConfiguration={getMetricConfiguration(tagFiltersWithApplicationId, timeConfig, metricChartGranularity)}
      thresholdType={threshold.type}
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
      tagFilters,
      timeThreshold,
      threshold,
      granularity,
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
