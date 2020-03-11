import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import getWebsiteMetricAlertsPreview from 'in-websites/eum-alerting/subscriptions/getWebsiteMetricAlertsPreview';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import { getMetricLabel } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { onLoadTime } from 'in-websites/eum-alerting/constants';
import { millis } from 'in-services/formatters/number';

export default function SlownessAlertingBarChart({
  websiteId,
  aggregation,
  sensitivity,
  timeConfig,
  tagFilters,
  granularity,
  threshold,
  timeThreshold,
  alertsPreviewEnabled
}) {
  const baseline = threshold.baseline;
  return (
    <AlertingBarChartWrapper
      alignLegendToLeftSideOfChart
      releaseMarkersDisabled
      timeConfig={timeConfig}
      granularity={granularity}
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
        metricIds: ['onLoadTime', 'threshold'],
        labels: [getMetricLabel(alertTypes.slowness, onLoadTime), 'Threshold', 'Expected Range', 'Violations'],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        nonToggleableSeries: new Map([['onLoadTime', null], ['threshold', null], ['alerts', null]]),
        alertMetricConfiguration: getAlertsConfiguration(
          timeConfig,
          [...tagFilters, getWebsiteIdTagFilter(websiteId)],
          aggregation,
          granularity,
          threshold,
          timeThreshold
        )
      }}
      getMetric={getWebsiteMetrics}
      getAlertsPreview={getWebsiteMetricAlertsPreview}
      metricsConfiguration={{
        timeConfig,
        tagFilters: [...tagFilters, getWebsiteIdTagFilter(websiteId)],
        metrics: {
          onLoadTime: {
            metric: onLoadTime,
            granularity,
            aggregation
          }
        }
      }}
      alertMetricConfiguration={getAlertsConfiguration(
        timeConfig,
        [...tagFilters, getWebsiteIdTagFilter(websiteId)],
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
  websiteId: PropTypes.string.isRequired,
  aggregation: PropTypes.string.isRequired,
  threshold: PropTypes.object.isRequired,
  timeThreshold: PropTypes.object.isRequired,
  sensitivity: PropTypes.number,
  granularity: PropTypes.number.isRequired,
  tagFilters: PropTypes.array.isRequired,
  timeConfig: PropTypes.object.isRequired,
  alertsPreviewEnabled: PropTypes.bool
};

function getWebsiteIdTagFilter(websiteId) {
  return {
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: websiteId
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
          metric: onLoadTime,
          aggregation,
          granularity // global metric granularity
        }
      }
    };
  } else {
    return null;
  }
}
