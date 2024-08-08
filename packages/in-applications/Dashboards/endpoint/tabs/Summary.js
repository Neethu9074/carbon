/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import ErroneousCallsBigNumberCard from 'in-applications/Dashboards/commonComponents/ErroneousCallsBigNumberCard';
import ApplicationDashboardsMarkerLanes from 'in-applications/Dashboards/ApplicationDashboardsMarkerLanes';
import LatencyAndDistribution from 'in-applications/Dashboards/commonComponents/LatencyAndDistribution';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import LatencyBigNumberCard from 'in-applications/Dashboards/commonComponents/LatencyBigNumberCard';
import TechnologyBreakdown from 'in-applications/Dashboards/commonComponents/TechnologyBreakdown';
import CallsBigNumberCard from 'in-applications/Dashboards/commonComponents/CallsBigNumberCard';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { summaryTab } from 'in-applications/navigation/paths';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { boundaryScopes } from 'in-applications/constants';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, applicationId, serviceId, endpointId, boundaryScope, data }) {
  const type = data.type;
  const isSyntheticEndpoint = get(data, ['syntheticType'], 'NON_SYNTHETIC') === 'SYNTHETIC';
  const includeSyntheticCalls = get(data, 'synthetic', false);

  const MarkerLanes = ApplicationDashboardsMarkerLanes({ applicationId, endpointId, serviceId });
  const withPotentialProblemsLane = ApplicationDashboardsMarkerLanes({
    applicationId,
    endpointId,
    serviceId,
    showPotentialProblemsLane: true
  });

  const tagFilters = [{ stringValue: endpointId, name: 'endpoint.id', entity: DESTINATION, operator: EQUALS }];

  if (serviceId) {
    tagFilters.push({ stringValue: serviceId, name: 'service.id', entity: DESTINATION, operator: EQUALS });
  }

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

  if (isSyntheticEndpoint && includeSyntheticCalls) {
    tagFilters.push({ booleanValue: true, name: 'include_synthetic', entity: NOT_APPLICABLE, operator: EQUALS });
  }

  const bigNumberCardConfiguration = {
    tagFilters,
    timeConfig,
    boundaryScope,
    includeSynthetic: isSyntheticEndpoint && includeSyntheticCalls,
    jumpToAnalyze: {
      ids: { applicationId, serviceId, endpointId },
      groupBy: createGroupBy('call.name')
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
            serviceId={serviceId}
            endpointId={endpointId}
            tagFilters={tagFilters}
            boundaryScope={boundaryScope}
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
            timeConfig={timeConfig}
            tagFilters={tagFilters}
            percentileGroupBy={createGroupBy('call.name')}
            renderPostChartContent={withPotentialProblemsLane}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'latencyTab', paramMetric: 'latencyMetric' }}
            renderWidgetNotSupportedIndicator={timeConfig.autoRefresh}
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
                  renderHistoricDataIndicator
                  renderWidgetNotSupportedIndicator={timeConfig.autoRefresh}
                />
              ) : (
                <TechnologyBreakdown
                  applicationId={applicationId}
                  endpointId={endpointId}
                  timeConfig={timeConfig}
                  renderPostChartContent={MarkerLanes}
                  renderHistoricDataIndicator
                  renderWidgetNotSupportedIndicator={timeConfig.autoRefresh}
                  disableChartInLive={timeConfig.autoRefresh}
                />
              )}
            </Col>
          </Row>
        </Fragment>
      )}
    </Fragment>
  );
}
