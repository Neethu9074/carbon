import React, { Fragment } from 'react';
import { get } from 'lodash';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
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
                    groupByTag: { name: 'call.name', entity: entityTypes.NOT_APPLICABLE },
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
                    groupByTag: { name: 'call.name', entity: entityTypes.NOT_APPLICABLE },
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
                    groupByTag: { name: 'call.name', entity: entityTypes.NOT_APPLICABLE },
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
                renderPostChartContent={MarkerLanes}
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
                renderPostChartContent={MarkerLanes}
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
              renderPostChartContent={MarkerLanes}
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
              renderPostChartContent={MarkerLanes}
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
                  renderPostChartContent={MarkerLanes}
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
                    renderPostChartContent={MarkerLanes}
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
