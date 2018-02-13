import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

import Columize from 'in-sdk/components/dashboard/Columize';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { millis } from 'in-services/formatters/number';
import { getChartGranularity } from 'in-applications/metrics';

import { KpiSection, AppKpi } from 'in-components/Kpis/KpiSection';
import { number, ms, percentage } from 'in-services/formatters/number';

export default function Summary({ timeframe, data, applicationId, serviceId }) {
  const filter = {
    timeframe,
    endpoint: data.id,
    application: applicationId,
    service: serviceId
  };

  return (
    <MaxWidthFullscreenContainer>
      <Columize>
        <DashboardSection>
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
                    aggregation: 'SUM'
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
                    aggregation: 'SUM'
                  }
                }
              }}
            />
          </KpiSection>
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
                  granularity: getChartGranularity(timeframe),
                  aggregation: 'SUM'
                },
                errors: {
                  metric: 'errors',
                  granularity: getChartGranularity(timeframe),
                  aggregation: 'SUM'
                },
                latency: {
                  metric: 'latency',
                  granularity: getChartGranularity(timeframe),
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
