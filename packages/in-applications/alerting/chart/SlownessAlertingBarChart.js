import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import getApplicationMetricsAlertPreview from 'in-applications/alerting/subscriptions/getApplicationMetricsAlertsPreview';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { millis } from 'in-services/formatters/number';

export default function SlownessAlertingBarChart({
  applicationId,
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
  const tagFiltersWithApplicationId = [getApplicationIdTagFilter(applicationId), ...tagFilters];
  return (
    <AlertingBarChartWrapper
      alignLegendToLeftSideOfChart
      releaseMarkersDisabled
      timeConfig={timeConfig}
      granularity={granularity}
      canReload={canReload}
      y1={{
        sensitivity,
        baseline,
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
        renderer: threshold.type === 'staticThreshold' ? Renderer.barWithThreshold : Renderer.barWithBaseline,
        formatter: millis.forcedFixedCompact,
        metricIds: ['latency', 'threshold'],
        labels: [getMetricLabel('slowness', 'latency'), 'Threshold', 'Expected Range', 'Violations'],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        nonToggleableSeries: new Map([['latency', null], ['threshold', null], ['alerts', null]])
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
    />
  );
}

SlownessAlertingBarChart.propTypes = {
  applicationId: PropTypes.string.isRequired,
  aggregation: PropTypes.string.isRequired,
  threshold: PropTypes.object.isRequired,
  timeThreshold: PropTypes.object.isRequired,
  sensitivity: PropTypes.number,
  granularity: PropTypes.number.isRequired,
  tagFilters: PropTypes.array.isRequired,
  timeConfig: PropTypes.object.isRequired,
  alertsPreviewEnabled: PropTypes.bool,
  canReload: PropTypes.bool
};

function getApplicationIdTagFilter(applicationId) {
  return {
    name: 'application.id',
    operator: 'EQUALS',
    stringValue: applicationId
  };
}

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
          granularity // global metric granularity
        }
      }
    };
  } else {
    return null;
  }
}
