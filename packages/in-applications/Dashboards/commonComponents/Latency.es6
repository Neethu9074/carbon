import React from 'react';

import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { millis, latencyFixed, meanLatencyFixed } from 'in-services/formatters/number';

export default function Latency({
  timeConfig,
  endpointId,
  applicationId,
  serviceId,
  includeSyntheticCalls,
  cardTitle
}) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <AppdataChartWrapper
      cardTitle={cardTitle}
      timeConfig={timeConfig}
      reverseTooltipOrder
      shareMaxAxisDomain
      y1={{
        renderer: Renderer.integral,
        formatter: millis.forcedFixedCompact,
        tooltipFormatter: latencyFixed.compact,
        labels: ['50th', '90th', '95th', '99th', 'Max'],
        defaultDisabledMetrics: ['durationMax'],
        metricIds: ['duration50th', 'duration90th', 'duration95th', 'duration99th', 'durationMax']
      }}
      y2={{
        renderer: Renderer.line,
        formatter: millis.forcedFixedCompact,
        tooltipFormatter: meanLatencyFixed.compact,
        labels: ['Mean'],
        defaultDisabledMetrics: ['durationAvg'],
        metricIds: ['durationAvg']
      }}
      metricsConfiguration={{
        filter: {
          timeConfig,
          application: applicationId,
          service: serviceId,
          endpoint: endpointId,
          includeSyntheticCalls
        },
        metrics: {
          duration50th: {
            metric: 'latency',
            granularity,
            aggregation: 'P50'
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
          },
          durationAvg: {
            metric: 'latency',
            granularity,
            aggregation: 'MEAN'
          }
        }
      }}
    />
  );
}
