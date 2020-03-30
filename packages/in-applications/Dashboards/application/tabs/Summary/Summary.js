import React, { Fragment } from 'react';

import InboundOrAllCallsChoiceHorizontal from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceHorizontal';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import ServiceTopList from 'in-applications/Dashboards/application/tabs/Summary/ServiceTopList';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import CallsErrors from 'in-applications/Dashboards/commonComponents/CallsErrors';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { entityTypes } from 'in-analyze/applicationFilter';
import { Row, Col } from 'in-new-components/layout/Grid';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function Summary({
    timeConfig,
    applicationId,
    endpointId,
    serviceId,
    onBoundaryStateChange,
    data: application,
    boundaryScope: urlBoundaryScope
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
            <CallsErrors
              cardTitle="Calls"
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              timeConfig={timeConfig}
              boundaryScope={boundaryScope}
              groupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
            />
          </Col>
          <Col lg={4}>
            <Errors
              cardTitle="Erroneous Call Rate"
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              timeConfig={timeConfig}
              boundaryScope={boundaryScope}
              groupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
            />
          </Col>
          <Col lg={4}>
            <LatencyAndDistribution
              cardTitle="Latency"
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              timeConfig={timeConfig}
              boundaryScope={boundaryScope}
              percentileGroupBy={{ name: 'service.name', entity: entityTypes.DESTINATION }}
            />
          </Col>
        </Row>
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
      </Fragment>
    );
  }
);
