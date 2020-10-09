import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import { DESTINATION, NOT_APPLICABLE } from 'in-new-components/QueryBuilder/tagFilter/entities';
import { hasHttpEndpoints, hasHttpAndOtherEndpoints } from 'in-applications/endpointTypes';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import EndpointTopList from 'in-applications/Dashboards/service/tabs/EndpointTopList';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import CallsErrors from 'in-applications/Dashboards/commonComponents/CallsErrors';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import BigNumberKpiCard from 'in-new-components/KpiCard/BigNumberKpiCard';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { boundaryScopes } from 'in-applications/constants';
import { entityTypes } from 'in-analyze/applicationFilter';
import { Row, Col } from 'in-new-components/layout/Grid';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function Summary(props) {
    const timeShiftConfig = useTimeShiftConfig();
    const { timeConfig, applicationId, serviceId, boundaryScope, data } = props;
    const types = data.types;

    const MarkerLanes = ApplicationDashboardsMarkerLanes({ applicationId, serviceId });
    const withPotentialProblemsLane = ApplicationDashboardsMarkerLanes({
      applicationId,
      serviceId,
      showPotentialProblemsLane: true
    });

    const tagFilters = [{ stringValue: serviceId, name: 'service.id', entity: DESTINATION, operator: EQUALS }];
    if (applicationId != null) {
      if (boundaryScope === boundaryScopes.all) {
        tagFilters.push({ stringValue: applicationId, name: 'application.id', entity: DESTINATION, operator: EQUALS });
      } else {
        tagFilters.push({
          stringValue: applicationId,
          name: 'boundary.application.id',
          entity: NOT_APPLICABLE,
          operator: EQUALS
        });
      }
    }

    return (
      <>
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
                  { applicationId, serviceId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupByTag: { name: 'endpoint.name', entity: entityTypes.DESTINATION },
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
                  { applicationId, serviceId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupByTag: { name: 'endpoint.name', entity: entityTypes.DESTINATION },
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
                  { applicationId, serviceId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupByTag: { name: 'endpoint.name', entity: entityTypes.DESTINATION },
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
            {hasHttpEndpoints(types) ? (
              <CallsAndHttp
                cardTitle="Calls"
                applicationId={applicationId}
                serviceId={serviceId}
                tagFilters={tagFilters}
                boundaryScope={boundaryScope}
                timeConfig={timeConfig}
                callGroupByTag={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
                renderPostChartContent={withPotentialProblemsLane}
                renderPostChartContentHttpStatus={MarkerLanes}
                showNonHttpCalls={hasHttpAndOtherEndpoints(types)}
              />
            ) : (
              <CallsErrors
                cardTitle="Calls"
                applicationId={applicationId}
                serviceId={serviceId}
                boundaryScope={boundaryScope}
                timeConfig={timeConfig}
                tagFilters={tagFilters}
                groupByTag={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
                renderPostChartContent={withPotentialProblemsLane}
              />
            )}
          </Col>
          <Col lg={4}>
            <Errors
              cardTitle="Erroneous Call Rate"
              applicationId={applicationId}
              serviceId={serviceId}
              boundaryScope={boundaryScope}
              timeConfig={timeConfig}
              tagFilters={tagFilters}
              groupByTag={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
              renderPostChartContent={withPotentialProblemsLane}
            />
          </Col>
          <Col lg={4}>
            <LatencyAndDistribution
              cardTitle="Latency"
              applicationId={applicationId}
              serviceId={serviceId}
              boundaryScope={boundaryScope}
              timeConfig={timeConfig}
              tagFilters={tagFilters}
              percentileGroupBy={{ name: 'endpoint.name', entity: entityTypes.DESTINATION }}
              renderPostChartContent={withPotentialProblemsLane}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={4}>
            <IssuesAndEvents
              applicationId={applicationId}
              serviceId={serviceId}
              timeConfig={timeConfig}
              renderPostChartContent={MarkerLanes}
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
                renderPostChartContent={MarkerLanes}
              />
            )}
          </Col>
        </Row>
      </>
    );
  }
);
