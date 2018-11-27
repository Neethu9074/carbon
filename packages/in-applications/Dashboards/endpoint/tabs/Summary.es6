import React, { Fragment } from 'react';

import LatencyDistributionHistogram from 'in-applications/Dashboards/commonComponents/LatencyDistributionHistogram';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import CallsErrors from 'in-applications/Dashboards/commonComponents/CallsErrors';
import TopTraces from 'in-applications/Dashboards/commonComponents/TopTraces';
import { number, millis, percentage } from 'in-services/formatters/number';
import Latency from 'in-applications/Dashboards/commonComponents/Latency';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Summary({ timeConfig, applicationId, serviceId, endpointId, data }) {
  const includeSyntheticCalls = data.synthetic;

  const filter = {
    timeConfig,
    endpoint: endpointId,
    application: applicationId,
    service: serviceId,
    includeSyntheticCalls
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
      </Row>

      <Row>
        <Col lg={4}>
          <CallsErrors
            cardTitle="Calls"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            includeSyntheticCalls={includeSyntheticCalls}
            timeConfig={timeConfig}
          />
        </Col>
        <Col lg={4}>
          <Errors
            cardTitle="Errors"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            includeSyntheticCalls={includeSyntheticCalls}
            timeConfig={timeConfig}
          />
        </Col>
        <Col lg={4}>
          <Latency
            cardTitle="Latency"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            includeSyntheticCalls={includeSyntheticCalls}
            timeConfig={timeConfig}
          />
        </Col>
      </Row>

      {!data.synthetic && (
        <Fragment>
          <Row>
            <Col lg={6}>
              <TopTraces
                applicationId={applicationId}
                serviceId={serviceId}
                endpointId={endpointId}
                timeConfig={timeConfig}
              />
            </Col>
            <Col lg={6}>
              <TechnologyBreakdown
                applicationId={applicationId}
                serviceId={serviceId}
                endpointId={endpointId}
                timeConfig={timeConfig}
              />
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
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
      )}
    </Fragment>
  );
}
