import React, { Fragment } from 'react';

import CallsErrorsLatencyVsTechnologieBreakdown from 'in-applications/Dashboards/commonComponents/CallsErrorsLatencyVsTechnologieBreakdown';
import LatencyDistributionHistogram from 'in-applications/Dashboards/commonComponents/LatencyDistributionHistogram';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import ServiceTopList from 'in-applications/Dashboards/application/tabs/Summary/ServiceTopList';
import { number, millis, percentage } from 'in-services/formatters/number';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Summary({ timeframe, applicationId, endpointId, serviceId }) {
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
          <CallsErrorsLatencyVsTechnologieBreakdown
            cardTitle="Calls vs Latency"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            timeframe={timeframe}
          />
        </Col>
        <Col lg={6}>
          <TechnologyBreakdown applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <ServiceTopList applicationId={applicationId} timeframe={timeframe} />
        </Col>
        <Col lg={6}>
          <LatencyDistributionHistogram
            cardTitle="Latency Distribution"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            timeframe={timeframe}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
