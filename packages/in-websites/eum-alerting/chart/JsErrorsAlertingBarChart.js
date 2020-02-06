import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import EumAlertingBarChartWrapper from 'in-websites/eum-alerting/chart/EumAlertingBarChartWrapper';
import { getThreshold, getTimeThreshold } from 'in-websites/eum-alerting/alertConfigUtil.js';
import { errorCount, errorRate } from 'in-websites/eum-alerting/constants';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { percentage, number } from 'in-services/formatters/number';

export default function JsErrorsAlertingBarChart({
  websiteId,
  threshold,
  operator,
  timeConfig,
  tagFilters,
  errorFilter,
  metricName,
  granularity,
  form
}) {
  return (
    <EumAlertingBarChartWrapper
      alignLegendToLeftSideOfChart
      releaseMarkersDisabled
      isCatalogMetric={metricName === errorCount}
      timeConfig={timeConfig}
      granularity={granularity}
      y1={{
        threshold,
        operator,
        getMax: metricsMaxValue => {
          return threshold >= metricsMaxValue
            ? Math.max(metricsMaxValue, (metricName === errorCount ? Math.trunc(threshold) : threshold) * 1.2)
            : metricsMaxValue;
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
        renderer: Renderer.barWithThreshold,
        formatter: metricName === errorCount ? number.forcedCompact : percentage.detailed,
        labels: ['Historical data', 'Threshold', 'Expected Range', 'Violations'],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        metricIds: ['errors', 'threshold'],
        nonToggleableSeries: new Map([['errors', null], ['threshold', null]])
      }}
      metricsConfiguration={getMetricConfiguration(
        websiteId,
        metricName,
        errorFilter,
        tagFilters,
        timeConfig,
        granularity
      )}
      alertMetricConfiguration={getAlertsConfiguration(
        timeConfig,
        [...tagFilters, getWebsiteIdTagFilter(websiteId)],
        metricName,
        granularity,
        errorFilter,
        form
      )}
    />
  );
}

JsErrorsAlertingBarChart.propTypes = {
  errorFilter: PropTypes.object.isRequired,
  form: PropTypes.object,
  granularity: PropTypes.number.isRequired,
  metricName: PropTypes.string.isRequired,
  operator: PropTypes.string.isRequired,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.number.isRequired,
  timeConfig: PropTypes.object.isRequired,
  websiteId: PropTypes.string.isRequired
};

function getMetricConfiguration(websiteId, metric, errorFilter, tagFilters, timeConfig, granularity) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];

  return {
    timeConfig,
    tagFilters: metric === errorCount ? [...tagFiltersWithWebsiteId, errorFilter] : tagFiltersWithWebsiteId,
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

function getAlertsConfiguration(timeConfig, tagFilters, metric, granularity, errorFilter, form) {
  //TODO: Refactor this method
  if (!form) return null;

  const threshold = getThreshold(form);

  const alertsConfig = {
    metric,
    aggregation: metric === errorCount ? 'SUM' : 'MEAN',
    granularity // global metric granularity
  };

  if (metric === errorRate) {
    alertsConfig.numeratorFilter = errorFilter;
  }

  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters: metric === errorCount ? [...tagFilters, errorFilter] : tagFilters,
      timeThreshold: getTimeThreshold(form),
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
