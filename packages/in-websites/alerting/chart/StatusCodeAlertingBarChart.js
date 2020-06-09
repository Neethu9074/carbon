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
import { shouldSmoothMetric } from 'in-new-components/Alerting/utils/timeConfigUtils';
import { statusCodeCount, statusCodeRate } from 'in-websites/alerting/constants';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-websites/alerting/form/ruleFormData';
import { alertTypes } from 'in-websites/alerting/data/blueprintConfig';
import { percentage, number } from 'in-services/formatters/number';

export default function StatusCodeAlertingBarChart({
  websiteId,
  timeConfig,
  tagFilters,
  numeratorFilter,
  metricName,
  granularity,
  minChartMetricGranularity = 0,
  threshold,
  timeThreshold,
  alertsPreviewEnabled,
  canReload
}) {
  const thresholdValue = threshold.value;
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
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
        renderer: _shouldSmoothMetric ? Renderer.barWithThreshold : Renderer.lineWithThreshold,
        formatter: metricName === statusCodeCount ? number.forcedCompact : percentage.detailed,
        labels: [
          `${getMetricLabel(alertTypes.specificStatusCode, metricName)}${_shouldSmoothMetric ? '' : '*'}`,
          'Threshold',
          'Violations'
        ],
        excludedLabelsFromTooltip: ['Violations'],
        metricIds: ['statusCode', 'threshold'],
        nonToggleableSeries: new Map([
          ['statusCode', getSmoothedMetricTooltipContent(_shouldSmoothMetric)],
          ['threshold', null],
          ['alerts', null],
          ['Violations', null]
        ])
      }}
      getMetric={metricConfig => getMetric(metricName, metricConfig)}
      getAlertsPreview={metricConfig => getAlertsPreview(metricName, metricConfig)}
      metricsConfiguration={getMetricConfiguration(
        websiteId,
        metricName,
        numeratorFilter,
        tagFiltersWithWebsiteId,
        timeConfig,
        metricChartGranularity
      )}
      alertsPreviewConfiguration={getAlertsPreviewConfiguration(
        timeConfig,
        tagFiltersWithWebsiteId,
        metricName,
        granularity,
        numeratorFilter,
        threshold,
        timeThreshold
      )}
      thresholdType={threshold.type}
      alertsPreviewEnabled={alertsPreviewEnabled}
      mutateMetrics={{
        doMutate: !_shouldSmoothMetric,
        metricNames: ['statusCode'],
        mutate: smoothMetrics
      }}
    />
  );
}

StatusCodeAlertingBarChart.propTypes = {
  websiteId: PropTypes.string.isRequired,
  numeratorFilter: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  minChartMetricGranularity: PropTypes.number,
  metricName: PropTypes.string.isRequired,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.object.isRequired,
  timeThreshold: PropTypes.object.isRequired,
  timeConfig: PropTypes.object.isRequired,
  alertsPreviewEnabled: PropTypes.bool,
  canReload: PropTypes.bool
};

function getMetric(metricName, metricConfig) {
  if (metricName === statusCodeRate) {
    return getWebsiteRateMetric(metricConfig);
  }
  return getWebsiteMetrics(metricConfig);
}

function getAlertsPreview(metricName, metricConfig) {
  if (metricName === statusCodeRate) {
    return getWebsiteRateMetricAlertsPreview(metricConfig);
  }
  return getWebsiteMetricAlertsPreview(metricConfig);
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
