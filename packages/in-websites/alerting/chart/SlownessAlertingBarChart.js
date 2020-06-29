import PropTypes from 'prop-types';
import React from 'react';

import {
  chartColors,
  legendColors,
  smoothMetrics,
  getSmoothedMetricTooltipContent
} from 'in-new-components/Alerting/utils/chartUtil';
import getWebsiteMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteMetricAlertsPreview';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import { chartViewConfigPropType } from 'in-new-components/Alerting/Chart/chartViewConfig';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-websites/alerting/form/ruleFormData';
import { alertTypes } from 'in-websites/alerting/data/blueprintConfig';
import { onLoadTime } from 'in-websites/alerting/constants';
import { millis } from 'in-services/formatters/number';

export default function SlownessAlertingBarChart({
  websiteId,
  aggregation,
  sensitivity,
  viewConfig,
  tagFilters,
  granularity,
  threshold,
  timeThreshold,
  alertsPreviewEnabled,
  canReload
}) {
  const baseline = threshold.baseline;
  const tagFiltersWithWebsiteId = [getWebsiteIdTagFilter(websiteId), ...tagFilters];
  const { timeConfig, minChartMetricGranularity, smoothMetric } = viewConfig;

  const metricChartGranularity = Math.max(granularity, minChartMetricGranularity);

  return (
    <AlertingBarChartWrapper
      renderPreChartContent={props => {
        if (!alertsPreviewEnabled) return;
        const alertsPreviewConfiguration = getAlertsPreviewConfiguration(
          timeConfig,
          tagFiltersWithWebsiteId,
          aggregation,
          granularity,
          threshold,
          timeThreshold
        );
        return (
          alertsPreviewConfiguration && (
            <MarkerLanesPresenter
              {...props}
              alertsPreviewConfiguration={alertsPreviewConfiguration}
              getAlertsPreview={getWebsiteMetricAlertsPreview}
            >
              <SmartAlertMarkerLane />
            </MarkerLanesPresenter>
          )
        );
      }}
      timeConfig={timeConfig}
      granularity={metricChartGranularity}
      canReload={canReload}
      y1={{
        sensitivity,
        baseline,
        thresholdGranularity: granularity,
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
          types: [smoothMetric ? 'lib_line_chart' : 'lib_bar_chart', 'lib_threshold', 'lib_actions_stop'],
          colors: legendColors
        },
        renderer: getRenderer(),
        formatter: millis.forcedFixedCompact,
        metricIds: ['onLoadTime', 'threshold'],
        labels: [
          `${getMetricLabel(alertTypes.slowness, onLoadTime)}${smoothMetric ? '*' : ''}`,
          'Threshold',
          'Violations'
        ],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        nonToggleableSeries: new Map([
          ['onLoadTime', getSmoothedMetricTooltipContent(smoothMetric)],
          ['threshold', null],
          ['alerts', null],
          ['Violations', null]
        ])
      }}
      getMetric={getWebsiteMetrics}
      metricsConfiguration={{
        timeConfig,
        tagFilters: tagFiltersWithWebsiteId,
        metrics: {
          onLoadTime: {
            metric: onLoadTime,
            granularity: metricChartGranularity,
            aggregation
          }
        }
      }}
      thresholdType={threshold.type}
      mutateMetrics={{
        doMutate: smoothMetric,
        metricNames: ['onLoadTime'],
        mutate: smoothMetrics
      }}
    />
  );

  function getRenderer() {
    if (threshold.type === 'staticThreshold') {
      return smoothMetric ? Renderer.lineWithThreshold : Renderer.barWithThreshold;
    } else {
      return smoothMetric ? Renderer.lineWithBaseline : Renderer.barWithBaseline;
    }
  }
}

SlownessAlertingBarChart.propTypes = {
  websiteId: PropTypes.string.isRequired,
  aggregation: PropTypes.string.isRequired,
  threshold: PropTypes.object.isRequired,
  timeThreshold: PropTypes.object.isRequired,
  sensitivity: PropTypes.number,
  granularity: PropTypes.number.isRequired,
  tagFilters: PropTypes.array.isRequired,
  viewConfig: chartViewConfigPropType.isRequired,
  alertsPreviewEnabled: PropTypes.bool,
  canReload: PropTypes.bool
};

function getWebsiteIdTagFilter(websiteId) {
  return {
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: websiteId
  };
}

function getAlertsPreviewConfiguration(timeConfig, tagFilters, aggregation, granularity, threshold, timeThreshold) {
  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters,
      timeThreshold,
      threshold,
      granularity, // to request clustered alert preview results
      metrics: {
        alerts: {
          metric: onLoadTime,
          aggregation,
          granularity
        }
      }
    };
  } else {
    return null;
  }
}
