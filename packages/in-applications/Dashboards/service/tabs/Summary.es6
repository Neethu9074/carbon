import React, { Fragment } from 'react';

import CallsErrorsLatencyVsTechnologieBreakdown from 'in-applications/Dashboards/commonComponents/CallsErrorsLatencyVsTechnologieBreakdown';
import { newApplicationMonitoringFeaturePlaceholdersEnabled } from 'in-services/featureFlags';
import dummyHeatMap from 'in-applications/Dashboards/service/tabs/time-distribution.png';
import EndpointTopList from 'in-applications/Dashboards/service/tabs/EndpointTopList';
import TraceTopList from 'in-applications/Dashboards/commonComponents/TraceTopList';
import { number, millis, percentage } from 'in-services/formatters/number';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

export default function Summary({ timeframe, endpointId, applicationId, serviceId }) {
  const filter = {
    timeframe,
    endpoint: endpointId,
    application: applicationId,
    service: serviceId
  };

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
        <Col lg={newApplicationMonitoringFeaturePlaceholdersEnabled ? 6 : 12}>
          <Card title="Calls vs Latency">
            <CallsErrorsLatencyVsTechnologieBreakdown
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              timeframe={timeframe}
            />
          </Card>
        </Col>

        {newApplicationMonitoringFeaturePlaceholdersEnabled && (
          <Col lg={6}>
            <Card title="Latency Distribution">
              <img src={dummyHeatMap} alt="Dummy heat map" style={{ width: '100%' }} />
            </Card>
          </Col>
        )}
      </Row>

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
