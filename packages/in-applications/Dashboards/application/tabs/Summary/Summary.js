/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption,
  getTagFiltersForSyntheticOption,
  isSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import { createChartedMetric, createGroupBy, createMetricField, createOrderBy } from 'in-analyze/navigation/paths';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import ServiceTopList from 'in-applications/Dashboards/application/tabs/Summary/ServiceTopList';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { hasHttpEndpoints, hasHttpAndOtherEndpoints } from 'in-applications/endpointTypes';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import { boundaryScopes, syntheticCallsOptions } from 'in-applications/constants';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { syntheticCallsEnabled } from 'in-services/featureFlags';
import { summaryTab } from 'in-applications/navigation/paths';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { Row, Col } from 'in-components/layout/Grid';
import Footer from 'in-components/Footer/Footer';
import { t } from 'in-i18n';

export default function Summary({
  timeConfig,
  applicationId,
  data: application,
  boundaryScope: urlBoundaryScope,
  syntheticCalls: urlIncludeSyntheticCalls,
  endpointTypes: types
}) {
  const timeShiftConfig = useTimeShiftConfig();
  const boundaryScope = urlBoundaryScope || application.boundaryScope;
  const syntheticCalls = urlIncludeSyntheticCalls || syntheticCallsOptions.default;
  const includeSyntheticCalls = isSyntheticOption(syntheticCalls);

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
  if (syntheticCallsEnabled) {
    tagFilters.push(...getTagFiltersForSyntheticOption(syntheticCalls));
  }

  const MarkerLanes = ApplicationDashboardsMarkerLanes({ applicationId });
  const withPotentialProblemsLane = ApplicationDashboardsMarkerLanes({
    applicationId,
    includeSyntheticCalls,
    showPotentialProblemsLane: true
  });

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
                { applicationId },
                {
                  timeConfig,
                  boundaryScope,
                  groupBy: createGroupBy('service.name', DESTINATION),
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
                { applicationId },
                {
                  timeConfig,
                  boundaryScope,
                  groupBy: createGroupBy('service.name', DESTINATION),
                  formModel: joinExpressions({
                    expressions: [createFormModelFromSyntheticOption(syntheticCalls)]
                  }),
                  facets: { 'call.erroneous': [true] },
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
                { applicationId },
                {
                  timeConfig,
                  boundaryScope,
                  groupBy: createGroupBy('service.name', DESTINATION),
                  formModel: createFormModelFromSyntheticOption(syntheticCalls),
                  hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCalls),
                  orderByGroups: createOrderBy('latency_MEAN', 'DESC')
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
            tagFilters={tagFilters}
            boundaryScope={boundaryScope}
            timeConfig={timeConfig}
            callGroupBy={createGroupBy('service.name', DESTINATION)}
            renderPostChartContent={withPotentialProblemsLane}
            renderPostChartContentHttpStatus={withPotentialProblemsLane}
            // if 'types' is not available yet, set to true, so that the initial state can be set based on all metrics
            showHttp={!types || hasHttpEndpoints(types)}
            hasHttpAndOtherEndpoints={!types || hasHttpAndOtherEndpoints(types)}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'callsTab', paramMetric: 'callsMetric' }}
            syntheticCalls={syntheticCalls}
          />
        </Col>
        <Col lg={4}>
          <Errors
            cardTitle={t('in-applications:titleErroneousCallRate')}
            applicationId={applicationId}
            timeConfig={timeConfig}
            boundaryScope={boundaryScope}
            tagFilters={tagFilters}
            groupBy={createGroupBy('service.name', DESTINATION)}
            renderPostChartContent={withPotentialProblemsLane}
            syntheticCalls={syntheticCalls}
          />
        </Col>
        <Col lg={4}>
          <LatencyAndDistribution
            cardTitle={t('in-applications:labelLatency')}
            applicationId={applicationId}
            timeConfig={timeConfig}
            boundaryScope={boundaryScope}
            tagFilters={tagFilters}
            percentileGroupBy={createGroupBy('service.name', DESTINATION)}
            renderPostChartContent={withPotentialProblemsLane}
            syntheticCalls={syntheticCalls}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'latencyTab', paramMetric: 'latencyMetric' }}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <IssuesAndEvents applicationId={applicationId} timeConfig={timeConfig} renderPostChartContent={MarkerLanes} />
        </Col>
        <Col lg={4}>
          <ServiceTopList
            applicationId={applicationId}
            boundaryScope={boundaryScope}
            timeConfig={timeConfig}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'servicesTab' }}
            syntheticCalls={syntheticCalls}
          />
        </Col>
        <Col lg={4}>
          <TechnologyBreakdown
            applicationId={applicationId}
            boundaryScope={boundaryScope}
            timeConfig={timeConfig}
            renderPostChartContent={MarkerLanes}
            syntheticCalls={syntheticCalls}
          />
        </Col>
      </Row>
      <Footer />
    </Fragment>
  );
}
