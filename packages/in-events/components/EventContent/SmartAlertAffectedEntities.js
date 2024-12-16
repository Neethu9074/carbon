/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';
import React from 'react';

import { Card } from '@instana/components';
import { Link } from '@instana/components';

import {
  getLinkToUnboundAnalytics,
  getEnrichedAnalyzeTagFilterFormModel,
  tagNamesToUseEndpointGrouping
} from 'in-events/components/AnalyzeApplicationEventButton';
import {
  analyzeQueryTimeframeLimit,
  extendWindowSizeForLateData
} from 'in-events/components/EventContent/analyzeUtils';
import { containsTagName, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE } from 'in-services/tracking/tracking';
import { groupByEndpointName, groupByServiceName } from 'in-analyze/AnalyzeView/dataSources';
import AffectedEntities from 'in-events/components/AffectedEntities/AffectedEntities';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { fixateTimeConfig, trimTimeConfigEnd } from 'in-stores/time/config';
import { isApplicationEntity } from 'in-services/entityUtils';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { t } from 'in-i18n';

export function SmartAlertAffectedEntities({
  alertConfig,
  event,
  applicationId,
  applicationName,
  serviceId,
  serviceName,
  endpointId,
  endpointName,
  leftHeaderContent,
  setApproxDataForAffectedEntities
}) {
  const { rule, includeInternal, includeSynthetic, granularity } = alertConfig;
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const { trackCta } = useSegmentTracking();

  if (rule.alertType === 'throughput') {
    // we don't show the affected services/endpoints list for this blueprint type, because there is no simple property
    // to differentiate single calls from being violated or non-violated. Thus, we have to come up with a new way to do
    // this distinction.
    return null;
  }

  const eventEntityType = event.get('entityType');
  const adaptiveBaselineInfo = (event.getIn(['metadata', 'adaptiveBaselineInfo'], Map({})) ?? Map({})).toJS();
  const timeConfig = getTimeConfigFromEvent(event);
  const extendedTimeConfig = extendWindowSizeForLateData(timeConfig, granularity);
  const fixedTimeConfig = fixateTimeConfig(extendedTimeConfig);
  const trimmedTimeConfig = trimTimeConfigEnd(fixedTimeConfig, analyzeQueryTimeframeLimit);
  const tagFilterExpression = getTagFilterExpression();
  const totalTagFilterExpression = getTotalTagFilterExpression();
  const needsGroupByEndpoint =
    !isApplicationEntity(eventEntityType) ||
    tagNamesToUseEndpointGrouping.some(tagName => containsTagName(alertConfig.tagFilterExpression, tagName));

  const renderLinkToAnalyzeAll = total => (
    <Link
      onClick={() => trackCta(APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE)}
      href={getLinkToUnboundAnalytics(
        {
          applicationId,
          applicationName,
          serviceId,
          serviceName,
          endpointId,
          endpointName,
          alertConfig,
          timeConfig: trimmedTimeConfig,
          groupingTagName: needsGroupByEndpoint ? 'endpoint.name' : 'service.name',
          adaptiveBaselineInfo
        },
        getLinkToApplicationAnalyze
      )}
    >
      {needsGroupByEndpoint
        ? t('in-events:showAllEndpoints', { count: total })
        : t('in-events:showAllServices', { count: total })}
    </Link>
  );

  return (
    <Card
      title={needsGroupByEndpoint ? t('in-events:affectedEndpoints') : t('in-events:affectedServices')}
      leftHeaderContent={leftHeaderContent}
    >
      <AffectedEntities
        tagFilterExpression={tagFilterExpression}
        totalTagFilterExpression={totalTagFilterExpression}
        includeInternal={includeInternal}
        includeSynthetic={includeSynthetic}
        timeConfig={trimmedTimeConfig}
        filterGroup={needsGroupByEndpoint ? groupByEndpointName : groupByServiceName}
        createItemLink={createItemLink}
        renderLinkToAnalyzeAll={renderLinkToAnalyzeAll}
        setApproxDataForAffectedEntities={setApproxDataForAffectedEntities}
      />
    </Card>
  );

  function getTagFilterExpression() {
    return toBackendQueryModel(
      getEnrichedAnalyzeTagFilterFormModel({
        alertConfig,
        applicationId,
        applicationName,
        serviceId,
        endpointId,
        timeConfig: trimmedTimeConfig,
        adaptiveBaselineInfo
      })
    );
  }

  function getTotalTagFilterExpression() {
    return toBackendQueryModel(
      getEnrichedAnalyzeTagFilterFormModel({
        alertConfig,
        applicationId,
        applicationName,
        serviceId,
        endpointId,
        timeConfig: trimmedTimeConfig,
        excludeViolationRelatedFilters: true,
        adaptiveBaselineInfo
      })
    );
  }

  function createItemLink(item) {
    return getLinkToUnboundAnalytics(
      {
        applicationId,
        applicationName,
        serviceId: needsGroupByEndpoint ? serviceId : item.id,
        serviceName: needsGroupByEndpoint ? serviceName : item.name,
        endpointId: needsGroupByEndpoint ? item.id : null, // we never have an ID here (e.g. for a PER-SERVICE SmartAlert), because we do a grouping by name.
        endpointName: needsGroupByEndpoint ? item.name : null,
        alertConfig,
        timeConfig: trimmedTimeConfig,
        adaptiveBaselineInfo
      },
      getLinkToApplicationAnalyze
    );
  }
}
