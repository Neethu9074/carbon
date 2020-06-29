import React, { Fragment } from 'react';
import { get } from 'lodash';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
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
  function Summary({ timeConfig, applicationId, serviceId, endpointId, boundaryScope, data }) {
    const includeSyntheticCalls = get(data, 'synthetic', false);
    const type = data.type;

    const filter = {
      timeConfig,
      endpoint: endpointId,
      application: applicationId,
      applicationBoundaryScope: boundaryScope,
      includeSyntheticCalls
    };

    const postChartContent = timeConfig => <MarkerLanesPresenter timeConfig={timeConfig} />;

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
            {type.includes('HTTP') ? (
              <CallsAndHttp
                cardTitle="Calls"
                applicationId={applicationId}
                serviceId={serviceId}
                endpointId={endpointId}
                boundaryScope={boundaryScope}
                includeSyntheticCalls={includeSyntheticCalls}
                timeConfig={timeConfig}
                callGroupByTag={{ name: 'call.name', entity: entityTypes.NOT_APPLICABLE }}
                renderPostChartContent={postChartContent}
              />
            ) : (
              <CallsErrors
                cardTitle="Calls"
                applicationId={applicationId}
                serviceId={serviceId}
                endpointId={endpointId}
                boundaryScope={boundaryScope}
                includeSyntheticCalls={includeSyntheticCalls}
                timeConfig={timeConfig}
                groupByTag={{ name: 'call.name', entity: entityTypes.NOT_APPLICABLE }}
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
              includeSyntheticCalls={includeSyntheticCalls}
              timeConfig={timeConfig}
              groupByTag={{ name: 'call.name', entity: entityTypes.NOT_APPLICABLE }}
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
              includeSyntheticCalls={includeSyntheticCalls}
              timeConfig={timeConfig}
              percentileGroupBy={{ name: 'endpoint.name', entity: entityTypes.NOT_APPLICABLE }}
              callType={type}
              renderPostChartContent={postChartContent}
            />
          </Col>
        </Row>
        {!includeSyntheticCalls && (
          <Fragment>
            <Row>
              <Col lg={6}>
                <IssuesAndEvents
                  applicationId={applicationId}
                  serviceId={serviceId}
                  endpointId={endpointId}
                  timeConfig={timeConfig}
                  renderPostChartContent={postChartContent}
                />
              </Col>
              <Col lg={6}>
                {type.includes('DATABASE') ? (
                  <DatabaseSections
                    boundaryScope={boundaryScope}
                    applicationId={applicationId}
                    serviceId={serviceId}
                    endpointId={endpointId}
                    timeConfig={timeConfig}
                  />
                ) : (
                  <TechnologyBreakdown
                    applicationId={applicationId}
                    endpointId={endpointId}
                    timeConfig={timeConfig}
                    renderPostChartContent={postChartContent}
                  />
                )}
              </Col>
            </Row>
          </Fragment>
        )}
      </Fragment>
    );
  }
);
