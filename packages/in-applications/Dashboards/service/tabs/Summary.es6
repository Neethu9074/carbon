import React, { Fragment } from 'react';

import CallsErrorsLatencyVsTechnologieBreakdown from 'in-applications/Dashboards/commonComponents/CallsErrorsLatencyVsTechnologieBreakdown';
import LatencyDistributionHistogram from 'in-applications/Dashboards/commonComponents/LatencyDistributionHistogram';
import EndpointTopList from 'in-applications/Dashboards/service/tabs/EndpointTopList';
import TopTraces from 'in-applications/Dashboards/commonComponents/TopTraces';
import { number, millis, percentage } from 'in-services/formatters/number';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { Row, Col } from 'in-new-components/layout/Grid';

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
          <LatencyDistributionHistogram
            cardTitle="Latency Distribution"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            timeframe={timeframe}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <EndpointTopList applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
        </Col>
        <Col lg={6}>
          <TopTraces
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
