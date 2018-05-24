import React from 'react';

import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { percentage } from 'in-services/formatters/number';
import theme from 'in-themes';

export default function Errors({ timeConfig, endpointId, applicationId, serviceId, cardTitle }) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <div>
      <ChartWrapper
        cardTitle={cardTitle}
        timeConfig={timeConfig}
        y1={{
          renderer: Renderer.bar,
          formatter: percentage,
          labels: ['Errors'],
          colors: [theme.lib.colors.failure],
          metricIds: ['errors']
        }}
        metricsConfiguration={{
          filter: {
            timeConfig,
            endpoint: endpointId,
            application: applicationId,
            service: serviceId
          },
          metrics: {
            errors: {
              metric: 'errors',
              granularity,
              aggregation: 'MEAN'
            }
          }
        }}
      />
    </div>
  );
}
