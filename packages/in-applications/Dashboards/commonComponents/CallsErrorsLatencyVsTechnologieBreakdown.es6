import React from 'react';

import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { millis } from 'in-services/formatters/number';

export default function CallsErrorsLatencyVsTechnologieBreakdown({
  timeframe,
  endpointId,
  applicationId,
  serviceId,
  cardTitle
}) {
  const granularity = getChartGranularity(timeframe);

  return (
    <div>
      <ChartWrapper
        cardTitle={cardTitle}
        timeframe={timeframe}
        y1={{
          renderer: Renderer.countErrorBar,
          labels: ['Calls', 'Errors'],
          metricIds: ['calls', 'errors']
        }}
        y2={{
          renderer: Renderer.line,
          labels: ['Latency'],
          metricIds: ['latency'],
          formatter: millis,
          min: 0
        }}
        metricsConfiguration={{
          filter: {
            timeframe,
            endpoint: endpointId,
            application: applicationId,
            service: serviceId
          },
          metrics: {
            calls: {
              metric: 'calls',
              granularity,
              aggregation: 'SUM'
            },
            errors: {
              metric: 'errors',
              granularity,
              aggregation: 'MEAN'
            },
            latency: {
              metric: 'latency',
              granularity,
              aggregation: 'MEAN'
            }
          }
        }}
      />
    </div>
  );
}
