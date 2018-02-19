import React from 'react';

import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import TraceTopList from 'in-applications/Dashboards/commonComponents/TraceTopList';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, ms, percentage } from 'in-services/formatters/number';
import { KpiSection, AppKpi } from 'in-components/Kpis/KpiSection';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import Columize from 'in-sdk/components/dashboard/Columize';
import { millis } from 'in-services/formatters/number';

export default function Summary({ timeframe, applicationId, serviceId, endpointId }) {
  const filter = {
    timeframe,
    endpoint: endpointId,
    application: applicationId,
    service: serviceId
  };

  const granularity = getChartGranularity(timeframe);

  return (
    <MaxWidthFullscreenContainer>
      <KpiSection>
        <AppKpi
          label="Calls"
          formatter={number}
          metricsConfig={{
            filter,
            metrics: {
              calls: {
                metric: 'calls',
                aggregation: 'SUM'
              }
            }
          }}
        />
        <AppKpi
          label="Latency"
          formatter={ms}
          metricsConfig={{
            filter,
            metrics: {
              latency: {
                metric: 'latency',
                aggregation: 'MEAN'
              }
            }
          }}
        />
        <AppKpi
          label="Errors"
          formatter={percentage}
          metricsConfig={{
            filter,
            metrics: {
              errors: {
                metric: 'errors',
                aggregation: 'MEAN'
              }
            }
          }}
        />
      </KpiSection>

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
              filter,
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
        </DashboardSection>

        <DashboardSection title="Downstream Breakdown">
          <TechnologyBreakdown
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            timeframe={timeframe}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Top Traces">
        <TraceTopList
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          timeframe={timeframe}
        />
      </DashboardSection>
    </MaxWidthFullscreenContainer>
  );
}
