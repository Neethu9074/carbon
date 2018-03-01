import React from 'react';

import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { millis } from 'in-services/formatters/number';

export default function CallsErrorsLatencyVsTechnologieBreakdown({ timeframe, endpointId, applicationId, serviceId }) {
  const granularity = getChartGranularity(timeframe);

  return (
    <div>
      <ChartWrapper
        renderXAxis={false}
        timeframe={timeframe}
        y1={{
          renderer: Renderer.countErrorBar,
          labels: ['Calls', 'Errors'],
          metricIds: ['calls', 'errors']
        }}
        y2={{
          renderer: Renderer.line,
          labels: ['Latency'],
          colors: ['#9d96ff'],
          formatter: millis,
          metricIds: ['latency']
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
      <TechnologyBreakdown
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeframe={timeframe}
      />
    </div>
  );
}
