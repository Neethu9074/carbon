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
        <DashboardSection title="Technology Breakdown">
          <ChartWrapper
            timeframe={timeframe}
            minRollup={60000}
            y1={{
              renderer: Renderer.stackedArea,
              labels: ['Calls', 'Calls 1', 'Calls 2'],
              metricIds: ['calls', 'calls1', 'calls2']
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
                },
                calls1: {
                  metric: 'calls',
                  granularity: 60000,
                  aggregation: 'SUM'
                },
                calls2: {
                  metric: 'calls',
                  granularity: 60000,
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Slow traces">
          <ChartWrapper
            timeframe={timeframe}
            y1={{
              renderer: Renderer.bar,
              labels: ['Traces'],
              metricIds: ['latency']
            }}
            metricsConfiguration={{
              filter: {
                timeframe,
                endpointType: data.type,
                endpoint: data.id
              },
              config: {
                latency: {
                  metric: 'latency',
                  granularity: 60000,
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </DashboardSection>
        <DashboardSection title="Erroneous Traces">
          <ChartWrapper
            timeframe={timeframe}
            minRollup={60000}
            y1={{
              renderer: Renderer.bar,
              labels: ['Erroneous traces'],
              metricIds: ['error']
            }}
            metricsConfiguration={{
              filter: {
                timeframe,
                endpointType: data.type,
                endpoint: data.id
              },
              config: {
                error: {
                  metric: 'error',
                  granularity: 60000,
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </DashboardSection>
        <DashboardSection title="Incidents">
          <ChartWrapper
            timeframe={timeframe}
            minRollup={60000}
            y1={{
              renderer: Renderer.bar,
              labels: ['Incidents'],
              metricIds: ['error']
            }}
            metricsConfiguration={{
              filter: {
                timeframe,
                endpointType: data.type,
                endpoint: data.id
              },
              config: {
                error: {
                  metric: 'error',
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
