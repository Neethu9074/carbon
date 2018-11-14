import React from 'react';

import AppdataChartWrapper from 'in-applications/components/AppdataChartWrapper';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';

export default function CallsErrors({ timeConfig, endpointId, applicationId, serviceId, cardTitle }) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <div>
      <AppdataChartWrapper
        cardTitle={cardTitle}
        timeConfig={timeConfig}
        y1={{
          renderer: Renderer.countErrorBar,
          labels: ['Calls', 'Errors'],
          metricIds: ['calls', 'errors']
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
            }
          }
        }}
      />
    </div>
  );
}
