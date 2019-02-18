import React, { Fragment } from 'react';
import { get } from 'lodash';

import LatencyDistributionHistogram from 'in-applications/Dashboards/commonComponents/LatencyDistributionHistogram';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import TraceTopList from 'in-applications/Dashboards/commonComponents/TraceTopList';
import CallsErrors from 'in-applications/Dashboards/commonComponents/CallsErrors';
import { number, millis, percentage } from 'in-services/formatters/number';
import Latency from 'in-applications/Dashboards/commonComponents/Latency';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { meanLatencyFormatterWrapper } from 'in-applications/metrics';
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
            title="Mean Latency"
            formatter={meanLatencyFormatterWrapper(millis.forcedCompactOnMs).detailed}
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

          <Row>
            <Col lg={12}>
              <LatencyDistributionHistogram
                cardTitle="Latency Distribution"
                applicationId={applicationId}
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
