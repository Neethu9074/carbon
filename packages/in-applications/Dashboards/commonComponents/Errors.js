import React from 'react';

import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { percentage } from 'in-services/formatters/number';
import theme from 'in-themes';

export default function Errors({ timeConfig, endpointId, applicationId, serviceId, includeSyntheticCalls, cardTitle }) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <div>
      <AppdataChartWrapper
        cardTitle={cardTitle}
        timeConfig={timeConfig}
        y1={{
          renderer: Renderer.bar,
          formatter: percentage,
          detailedFormatting: true,
          labels: ['Errors'],
          colors: [theme.lib.colors.failure],
          metricIds: ['errors']
        }}
        metricsConfiguration={{
          filter: {
            timeConfig,
            endpoint: endpointId,
            application: applicationId,
            service: serviceId,
            includeSyntheticCalls
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
