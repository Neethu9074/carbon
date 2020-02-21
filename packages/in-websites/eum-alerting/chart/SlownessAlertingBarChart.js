import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import EumAlertingBarChartWrapper from 'in-websites/eum-alerting/chart/EumAlertingBarChartWrapper';
import { getThreshold, getTimeThreshold } from 'in-websites/eum-alerting/alertConfigUtil';
import Renderer from 'in-new-components/Alerting/Chart/renderer/Renderer';
import { millis } from 'in-services/formatters/number';

export default function SlownessAlertingBarChart({
  websiteId,
  aggregation,
  threshold,
  operator,
  sensitivity,
  baseline,
  timeConfig,
  tagFilters,
  thresholdType,
  granularity,
  form
}) {
  return (
    <EumAlertingBarChartWrapper
      alignLegendToLeftSideOfChart
      releaseMarkersDisabled
      isCatalogMetric
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
        nonToggleableSeries: new Map([['onLoadTime', null], ['threshold', null], ['alerts', null]]),
        alertMetricConfiguration: getAlertsConfiguration(
          timeConfig,
          [...tagFilters, getWebsiteIdTagFilter(websiteId)],
          aggregation,
          granularity,
          form
        )
      }}
      metricsConfiguration={{
        timeConfig,
        tagFilters: [...tagFilters, getWebsiteIdTagFilter(websiteId)],
        metrics: {
          onLoadTime: {
            metric: 'onLoadTime',
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
        form
      )}
    />
  );
}

SlownessAlertingBarChart.propTypes = {
  websiteId: PropTypes.string.isRequired,
  aggregation: PropTypes.string.isRequired,
  baseline: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  threshold: PropTypes.number,
  operator: PropTypes.string.isRequired,
  thresholdType: PropTypes.oneOf(['staticThreshold', 'historicBaseline.DAILY', 'historicBaseline.WEEKLY']),
  sensitivity: PropTypes.number,
  granularity: PropTypes.number.isRequired,
  tagFilters: PropTypes.array.isRequired,
  timeConfig: PropTypes.object.isRequired,
  form: PropTypes.object
};

function getWebsiteIdTagFilter(websiteId) {
  return {
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: websiteId
  };
}

function getAlertsConfiguration(timeConfig, tagFilters, aggregation, granularity, form) {
  if (!form) return null;

  const threshold = getThreshold(form);

  if (threshold.baseline || typeof threshold.value === 'number') {
    return {
      timeConfig,
      tagFilters,
      timeThreshold: getTimeThreshold(form),
      threshold,
      granularity, // local alerts/chart granularity
      metrics: {
        alerts: {
          metric: 'onLoadTime',
          aggregation,
          granularity // global metric granularity
        }
      }
    };
  } else {
    return null;
  }
}
