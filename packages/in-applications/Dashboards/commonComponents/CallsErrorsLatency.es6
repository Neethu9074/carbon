import React from 'react';

import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { millis } from 'in-services/formatters/number';
import theme from 'in-themes';

export default function CallsErrorsLatency({ timeConfig, endpointId, applicationId, serviceId, cardTitle }) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <div>
      <ChartWrapper
        cardTitle={cardTitle}
        timeConfig={timeConfig}
        y1={{
          renderer: Renderer.countErrorBar,
          labels: ['Calls', 'Errors'],
          metricIds: ['calls', 'errors']
        }}
        y2={{
          renderer: Renderer.line,
          labels: ['Latency'],
          metricIds: ['latency'],
          colors: [theme.app20Chart.strokeColors100[2]],
          formatter: {
            compact: millis.detailed,
            detailed: millis.detailed
          },
          min: 0
        }}
        metricsConfiguration={{
          filter: {
            timeConfig,
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
