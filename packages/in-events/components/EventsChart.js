import React from 'react';

import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';
import OpenEventsCountChartWrapper from 'in-events/components/OpenEventsCountChartWrapper';
import { MINIMUM_ROLLUP, getDefaultMetricRollupDuration } from 'in-stores/metric';
import getElementDimensions from 'in-hoc/getElementDimensions';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import { query$ } from 'in-stores/search/query';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

import locals from './EventsChart.mless';

export default getElementDimensions(
  connectTo(
    {
      timeConfig: timeConfig$,
      query: query$
    },
    function EventChart({ width, timeConfig, query, cardTitle = 'Open events' }) {
      if (!width) {
        return <div />;
      }

      let granularity = getDefaultMetricRollupDuration(timeConfig).rollup || MINIMUM_ROLLUP;
      const blockSizeMillis = getPredefinedBlockSizeMillisForBlockSize(
        getBlockSizeMillis({
          windowSize: timeConfig.windowSize,
          minPixelsPerBlock: 5,
          width,
          rollup: granularity
        })
      );
      granularity = getDefaultMetricRollupDuration(timeConfig, blockSizeMillis).rollup || MINIMUM_ROLLUP;

      return (
        <>
          <div className={locals.spacer} />
          <OpenEventsCountChartWrapper
            cardTitle={cardTitle}
            timeConfig={timeConfig}
            granularity={granularity}
            y1={{
              renderer: Renderer.stackedBar,
              formatter: number.forcedCompact,
              labels: ['Incidents', 'Critical', 'Warning', 'Offline', 'Online', 'Changes'],
              metricIds: ['incidents', 'critical', 'warning', 'offline', 'online', 'changes'],
              colors: [
                theme.lib.colors.orange800,
                theme.lib.colors.red800,
                theme.lib.colors.yellow800,
                '#9aa5a9',
                '#99e1e1',
                '#a2d9f5'
              ]
            }}
            metricsConfiguration={{
              timeConfig,
              metrics: {
                incidents: {
                  query: `event.type:incident ${query || ''}`.trim(),
                  granularity
                },
                critical: {
                  query: `event.type:critical ${query || ''}`.trim(),
                  granularity
                },
                warning: {
                  query: `event.type:warning ${query || ''}`.trim(),
                  granularity
                },
                offline: {
                  query: `event.type:offline ${query || ''}`.trim(),
                  granularity
                },
                online: {
                  query: `event.type:online ${query || ''}`.trim(),
                  granularity
                },
                changes: {
                  query: `event.type:change ${query || ''}`.trim(),
                  granularity
                }
              }
            }}
          />
        </>
      );
    }
  )
);
