import React, { Fragment } from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import ServiceTopList from 'in-applications/Dashboards/application/tabs/Summary/ServiceTopList';
import { DESTINATION, NOT_APPLICABLE } from 'in-new-components/QueryBuilder/tagFilter/entities';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import CallsErrors from 'in-applications/Dashboards/commonComponents/CallsErrors';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import BigNumberKpiCard from 'in-new-components/KpiCard/BigNumberKpiCard';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { entityTypes } from 'in-analyze/applicationFilter';
import { boundaryScopes } from 'in-applications/constants';
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
    data: application,
    boundaryScope: urlBoundaryScope,
    isInternalVisible
  }) {
    const timeShiftConfig = useTimeShiftConfig();
    const boundaryScope = urlBoundaryScope || application.boundaryScope;

    let tagFilters = [
      boundaryScope === boundaryScopes.all
        ? { stringValue: applicationId, name: 'application.id', entity: DESTINATION, operator: EQUALS }
        : {
            stringValue: applicationId,
            name: 'boundary.application.id',
            entity: NOT_APPLICABLE,
            operator: EQUALS
          }
    ];

    const MarkerLanes = ApplicationDashboardsMarkerLanes({ applicationId });
    const withPotentialProblemsLane = isInternalVisible
      ? ApplicationDashboardsMarkerLanes({
          applicationId,
          showPotentialProblemsLane: true
        })
      : MarkerLanes;

    return (
      <Fragment>
        <Row>
          <Col xs>
            <BigNumberKpiCard
              title="Calls"
              formatter={number.compact}
              config={{
                comparisonDecreaseColor: 'redish',
                comparisonIncreaseColor: 'greenish',
                metricConfiguration: {
                  metric: 'calls',
                  aggregation: 'SUM',
                  source: 'APPLICATION',
                  tagFilters: tagFilters,
                  timeShift: timeShiftConfig.offset
                }
              }}
              iconAction={{
                text: 'View in Analyze',
                kind: 'subtle',
                icon: 'lib_analyze',
                href$: getJumpToAnalyzeHref$(
                  { applicationId },
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
            <BigNumberKpiCard
              title="Erroneous Calls"
              formatter={number.compact}
              companionFormatter={v => `${percentage.detailed(v)} of all calls`}
              config={{
                comparisonDecreaseColor: 'greenish',
                comparisonIncreaseColor: 'redish',
                metricConfiguration: {
                  metric: 'erroneousCalls',
                  aggregation: 'SUM',
                  source: 'APPLICATION',
                  tagFilters: tagFilters,
                  timeShift: timeShiftConfig.offset
                },
                companionMetricConfiguration: {
                  metric: 'errors',
                  aggregation: 'MEAN',
                  source: 'APPLICATION',

                  tagFilters: tagFilters
                }
              }}
              iconAction={{
                text: 'View in Analyze',
                kind: 'subtle',
                icon: 'lib_analyze',
                href$: getJumpToAnalyzeHref$(
                  { applicationId },
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
            <BigNumberKpiCard
              title="Mean Latency"
              formatter={meanLatency.detailed}
              companionFormatter={v => `${meanLatency.detailed(v)} for 90th`}
              config={{
                comparisonDecreaseColor: 'greenish',
                comparisonIncreaseColor: 'redish',
                metricConfiguration: {
                  metric: 'latency',
                  aggregation: 'MEAN',
                  source: 'APPLICATION',
                  tagFilters: tagFilters,
                  timeShift: timeShiftConfig.offset
                },
                companionMetricConfiguration: {
                  metric: 'latency',
                  aggregation: 'P90',
                  source: 'APPLICATION',
                  tagFilters: tagFilters
                }
              }}
              iconAction={{
                text: 'View in Analyze',
                kind: 'subtle',
                icon: 'lib_analyze',
                href$: getJumpToAnalyzeHref$(
                  { applicationId },
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
              timeConfig={timeConfig}
              boundaryScope={boundaryScope}
              tagFilters={tagFilters}
              groupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
              renderPostChartContent={withPotentialProblemsLane}
            />
          </Col>
          <Col lg={4}>
            <Errors
              cardTitle="Erroneous Call Rate"
              applicationId={applicationId}
              timeConfig={timeConfig}
              boundaryScope={boundaryScope}
              tagFilters={tagFilters}
              groupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
              renderPostChartContent={withPotentialProblemsLane}
            />
          </Col>
          <Col lg={4}>
            <LatencyAndDistribution
              cardTitle="Latency"
              applicationId={applicationId}
              timeConfig={timeConfig}
              boundaryScope={boundaryScope}
              tagFilters={tagFilters}
              percentileGroupBy={{ name: 'service.name', entity: entityTypes.DESTINATION }}
              renderPostChartContent={withPotentialProblemsLane}
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
