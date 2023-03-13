/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getTagFiltersForSyntheticOption,
  isSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import ErroneousCallsBigNumberCard from 'in-applications/Dashboards/commonComponents/ErroneousCallsBigNumberCard';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
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
import { boundaryScopes, syntheticCallsOptions } from 'in-applications/constants';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { syntheticCallsEnabled } from 'in-services/featureFlags';
import { summaryTab } from 'in-applications/navigation/paths';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { entityTypes } from 'in-analyze/applicationFilter';
import { Col, Row } from 'in-components/layout/Grid';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function Summary(props) {
    const { timeConfig, applicationId, serviceId, boundaryScope, data, syntheticCalls: urlSyntheticCalls } = props;
    const endpointTypes = data.types;
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

    const bigNumberCardConfiguration = {
      tagFilters,
      endpointTypes,
      syntheticCallsOption: syntheticCalls,
      timeConfig,
      boundaryScope,
      jumpToAnalyze: {
        ids: { applicationId, serviceId },
        groupBy: createGroupBy('endpoint.name', DESTINATION)
      }
    };

    return (
      <>
        <Row>
          <Col xs>
            <CallsBigNumberCard {...bigNumberCardConfiguration} />
          </Col>
          <Col xs>
            <ErroneousCallsBigNumberCard {...bigNumberCardConfiguration} />
          </Col>
          <Col xs>
            <LatencyBigNumberCard {...bigNumberCardConfiguration} />
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
              showHttp={hasHttpEndpoints(endpointTypes)}
              hasHttpAndOtherEndpoints={hasHttpAndOtherEndpoints(endpointTypes)}
              urlMatrixParamConfig={{ path: summaryTab, paramTab: 'callsTab', paramMetric: 'callsMetric' }}
              syntheticCalls={syntheticCalls}
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
              syntheticCalls={syntheticCalls}
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
              syntheticCalls={syntheticCalls}
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
              syntheticCalls={syntheticCalls}
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
                syntheticCalls={syntheticCalls}
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
);
