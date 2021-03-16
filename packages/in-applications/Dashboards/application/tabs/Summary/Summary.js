/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import {
  getTagFiltersForSyntheticOption,
  isSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import ServiceTopList from 'in-applications/Dashboards/application/tabs/Summary/ServiceTopList';
import { DESTINATION, NOT_APPLICABLE } from 'in-new-components/QueryBuilder/tagFilter/entities';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { hasHttpEndpoints, hasHttpAndOtherEndpoints } from 'in-applications/endpointTypes';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import { boundaryScopes, syntheticCallsOptions } from 'in-applications/constants';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import BigNumberKpiCard from 'in-new-components/KpiCard/BigNumberKpiCard';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import { syntheticCallsEnabled } from 'in-services/featureFlags';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { summaryTab } from 'in-applications/navigation/paths';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { entityTypes } from 'in-analyze/applicationFilter';
import { Row, Col } from 'in-new-components/layout/Grid';
import Footer from 'in-new-components/Footer/Footer';
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
  const tagCatalog = useTagCatalog(getTagCatalog);
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
              href$:
                tagCatalog &&
                getJumpToAnalyzeHref$(
                  { applicationId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupByTag: { name: 'service.name', entity: entityTypes.DESTINATION },
                    filters: getTagFiltersForSyntheticOption(syntheticCalls),
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
              href$:
                tagCatalog &&
                getJumpToAnalyzeHref$(
                  { applicationId },
                  {
                    timeConfig,
                    boundaryScope,
                    groupByTag: { name: 'service.name', entity: entityTypes.DESTINATION },
                    filters: [
                      { name: 'call.erroneous', value: 'true' },
                      ...getTagFiltersForSyntheticOption(syntheticCalls)
                    ],
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
              href$:
                tagCatalog &&
                getJumpToAnalyzeHref$(
                  { applicationId },
                  {
                    timeConfig,
                    boundaryScope,
                    filters: getTagFiltersForSyntheticOption(syntheticCalls),
                    groupByTag: { name: 'service.name', entity: entityTypes.DESTINATION },
                    tagCatalog: tagCatalog,
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
          <CallsAndHttp
            cardTitle={t('in-applications:labelCalls')}
            applicationId={applicationId}
            tagFilters={tagFilters}
            boundaryScope={boundaryScope}
            timeConfig={timeConfig}
            callGroupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
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
            groupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
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
            percentileGroupBy={{ name: 'service.name', entity: entityTypes.DESTINATION }}
            renderPostChartContent={withPotentialProblemsLane}
            includeSyntheticCalls={includeSyntheticCalls}
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
