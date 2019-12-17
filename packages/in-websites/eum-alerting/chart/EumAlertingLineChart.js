import PropTypes from 'prop-types';
import React from 'react';

import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { millis } from 'in-services/formatters/number';
import theme from 'in-themes';

// TODO: Add line renderer when api is available. Til then we use the bar renderer
export default function EumAlertingLineChart({ aggregation, threshold, timeConfig, tagFilters, granularity }) {
  return (
    <WebsiteChartWrapper
      alignLegendToLeftSideOfChart
      releaseMarkersDisabled
      timeConfig={timeConfig}
      granularity={granularity}
      y1={{
        threshold,
        getMax: metricsMaxValue => {
          return threshold >= metricsMaxValue
            ? Math.max(metricsMaxValue, Math.trunc(threshold) * 1.2)
            : metricsMaxValue;
        },
        colors: [
          theme.lib.colors.blue800,
          theme.lib.colors.pink800,
          theme.lib.colors.red800,
          theme.lib.colors.lightBlue800
        ],
        icons: {
          types: ['lib_bar_chart', 'lib_threshold', 'lib_actions_stop', 'lib_actions_stop'],
          colors: [
            theme.lib.colors.blue800,
            theme.lib.colors.red800,
            theme.lib.colors.pink800,
            theme.lib.colors.lightBlue800
          ]
        },
        // renderer: Renderer.lineWithBaseline,
        renderer: Renderer.errorsBarWithBaseline,
        formatter: millis.forcedFixedCompact,
        metricIds: ['onLoadTime'],
        labels: ['Historical data', 'Threshold', 'Expected Range', 'Violations'],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        // metricIds: ['errors', 'threshold'],
        nonToggleableSeries: new Map([['errors', null], ['threshold', null]])
      }}
      metricsConfiguration={{
        timeConfig,
        tagFilters,
        metrics: {
          onLoadTime: {
            metric: 'onLoadTime',
            granularity,
            aggregation
          }
        }
      }}
    />
  );
}

EumAlertingLineChart.propTypes = {
  threshold: PropTypes.number.isRequired,
  granularity: PropTypes.number.isRequired,
  tagFilters: PropTypes.array.isRequired,
  aggregation: PropTypes.string.isRequired,
  timeConfig: PropTypes.object.isRequired
};
