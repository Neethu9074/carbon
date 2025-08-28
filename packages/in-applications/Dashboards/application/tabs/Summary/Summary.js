/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import ErroneousCallsBigNumberCard from 'in-applications/Dashboards/commonComponents/ErroneousCallsBigNumberCard';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import LatencyBigNumberCard from 'in-applications/Dashboards/commonComponents/LatencyBigNumberCard';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import ServiceTopList from 'in-applications/Dashboards/application/tabs/Summary/ServiceTopList';
import CallsBigNumberCard from 'in-applications/Dashboards/commonComponents/CallsBigNumberCard';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { hasHttpAndOtherEndpoints, hasHttpEndpoints } from 'in-applications/endpointTypes';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import { summaryTab } from 'in-applications/navigation/paths';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { boundaryScopes } from 'in-applications/constants';
import { solisEnabled } from 'in-services/featureFlags';
import { Col, Row } from 'in-components/layout/Grid';
import Footer from 'in-components/Footer/Footer';
import { t } from 'in-i18n';

export default function Summary({
  timeConfig,
  applicationId,
  data: application,
  boundaryScope: urlBoundaryScope,
  endpointTypes: types
}) {
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

  const MarkerLanes = ApplicationDashboardsMarkerLanes({ applicationId, boundaryScope });
  const withPotentialProblemsLane = ApplicationDashboardsMarkerLanes({
    applicationId,
    showPotentialProblemsLane: true
  });

  const bigNumberCardConfiguration = {
    tagFilters,
    timeConfig,
    boundaryScope,
    jumpToAnalyze: {
      ids: { applicationId },
      groupBy: createGroupBy('service.name', DESTINATION)
    }
  };

  return (
    <Fragment>
      <KpiGridRow sizes={[4, 4, 4]}>
        <CallsBigNumberCard {...bigNumberCardConfiguration} />
        <ErroneousCallsBigNumberCard {...bigNumberCardConfiguration} />
        <LatencyBigNumberCard {...bigNumberCardConfiguration} />
      </KpiGridRow>
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
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'latencyTab', paramMetric: 'latencyMetric' }}
            renderWidgetNotSupportedIndicator={timeConfig.autoRefresh}
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
            renderHistoricDataIndicator
            renderWidgetNotSupportedIndicator={timeConfig.autoRefresh}
          />
        </Col>
        <Col lg={4}>
          <TechnologyBreakdown
            applicationId={applicationId}
            boundaryScope={boundaryScope}
            timeConfig={timeConfig}
            renderPostChartContent={MarkerLanes}
            renderHistoricDataIndicator
            renderWidgetNotSupportedIndicator={timeConfig.autoRefresh}
            disableChartInLive={timeConfig.autoRefresh}
          />
        </Col>
      </Row>
      {solisEnabled && (
        <solis-sidekick
          correlation_id={applicationId}
          title={application.label}
          context="application"
          product="instana"
        />
      )}
      <Footer />
    </Fragment>
  );
}
