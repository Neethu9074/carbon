import React, { Fragment } from 'react';

import InboundOrAllCallsChoiceHorizontal from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceHorizontal';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import ServiceTopList from 'in-applications/Dashboards/application/tabs/Summary/ServiceTopList';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import TraceTopList from 'in-applications/Dashboards/commonComponents/TraceTopList';
import CallsErrors from 'in-applications/Dashboards/commonComponents/CallsErrors';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import Latency from 'in-applications/Dashboards/commonComponents/Latency';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { apDashboardEventsEnabled } from 'in-services/featureFlags';
import { entityTypes } from 'in-analyze/applicationFilter';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function Summary({
  timeConfig,
  applicationId,
  endpointId,
  serviceId,
  onBoundaryStateChange,
  data: application,
  urlBoundaryScope
}) {
  const boundaryScope = urlBoundaryScope || application.boundaryScope;

  const filter = {
    timeConfig,
    endpoint: endpointId,
    application: applicationId,
    service: serviceId,
    applicationBoundaryScope: boundaryScope
  };

  return (
    <Fragment>
      <InboundOrAllCallsChoiceHorizontal
        boundaryScope={boundaryScope}
        onBoundaryStateChange={onBoundaryStateChange}
        defaultBoundaryScope={application.boundaryScope}
      />
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
            serviceId={serviceId}
            endpointId={endpointId}
            timeConfig={timeConfig}
            boundaryScope={boundaryScope}
            groupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
            metrics={[
              { metric: 'errors', aggregation: 'MEAN' },
              {
                metric: 'latency',
                aggregation: 'MEAN'
              }
            ]}
            showGraph
          />
        </Col>
        <Col lg={4}>
          <Errors
            cardTitle="Errors"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            timeConfig={timeConfig}
            boundaryScope={boundaryScope}
          />
        </Col>
        <Col lg={4}>
          <Latency
            cardTitle="Latency"
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            timeConfig={timeConfig}
            boundaryScope={boundaryScope}
          />
        </Col>
      </Row>
      {apDashboardEventsEnabled ? (
        <Row>
          <Col lg={4}>
            <IssuesAndEvents applicationId={applicationId} timeConfig={timeConfig} />
          </Col>
          <Col lg={4}>
            <ServiceTopList applicationId={applicationId} boundaryScope={boundaryScope} timeConfig={timeConfig} />
          </Col>
          <Col lg={4}>
            <TechnologyBreakdown
              applicationId={applicationId}
              serviceId={serviceId}
              boundaryScope={boundaryScope}
              timeConfig={timeConfig}
            />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col lg={4}>
            <ServiceTopList applicationId={applicationId} boundaryScope={boundaryScope} timeConfig={timeConfig} />
          </Col>
          <Col lg={4}>
            <TraceTopList applicationId={applicationId} timeConfig={timeConfig} />
          </Col>
          <Col lg={4}>
            <TechnologyBreakdown
              applicationId={applicationId}
              serviceId={serviceId}
              boundaryScope={boundaryScope}
              timeConfig={timeConfig}
            />
          </Col>
        </Row>
      )}
    </Fragment>
  );
}
