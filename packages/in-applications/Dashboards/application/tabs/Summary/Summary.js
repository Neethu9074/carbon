import React, { Fragment } from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import ServiceTopList from 'in-applications/Dashboards/application/tabs/Summary/ServiceTopList';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import CallsErrors from 'in-applications/Dashboards/commonComponents/CallsErrors';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import AppDataKpiCard from 'in-new-components/KpiCard/AppDataKpiCard';
import { entityTypes } from 'in-analyze/applicationFilter';
import { Row, Col } from 'in-new-components/layout/Grid';
import Footer from 'in-new-components/Footer/Footer';
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

    const MarkerLanes = ApplicationDashboardsMarkerLanes({ applicationId, endpointId, serviceId });

    return (
      <Fragment>
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
              iconAction={{
                text: 'View in Analyze',
                kind: 'subtle',
                icon: 'lib_analyze',
                href$: getJumpToAnalyzeHref$(
                  { applicationId, serviceId, endpointId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupByTag: { name: 'service.name', entity: entityTypes.DESTINATION },
                    filters: [],
                    metrics: [
                      { metric: 'erroneousCalls', aggregation: 'SUM' },
                      {
                        metric: 'latency',
                        aggregation: 'MEAN'
                      }
                    ],
                    focusedMetric: 'calls_SUM'
                  }
                )
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
              iconAction={{
                text: 'View in Analyze',
                kind: 'subtle',
                icon: 'lib_analyze',
                href$: getJumpToAnalyzeHref$(
                  { applicationId, serviceId, endpointId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupByTag: { name: 'service.name', entity: entityTypes.DESTINATION },
                    filters: [{ name: 'call.erroneous', value: 'true' }],
                    metrics: [
                      { metric: 'errors', aggregation: 'MEAN' },
                      { metric: 'latency', aggregation: 'MEAN' }
                    ],
                    focusedMetric: 'errors_MEAN'
                  }
                )
              }}
            />
          </Col>
          <Col xs>
            <AppDataKpiCard
              title="Mean Latency"
              formatter={meanLatency.detailed}
              companionFormatter={v => `${meanLatency.detailed(v)} for 90th`}
              metricsConfig={{
                filter,
                metrics: {
                  latency: {
                    metric: 'latency',
                    aggregation: 'MEAN'
                  },
                  latency90: {
                    metric: 'latency',
                    aggregation: 'P90'
                  }
                }
              }}
              iconAction={{
                text: 'View in Analyze',
                kind: 'subtle',
                icon: 'lib_analyze',
                href$: getJumpToAnalyzeHref$(
                  { applicationId, serviceId, endpointId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupByTag: { name: 'service.name', entity: entityTypes.DESTINATION },
                    orderBy: 'latency_MEAN_Agg',
                    orderDirection: 'DESC'
                  }
                )
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
              renderPostChartContent={MarkerLanes}
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
              renderPostChartContent={MarkerLanes}
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
              renderPostChartContent={MarkerLanes}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={4}>
            <IssuesAndEvents
              applicationId={applicationId}
              timeConfig={timeConfig}
              renderPostChartContent={MarkerLanes}
            />
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
              renderPostChartContent={MarkerLanes}
            />
          </Col>
        </Row>
        <Footer />
      </Fragment>
    );
  }
);
