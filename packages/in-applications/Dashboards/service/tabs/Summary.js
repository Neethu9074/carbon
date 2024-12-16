/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErroneousCallsBigNumberCard from 'in-applications/Dashboards/commonComponents/ErroneousCallsBigNumberCard';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import LatencyBigNumberCard from 'in-applications/Dashboards/commonComponents/LatencyBigNumberCard';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import CallsBigNumberCard from 'in-applications/Dashboards/commonComponents/CallsBigNumberCard';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { hasHttpAndOtherEndpoints, hasHttpEndpoints } from 'in-applications/endpointTypes';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import EndpointTopList from 'in-applications/Dashboards/service/tabs/EndpointTopList';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { summaryTab } from 'in-applications/navigation/paths';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { boundaryScopes } from 'in-applications/constants';
import { entityTypes } from 'in-analyze/applicationFilter';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary(props) {
  const { timeConfig, applicationId, serviceId, boundaryScope, data } = props;
  const endpointTypes = data.types;

  const MarkerLanes = ApplicationDashboardsMarkerLanes({ applicationId, serviceId });
  const withPotentialProblemsLane = ApplicationDashboardsMarkerLanes({
    applicationId,
    serviceId,
    showPotentialProblemsLane: true
  });

  const tagFilters = [{ stringValue: serviceId, name: 'service.id', entity: DESTINATION, operator: EQUALS }];
  if (applicationId) {
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

  const bigNumberCardConfiguration = {
    tagFilters,
    endpointTypes,
    timeConfig,
    boundaryScope,
    jumpToAnalyze: {
      ids: { applicationId, serviceId },
      groupBy: createGroupBy('endpoint.name', DESTINATION)
    }
  };

  return (
    <>
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
            serviceId={serviceId}
            tagFilters={tagFilters}
            boundaryScope={boundaryScope}
            timeConfig={timeConfig}
            callGroupBy={createGroupBy('endpoint.name', entityTypes.DESTINATION)}
            renderPostChartContent={withPotentialProblemsLane}
            renderPostChartContentHttpStatus={MarkerLanes}
            showHttp={hasHttpEndpoints(endpointTypes)}
            hasHttpAndOtherEndpoints={hasHttpAndOtherEndpoints(endpointTypes)}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'callsTab', paramMetric: 'callsMetric' }}
            endpointTypes={endpointTypes}
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
            endpointTypes={endpointTypes}
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
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'latencyTab', paramMetric: 'latencyMetric' }}
            endpointTypes={endpointTypes}
            renderWidgetNotSupportedIndicator={timeConfig.autoRefresh}
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
            renderHistoricDataIndicator
            renderWidgetNotSupportedIndicator={timeConfig.autoRefresh}
          />
        </Col>
        <Col lg={4}>
          {endpointTypes.includes('DATABASE') ? (
            <DatabaseSections
              boundaryScope={boundaryScope}
              {...props}
              urlMatrixParamConfig={{ path: summaryTab, paramTab: 'stmtTab' }}
              renderHistoricDataIndicator
              renderWidgetNotSupportedIndicator={timeConfig.autoRefresh}
              endpointTypes={endpointTypes}
            />
          ) : (
            <TechnologyBreakdown
              applicationId={applicationId}
              serviceId={serviceId}
              timeConfig={timeConfig}
              renderPostChartContent={MarkerLanes}
              renderHistoricDataIndicator
              renderWidgetNotSupportedIndicator={timeConfig.autoRefresh}
              disableChartInLive={timeConfig.autoRefresh}
            />
          )}
        </Col>
      </Row>
    </>
  );
}
