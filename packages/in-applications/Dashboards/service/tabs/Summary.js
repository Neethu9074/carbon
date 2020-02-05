import React from 'react';

import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import EndpointTopList from 'in-applications/Dashboards/service/tabs/EndpointTopList';
import TraceTopList from 'in-applications/Dashboards/commonComponents/TraceTopList';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import CallsErrors from 'in-applications/Dashboards/commonComponents/CallsErrors';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import Latency from 'in-applications/Dashboards/commonComponents/Latency';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { apDashboardEventsEnabled } from 'in-services/featureFlags';
import { entityTypes } from 'in-analyze/applicationFilter';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Summary(props) {
  const { timeConfig, endpointId, applicationId, serviceId, boundaryScope, data } = props;
  const types = data.types;

  const filter = {
    timeConfig,
    endpoint: endpointId,
    application: applicationId,
    service: serviceId,
    applicationBoundaryScope: boundaryScope
  };

  return (
    <>
      <Row>
        <Col xs>
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
        <Col xs>
          <AppDataKpiCard
            title="Erroneous Calls"
            formatter={number.compact}
            companionFormatter={v => `${percentage.detailed(v)} of all calls`}
            metricsConfig={{
              filter,
              metrics: {
                erroneousCalls: {
                  metric: 'erroneousCalls',
                  aggregation: 'SUM'
                },
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
          {types.includes('HTTP') ? (
            <CallsAndHttp
              cardTitle="Calls"
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              boundaryScope={boundaryScope}
              timeConfig={timeConfig}
              callGroupByTag={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
            />
          ) : (
            <CallsErrors
              cardTitle="Calls"
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              boundaryScope={boundaryScope}
              timeConfig={timeConfig}
              groupByTag={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
            />
          )}
        </Col>
        <Col lg={4}>
          <Errors
            cardTitle="Erroneous Call Rate"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            boundaryScope={boundaryScope}
            timeConfig={timeConfig}
            groupByTag={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
          />
        </Col>
        <Col lg={4}>
          <Latency
            cardTitle="Latency"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            boundaryScope={boundaryScope}
            timeConfig={timeConfig}
            groupByTag={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
          />
        </Col>
      </Row>

      {apDashboardEventsEnabled ? (
        <Row>
          <Col lg={4}>
            <IssuesAndEvents applicationId={applicationId} serviceId={serviceId} timeConfig={timeConfig} />
          </Col>
          <Col lg={4}>
            <EndpointTopList
              applicationId={applicationId}
              serviceId={serviceId}
              boundaryScope={boundaryScope}
              timeConfig={timeConfig}
            />
          </Col>
          <Col lg={4}>
            <TechnologyBreakdown applicationId={applicationId} serviceId={serviceId} timeConfig={timeConfig} />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col lg={4}>
            <EndpointTopList
              applicationId={applicationId}
              serviceId={serviceId}
              boundaryScope={boundaryScope}
              groupByTag={{ name: 'call.type', entity: entityTypes.NOT_APPLICABLE }}
              timeConfig={timeConfig}
            />
          </Col>
          <Col lg={4}>
            <TraceTopList
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              applicationBoundaryScope={boundaryScope}
              groupByTag={{ name: 'call.type', entity: entityTypes.NOT_APPLICABLE }}
              timeConfig={timeConfig}
            />
          </Col>
          <Col lg={4}>
            <TechnologyBreakdown applicationId={applicationId} serviceId={serviceId} timeConfig={timeConfig} />
          </Col>
        </Row>
      )}
    </>
  );
}
