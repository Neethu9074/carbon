import React from 'react';

import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { millis } from 'in-services/formatters/number';

export default function Latency({ timeConfig, endpointId, applicationId, serviceId, cardTitle }) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <ChartWrapper
      cardTitle={cardTitle}
      timeConfig={timeConfig}
      y1={{
        calculateStackDifferences: true,
        renderer: Renderer.line,
        formatter: millis,
        labels: ['avg', '50th', '75th', '90th', '95th', '99th', 'max'],
        metricIds: [
          'durationAvg',
          'duration50th',
          'duration75th',
          'duration90th',
          'duration95th',
          'duration99th',
          'durationMax'
        ]
      }}
      metricsConfiguration={{
        filter: {
          timeConfig,
          application: applicationId,
          service: serviceId,
          endpoint: endpointId
        },
        metrics: {
          durationAvg: {
            metric: 'latency',
            granularity,
            aggregation: 'MEAN'
          },
          duration25th: {
            metric: 'latency',
            granularity,
            aggregation: 'P25'
          },
          duration50th: {
            metric: 'latency',
            granularity,
            aggregation: 'P50'
          },
          duration75th: {
            metric: 'latency',
            granularity,
            aggregation: 'P75'
          },
          duration90th: {
            metric: 'latency',
            granularity,
            aggregation: 'P90'
          },
          duration95th: {
            metric: 'latency',
            granularity,
            aggregation: 'P95'
          },
          duration99th: {
            metric: 'latency',
            granularity,
            aggregation: 'P99'
          },
          durationMax: {
            metric: 'latency',
            granularity,
            aggregation: 'MAX'
          }
        }
      }}
    />
  );
}
