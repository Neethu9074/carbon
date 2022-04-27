/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

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
import IssuesAndEvents from 'in-applications/Dashboards/commonComponents/IssuesAndEvents';
import CallsAndHttp from 'in-applications/Dashboards/commonComponents/CallsAndHttp';
import { boundaryScopes, syntheticCallsOptions } from 'in-applications/constants';
import Errors from 'in-applications/Dashboards/commonComponents/Errors';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { syntheticCallsEnabled } from 'in-services/featureFlags';
import { summaryTab } from 'in-applications/navigation/paths';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { Col, Row } from 'in-components/layout/Grid';
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

    const bigNumberCardConfiguration = {
      tagFilters,
      syntheticCallsOption: syntheticCalls,
      timeConfig,
      boundaryScope,
      jumpToAnalyze: {
        ids: { applicationId, serviceId, endpointId },
        groupBy: createGroupBy('call.name')
      }
    };

    return (
      <Fragment>
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
                    renderHistoricDataIndicator
                  />
                ) : (
                  <TechnologyBreakdown
                    applicationId={applicationId}
                    endpointId={endpointId}
                    timeConfig={timeConfig}
                    renderPostChartContent={MarkerLanes}
                    syntheticCalls={syntheticCalls}
                    renderHistoricDataIndicator
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
