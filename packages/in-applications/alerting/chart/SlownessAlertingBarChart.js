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
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import { chartViewConfigPropType } from 'in-new-components/Alerting/Chart/chartViewConfig';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import getApplicationMetrics from 'in-subscription/application/getApplicationMetrics';
import { getApplicationIdTagFilter } from 'in-applications/alerting/tagFilterUtils';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-applications/alerting/form/formUtils';
import { millis } from 'in-services/formatters/number';

export default function SlownessAlertingBarChart({
  applicationId,
  boundaryScope,
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
  const tagFiltersWithApplicationId = [...tagFilters, getApplicationIdTagFilter({ applicationId, boundaryScope })];
  const { timeConfig, minChartMetricGranularity, smoothMetric } = viewConfig;

  const metricChartGranularity = Math.max(granularity, minChartMetricGranularity);

  return (
    <AlertingBarChartWrapper
      renderPreChartContent={props => {
        if (!alertsPreviewEnabled) return;

        const alertsPreviewConfiguration = getAlertsPreviewConfiguration(
          timeConfig,
          tagFiltersWithApplicationId,
          aggregation,
          granularity,
          threshold,
          timeThreshold
        );

        return (
          alertsPreviewConfiguration && (
            <MarkerLanesPresenter
              {...props}
              getAlertsPreview={getApplicationMetricsAlertPreview}
              alertsPreviewConfiguration={alertsPreviewConfiguration}
              isClustered
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
        metricIds: ['latency', 'threshold'],
        labels: [`${getMetricLabel('slowness', 'latency')}${smoothMetric ? '*' : ''}`, 'Threshold', 'Violations'],
        excludedLabelsFromTooltip: ['Violations'],
        nonToggleableSeries: new Map([
          ['latency', getSmoothedMetricTooltipContent(smoothMetric)],
          ['threshold', null],
          ['alerts', null],
          ['Violations', null]
        ])
      }}
      getMetric={getApplicationMetrics}
      metricsConfiguration={{
        timeConfig,
        tagFilters: tagFiltersWithApplicationId,
        metrics: {
          latency: {
            metric: 'latency',
            granularity: metricChartGranularity,
            aggregation
          }
        }
      }}
      thresholdType={threshold.type}
      mutateMetrics={{
        doMutate: smoothMetric,
        metricNames: ['latency'],
        mutate: smoothMetrics
      }}
      nonInteractive
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
  aggregation: PropTypes.string.isRequired,
  alertsPreviewEnabled: PropTypes.bool,
  applicationId: PropTypes.string.isRequired,
  boundaryScope: boundaryScopePropType.isRequired,
  canReload: PropTypes.bool,
  granularity: PropTypes.number.isRequired,
  sensitivity: PropTypes.number,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.object.isRequired,
  viewConfig: chartViewConfigPropType.isRequired,
  timeThreshold: PropTypes.object.isRequired
};

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
          metric: 'latency',
          aggregation,
          granularity
        }
      }
    };
  } else {
    return null;
  }
}
