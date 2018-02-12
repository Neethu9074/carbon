import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

import Columize from 'in-sdk/components/dashboard/Columize';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { millis } from 'in-services/formatters/number';

export default function Summary({ timeframe, data, applicationId, serviceId }) {
  return (
    <MaxWidthFullscreenContainer>
      <Columize>
        <DashboardSection>
          <ChartWrapper
            timeframe={timeframe}
            y1={{
              renderer: Renderer.countErrorBar,
              labels: ['Calls', 'Errors'],
              metricIds: ['calls', 'errors']
            }}
            y2={{
              renderer: Renderer.line,
              labels: ['Latency'],
              colors: ['#57a7f0'],
              formatter: millis,
              metricIds: ['latency']
            }}
            metricsConfiguration={{
              filter: {
                timeframe,
                endpointType: data.type,
                endpoint: data.id,
                application: applicationId,
                service: serviceId
              },
              config: {
                calls: {
                  metric: 'calls',
                  granularity: 60000,
                  aggregation: 'SUM'
                },
                errors: {
                  metric: 'errors',
                  granularity: 60000,
                  aggregation: 'SUM'
                },
                latency: {
                  metric: 'latency',
                  granularity: 60000,
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </DashboardSection>
      </Columize>
    </MaxWidthFullscreenContainer>
  );
}
