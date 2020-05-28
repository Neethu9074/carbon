import PropTypes from 'prop-types';
import React from 'react';

import {
  chartColors,
  legendColors,
  smoothMetrics,
  getSmoothedMetricTooltipContent
} from 'in-new-components/Alerting/utils/chartUtil';
import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import { alertingMetricsGranularity, shouldSmoothMetric } from 'in-new-components/Alerting/utils/timeConfigUtils';
import { boundaryScopePropType } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import { getApplicationIdTagFilter } from 'in-applications/alerting/tagFilterUtils';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { millis } from 'in-services/formatters/number';

export default function SlownessAlertingBarChart({
  applicationId,
  boundaryScope,
  aggregation,
  sensitivity,
  timeConfig,
  tagFilters,
  granularity,
  threshold,
  timeThreshold,
  alertsPreviewEnabled,
  canReload
}) {
  const baseline = threshold.baseline;
  const tagFiltersWithApplicationId = [...tagFilters, getApplicationIdTagFilter({ applicationId, boundaryScope })];
  const _shouldSmoothMetric = shouldSmoothMetric(timeConfig.windowSize);

  return (
    <AlertingBarChartWrapper
      releaseMarkersDisabled
      timeConfig={timeConfig}
      granularity={granularity}
      canReload={canReload}
      y1={{
        sensitivity,
        baseline,
        granularity,
        lineWidth: 1,
        threshold: threshold.value,
        operator: threshold.operator,
        getMax: metricsMaxValue => {
          let maxBaselineVal = 0;
          if (baseline) {
            for (let i = 0; i < baseline.length; ++i) {
              const currentBaseline = baseline[i][1] + baseline[i][2] * sensitivity;
              if (currentBaseline > maxBaselineVal) maxBaselineVal = currentBaseline;
            }
          }
          const overallMaxValue = (baseline || [])
            .map(v => v[1] + v[2] * sensitivity)
            .reduce((a, b) => (a > b ? a : b), metricsMaxValue);
          return overallMaxValue * 1.1;
        },
        colors: chartColors,
        icons: {
          types: [_shouldSmoothMetric ? 'lib_bar_chart' : 'lib_line_chart', 'lib_threshold', 'lib_actions_stop'],
          colors: legendColors
        },
        renderer: getRenderer(),
        formatter: millis.forcedFixedCompact,
        metricIds: ['latency', 'threshold'],
        labels: [
          `${getMetricLabel('slowness', 'latency')}${_shouldSmoothMetric ? '' : '*'}`,
          'Threshold',
          'Violations'
        ],
        excludedLabelsFromTooltip: ['Violations'],
        nonToggleableSeries: new Map([
          ['latency', getSmoothedMetricTooltipContent(_shouldSmoothMetric)],
          ['threshold', null],
          ['alerts', null],
          ['Violations', null]
        ])
      }}
      getMetric={getApplicationMetrics}
      getAlertsPreview={getApplicationMetricsAlertPreview}
      metricsConfiguration={{
        timeConfig,
        tagFilters: tagFiltersWithApplicationId,
        metrics: {
          latency: {
            metric: 'latency',
            granularity,
            aggregation
          }
        }
      }}
      alertMetricConfiguration={getAlertsConfiguration(
        timeConfig,
        tagFiltersWithApplicationId,
        aggregation,
        granularity,
        threshold,
        timeThreshold
      )}
      thresholdType={threshold.type}
      alertsPreviewEnabled={alertsPreviewEnabled}
      mutateMetrics={{
        doMutate: !_shouldSmoothMetric,
        metricNames: ['latency'],
        mutate: smoothMetrics
      }}
    />
  );

  function getRenderer() {
    if (threshold.type === 'staticThreshold') {
      return _shouldSmoothMetric ? Renderer.barWithThreshold : Renderer.lineWithThreshold;
    } else {
      return _shouldSmoothMetric ? Renderer.barWithBaseline : Renderer.lineWithBaseline;
    }
  }
}

SlownessAlertingBarChart.propTypes = {
  aggregation: PropTypes.string.isRequired,
  alertsPreviewEnabled: PropTypes.bool,
  applicationId: PropTypes.string.isRequired,
  boundaryScope: boundaryScopePropType.isRequired,
  canReload: PropTypes.bool,
  granularity: PropTypes.number.isRequired,
  sensitivity: PropTypes.number,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.object.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  timeThreshold: PropTypes.object.isRequired
};

function getAlertsConfiguration(timeConfig, tagFilters, aggregation, granularity, threshold, timeThreshold) {
  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters,
      timeThreshold,
      threshold,
      granularity, // local alerts/chart granularity
      metrics: {
        alerts: {
          metric: 'latency',
          aggregation,
          granularity: alertingMetricsGranularity // global metric granularity
        }
      }
    };
  } else {
    return null;
  }
}
