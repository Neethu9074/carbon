import React, { Fragment } from 'react';

import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import { newApplicationMonitoringFeaturePlaceholdersEnabled } from 'in-services/featureFlags';
import dummyHeatMap from 'in-applications/Dashboards/service/tabs/time-distribution.png';
import EndpointTopList from 'in-applications/Dashboards/service/tabs/EndpointTopList';
import TraceTopList from 'in-applications/Dashboards/commonComponents/TraceTopList';
import { number, millis, percentage } from 'in-services/formatters/number';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

export default function Summary({ timeframe, endpointId, applicationId, serviceId }) {
  const filter = {
    timeframe,
    endpoint: endpointId,
    application: applicationId,
    service: serviceId
  };

  const granularity = getChartGranularity(timeframe);

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <AppDataKpiCard
            title="Calls"
            formatter={number.compact}
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
          <Card title="Contribution Breakdown">
            <TechnologyBreakdown applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
          </Card>
        </Col>
      </Row>

      {newApplicationMonitoringFeaturePlaceholdersEnabled && (
        <Row>
          <Col lg={12}>
            <Card title="Latency Distribution">
              <img src={dummyHeatMap} alt="Dummy heat map" />
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={6}>
          <TraceTopList applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
        </Col>
        <Col lg={6}>
          <EndpointTopList applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
        </Col>
      </Row>
    </Fragment>
  );
}
