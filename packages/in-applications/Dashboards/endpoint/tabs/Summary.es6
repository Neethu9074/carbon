import React from 'react';

import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import TraceTopList from 'in-applications/Dashboards/commonComponents/TraceTopList';
import { number, millis, percentage } from 'in-services/formatters/number';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

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
      <Row>
        <Col lg={4}>
          <AppDataKpiCard
            title="Calls"
            formatter={number.detailed}
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
        </Col>
        <Col lg={4}>
          <AppDataKpiCard
            title="Latency"
            formatter={millis.detailed}
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
        </Col>
        <Col lg={4}>
          <AppDataKpiCard
            title="Errors"
            formatter={percentage.detailed}
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
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Card title="Calls vs. Latency">
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
                colors: ['#9d96ff'],
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
          </Card>
        </Col>
        <Col lg={6}>
          <Card title="Downstream Breakdown">
            <TechnologyBreakdown
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              timeframe={timeframe}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <TraceTopList
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            timeframe={timeframe}
          />
        </Col>
      </Row>
    </MaxWidthFullscreenContainer>
  );
}
