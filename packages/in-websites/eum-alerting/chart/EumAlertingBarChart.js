import React from 'react';

import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper.js';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import theme from 'in-themes';

export default function EumAlertingBarChart({ threshold, timeConfig, tagFilters }) {
  return (
    <WebsiteChartWrapper
      isDebounced
      alignLegendToLeftSideOfChart
      releaseMarkersDisabled
      timeConfig={timeConfig}
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
          types: ['lib_actions_stop', 'lib_actions_stop', 'lib_menu_more_horizontal']
        },
        renderer: Renderer.errorsBarWithBaseline,
        formatter: number.forcedCompact,
        labels: ['Historical data', 'Violations', 'Threshold'],
        metricIds: ['errors']
      }}
      metricsConfiguration={{
        timeConfig,
        tagFilters,
        metrics: {
          errors: {
            metric: 'errors',
            granularity: getChartGranularity(timeConfig),
            aggregation: 'SUM'
          }
        }
      }}
    />
  );
}
