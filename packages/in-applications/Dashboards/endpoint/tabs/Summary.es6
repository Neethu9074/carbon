import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

import Columize from 'in-sdk/components/dashboard/Columize';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';

export default function Summary({ timeframe, data }) {
  return (
    <MaxWidthFullscreenContainer>
      <Columize>
        <DashboardSection>
          <ChartWrapper
            timeframe={timeframe}
            minRollup={60000}
            y1={{
              renderer: Renderer.line,
              labels: ['Calls'],
              metricIds: ['calls']
            }}
            metricsConfiguration={{
              filter: {
                timeframe,
                endpointType: data.type,
                endpoint: data.id
              },
              config: {
                calls: {
                  metric: 'calls',
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
