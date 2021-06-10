/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption,
  getTagFiltersForSyntheticOption,
  isSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { createMetricField, createChartedMetric, createGroupBy, createOrderBy } from 'in-analyze/navigation/paths';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import { DESTINATION, NOT_APPLICABLE } from 'in-new-components/QueryBuilder/tagFilter/entities';
import { hasHttpAndOtherEndpoints, hasHttpEndpoints } from 'in-applications/endpointTypes';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import EndpointTopList from 'in-applications/Dashboards/service/tabs/EndpointTopList';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { boundaryScopes, syntheticCallsOptions } from 'in-applications/constants';
import { meanLatency, number, percentage } from 'in-services/formatters/number';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import BigNumberKpiCard from 'in-new-components/KpiCard/BigNumberKpiCard';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import { syntheticCallsEnabled } from 'in-services/featureFlags';
import { summaryTab } from 'in-applications/navigation/paths';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { entityTypes } from 'in-analyze/applicationFilter';
import { Col, Row } from 'in-components/layout/Grid';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function Summary(props) {
    const timeShiftConfig = useTimeShiftConfig();
    const { timeConfig, applicationId, serviceId, boundaryScope, data, syntheticCalls: urlSyntheticCalls } = props;
    const types = data.types;
    const syntheticCalls = urlSyntheticCalls || syntheticCallsOptions.default;
    const includeSyntheticCalls = isSyntheticOption(urlSyntheticCalls);

    const MarkerLanes = ApplicationDashboardsMarkerLanes({ applicationId, serviceId });
    const withPotentialProblemsLane = ApplicationDashboardsMarkerLanes({
      applicationId,
      serviceId,
      includeSyntheticCalls,
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
    if (syntheticCallsEnabled) {
      tagFilters.push(...getTagFiltersForSyntheticOption(syntheticCalls));
    }

    return (
      <>
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
                  includeSynthetic: includeSyntheticCalls,
                  timeShift: timeShiftConfig.offset
                }
              }}
              iconAction={{
                text: t('in-applications:lineViewInAnalyze'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href$: getJumpToAnalyzeHref$(
                  { applicationId, serviceId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupBy: createGroupBy('endpoint.name', DESTINATION),
                    formModel: createFormModelFromSyntheticOption(syntheticCalls),
                    hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCalls),
                    fields: [createMetricField('erroneousCalls', 'SUM'), createMetricField('latency', 'MEAN')],
                    chartedMetrics: [createChartedMetric('calls', 'SUM')]
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
                  includeSynthetic: includeSyntheticCalls,
                  timeShift: timeShiftConfig.offset
                },
                companionMetricConfiguration: {
                  metric: 'errors',
                  aggregation: 'MEAN',
                  source: 'APPLICATION',
                  tagFilters: tagFilters,
                  includeSynthetic: includeSyntheticCalls
                }
              }}
              iconAction={{
                text: t('in-applications:lineViewInAnalyze'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href$: getJumpToAnalyzeHref$(
                  { applicationId, serviceId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupBy: createGroupBy('endpoint.name', DESTINATION),
                    formModel: joinExpressions({
                      expressions: [
                        tagFilter('call.erroneous', EQUALS, true),
                        createFormModelFromSyntheticOption(syntheticCalls)
                      ]
                    }),
                    hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCalls),
                    fields: [createMetricField('errors', 'MEAN'), createMetricField('latency', 'MEAN')],
                    chartedMetrics: [createChartedMetric('errors', 'MEAN')]
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
                  includeSynthetic: includeSyntheticCalls,
                  timeShift: timeShiftConfig.offset
                },
                companionMetricConfiguration: {
                  metric: 'latency',
                  aggregation: 'P90',
                  source: 'APPLICATION',
                  tagFilters: tagFilters,
                  includeSynthetic: includeSyntheticCalls
                }
              }}
              iconAction={{
                text: t('in-applications:lineViewInAnalyze'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href$: getJumpToAnalyzeHref$(
                  { applicationId, serviceId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupBy: createGroupBy('endpoint.name', DESTINATION),
                    orderByGroups: createOrderBy('latency_MEAN', 'DESC'),
                    formModel: createFormModelFromSyntheticOption(syntheticCalls),
                    hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCalls)
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
              tagFilters={tagFilters}
              boundaryScope={boundaryScope}
              timeConfig={timeConfig}
              callGroupBy={createGroupBy('endpoint.name', entityTypes.DESTINATION)}
              renderPostChartContent={withPotentialProblemsLane}
              renderPostChartContentHttpStatus={MarkerLanes}
              showHttp={hasHttpEndpoints(types)}
              hasHttpAndOtherEndpoints={hasHttpAndOtherEndpoints(types)}
              urlMatrixParamConfig={{ path: summaryTab, paramTab: 'callsTab', paramMetric: 'callsMetric' }}
              syntheticCalls={syntheticCalls}
            />
          </Col>
          <Col lg={4}>
            <Errors
              cardTitle={t('in-applications:titleErroneousCallRate')}
              applicationId={applicationId}
              serviceId={serviceId}
              boundaryScope={boundaryScope}
              timeConfig={timeConfig}
              tagFilters={tagFilters}
              groupBy={createGroupBy('endpoint.name', entityTypes.DESTINATION)}
              renderPostChartContent={withPotentialProblemsLane}
              syntheticCalls={syntheticCalls}
            />
          </Col>
          <Col lg={4}>
            <LatencyAndDistribution
              cardTitle={t('in-applications:labelLatency')}
              applicationId={applicationId}
              serviceId={serviceId}
              boundaryScope={boundaryScope}
              timeConfig={timeConfig}
              tagFilters={tagFilters}
              percentileGroupBy={createGroupBy('endpoint.name', entityTypes.DESTINATION)}
              renderPostChartContent={withPotentialProblemsLane}
              syntheticCalls={syntheticCalls}
              urlMatrixParamConfig={{ path: summaryTab, paramTab: 'latencyTab', paramMetric: 'latencyMetric' }}
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
              urlMatrixParamConfig={{ path: summaryTab, paramTab: 'endpointsTab' }}
              syntheticCalls={syntheticCalls}
            />
          </Col>
          <Col lg={4}>
            {types.includes('DATABASE') ? (
              <DatabaseSections
                boundaryScope={boundaryScope}
                {...props}
                urlMatrixParamConfig={{ path: summaryTab, paramTab: 'stmtTab' }}
              />
            ) : (
              <TechnologyBreakdown
                applicationId={applicationId}
                serviceId={serviceId}
                timeConfig={timeConfig}
                renderPostChartContent={MarkerLanes}
                syntheticCalls={syntheticCalls}
              />
            )}
          </Col>
        </Row>
      </>
    );
  }
);
