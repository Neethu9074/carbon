import PropTypes from 'prop-types';
import React from 'react';

import EumAlertingBarChartWrapper from 'in-websites/eum-alerting/chart/EumAlertingBarChartWrapper';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { millis } from 'in-services/formatters/number';
import theme from 'in-themes';

export default function EumAlertingBarChart({
  websiteId,
  aggregation,
  threshold,
  operator,
  sensitivity,
  baseline,
  timeConfig,
  tagFilters,
  thresholdType,
  granularity
}) {
  return (
    <EumAlertingBarChartWrapper
      alignLegendToLeftSideOfChart
      releaseMarkersDisabled
      timeConfig={timeConfig}
      granularity={granularity}
      y1={{
        sensitivity,
        baseline,
        threshold,
        operator,
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
        renderer: thresholdType === 'staticThreshold' ? Renderer.barWithThreshold : Renderer.barWithBaseline,
        formatter: millis.forcedFixedCompact,
        metricIds: ['onLoadTime', 'threshold'],
        labels: ['Historical data', 'Threshold', 'Expected Range', 'Violations'],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        nonToggleableSeries: new Map([['onLoadTime', null], ['threshold', null]])
      }}
      metricsConfiguration={getMetricConfiguration(websiteId, tagFilters, timeConfig, granularity, aggregation)}
    />
  );
}

EumAlertingBarChart.propTypes = {
  websiteId: PropTypes.string.isRequired,
  aggregation: PropTypes.string.isRequired,
  baseline: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  threshold: PropTypes.number,
  operator: PropTypes.string.isRequired,
  thresholdType: PropTypes.oneOf(['staticThreshold', 'historicBaseline.DAILY', 'historicBaseline.WEEKLY']),
  sensitivity: PropTypes.number,
  granularity: PropTypes.number.isRequired,
  tagFilters: PropTypes.array.isRequired,
  timeConfig: PropTypes.object.isRequired
};

function getMetricConfiguration(websiteId, tagFilters, timeConfig, granularity, aggregation) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  return {
    timeConfig,
    tagFilters: tagFiltersWithWebsiteId,
    metrics: {
      onLoadTime: {
        metric: 'onLoadTime',
        granularity,
        aggregation
      }
    }
  };
}

function getWebsiteIdTagFilter(websiteId) {
  return {
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: websiteId
  };
}
