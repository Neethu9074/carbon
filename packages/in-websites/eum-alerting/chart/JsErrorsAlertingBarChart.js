import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import JsErrorsAlertingBarChartWrapper from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChartWrapper';
import { fieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { errorCount, errorRate } from 'in-websites/eum-alerting/constants';
import { percentage, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';

export default function JsErrorsAlertingBarChart({
  websiteId,
  threshold,
  operator,
  timeConfig,
  tagFilters,
  errorFilter,
  metricName,
  granularity
}) {
  return (
    <JsErrorsAlertingBarChartWrapper
      alignLegendToLeftSideOfChart
      releaseMarkersDisabled
      metricName={metricName}
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
    />
  );
}

JsErrorsAlertingBarChart.propTypes = {
  websiteId: PropTypes.string.isRequired,
  errorFilter: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  metricName: PropTypes.oneOf(selectOptions[fieldNames.ruleMetricName].map(({ value }) => value)).isRequired,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.number.isRequired,
  operator: PropTypes.string.isRequired,
  timeConfig: PropTypes.object.isRequired
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
