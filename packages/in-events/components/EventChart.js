import React from 'react';

import OpenEventsCountChartWrapper from 'in-events/components/OpenEventsCountChartWrapper';
import { MINIMUM_ROLLUP, getDefaultMetricRollupDuration } from 'in-stores/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import { query$ } from 'in-stores/search/query';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$,
    query: query$
  },
  function EventChart({ timeConfig, query, cardTitle = 'Open events' }) {
    const granularity = getDefaultMetricRollupDuration(timeConfig).rollup || MINIMUM_ROLLUP;

    return (
      <OpenEventsCountChartWrapper
        cardTitle={cardTitle}
        timeConfig={timeConfig}
        y1={{
          renderer: Renderer.stackedArea,
          formatter: number.forcedCompact,
          labels: ['Incidents', 'Issues', 'Changes'],
          metricIds: ['incidents', 'issues', 'changes']
        }}
        metricsConfiguration={{
          timeConfig,
          metrics: {
            incidents: {
              query: `event.type:incident ${query || ''}`.trim(),
              granularity
            },
            issues: {
              query: `event.type:issue ${query || ''}`.trim(),
              granularity
            },
            changes: {
              query: `event.type:change ${query || ''}`.trim(),
              granularity
            }
          }
        }}
      />
    );
  }
);
