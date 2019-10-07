import React, { Fragment } from 'react';
import { get } from 'lodash';

import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import TraceTopList from 'in-applications/Dashboards/commonComponents/TraceTopList';
import CallsErrors from 'in-applications/Dashboards/commonComponents/CallsErrors';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import Latency from 'in-applications/Dashboards/commonComponents/Latency';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Summary({ timeConfig, applicationId, serviceId, endpointId, data }) {
  const includeSyntheticCalls = get(data, 'synthetic', false);

  const filter = {
    timeConfig,
    endpoint: endpointId,
    application: applicationId,
    includeSyntheticCalls
  };

  return (
    <Fragment>
      <Row>
        <Col xs>
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
        <Col xs>
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
        <Col xs>
          <AppDataKpiCard
            title="Mean Latency"
            formatter={meanLatency.detailed}
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
            endpointId={endpointId}
            includeSyntheticCalls={includeSyntheticCalls}
            timeConfig={timeConfig}
          />
        </Col>
        <Col lg={4}>
          <Errors
            cardTitle="Errors"
            applicationId={applicationId}
            endpointId={endpointId}
            includeSyntheticCalls={includeSyntheticCalls}
            timeConfig={timeConfig}
          />
        </Col>
        <Col lg={4}>
          <Latency
            cardTitle="Latency"
            applicationId={applicationId}
            endpointId={endpointId}
            includeSyntheticCalls={includeSyntheticCalls}
            timeConfig={timeConfig}
          />
        </Col>
      </Row>

      {!includeSyntheticCalls && (
        <Fragment>
          <Row>
            <Col lg={6}>
              <TraceTopList
                applicationId={applicationId}
                serviceId={serviceId}
                endpointId={endpointId}
                timeConfig={timeConfig}
              />
            </Col>
            <Col lg={6}>
              <TechnologyBreakdown applicationId={applicationId} endpointId={endpointId} timeConfig={timeConfig} />
            </Col>
          </Row>
        </Fragment>
      )}
    </Fragment>
  );
}
