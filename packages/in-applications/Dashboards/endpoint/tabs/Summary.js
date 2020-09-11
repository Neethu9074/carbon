import React, { Fragment } from 'react';
import { get } from 'lodash';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import { DESTINATION, NOT_APPLICABLE } from 'in-new-components/QueryBuilder/tagFilter/entities';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import CallsErrors from 'in-applications/Dashboards/commonComponents/CallsErrors';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import BigNumberKpiCard from 'in-new-components/KpiCard/BigNumberKpiCard';
import getApplication from 'in-subscription/application/getApplication';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import { boundaryScopes } from 'in-applications/constants';
import { entityTypes } from 'in-analyze/applicationFilter';
import { Row, Col } from 'in-new-components/layout/Grid';
import { alwaysNull } from 'in-services/fixedStreams';
import useObservable from 'in-hooks/useObservable';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function Summary({
    timeConfig,
    applicationId,
    serviceId,
    endpointId,
    boundaryScope,
    data,
    isInternalVisible,
    timeShift,
    onUpdate
  }) {
    const includeSyntheticCalls = get(data, 'synthetic', false);
    const type = data.type;

    const applicationLabel = useObservable(
      applicationId ? getApplication({ id: applicationId }).map(r => r?.data?.label) : alwaysNull,
      [applicationId]
    );

    const MarkerLanes = ApplicationDashboardsMarkerLanes({ applicationId, endpointId, serviceId });
    const withPotentialProblemsLane = isInternalVisible
      ? ApplicationDashboardsMarkerLanes({
          applicationId,
          endpointId,
          serviceId,
          showPotentialProblemsLane: true
        })
      : MarkerLanes;

    let tagFilters = [
      { stringValue: serviceId, name: 'service.id', entity: DESTINATION, operator: EQUALS },
      { stringValue: endpointId, name: 'endpoint.id', entity: DESTINATION, operator: EQUALS },
      { booleanValue: includeSyntheticCalls, name: 'include_synthetic', entity: NOT_APPLICABLE, operator: EQUALS }
    ];

    if (applicationId != null) {
      if (boundaryScope === boundaryScopes.all) {
        tagFilters.push({ stringValue: applicationId, name: 'application.id', entity: DESTINATION, operator: EQUALS });
      } else {
        if (applicationLabel == null) {
          // application label not available yet
          return null;
        }
        tagFilters.push({
          stringValue: applicationLabel,
          name: 'call.inbound_of_application',
          entity: NOT_APPLICABLE,
          operator: EQUALS
        });
      }
    }

    return (
      <Fragment>
        <Row>
          <Col xs>
            <BigNumberKpiCard
              title="Calls"
              formatter={number.compact}
              // it is enough to have the onUpdate callback on just one of the widgets
              onUpdate={onUpdate}
              config={{
                comparisonDecreaseColor: 'redish',
                comparisonIncreaseColor: 'greenish',
                metricConfiguration: {
                  metric: 'calls',
                  aggregation: 'SUM',
                  source: 'APPLICATION',
                  tagFilters: tagFilters,
                  timeShift: timeShift
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
                  timeShift: timeShift
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
                  timeShift: timeShift
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
                renderPostChartContent={withPotentialProblemsLane}
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
                renderPostChartContent={withPotentialProblemsLane}
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
              renderPostChartContent={withPotentialProblemsLane}
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
              renderPostChartContent={withPotentialProblemsLane}
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
