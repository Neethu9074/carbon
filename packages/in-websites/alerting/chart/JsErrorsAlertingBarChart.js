import PropTypes from 'prop-types';
import React from 'react';

import {
  chartColors,
  legendColors,
  smoothMetrics,
  getSmoothedMetricTooltipContent
} from 'in-new-components/Alerting/utils/chartUtil';
import getWebsiteRateMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteRateMetricAlertsPreview';
import { alertingMetricsGranularity, isDefaultWindowSize } from 'in-new-components/Alerting/utils/timeConfigUtils';
import getWebsiteMetricAlertsPreview from 'in-websites/alerting/subscriptions/getWebsiteMetricAlertsPreview';
import AlertingBarChartWrapper from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import getWebsiteRateMetric from 'in-websites/alerting/subscriptions/getWebsiteRateMetric';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { getMetricLabel } from 'in-websites/alerting/form/ruleFormData';
import { alertTypes } from 'in-websites/alerting/data/blueprintConfig';
import { errorCount, errorRate } from 'in-websites/alerting/constants';
import { percentage, number } from 'in-services/formatters/number';

export default function JsErrorsAlertingBarChart({
  websiteId,
  timeConfig,
  tagFilters,
  errorFilter,
  metricName,
  granularity,
  threshold,
  timeThreshold,
  alertsPreviewEnabled,
  canReload
}) {
  const thresholdValue = threshold.value;
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  const _isDefaultWindowSize = isDefaultWindowSize(timeConfig.windowSize);

  return (
    <AlertingBarChartWrapper
      releaseMarkersDisabled
      timeConfig={timeConfig}
      granularity={granularity}
      canReload={canReload}
      y1={{
        threshold: thresholdValue,
        operator: threshold.operator,
        granularity,
        getMax: metricsMaxValue => {
          return thresholdValue >= metricsMaxValue
            ? Math.max(metricsMaxValue, (metricName === errorCount ? Math.trunc(thresholdValue) : thresholdValue) * 1.2)
            : metricsMaxValue;
        },
        colors: chartColors,
        icons: {
          types: [_isDefaultWindowSize ? 'lib_bar_chart' : 'lib_line_chart', 'lib_threshold', 'lib_actions_stop'],
          colors: legendColors
        },
        renderer: _isDefaultWindowSize ? Renderer.barWithThreshold : Renderer.lineWithThreshold,
        formatter: metricName === errorCount ? number.forcedCompact : percentage.detailed,
        labels: [
          `${getMetricLabel(alertTypes.specificJsError, metricName)}${_isDefaultWindowSize ? '' : '*'}`,
          'Threshold',
          'Violations'
        ],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        metricIds: ['errors', 'threshold'],
        nonToggleableSeries: new Map([
          ['errors', getSmoothedMetricTooltipContent(_isDefaultWindowSize)],
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
        errorFilter,
        tagFiltersWithWebsiteId,
        timeConfig,
        granularity
      )}
      alertMetricConfiguration={getAlertsConfiguration(
        timeConfig,
        tagFiltersWithWebsiteId,
        metricName,
        granularity,
        errorFilter,
        threshold,
        timeThreshold
      )}
      thresholdType={threshold.type}
      alertsPreviewEnabled={alertsPreviewEnabled}
      mutateMetrics={{
        doMutate: !_isDefaultWindowSize,
        metricNames: ['errors'],
        mutate: smoothMetrics
      }}
    />
  );
}

JsErrorsAlertingBarChart.propTypes = {
  errorFilter: PropTypes.object.isRequired,
  threshold: PropTypes.object.isRequired,
  timeThreshold: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  metricName: PropTypes.string.isRequired,
  tagFilters: PropTypes.array.isRequired,
  timeConfig: PropTypes.object.isRequired,
  websiteId: PropTypes.string.isRequired,
  alertsPreviewEnabled: PropTypes.bool,
  canReload: PropTypes.bool
};

function getMetric(metricName, metricConfig) {
  if (metricName === errorRate) {
    return getWebsiteRateMetric(metricConfig);
  }
  return getWebsiteMetrics(metricConfig);
}

function getAlertsPreview(metricName, metricConfig) {
  if (metricName === errorRate) {
    return getWebsiteRateMetricAlertsPreview(metricConfig);
  }
  return getWebsiteMetricAlertsPreview(metricConfig);
}

function getMetricConfiguration(websiteId, metric, errorFilter, tagFilters, timeConfig, granularity) {
  return {
    timeConfig,
    tagFilters: metric === errorCount ? [...tagFilters, errorFilter] : tagFilters,
    metrics: {
      errors: getMetricConfig(metric, granularity, errorFilter)
    }
  };
}

function getMetricConfig(metricName, granularity, errorFilter = null) {
  const metricConfigs = {
    [errorRate]: {
      metric: errorRate,
      granularity: granularity,
      aggregation: 'MEAN',
      numeratorFilter: errorFilter
    },
    [errorCount]: {
      metric: errorCount,
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

function getAlertsConfiguration(timeConfig, tagFilters, metric, granularity, errorFilter, threshold, timeThreshold) {
  const alertsConfig = {
    metric,
    aggregation: metric === errorCount ? 'SUM' : 'MEAN',
    granularity: alertingMetricsGranularity // global metric granularity
  };

  if (metric === errorRate) {
    alertsConfig.numeratorFilter = errorFilter;
  }

  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters: metric === errorCount ? [...tagFilters, errorFilter] : tagFilters,
      timeThreshold,
      threshold,
      granularity, // local alerts/chart granularity
      metrics: {
        alerts: alertsConfig
      }
    };
  } else {
    return null;
  }
}
