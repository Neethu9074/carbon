import React, { Fragment } from 'react';

import LatencyDistributionHistogram from 'in-applications/Dashboards/commonComponents/LatencyDistributionHistogram';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import CallsErrorsLatency from 'in-applications/Dashboards/commonComponents/CallsErrorsLatency';
import ServiceTopList from 'in-applications/Dashboards/application/tabs/Summary/ServiceTopList';
import { number, millis, percentage } from 'in-services/formatters/number';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Summary({ timeConfig, applicationId, endpointId, serviceId }) {
  const filter = {
    timeConfig,
    endpoint: endpointId,
    application: applicationId,
    service: serviceId
  };

  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <AppDataKpiCard
            title="Total Calls"
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
            title="Avg. Latency"
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
            title="Error Rate"
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
          <CallsErrorsLatency
            cardTitle="Calls vs Latency"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            timeConfig={timeConfig}
          />
        </Col>
        <Col lg={6}>
          <TechnologyBreakdown applicationId={applicationId} serviceId={serviceId} timeConfig={timeConfig} />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <ServiceTopList applicationId={applicationId} timeConfig={timeConfig} />
        </Col>
        <Col lg={6}>
          <LatencyDistributionHistogram
            cardTitle="Latency Distribution"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            timeConfig={timeConfig}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
