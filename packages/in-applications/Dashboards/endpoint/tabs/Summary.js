/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { get } from 'lodash';
import { t } from 'in-i18n';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import { DESTINATION, NOT_APPLICABLE } from 'in-new-components/QueryBuilder/tagFilter/entities';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import BigNumberKpiCard from 'in-new-components/KpiCard/BigNumberKpiCard';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { summaryTab } from 'in-applications/navigation/paths';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { boundaryScopes } from 'in-applications/constants';
import { entityTypes } from 'in-analyze/applicationFilter';
import { Row, Col } from 'in-new-components/layout/Grid';
import { emptyArray } from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function Summary({ timeConfig, applicationId, serviceId, endpointId, boundaryScope, data }) {
    const tagCatalog = useTagCatalog(getTagCatalog);
    const timeShiftConfig = useTimeShiftConfig();
    const includeSyntheticCalls = get(data, 'synthetic', false);
    const type = data.type;

    const MarkerLanes = ApplicationDashboardsMarkerLanes({ applicationId, endpointId, serviceId });
    const withPotentialProblemsLane = ApplicationDashboardsMarkerLanes({
      applicationId,
      endpointId,
      serviceId,
      showPotentialProblemsLane: true
    });

    const includeSyntheticTagFilters = includeSyntheticCalls
      ? [{ value: true, name: 'include_synthetic', operator: EQUALS }]
      : emptyArray;
    const tagFilters = [
      ...includeSyntheticTagFilters,
      { stringValue: endpointId, name: 'endpoint.id', entity: DESTINATION, operator: EQUALS }
    ];

    if (serviceId != null) {
      tagFilters.push({ stringValue: serviceId, name: 'service.id', entity: DESTINATION, operator: EQUALS });
    }

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
      <Fragment>
        <Row>
          <Col xs>
            <BigNumberKpiCard
              title={t('in-applications:labelCalls')}
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
                text: t('in-applications:lineViewInAnalyze'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href$:
                  tagCatalog &&
                  getJumpToAnalyzeHref$(
                    { applicationId, serviceId, endpointId },
                    {
                      timeConfig,
                      boundaryScope,
                      groupByTag: { name: 'call.name', entity: entityTypes.NOT_APPLICABLE },
                      filters: includeSyntheticTagFilters,
                      tagCatalog: tagCatalog,
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
              title={t('in-applications:titleErroneousCalls')}
              formatter={number.compact}
              companionFormatter={v =>
                t('in-applications:dashboards.percentOfCalls', {
                  percentage: percentage.detailed(v)
                })
              }
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
                text: t('in-applications:lineViewInAnalyze'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href$:
                  tagCatalog &&
                  getJumpToAnalyzeHref$(
                    { applicationId, serviceId, endpointId },
                    {
                      timeConfig,
                      boundaryScope,
                      groupByTag: { name: 'call.name', entity: entityTypes.NOT_APPLICABLE },
                      filters: [...includeSyntheticTagFilters, { name: 'call.erroneous', value: 'true' }],
                      tagCatalog: tagCatalog,
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
              title={t('in-applications:titleMeanLatency')}
              formatter={meanLatency.detailed}
              companionFormatter={v =>
                t('in-applications:dashboards.meanLatencyFor90th', {
                  meanLatencyDetail: meanLatency.detailed(v)
                })
              }
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
                text: t('in-applications:lineViewInAnalyze'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href$:
                  tagCatalog &&
                  getJumpToAnalyzeHref$(
                    { applicationId, serviceId, endpointId },
                    {
                      timeConfig,
                      boundaryScope,
                      groupByTag: { name: 'call.name', entity: entityTypes.NOT_APPLICABLE },
                      orderBy: 'latency_MEAN_Agg',
                      orderDirection: 'DESC',
                      filters: includeSyntheticTagFilters,
                      tagCatalog: tagCatalog
                    }
                  )
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={4}>
            <CallsAndHttp
              cardTitle={t('in-applications:labelCalls')}
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              tagFilters={tagFilters}
              boundaryScope={boundaryScope}
              isSynthetic={includeSyntheticCalls}
              timeConfig={timeConfig}
              callGroupByTag={{ name: 'call.name', entity: entityTypes.NOT_APPLICABLE }}
              renderPostChartContent={withPotentialProblemsLane}
              renderPostChartContentHttpStatus={MarkerLanes}
              showHttp={type.includes('HTTP')}
              urlMatrixParamConfig={{ path: summaryTab, paramTab: 'callsTab', paramMetric: 'callsMetric' }}
            />
          </Col>
          <Col lg={4}>
            <Errors
              cardTitle={t('in-applications:titleErroneousCallRate')}
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              boundaryScope={boundaryScope}
              isSynthetic={includeSyntheticCalls}
              timeConfig={timeConfig}
              tagFilters={tagFilters}
              groupByTag={{ name: 'call.name', entity: entityTypes.NOT_APPLICABLE }}
              renderPostChartContent={withPotentialProblemsLane}
            />
          </Col>
          <Col lg={4}>
            <LatencyAndDistribution
              cardTitle={t('in-applications:labelLatency')}
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              boundaryScope={boundaryScope}
              includeSyntheticCalls={includeSyntheticCalls}
              timeConfig={timeConfig}
              tagFilters={tagFilters}
              percentileGroupBy={{ name: 'call.name', entity: entityTypes.NOT_APPLICABLE }}
              renderPostChartContent={withPotentialProblemsLane}
              urlMatrixParamConfig={{ path: summaryTab, paramTab: 'latencyTab', paramMetric: 'latencyMetric' }}
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
                    urlMatrixParamConfig={{ path: summaryTab, paramTab: 'stmtTab' }}
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
