import PropTypes from 'prop-types';
import React from 'react';

import {
  chartColors,
  legendColors,
  getSmoothedMetricTooltipContent,
  smoothMetrics
} from 'in-new-components/Alerting/utils/chartUtil';
import getWebsiteRateMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteRateMetricAlertsPreview';
import getWebsiteMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteMetricAlertsPreview';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import getWebsiteRateMetric from 'in-websites/alerting/subscriptions/getWebsiteRateMetric';
import { chartViewConfigPropType } from 'in-new-components/Alerting/Chart/chartViewConfig';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import SmartAlertMarkerLane from 'in-components/Chart/markerLanes/AlertMarkerLane';
import { statusCodeCount, statusCodeRate } from 'in-websites/alerting/constants';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-websites/alerting/form/ruleFormData';
import { alertTypes } from 'in-websites/alerting/data/blueprintConfig';
import { percentage, number } from 'in-services/formatters/number';

export default function StatusCodeAlertingBarChart({
  websiteId,
  viewConfig,
  tagFilters,
  numeratorFilter,
  metricName,
  granularity,
  threshold,
  timeThreshold,
  alertsPreviewEnabled,
  canReload
}) {
  const thresholdValue = threshold.value;
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  const { timeConfig, minChartMetricGranularity, smoothMetric } = viewConfig;

  const metricChartGranularity = Math.max(granularity, minChartMetricGranularity);

  return (
    <AlertingBarChartWrapper
      renderPreChartContent={props => {
        if (!alertsPreviewEnabled) return;

        const alertsPreviewConfiguration = getAlertsPreviewConfiguration(
          timeConfig,
          tagFiltersWithWebsiteId,
          metricName,
          granularity,
          numeratorFilter,
          threshold,
          timeThreshold
        );

        return (
          alertsPreviewConfiguration && (
            <MarkerLanesPresenter
              {...props}
              getAlertsPreview={getAlertsPreview(metricName)}
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
        threshold: thresholdValue,
        operator: threshold.operator,
        thresholdGranularity: granularity,
        getMax: metricsMaxValue => {
          return thresholdValue >= metricsMaxValue
            ? Math.max(
                metricsMaxValue,
                (metricName === statusCodeCount ? Math.trunc(thresholdValue) : thresholdValue) * 1.2
              )
            : metricsMaxValue;
        },
        colors: chartColors,
        icons: {
          types: ['lib_bar_chart', 'lib_threshold', 'lib_actions_stop'],
          colors: legendColors
        },
        renderer: smoothMetric ? Renderer.lineWithThreshold : Renderer.barWithThreshold,
        formatter: metricName === statusCodeCount ? number.forcedCompact : percentage.detailed,
        labels: [
          `${getMetricLabel(alertTypes.specificStatusCode, metricName)}${smoothMetric ? '*' : ''}`,
          'Threshold',
          'Violations'
        ],
        excludedLabelsFromTooltip: ['Violations'],
        metricIds: ['statusCode', 'threshold'],
        nonToggleableSeries: new Map([
          ['statusCode', getSmoothedMetricTooltipContent(smoothMetric)],
          ['threshold', null],
          ['alerts', null],
          ['Violations', null]
        ])
      }}
      getMetric={metricConfig => getMetric(metricName, metricConfig)}
      metricsConfiguration={getMetricConfiguration(
        websiteId,
        metricName,
        numeratorFilter,
        tagFiltersWithWebsiteId,
        timeConfig,
        metricChartGranularity
      )}
      thresholdType={threshold.type}
      mutateMetrics={{
        doMutate: smoothMetric,
        metricNames: ['statusCode'],
        mutate: smoothMetrics
      }}
      nonInteractive
    />
  );
}

StatusCodeAlertingBarChart.propTypes = {
  websiteId: PropTypes.string.isRequired,
  numeratorFilter: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  metricName: PropTypes.string.isRequired,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.object.isRequired,
  timeThreshold: PropTypes.object.isRequired,
  viewConfig: chartViewConfigPropType.isRequired,
  alertsPreviewEnabled: PropTypes.bool,
  canReload: PropTypes.bool
};

function getMetric(metricName, metricConfig) {
  if (metricName === statusCodeRate) {
    return getWebsiteRateMetric(metricConfig);
  }
  return getWebsiteMetrics(metricConfig);
}

function getAlertsPreview(metricName) {
  if (metricName === statusCodeRate) {
    return getWebsiteRateMetricAlertsPreview;
  }
  return getWebsiteMetricAlertsPreview;
}

function getMetricConfiguration(websiteId, metric, numeratorFilter, tagFilters, timeConfig, granularity) {
  return {
    timeConfig,
    tagFilters: metric === statusCodeCount ? [...tagFilters, numeratorFilter] : tagFilters,
    metrics: {
      statusCode: getMetricConfig(metric, granularity, numeratorFilter)
    }
  };
}

function getMetricConfig(metricName, granularity, numeratorFilter = null) {
  const metricConfigs = {
    [statusCodeRate]: {
      metric: statusCodeRate,
      granularity: granularity,
      aggregation: 'MEAN',
      numeratorFilter
    },
    [statusCodeCount]: {
      metric: statusCodeCount,
      granularity: granularity,
      aggregation: 'SUM'
    }
  };
  return metricConfigs[metricName];
}

function getWebsiteIdTagFilter(websiteId) {
  return {
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: websiteId
  };
}

function getAlertsPreviewConfiguration(
  timeConfig,
  tagFilters,
  metric,
  granularity,
  numeratorFilter,
  threshold,
  timeThreshold
) {
  const alertsConfig = {
    metric,
    aggregation: metric === statusCodeCount ? 'SUM' : 'MEAN',
    granularity
  };

  if (metric === statusCodeRate) {
    alertsConfig.numeratorFilter = numeratorFilter;
  }

  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters: metric === statusCodeCount ? [...tagFilters, numeratorFilter] : tagFilters,
      timeThreshold,
      threshold,
      granularity, // to request clustered alert preview results
      metrics: {
        alerts: alertsConfig
      }
    };
  } else {
    return null;
  }
}
