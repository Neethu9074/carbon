/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption,
  getTagFiltersForSyntheticOption,
  isSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { createChartedMetric, createGroupBy, createMetricField, createOrderBy } from 'in-analyze/navigation/paths';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import { DESTINATION, NOT_APPLICABLE } from 'in-new-components/QueryBuilder/tagFilter/entities';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { boundaryScopes, syntheticCallsOptions } from 'in-applications/constants';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import BigNumberKpiCard from 'in-new-components/KpiCard/BigNumberKpiCard';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import { syntheticCallsEnabled } from 'in-services/featureFlags';
import { summaryTab } from 'in-applications/navigation/paths';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { Row, Col } from 'in-new-components/layout/Grid';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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
    syntheticCalls: urlIncludeSyntheticCalls
  }) {
    const timeShiftConfig = useTimeShiftConfig();
    const isSyntheticEndpoint = get(data, ['syntheticType'], 'NON_SYNTHETIC') === 'SYNTHETIC';
    const syntheticCalls =
      isSyntheticEndpoint && !syntheticCallsEnabled
        ? syntheticCallsOptions.include
        : urlIncludeSyntheticCalls || syntheticCallsOptions.default;
    const includeSyntheticCalls = isSyntheticOption(syntheticCalls);
    const type = data.type;

    const MarkerLanes = ApplicationDashboardsMarkerLanes({ applicationId, endpointId, serviceId });
    const withPotentialProblemsLane = ApplicationDashboardsMarkerLanes({
      applicationId,
      endpointId,
      serviceId,
      includeSyntheticCalls,
      showPotentialProblemsLane: true
    });

    const tagFilters = [{ stringValue: endpointId, name: 'endpoint.id', entity: DESTINATION, operator: EQUALS }];

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
    if (syntheticCallsEnabled) {
      tagFilters.push(...getTagFiltersForSyntheticOption(syntheticCalls));
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
                  includeSynthetic: includeSyntheticCalls,
                  timeShift: timeShiftConfig.offset
                }
              }}
              iconAction={{
                text: t('in-applications:lineViewInAnalyze'),
                kind: 'subtle',
                icon: 'lib_analyze',
                href$: getJumpToAnalyzeHref$(
                  { applicationId, serviceId, endpointId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupBy: createGroupBy('call.name'),
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
                  { applicationId, serviceId, endpointId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupBy: createGroupBy('call.name'),
                    formModel: joinExpressions({
                      expressions: [
                        createFormModelFromSyntheticOption(syntheticCalls),
                        tagFilter('call.erroneous', EQUALS, true)
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
                  { applicationId, serviceId, endpointId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupBy: createGroupBy('call.name'),
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
              endpointId={endpointId}
              tagFilters={tagFilters}
              boundaryScope={boundaryScope}
              syntheticCalls={syntheticCalls}
              timeConfig={timeConfig}
              callGroupBy={createGroupBy('call.name')}
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
              syntheticCalls={syntheticCalls}
              timeConfig={timeConfig}
              tagFilters={tagFilters}
              groupBy={createGroupBy('call.name')}
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
              syntheticCalls={syntheticCalls}
              timeConfig={timeConfig}
              tagFilters={tagFilters}
              percentileGroupBy={createGroupBy('call.name')}
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
                    syntheticCalls={syntheticCalls}
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
