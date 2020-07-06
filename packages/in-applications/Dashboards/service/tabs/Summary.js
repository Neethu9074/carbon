import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import ReleaseMarkerLane from 'in-components/Chart/markerLanes/ReleaseMarkerLane/ReleaseMarkerLane';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import EndpointTopList from 'in-applications/Dashboards/service/tabs/EndpointTopList';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
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
  function Summary(props) {
    const { timeConfig, endpointId, applicationId, serviceId, boundaryScope: boundaryScope, data } = props;
    const types = data.types;

    const filter = {
      timeConfig,
      endpoint: endpointId,
      application: applicationId,
      service: serviceId,
      applicationBoundaryScope: boundaryScope
    };

    const postChartContent = props => (
      <MarkerLanesPresenter {...props} isClustered>
        <ReleaseMarkerLane />
      </MarkerLanesPresenter>
    );

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
                renderPostChartContent={postChartContent}
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
                renderPostChartContent={postChartContent}
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
              renderPostChartContent={postChartContent}
            />
          </Col>
          <Col lg={4}>
            <LatencyAndDistribution
              cardTitle="Latency"
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              boundaryScope={boundaryScope}
              timeConfig={timeConfig}
              percentileGroupBy={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
              callType={data.types[0]}
              renderPostChartContent={postChartContent}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={4}>
            <IssuesAndEvents
              applicationId={applicationId}
              serviceId={serviceId}
              timeConfig={timeConfig}
              renderPostChartContent={postChartContent}
            />
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
            {types.includes('DATABASE') ? (
              <DatabaseSections boundaryScope={boundaryScope} {...props} />
            ) : (
              <TechnologyBreakdown
                applicationId={applicationId}
                serviceId={serviceId}
                timeConfig={timeConfig}
                renderPostChartContent={postChartContent}
              />
            )}
          </Col>
        </Row>
      </>
    );
  }
);
