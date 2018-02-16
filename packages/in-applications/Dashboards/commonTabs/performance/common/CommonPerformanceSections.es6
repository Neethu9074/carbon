import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';

// eslint-disable-next-line no-unused-vars
export default function LoggingSections({ applicationId, serviceId, timeframe }) {
  const filter = {
    timeframe,
    application: applicationId,
    service: serviceId
  };

  return (
    <DashboardSection title="Latency Overview">
      <ChartWrapper
        timeframe={timeframe}
        y1={{
          renderer: Renderer.integral,
          labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
          metricIds: [
            'durationMin',
            'duration25th',
            'duration50th',
            'duration75th',
            'duration95th',
            'duration98th',
            'duration99th',
            'durationMax'
          ]
        }}
        metricsConfiguration={{
          filter,
          metrics: {
            durationMin: {
              metric: 'duration.min',
              granularity: getChartGranularity(timeframe),
              aggregation: 'MIN'
            },
            duration25th: {
              metric: 'duration.25th',
              granularity: getChartGranularity(timeframe),
              aggregation: 'P25'
            },
            duration50th: {
              metric: 'duration.25th',
              granularity: getChartGranularity(timeframe),
              aggregation: 'P25'
            },
            duration75th: {
              metric: 'duration.25th',
              granularity: getChartGranularity(timeframe),
              aggregation: 'P25'
            },
            duration95th: {
              metric: 'duration.25th',
              granularity: getChartGranularity(timeframe),
              aggregation: 'P25'
            },
            duration98th: {
              metric: 'duration.98th',
              granularity: getChartGranularity(timeframe),
              aggregation: 'P98'
            },
            duration99th: {
              metric: 'duration.99th',
              granularity: getChartGranularity(timeframe),
              aggregation: 'P99'
            },
            durationMax: {
              metric: 'duration.max',
              granularity: getChartGranularity(timeframe),
              aggregation: 'MAX'
            }
          }
        }}
      />
    </DashboardSection>
  );
}
