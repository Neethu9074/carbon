import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import EumAlertingBarChartWrapper from 'in-websites/eum-alerting/chart/EumAlertingBarChartWrapper';
import { statusCodeCount, statusCodeRate } from 'in-websites/eum-alerting/constants';
import { percentage, number } from 'in-services/formatters/number';

import Renderer from 'in-components/Chart/renderer/Renderer';

export default function StatusCodeAlertingBarChart({
  websiteId,
  threshold,
  operator,
  timeConfig,
  tagFilters,
  numeratorFilter,
  metricName,
  granularity
}) {
  return (
    <EumAlertingBarChartWrapper
      alignLegendToLeftSideOfChart
      releaseMarkersDisabled
      isCatalogMetric={metricName === statusCodeCount}
      timeConfig={timeConfig}
      granularity={granularity}
      y1={{
        threshold,
        operator,
        getMax: metricsMaxValue => {
          return threshold >= metricsMaxValue
            ? Math.max(metricsMaxValue, (metricName === statusCodeCount ? Math.trunc(threshold) : threshold) * 1.2)
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
        formatter: metricName === statusCodeCount ? number.forcedCompact : percentage.detailed,
        labels: ['Historical data', 'Threshold', 'Expected Range', 'Violations'],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        metricIds: ['statusCode', 'threshold'],
        nonToggleableSeries: new Map([['statusCode', null], ['threshold', null]])
      }}
      metricsConfiguration={getMetricConfiguration(
        websiteId,
        metricName,
        numeratorFilter,
        tagFilters,
        timeConfig,
        granularity
      )}
    />
  );
}

StatusCodeAlertingBarChart.propTypes = {
  websiteId: PropTypes.string.isRequired,
  numeratorFilter: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  metricName: PropTypes.string.isRequired,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.number.isRequired,
  operator: PropTypes.string.isRequired,
  timeConfig: PropTypes.object.isRequired
};

function getMetricConfiguration(websiteId, metric, numeratorFilter, tagFilters, timeConfig, granularity) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  return {
    timeConfig,
    tagFilters: metric === statusCodeCount ? [...tagFiltersWithWebsiteId, numeratorFilter] : tagFiltersWithWebsiteId,
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
      numeratorFilter: numeratorFilter
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
