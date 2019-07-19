import React from 'react';

import OpenEventsCountChartWrapper from 'in-events/components/OpenEventsCountChartWrapper';
import { MINIMUM_ROLLUP, getDefaultMetricRollupDuration } from 'in-stores/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';

export default function SloViolationsChart({ timeConfig, query, cardTitle = 'SLO Violations' }) {
  const granularity = getDefaultMetricRollupDuration(timeConfig).rollup || MINIMUM_ROLLUP;

  return (
    <OpenEventsCountChartWrapper
      cardTitle={cardTitle}
      timeConfig={timeConfig}
      y1={{
        renderer: Renderer.stackedArea,
        formatter: number.forcedCompact,
        labels: ['SLOs', 'Experimental SLOs'],
        metricIds: ['slo', 'experimentalSlo']
      }}
      metricsConfiguration={{
        timeConfig,
        metrics: {
          slo: {
            query: `event.text:"[SLO]" ${query || ''}`.trim(),
            granularity
          },
          experimentalSlo: {
            query: `event.text:"[experimental SLO]" ${query || ''}`.trim(),
            granularity
          }
        }
      }}
    />
  );
}
